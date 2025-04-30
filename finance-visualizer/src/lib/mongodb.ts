import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  console.log('MongoDB Connected to Database:', mongoose.connection.name);

  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
};

export default connectDB;
