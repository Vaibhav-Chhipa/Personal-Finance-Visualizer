import { useState, useEffect, useCallback } from 'react';

type SpendingData = {
  _id: string;
  totalSpending: number;
};

type BudgetData = {
  month: string;
  amount: number;
};

type Insight = {
  month: string;
  spending: number;
  budget: number;
  budgetPercentage: string;
};

const Insights = () => {
  const [spendingData, setSpendingData] = useState<SpendingData[]>([]);
  const [budgetData, setBudgetData] = useState<BudgetData[]>([]);
  const [insightsList, setInsightsList] = useState<Insight[]>([]);

  const fetchSpendingData = async () => {
    const res = await fetch('/api/spending');
    if (res.ok) {
      const data: SpendingData[] = await res.json();
      setSpendingData(data);
    } else {
      console.error('Error fetching spending data');
    }
  };

  const fetchBudgetData = async () => {
    const res = await fetch('/api/budget');
    if (res.ok) {
      const data: BudgetData[] = await res.json();
      setBudgetData(data);
    } else {
      console.error('Error fetching budget data');
    }
  };

  const calculateMonthlyInsights = useCallback(() => {
    const allMonths = Array.from(
      new Set([...spendingData.map(s => s._id), ...budgetData.map(b => b.month)])
    ).sort();

    const insights = allMonths.map(month => {
      const spending = spendingData.find(s => s._id === month)?.totalSpending || 0;
      const budget = budgetData.find(b => b.month === month)?.amount || 0;
      const budgetPercentage = budget > 0 ? ((spending / budget) * 100).toFixed(2) : 'N/A';

      return {
        month,
        spending,
        budget,
        budgetPercentage,
      };
    });

    setInsightsList(insights);
  }, [spendingData, budgetData]);

  useEffect(() => {
    fetchSpendingData();
    fetchBudgetData();
  }, []);

  useEffect(() => {
    if (spendingData.length > 0 || budgetData.length > 0) {
      calculateMonthlyInsights();
    }
  }, [spendingData, budgetData, calculateMonthlyInsights]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold">Monthly Spending Insights</h2>
      <div className="mt-4 border rounded p-4 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b font-medium">
              <th className="text-left py-2">Month</th>
              <th className="text-left py-2">Spending (₹)</th>
              <th className="text-left py-2">Budget (₹)</th>
              <th className="text-left py-2">Usage (%)</th>
            </tr>
          </thead>
          <tbody>
            {insightsList.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{item.month}</td>
                <td className="py-2">₹{item.spending}</td>
                <td className="py-2">₹{item.budget}</td>
                <td className="py-2">{item.budgetPercentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        {insightsList.length === 0 && <p className="text-gray-500">No data available.</p>}
      </div>
    </div>
  );
};

export default Insights;
