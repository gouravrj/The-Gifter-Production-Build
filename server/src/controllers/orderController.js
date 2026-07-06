import crypto from 'node:crypto';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import AppError from '../utils/AppError.js';

const makeOrderNumber = () => `TG-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
export async function createOrder(req, res) {
  const { name, email, phone, address, codAccepted } = req.body;
  if (!name || !email || !phone || !address) throw new AppError('Complete all delivery details', 400);
  if (!codAccepted) throw new AppError('Please confirm Cash on Delivery', 400);
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product').populate('items.customization');
  if (!cart?.items.length) throw new AppError('Your cart is empty', 400);
  const items = []; const decremented = [];
  try {
    for (const item of cart.items) {
      const product = item.product; if (!product?.active) throw new AppError('A product in your cart is unavailable', 400);
      if (item.customization && !['accepted', 'approved'].includes(item.customization.status)) throw new AppError('A custom quote is no longer valid', 400);
      if (!item.customization) {
        const updated = await Product.findOneAndUpdate({ _id: product._id, stock: { $gte: item.quantity } }, { $inc: { stock: -item.quantity } });
        if (!updated) throw new AppError(`${product.name} does not have enough stock`, 409);
        decremented.push({ id: product._id, quantity: item.quantity });
      }
      const price = item.customization ? item.customization.customPrice : product.price;
      items.push({ product: product._id, customization: item.customization?._id, name: item.customization ? `Custom ${product.name}` : product.name, image: item.customization?.referenceImage?.url || product.images[0]?.url, price, quantity: item.quantity });
    }
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const order = await Order.create({ orderNumber: makeOrderNumber(), user: req.user._id, items, shipping: { name, email, phone, address }, subtotal, total: subtotal });
    cart.items = []; await cart.save(); res.status(201).json({ success: true, order });
  } catch (error) {
    await Promise.all(decremented.map((x) => Product.findByIdAndUpdate(x.id, { $inc: { stock: x.quantity } }))); throw error;
  }
}
export async function myOrders(req, res) {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }); res.json({ success: true, orders });
}
export async function getOrder(req, res) {
  const filter = { _id: req.params.id, ...(req.user.role !== 'admin' && { user: req.user._id }) };
  const order = await Order.findOne(filter); if (!order) throw new AppError('Order not found', 404); res.json({ success: true, order });
}
export async function adminOrders(_req, res) {
  const orders = await Order.find().populate('user', 'fullName email').sort({ createdAt: -1 }); res.json({ success: true, orders });
}
export async function updateOrderStatus(req, res) {
  if (!['pending', 'shipped', 'delivered'].includes(req.body.status)) throw new AppError('Invalid order status', 400);
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }); if (!order) throw new AppError('Order not found', 404);
  res.json({ success: true, order });
}
