import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  month: { type: String, required: true }, 
  amount: { type: Number, required: true },
});


export default mongoose.models.Budget || mongoose.model('Budget', budgetSchema);
