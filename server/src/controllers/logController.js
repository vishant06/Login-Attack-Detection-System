import { Log } from '../models/Log.js';

export const getLogs = async (_req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });
    return res.json(logs);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch logs.' });
  }
};

export const clearLogs = async (_req, res) => {
  try {
    await Log.deleteMany({});
    return res.json({ message: 'All logs cleared.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to clear logs.' });
  }
};
