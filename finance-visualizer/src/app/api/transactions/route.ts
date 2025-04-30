import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '../../../lib/mongodb';
import Transaction from '../../../model/transaction';

export async function POST(request: Request) {
  try {
    const { amount, date, description, category } = await request.json();
    
    console.log('Received Data:', { amount, date, description, category });

    if (!amount || !date || !description) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await connectDB();
    console.log('Database connected');
    console.log('MongoDB Connected to Database:', mongoose.connection.name);

    const newTransaction = new Transaction({ amount, date, description, category });
    await newTransaction.save();
    console.log('Transaction saved:', newTransaction);

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find().sort({ date: -1 });
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
    try {
      await connectDB();
      const { _id, ...updateData } = await req.json();
      const updated = await Transaction.findByIdAndUpdate(_id, updateData, { new: true });
      return NextResponse.json(updated);
    } catch (error) {
      console.error('Error updating transaction:', error);
      return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
    }
  }
  
  export async function DELETE(req: Request) {
    try {
      const url = new URL(req.url);
      const id = url.pathname.split('/').pop(); 
  
      if (!id) {
        return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
      }
  
      await connectDB();
  
      const transaction = await Transaction.findByIdAndDelete(id);
  
      if (!transaction) {
        return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
    }
  }