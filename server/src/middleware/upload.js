import multer from 'multer';
import AppError from '../utils/AppError.js';

const storage = multer.memoryStorage();
const fileFilter = (_req, file, cb) => {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) return cb(new AppError('Only JPG, PNG, and WebP images are allowed', 400));
  cb(null, true);
};
export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024, files: 8 } });
