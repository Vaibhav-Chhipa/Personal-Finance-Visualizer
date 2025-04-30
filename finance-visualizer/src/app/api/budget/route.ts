import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Budget from '@/model/budget';

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const budget = new Budget(body);
  await budget.save();
  return NextResponse.json(budget);
}

export async function GET() {
  try {
    await connectDB();
    const budgets = await Budget.find();
    return NextResponse.json(budgets, { status: 200 });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await connectDB();
  const body = await req.json();

  try {
    const updated = await Budget.findByIdAndUpdate(
      body._id,
      { amount: body.amount },
      { new: true }
    );
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await connectDB();
  const { _id } = await req.json();

  if (!_id) {
    return new NextResponse(JSON.stringify({ error: 'Missing _id' }), { status: 400 });
  }

  await Budget.findByIdAndDelete(_id);
  return NextResponse.json({ success: true });
}
