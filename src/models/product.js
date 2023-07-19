import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    pages: { type: Number, required: true },
    author: { type: String, required: true },
    mainCategory: {
      type: String, 
      required: true,
      enum: ['frontend', 'backend']
    },
    subCategory: { type: String, required: true }, 
    imageUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Product', productSchema);
