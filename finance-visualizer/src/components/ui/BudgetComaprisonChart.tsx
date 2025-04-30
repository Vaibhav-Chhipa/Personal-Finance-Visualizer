import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type BudgetSpending = {
  month: string;
  budgetAmount: number;
  actualSpending: number;
};


const BudgetComparisonChart = () => {
  const [spendingData, setSpendingData] = useState<BudgetSpending[]>([]);

  const fetchComparisonData = async () => {
    const resBudget = await fetch('/api/budget');
    const resSpending = await fetch('/api/spending');
  
    if (resBudget.ok && resSpending.ok) {
      const budgets: { month: string; amount: number }[] = await resBudget.json();
      const spending: { _id: string; totalSpending: number }[] = await resSpending.json();
  
      const mergedData: BudgetSpending[] = budgets.map((budget) => {
        const actualSpending = spending.find((spend) => spend._id === budget.month);
        return {
          month: budget.month,
          budgetAmount: budget.amount,
          actualSpending: actualSpending ? actualSpending.totalSpending : 0,
        };
      });
  
      setSpendingData(mergedData);
    }
  };
  

  useEffect(() => {
    fetchComparisonData();
  }, []);

  return (
    <div className="mt-8 max-w-4xl mx-auto">
  <h2 className="text-xl font-semibold mb-4 text-center">Budget vs Actual Comparison</h2>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart
      data={spendingData}
      margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month"  textAnchor="end" interval={0} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="budgetAmount" fill="#8884d8" name="Budget" />
      <Bar dataKey="actualSpending" fill="#82ca9d" name="Actual Spending" />
    </BarChart>
  </ResponsiveContainer>
</div>

  );
};

export default BudgetComparisonChart;
