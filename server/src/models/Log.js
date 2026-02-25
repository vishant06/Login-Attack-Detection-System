import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  username: { type: String, required: true },
  status: {
    type: String,
    enum: ['Success', 'Failed', 'Locked', 'Suspicious'],
    required: true
  },
  ip: { type: String, required: true },
  reason: { type: String, required: true }
});

export const Log = mongoose.model('Log', logSchema);
