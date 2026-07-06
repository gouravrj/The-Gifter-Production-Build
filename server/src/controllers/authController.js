import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { signToken } from '../utils/token.js';
import { sendOtp } from '../services/emailService.js';

const publicUser = (user) => ({ id: user._id, fullName: user.fullName, email: user.email, address: user.address, phone: user.phone, role: user.role });
const issue = (res, user) => res.json({ success: true, token: signToken({ id: user._id, role: user.role }), user: publicUser(user) });

export async function signup(req, res) {
  const { fullName, email, password, address } = req.body;
  if (!fullName || !email || !password || !address) throw new AppError('All fields are required', 400);
  if (password.length < 8) throw new AppError('Password must contain at least 8 characters', 400);
  const normalized = email.toLowerCase().trim();
  let user = await User.findOne({ email: normalized }).select('+otpHash +otpExpiresAt');
  if (user?.isVerified) throw new AppError('An account with this email already exists', 409);
  if (!user) user = new User({ fullName, email: normalized, password, address });
  else { user.fullName = fullName; user.password = password; user.address = address; }
  const otp = crypto.randomInt(100000, 1000000).toString();
  user.otpHash = await bcrypt.hash(otp, 10); user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await user.save(); await sendOtp(user.email, user.fullName, otp);
  res.status(201).json({ success: true, message: 'Verification code sent to your email', email: user.email });
}

export async function verifyOtp(req, res) {
  const { email, otp } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() }).select('+otpHash +otpExpiresAt');
  if (!user || user.isVerified || !user.otpHash) throw new AppError('Invalid verification request', 400);
  if (user.otpExpiresAt < new Date() || !(await bcrypt.compare(String(otp), user.otpHash))) throw new AppError('Invalid or expired verification code', 400);
  user.isVerified = true; user.otpHash = undefined; user.otpExpiresAt = undefined; await user.save();
  issue(res, user);
}

export async function login(req, res) {
  const user = await User.findOne({ email: req.body.email?.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password || ''))) throw new AppError('Invalid email or password', 401);
  if (!user.isVerified) throw new AppError('Please verify your email first', 403);
  issue(res, user);
}

export async function adminLogin(req, res) {
  if (req.body.email?.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase() || req.body.password !== process.env.ADMIN_PASSWORD) throw new AppError('Invalid admin credentials', 401);
  const user = await User.findOne({ email: process.env.ADMIN_EMAIL.toLowerCase(), role: 'admin' });
  if (!user) throw new AppError('Admin account is not initialized', 503);
  issue(res, user);
}

export const me = (req, res) => res.json({ success: true, user: publicUser(req.user) });
export async function updateProfile(req, res) {
  const updates = Object.fromEntries(['fullName', 'address', 'phone'].filter((key) => req.body[key] !== undefined).map((key) => [key, req.body[key]]));
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.json({ success: true, user: publicUser(user) });
}
