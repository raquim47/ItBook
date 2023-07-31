import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: false },
  phone: { type: String, required: false },
  isAdmin: { type: Boolean, default: false, required: true },
  cart: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

export default mongoose.model('User', userSchema);
