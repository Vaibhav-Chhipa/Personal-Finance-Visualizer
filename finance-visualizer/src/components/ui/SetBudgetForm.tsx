'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Budget = {
  _id?: string;
  month: string;
  amount: number;
};

const SetBudgetForm = () => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [form, setForm] = useState<{ month: string; amount: string }>({
    month: currentMonth,
    amount: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentMonthBudget, setCurrentMonthBudget] = useState<Budget | null>(null);
  const [allBudgets, setAllBudgets] = useState<Budget[]>([]);

  useEffect(() => {
  const fetchBudgets = async () => {
    const res = await fetch('/api/budget');
    if (!res.ok) return;
    const budgets: Budget[] = await res.json();
    setAllBudgets(budgets);

    const existing = budgets.find((b) => b.month === currentMonth);
    if (existing) {
      setCurrentMonthBudget(existing);
      setSubmitted(true);
      setForm({ month: existing.month, amount: existing.amount.toString() });
    }
  };
  fetchBudgets();
}, [currentMonth]); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const existingBudget = allBudgets.find((b) => b.month === form.month);
    const isNewMonth = !existingBudget;

    const res = await fetch('/api/budget', {
      method: isNewMonth ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...(isNewMonth ? {} : { _id: currentMonthBudget?._id }),
        month: form.month || currentMonth,
        amount: parseFloat(form.amount),
      }),
    });

    if (res.ok) {
      const updatedRes = await fetch('/api/budget');
      const updatedBudgets: Budget[] = await updatedRes.json();
      setAllBudgets(updatedBudgets);

      const updated = updatedBudgets.find((b) => b.month === currentMonth);
      setCurrentMonthBudget(updated || null);
      setSubmitted(true);
      setEditing(false);
    }
  };

  const handleEdit = (month: string) => {
    const budget = allBudgets.find((b) => b.month === month);
    if (budget) {
      setForm({ month: budget.month, amount: budget.amount.toString() });
      setCurrentMonthBudget(budget);
      setEditing(true);
      setSubmitted(false);
    }
  };

  const handleDelete = async (_id: string) => {
    const res = await fetch('/api/budget', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id }),
    });

    if (res.ok) {
      const updatedRes = await fetch('/api/budget');
      const updatedBudgets: Budget[] = await updatedRes.json();
      setAllBudgets(updatedBudgets);

      if (currentMonthBudget?._id === _id) {
        setCurrentMonthBudget(null);
        setSubmitted(false);
      }
    }
  };

  return (
    <div className="mt-4">
      {submitted && !editing ? (
        <>
          <h2 className="text-xl font-semibold">Budget for {currentMonth}</h2>
          <p className="mt-2 font-medium">₹{currentMonthBudget?.amount}</p>
          <Button className="mt-2" onClick={() => setEditing(true)}>Edit</Button>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <h2 className="text-xl font-semibold">{editing ? 'Edit Budget' : 'Set Budget'}</h2>

          <div>
            <Label htmlFor="month">Month</Label>
            <Input
              id="month"
              name="month"
              type="month"
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
          </div>

          <Button type="submit">{editing ? 'Update Budget' : 'Submit'}</Button>
        </form>
      )}

      {allBudgets.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">All Saved Budgets</h3>
          <div className="border rounded-md p-3 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-1">Month</th>
                  <th className="py-1">Amount (₹)</th>
                  <th className="py-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allBudgets.map((b) => (
                  <tr key={b._id} className="border-b">
                    <td className="py-1">{b.month}</td>
                    <td className="py-1">₹{b.amount}</td>
                    <td className="py-1 flex gap-2">
                      <Button onClick={() => handleEdit(b.month)}>Edit</Button>
                      <Button variant="destructive" onClick={() => b._id && handleDelete(b._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetBudgetForm;
