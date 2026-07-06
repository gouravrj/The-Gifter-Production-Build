import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  customization: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomizationRequest', default: null },
  quantity: { type: Number, required: true, min: 1, max: 20, default: 1 }
}, { timestamps: true });
const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema]
}, { timestamps: true });
export default mongoose.model('Cart', cartSchema);
