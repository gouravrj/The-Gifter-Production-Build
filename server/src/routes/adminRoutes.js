import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { dashboard, listUsers } from '../controllers/adminController.js';
const router = Router(); router.use(protect, adminOnly); router.get('/dashboard', dashboard); router.get('/users', listUsers);
export default router;
