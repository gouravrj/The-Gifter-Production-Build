import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  customization: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomizationRequest', default: null },
  name: { type: String, required: true },
  image: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
}, { _id: false });
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: { type: [orderItemSchema], required: true },
  shipping: {
    name: { type: String, required: true }, email: { type: String, required: true },
    phone: { type: String, required: true }, address: { type: String, required: true }
  },
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['COD'], default: 'COD' },
  status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending', index: true }
}, { timestamps: true });
export default mongoose.model('Order', orderSchema);
