import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import CustomizationRequest from '../models/CustomizationRequest.js';
import AppError from '../utils/AppError.js';

async function presentCart(userId) {
  const cart = await Cart.findOne({ user: userId }).populate('items.product').populate('items.customization');
  if (!cart) return { items: [], subtotal: 0, total: 0 };
  const items = cart.items.filter((i) => i.product?.active).map((i) => {
    const custom = i.customization;
    const price = custom ? custom.customPrice : i.product.price;
    return { id: i._id, product: i.product, customization: custom, quantity: i.quantity, price, lineTotal: price * i.quantity };
  });
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return { id: cart._id, items, subtotal, total: subtotal };
}
export async function getCart(req, res) { res.json({ success: true, cart: await presentCart(req.user._id) }); }
export async function addToCart(req, res) {
  const { productId, customizationId, quantity = 1 } = req.body;
  const product = await Product.findById(productId); if (!product?.active) throw new AppError('Product is unavailable', 404);
  let customization = null;
  if (customizationId) {
    customization = await CustomizationRequest.findOne({ _id: customizationId, user: req.user._id, product: productId, status: { $in: ['approved', 'accepted'] } });
    if (!customization) throw new AppError('This custom quote is not available', 400);
  }
  const qty = customization ? 1 : Math.max(1, Math.min(Number(quantity), 20));
  if (!customization && product.stock < qty) throw new AppError('Not enough stock available', 400);
  let cart = await Cart.findOne({ user: req.user._id }); if (!cart) cart = new Cart({ user: req.user._id, items: [] });
  const existing = cart.items.find((i) => String(i.product) === String(productId) && String(i.customization || '') === String(customizationId || ''));
  if (existing) existing.quantity = customization ? 1 : Math.min(existing.quantity + qty, 20); else cart.items.push({ product: productId, customization: customizationId || null, quantity: qty });
  if (customization) { customization.status = 'accepted'; await customization.save(); }
  await cart.save(); res.status(201).json({ success: true, cart: await presentCart(req.user._id) });
}
export async function updateCartItem(req, res) {
  const cart = await Cart.findOne({ user: req.user._id }); if (!cart) throw new AppError('Cart not found', 404);
  const item = cart.items.id(req.params.itemId); if (!item) throw new AppError('Cart item not found', 404);
  const quantity = Math.max(1, Math.min(Number(req.body.quantity), 20));
  const product = await Product.findById(item.product); if (!item.customization && product.stock < quantity) throw new AppError('Not enough stock available', 400);
  item.quantity = item.customization ? 1 : quantity; await cart.save(); res.json({ success: true, cart: await presentCart(req.user._id) });
}
export async function removeCartItem(req, res) {
  const cart = await Cart.findOne({ user: req.user._id }); if (!cart) throw new AppError('Cart not found', 404);
  const item = cart.items.id(req.params.itemId); if (!item) throw new AppError('Cart item not found', 404);
  cart.items.pull(item._id); await cart.save(); res.json({ success: true, cart: await presentCart(req.user._id) });
}
