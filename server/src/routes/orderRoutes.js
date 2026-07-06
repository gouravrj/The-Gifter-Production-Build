import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { createOrder, myOrders, getOrder, adminOrders, updateOrderStatus } from '../controllers/orderController.js';
const router = Router(); router.use(protect);
router.post('/', createOrder); router.get('/mine', myOrders); router.get('/admin/all', adminOnly, adminOrders); router.patch('/:id/status', adminOnly, updateOrderStatus); router.get('/:id', getOrder);
export default router;
