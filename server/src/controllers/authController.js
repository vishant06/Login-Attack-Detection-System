import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Log } from '../models/Log.js';
import { SECURITY_RULES } from '../utils/security.js';

const attemptTracker = new Map();

const getClientIp = (req) => req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';

const trackAttempt = (ip) => {
  const now = Date.now();
  const history = attemptTracker.get(ip) || [];
  const recent = history.filter((time) => now - time <= SECURITY_RULES.SUSPICIOUS_WINDOW_MS);
  recent.push(now);
  attemptTracker.set(ip, recent);
  return recent.length;
};

const createLog = async ({ username, status, ip, reason }) => {
  await Log.create({ username, status, ip, reason });
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const ip = getClientIp(req);

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const attemptsInWindow = trackAttempt(ip);
    if (attemptsInWindow >= SECURITY_RULES.SUSPICIOUS_ATTEMPTS) {
      await createLog({
        username,
        status: 'Suspicious',
        ip,
        reason: `Too many requests from IP in ${SECURITY_RULES.SUSPICIOUS_WINDOW_MS / 1000}s`
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      await createLog({ username, status: 'Failed', ip, reason: 'User not found' });
      return res.status(401).json({ message: 'Invalid credentials.', status: 'Failed' });
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      await createLog({ username, status: 'Locked', ip, reason: 'Account currently locked' });
      return res.status(423).json({
        message: 'Account is locked due to repeated failed login attempts.',
        status: 'Locked',
        lockedUntil: user.lockedUntil
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      user.failedAttempts += 1;

      let message = 'Invalid credentials.';
      let status = 'Failed';
      let reason = 'Incorrect password';

      if (user.failedAttempts >= SECURITY_RULES.LOCK_THRESHOLD) {
        user.lockedUntil = new Date(Date.now() + SECURITY_RULES.LOCK_DURATION_MS);
        status = 'Locked';
        message = 'Account locked for 2 minutes due to repeated failed attempts.';
        reason = `Reached ${SECURITY_RULES.LOCK_THRESHOLD} failed attempts`;
      } else if (user.failedAttempts >= SECURITY_RULES.WARNING_THRESHOLD) {
        message = `Warning: ${user.failedAttempts} failed attempts. Account locks at ${SECURITY_RULES.LOCK_THRESHOLD}.`;
        reason = `Warning threshold reached (${user.failedAttempts} failed attempts)`;
      }

      await user.save();
      await createLog({ username, status, ip, reason });
      return res.status(status === 'Locked' ? 423 : 401).json({ message, status });
    }

    user.failedAttempts = 0;
    user.lockedUntil = null;
    await user.save();

    await createLog({ username, status: 'Success', ip, reason: 'Login successful' });

    const responseStatus = attemptsInWindow >= SECURITY_RULES.SUSPICIOUS_ATTEMPTS ? 'Suspicious' : 'Success';
    const responseMessage =
      responseStatus === 'Suspicious'
        ? 'Login successful, but suspicious activity detected from this IP.'
        : 'Login successful.';

    return res.json({
      message: responseMessage,
      status: responseStatus,
      user: { username: user.username }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};
