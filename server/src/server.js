import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';
import { ensureAdmin } from './services/adminService.js';
import { seedCatalog } from './services/catalogService.js';

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) { console.error('MONGODB_URI and JWT_SECRET are required'); process.exit(1); }
const port = process.env.PORT || 5000;
connectDB().then(async () => { await ensureAdmin(); await seedCatalog(); app.listen(port, () => console.log(`API listening on port ${port}`)); }).catch((error) => { console.error('Startup failed:', error); process.exit(1); });
