import { Router } from 'express';
import { signup, verifyOtp, login, adminLogin, me, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.post('/signup', signup); router.post('/verify-otp', verifyOtp); router.post('/login', login); router.post('/admin-login', adminLogin);
router.get('/me', protect, me); router.patch('/me', protect, updateProfile);
export default router;
