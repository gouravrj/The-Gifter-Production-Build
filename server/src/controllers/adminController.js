import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import CustomizationRequest from '../models/CustomizationRequest.js';

export async function dashboard(_req, res) {
  const [totalProducts, totalUsers, totalOrders, pendingOrders, shippedOrders, deliveredOrders, totalCustomizationRequests] = await Promise.all([
    Product.countDocuments(), User.countDocuments({ role: 'user' }), Order.countDocuments(), Order.countDocuments({ status: 'pending' }),
    Order.countDocuments({ status: 'shipped' }), Order.countDocuments({ status: 'delivered' }), CustomizationRequest.countDocuments()
  ]);
  res.json({ success: true, stats: { totalProducts, totalUsers, totalOrders, pendingOrders, shippedOrders, deliveredOrders, totalCustomizationRequests } });
}
export async function listUsers(_req, res) {
  const users = await User.find({ role: 'user' }).select('-password -otpHash').sort({ createdAt: -1 }); res.json({ success: true, users });
}
