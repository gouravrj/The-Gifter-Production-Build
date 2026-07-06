import AppError from '../utils/AppError.js';

export const notFound = (req, _res, next) => next(new AppError(`Route ${req.originalUrl} not found`, 404));

export const errorHandler = (err, _req, res, _next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  if (err.name === 'ValidationError') { status = 400; message = Object.values(err.errors).map((e) => e.message).join(', '); }
  if (err.code === 11000) { status = 409; message = 'This value already exists'; }
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') { status = 401; message = 'Invalid or expired session'; }
  res.status(status).json({ success: false, message, ...(process.env.NODE_ENV !== 'production' && { stack: err.stack, details: err.details }) });
};
