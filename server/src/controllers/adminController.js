import { User } from '../models/User.js';
import { Log } from '../models/Log.js';

export const unlockUser = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'Username is required.' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.failedAttempts = 0;
    user.lockedUntil = null;
    await user.save();

    await Log.create({
      username,
      status: 'Success',
      ip: 'admin-action',
      reason: 'Account unlocked by admin'
    });

    return res.json({ message: `${username} has been unlocked.` });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to unlock user.' });
  }
};
