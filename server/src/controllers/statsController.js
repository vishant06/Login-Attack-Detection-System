import { Log } from '../models/Log.js';
import { User } from '../models/User.js';

export const getStats = async (_req, res) => {
  try {
    const [totalAttempts, failedAttempts, lockedAccounts] = await Promise.all([
      Log.countDocuments(),
      Log.countDocuments({ status: { $in: ['Failed', 'Locked'] } }),
      User.countDocuments({ lockedUntil: { $gt: new Date() } })
    ]);

    return res.json({ totalAttempts, failedAttempts, lockedAccounts });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch stats.' });
  }
};
