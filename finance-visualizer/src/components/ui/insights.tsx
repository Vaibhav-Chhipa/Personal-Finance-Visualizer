// import { useState, useEffect } from 'react';

// const Insights = () => {
//   const [spendingData, setSpendingData] = useState<any[]>([]);
//   const [budgetData, setBudgetData] = useState<any[]>([]);

//   const fetchSpendingData = async () => {
//     const res = await fetch('/api/spending');
//     if (res.ok) {
//       const data = await res.json();
//       console.log('Spending Data:', data);
//       setSpendingData(data);
//     } else {
//       console.error('Error fetching spending data');
//     }
//   };

//   const fetchBudgetData = async () => {
//     const res = await fetch('/api/budget');
//     if (res.ok) {
//       const data = await res.json();
//       console.log('Budget Data:', data);
//       setBudgetData(data); 
//     } else {
//       console.error('Error fetching budget data');
//     }
//   };

//   useEffect(() => {
//     fetchSpendingData();
//     fetchBudgetData();
//   }, []);
//   const [insights, setInsights] = useState({
//     totalSpendingThisMonth: 0,
//     totalSpendingLastMonth: 0,
//     budgetPercentage: 'N/A',
//   });

//   const calculateInsights = () => {
//     const thisMonth = new Date().toISOString().slice(0, 7);
//     const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);

//     const thisMonthSpending = spendingData.find((data: any) => data._id === thisMonth)?.totalSpending || 0;
//     const lastMonthSpending = spendingData.find((data: any) => data._id === lastMonth)?.totalSpending || 0;

//     const thisMonthBudget = budgetData.find((data: any) => data.month === thisMonth)?.amount || 0;
//     let budgetPercentage = 'N/A';

//     if (thisMonthBudget > 0) {
//       budgetPercentage = ((thisMonthSpending / thisMonthBudget) * 100).toFixed(2);
//     }

//     setInsights({
//       totalSpendingThisMonth: thisMonthSpending,
//       totalSpendingLastMonth: lastMonthSpending,
//       budgetPercentage: budgetPercentage,
//     });
//   };

//   useEffect(() => {
//     if (spendingData.length > 0 && budgetData.length > 0) {
//       calculateInsights();
//     }
//   }, [spendingData, budgetData]);

//   return (
//     <div className="mt-8">
//       <h2 className="text-xl font-semibold">Simple Spending Insights</h2>
//       <div className="mt-4">
//         <p>Total Spending This Month: ${insights.totalSpendingThisMonth}</p>
//         <p>Total Spending Last Month: ${insights.totalSpendingLastMonth}</p>
//         <p>Budget Usage Percentage: {insights.budgetPercentage}%</p>
//       </div>
//     </div>
//   );
// };

// export default Insights;


import { useState, useEffect } from 'react';

const Insights = () => {
  const [spendingData, setSpendingData] = useState<any[]>([]);
  const [budgetData, setBudgetData] = useState<any[]>([]);
  const [insightsList, setInsightsList] = useState<any[]>([]);

  const fetchSpendingData = async () => {
    const res = await fetch('/api/spending');
    if (res.ok) {
      const data = await res.json();
      setSpendingData(data);
    } else {
      console.error('Error fetching spending data');
    }
  };

  const fetchBudgetData = async () => {
    const res = await fetch('/api/budget');
    if (res.ok) {
      const data = await res.json();
      setBudgetData(data);
    } else {
      console.error('Error fetching budget data');
    }
  };

  const calculateMonthlyInsights = () => {
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
  };

  useEffect(() => {
    fetchSpendingData();
    fetchBudgetData();
  }, []);

  useEffect(() => {
    if (spendingData.length > 0 || budgetData.length > 0) {
      calculateMonthlyInsights();
    }
  }, [spendingData, budgetData]);

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
