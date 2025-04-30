'use client';

import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28'];

// Define types for transactions and category data
type Transaction = {
  category: string;
  amount: number;
  date: string;
};

type CategoryData = {
  name: string;
  value: number;
};

const CategoryPieChart = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]); 
  const [selectedMonth, setSelectedMonth] = useState<string>(() => new Date().toISOString().slice(0, 7)); 
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]); 

  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await fetch('/api/transactions');
      if (res.ok) {
        const data: Transaction[] = await res.json();
        setTransactions(data);
      } else {
        console.error('Failed to fetch transactions');
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    const filtered = transactions.filter(tx => tx.date.slice(0, 7) === selectedMonth);
    const categoryTotals: { [key: string]: number } = {};

    filtered.forEach(tx => {
      if (!categoryTotals[tx.category]) categoryTotals[tx.category] = 0;
      categoryTotals[tx.category] += tx.amount;
    });

    const formatted: CategoryData[] = Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount
    }));

    setCategoryData(formatted);
  }, [transactions, selectedMonth]);

  return (
    <div className="mt-6">
      <div className="mb-4">
        <label className="font-medium mr-2">Select Month:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-1 rounded"
        />
      </div>

      {categoryData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {categoryData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">No data available for {selectedMonth}.</p>
      )}
    </div>
  );
};

export default CategoryPieChart;
