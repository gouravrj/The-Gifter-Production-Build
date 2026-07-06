import Product from '../models/Product.js';
import AppError from '../utils/AppError.js';
import { uploadImage, deleteImage } from '../services/imageKitService.js';

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
export async function listProducts(req, res) {
  const { search = '', category, subcategory, page = 1, limit = 12, featured } = req.query;
  const filter = { active: true };
  if (search) filter.$text = { $search: String(search).slice(0, 100) };
  if (category) filter.category = category;
  if (subcategory) filter.subcategory = subcategory;
  if (featured === 'true') filter.featured = true;
  const take = Math.min(Number(limit) || 12, 50), skip = (Math.max(Number(page), 1) - 1) * take;
  const [products, total] = await Promise.all([Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(take), Product.countDocuments(filter)]);
  res.json({ success: true, products, pagination: { page: Number(page), pages: Math.ceil(total / take), total } });
}
export async function getProduct(req, res) {
  const product = await Product.findOne({ $or: [{ slug: req.params.id }, ...(req.params.id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: req.params.id }] : [])], active: true });
  if (!product) throw new AppError('Product not found', 404); res.json({ success: true, product });
}
export async function createProduct(req, res) {
  const { name, description, price, category, subcategory = '', stock = 0, featured = false } = req.body;
  if (!name || !description || price === undefined || !category) throw new AppError('Name, description, price, and category are required', 400);
  const images = await Promise.all((req.files || []).map((file) => uploadImage(file, '/the-gifter/products')));
  const product = await Product.create({ name, slug: `${slugify(name)}-${Date.now().toString(36)}`, description, price: Number(price), category, subcategory, stock: Number(stock), featured: String(featured) === 'true', images });
  res.status(201).json({ success: true, product });
}
export async function updateProduct(req, res) {
  const product = await Product.findById(req.params.id); if (!product) throw new AppError('Product not found', 404);
  for (const key of ['name', 'description', 'category', 'subcategory']) if (req.body[key] !== undefined) product[key] = req.body[key];
  for (const key of ['price', 'stock']) if (req.body[key] !== undefined) product[key] = Number(req.body[key]);
  if (req.body.featured !== undefined) product.featured = String(req.body.featured) === 'true';
  const removeIds = req.body.removeImageIds ? JSON.parse(req.body.removeImageIds) : [];
  await Promise.all(product.images.filter((i) => removeIds.includes(i.fileId)).map((i) => deleteImage(i.fileId)));
  product.images = product.images.filter((i) => !removeIds.includes(i.fileId));
  if (req.files?.length) product.images.push(...await Promise.all(req.files.map((file) => uploadImage(file, '/the-gifter/products'))));
  await product.save(); res.json({ success: true, product });
}
export async function deleteProduct(req, res) {
  const product = await Product.findById(req.params.id); if (!product) throw new AppError('Product not found', 404);
  await Promise.all(product.images.map((i) => deleteImage(i.fileId))); await product.deleteOne(); res.json({ success: true, message: 'Product deleted' });
}
