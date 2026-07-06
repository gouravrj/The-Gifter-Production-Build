import mongoose from 'mongoose';

const customizationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  description: { type: String, required: true, minlength: 10, maxlength: 2000 },
  referenceImage: { url: { type: String, required: true }, fileId: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'accepted', 'declined'], default: 'pending', index: true },
  customPrice: { type: Number, min: 0 },
  adminNote: { type: String, maxlength: 1000 }
}, { timestamps: true });
export default mongoose.model('CustomizationRequest', customizationSchema);
