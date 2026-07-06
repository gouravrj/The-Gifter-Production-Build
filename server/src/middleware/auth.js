import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, _res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null;
  if (!token) throw new AppError('Please log in to continue', 401);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password -otpHash -otpExpiresAt');
  if (!user || !user.isVerified) throw new AppError('Account not found or not verified', 401);
  req.user = user;
  next();
});

export const adminOnly = (req, _res, next) => {
  if (req.user?.role !== 'admin') return next(new AppError('Admin access required', 403));
  next();
};
