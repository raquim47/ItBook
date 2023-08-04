import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['FrontEnd', 'BackEnd', 'CS'], required: true },  
});

export default mongoose.model('Category', categorySchema);
