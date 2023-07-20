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
      enum: ['frontend', 'backend', 'cs'],
      required: true,
    },
    subCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    imageUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Product', productSchema);
