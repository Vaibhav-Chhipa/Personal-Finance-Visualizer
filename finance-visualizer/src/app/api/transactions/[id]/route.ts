import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Transaction from '../../../../model/transaction';

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); 

    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    await connectDB();

    const transaction = await Transaction.findByIdAndDelete(id);

    console.log("Deleting transaction with ID:", id);
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }


    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
