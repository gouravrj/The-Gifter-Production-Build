import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({ url: { type: String, required: true }, fileId: String }, { _id: false });
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 140 },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  description: { type: String, required: true, maxlength: 4000 },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, index: true },
  subcategory: { type: String, default: '', index: true },
  images: { type: [imageSchema], default: [] },
  stock: { type: Number, default: 0, min: 0 },
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true }
}, { timestamps: true });
productSchema.index({ name: 'text', description: 'text', category: 'text', subcategory: 'text' });
export default mongoose.model('Product', productSchema);
