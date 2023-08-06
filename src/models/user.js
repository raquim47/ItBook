import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false, required: true },
  address: { type: String, required: false },
  phone: { type: String, required: false },
  cart: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  wishList: [
    { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
  ],
});

export default mongoose.model('User', userSchema);
