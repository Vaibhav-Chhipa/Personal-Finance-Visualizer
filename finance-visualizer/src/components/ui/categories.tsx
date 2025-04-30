'use client';

import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28'];

const CategoryPieChart = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7)); // default: current month
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await fetch('/api/transactions');
      if (res.ok) {
        const data = await res.json();
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

    const formatted = Object.entries(categoryTotals).map(([category, amount]) => ({
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
