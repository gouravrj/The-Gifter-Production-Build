import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { createRequest, myRequests, declineQuote, adminListRequests, reviewRequest } from '../controllers/customizationController.js';
const router = Router(); router.use(protect);
router.post('/', upload.single('referenceImage'), createRequest); router.get('/mine', myRequests); router.patch('/:id/decline', declineQuote);
router.get('/', adminOnly, adminListRequests); router.patch('/:id/review', adminOnly, reviewRequest);
export default router;
