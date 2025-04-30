import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BudgetComparisonChart = () => {
  const [budgetData, setBudgetData] = useState<any[]>([]);
  const [spendingData, setSpendingData] = useState<any[]>([]);

  const fetchComparisonData = async () => {
    const resBudget = await fetch('/api/budget');
    const resSpending = await fetch('/api/spending');

    if (resBudget.ok && resSpending.ok) {
      const budgets = await resBudget.json();
      const spending = await resSpending.json();

      const mergedData = budgets.map((budget: any) => {
        const actualSpending = spending.find((spend: any) => spend._id === budget.month);
        return {
          month: budget.month,
          budgetAmount: budget.amount,
          actualSpending: actualSpending ? actualSpending.totalSpending : 0,
        };
      });

      setBudgetData(mergedData);
      setSpendingData(mergedData);
    }
  };

  useEffect(() => {
    fetchComparisonData();
  }, []);

  return (
    // <div className="mt-8">
    //   <h2 className="text-xl font-semibold">Budget vs Actual Comparison</h2>
    //   <ResponsiveContainer width="100%" height={400}>
    //     <BarChart data={spendingData}>
    //       <CartesianGrid strokeDasharray="3 3" />
    //       <XAxis dataKey="month" />
    //       <YAxis />
    //       <Tooltip />
    //       <Legend />
    //       <Bar dataKey="budgetAmount" fill="#8884d8" name="Budget" />
    //       <Bar dataKey="actualSpending" fill="#82ca9d" name="Actual Spending" />
    //     </BarChart>
    //   </ResponsiveContainer>
    // </div>
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
