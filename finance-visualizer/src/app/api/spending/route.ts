import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Transaction from '../../../model/transaction';

export async function GET() {
  try {
    await connectDB();

    const spendingData = await Transaction.aggregate([
      {
        $group: {
          _id: { $substr: ["$date", 0, 7] },
          totalSpending: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    return NextResponse.json(spendingData);
  } catch (error) {
    console.error('Error fetching spending data:', error);
    return NextResponse.json({ error: 'Failed to fetch spending data' }, { status: 500 });
  }
}
