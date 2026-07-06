import AppError from '../utils/AppError.js';

function clean(value) {
  if (!value || typeof value !== 'object') return value;
  for (const key of Object.keys(value)) {
    if (key.startsWith('$') || key.includes('.')) throw new AppError('Invalid input field', 400);
    clean(value[key]);
  }
  return value;
}
export const sanitize = (req, _res, next) => { clean(req.body); clean(req.params); clean(req.query); next(); };
