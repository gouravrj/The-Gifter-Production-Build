import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getCart, addToCart, updateCartItem, removeCartItem } from '../controllers/cartController.js';
const router = Router(); router.use(protect);
router.get('/', getCart); router.post('/items', addToCart); router.patch('/items/:itemId', updateCartItem); router.delete('/items/:itemId', removeCartItem);
export default router;
