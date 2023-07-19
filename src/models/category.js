import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['frontend', 'backend'], required: true },  
});

export default mongoose.model('Category', categorySchema);
