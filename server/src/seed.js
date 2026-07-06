import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { ensureAdmin } from './services/adminService.js';
import { seedCatalog } from './services/catalogService.js';
await connectDB(); await ensureAdmin(); await seedCatalog(); console.log('Catalog and admin seeded'); await mongoose.disconnect();
