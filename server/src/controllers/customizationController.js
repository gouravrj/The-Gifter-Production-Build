import CustomizationRequest from '../models/CustomizationRequest.js';
import Product from '../models/Product.js';
import AppError from '../utils/AppError.js';
import { uploadImage } from '../services/imageKitService.js';

export async function createRequest(req, res) {
  if (!req.file) throw new AppError('A reference image is required', 400);
  if (!req.body.description || req.body.description.trim().length < 10) throw new AppError('Please provide at least 10 characters of detail', 400);
  const product = await Product.findById(req.body.productId); if (!product?.active) throw new AppError('Product not found', 404);
  const referenceImage = await uploadImage(req.file, '/the-gifter/customizations');
  const request = await CustomizationRequest.create({ user: req.user._id, product: product._id, description: req.body.description, referenceImage });
  res.status(201).json({ success: true, request });
}
export async function myRequests(req, res) {
  const requests = await CustomizationRequest.find({ user: req.user._id }).populate('product', 'name images price').sort({ createdAt: -1 });
  res.json({ success: true, requests });
}
export async function declineQuote(req, res) {
  const request = await CustomizationRequest.findOne({ _id: req.params.id, user: req.user._id, status: 'approved' });
  if (!request) throw new AppError('Approved quote not found', 404); request.status = 'declined'; await request.save();
  res.json({ success: true, request });
}
export async function adminListRequests(req, res) {
  const requests = await CustomizationRequest.find().populate('user', 'fullName email').populate('product', 'name images').sort({ createdAt: -1 });
  res.json({ success: true, requests });
}
export async function reviewRequest(req, res) {
  const request = await CustomizationRequest.findById(req.params.id); if (!request) throw new AppError('Request not found', 404);
  const { action, customPrice, adminNote = '' } = req.body;
  if (!['approve', 'reject'].includes(action)) throw new AppError('Choose approve or reject', 400);
  if (action === 'approve' && (!Number(customPrice) || Number(customPrice) <= 0)) throw new AppError('Enter a valid custom price', 400);
  request.status = action === 'approve' ? 'approved' : 'rejected'; request.customPrice = action === 'approve' ? Number(customPrice) : undefined; request.adminNote = adminNote;
  await request.save(); res.json({ success: true, request });
}
