import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import customizationRoutes from './routes/customizationRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { getCategories } from './services/catalogService.js';
import { sanitize } from './middleware/sanitize.js';
import { errorHandler, notFound } from './middleware/error.js';

const app = express();
app.set('trust proxy', 1);
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: { directives: {
    "img-src": ["'self'", 'data:', 'https:'],
    "style-src": ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    "font-src": ["'self'", 'data:', 'https://fonts.gstatic.com']
  } }
}));
app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || 'http://localhost:5173', credentials: false }));
app.use(express.json({ limit: '1mb' })); app.use(express.urlencoded({ extended: true, limit: '1mb' })); app.use(sanitize);
if (process.env.NODE_ENV !== 'test') app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false, message: { success: false, message: 'Too many attempts. Please try again later.' } });
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 400, standardHeaders: 'draft-7', legacyHeaders: false });
app.get('/api/health', (_req, res) => res.json({ success: true, status: 'healthy' }));
app.use('/api/auth', authLimiter, authRoutes); app.use('/api', apiLimiter);
app.use('/api/products', productRoutes); app.get('/api/categories', getCategories); app.use('/api/cart', cartRoutes);
app.use('/api/customizations', customizationRoutes); app.use('/api/orders', orderRoutes); app.use('/api/admin', adminRoutes);

const __dirname = path.dirname(fileURLToPath(import.meta.url)); const clientDist = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res, next) => req.path.startsWith('/api') ? next() : res.sendFile(path.join(clientDist, 'index.html')));
}
app.use(notFound); app.use(errorHandler);
export default app;
