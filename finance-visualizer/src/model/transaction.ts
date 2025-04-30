import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: false,
  },
},{
    collection: 'transaction',
});

export default mongoose.models.transaction || mongoose.model('transaction', TransactionSchema);
