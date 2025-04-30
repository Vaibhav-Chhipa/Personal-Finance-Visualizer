'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectItem } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Transaction } from '../types';
import SetBudgetForm from '@/components/ui/SetBudgetForm';

const categories = ['Food', 'Transportation', 'Entertainment', 'Health', 'Utilities', 'Others']
export default function TransactionForm() {
  const [form, setForm] = useState<Transaction>({
    _id: '',
    amount: '',
    date: '',
    description: '',
    category: '',
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);


  const fetchTransactions = async () => {
    const response = await fetch('/api/transactions');
    const data: Transaction[] = await response.json();
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = form._id ? 'PATCH' : 'POST';
    try {
      const res = await fetch('/api/transactions', {
        method: method,
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {

        fetchTransactions();
        setForm({
          _id: '',
          amount: '',
          date: '',
          description: '',
          category: '',
        });
      } else {
        const error = await res.text();
        console.error(`Failed to save transaction: ${error}`);
      }
    } catch (error) {
      console.error(`Error: ${error}`);
      
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!id) {
        console.error('Transaction ID is required');
        return;
      }

      const res = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        fetchTransactions();
      } else {
        const error = await res.text();
        console.error(`Failed to delete transaction: ${error}`);
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  return (
    <div className=" min-h-screen p-4 bg-cover"
    style={{
        backgroundImage: "url('../Background-img.jpg')"
    }}>
      <div className="max-w-150 mx-auto mt-5 space-y-2 bg-gray-100 bg-opacity-70 rounded-2xl p-4">
        <nav className="max-w-md mx-auto mt-10 space-y-4">
          <div className="bg-blue-600 text-white p-4 rounded-md shadow-md">
            <a href="/dashboard" className="text-lg font-bold">Dashboard</a>
          </div>
        </nav>


        <SetBudgetForm />

        <h2 className="text-xl font-semibold">Transactions of the month</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={form.category} onValueChange={(value: string) => setForm({ ...form, category: value })}>
              <SelectItem value="" disabled>Select Category</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </Select>
          </div>
          <   Button type="submit">{form._id ? 'Update' : 'Add'} Transaction</Button>
        </form>
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Transactions</h2>
          {transactions.map((txn) => (
            <div key={txn._id} className="border p-3 rounded mb-2">
              <div><strong>{txn.description}</strong> - ₹{txn.amount}</div>
              <div>{txn.category} | {new Date(txn.date).toLocaleDateString()}</div>
              <div className="mt-2">
                <Button onClick={() => setForm(txn)} className="mr-2">Edit</Button>
                <Button onClick={() => handleDelete(txn._id)} >Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
