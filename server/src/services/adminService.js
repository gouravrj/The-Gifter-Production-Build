import User from '../models/User.js';

export async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) { console.warn('Admin credentials are not configured'); return; }
  let admin = await User.findOne({ email }).select('+password');
  if (!admin) admin = new User({ fullName: 'Administrator', email, password, address: 'Admin', role: 'admin', isVerified: true });
  else { admin.role = 'admin'; admin.isVerified = true; if (!(await admin.comparePassword(password))) admin.password = password; }
  await admin.save();
}
