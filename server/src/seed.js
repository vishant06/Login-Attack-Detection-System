import bcrypt from 'bcryptjs';
import { User } from './models/User.js';

export const seedUsers = async () => {
  const existing = await User.countDocuments();
  if (existing > 0) return;

  const demoUsers = [
    { username: 'student1', password: 'password123' },
    { username: 'admin', password: 'admin123' }
  ];

  const payload = await Promise.all(
    demoUsers.map(async (u) => ({
      username: u.username,
      passwordHash: await bcrypt.hash(u.password, 10)
    }))
  );

  await User.insertMany(payload);
  console.log('Demo users seeded: student1/password123, admin/admin123');
};
