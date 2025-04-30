// 'use client';

// import { useState, useEffect } from 'react';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';

// const SetBudgetForm = () => {
//   const [form, setForm] = useState({ month: '', amount: '' });
//   const [submitted, setSubmitted] = useState(false);
//   const [editing, setEditing] = useState(false);
//   const [currentMonthBudget, setCurrentMonthBudget] = useState<any>(null);
//   const [allBudgets, setAllBudgets] = useState<any[]>([]);


//   const currentMonth = new Date().toISOString().slice(0, 7);

//   const checkExistingBudget = async () => {
//     const res = await fetch('/api/budget');
//     const budgets = await res.json();
//     const existing = budgets.find((b: any) => b.month === currentMonth);
//     if (existing) {
//       setCurrentMonthBudget(existing);
//       setSubmitted(true);
//       setForm({ month: existing.month, amount: existing.amount });
//     }
//   };
  

//   useEffect(() => {
//     checkExistingBudget();
//   }, []);

//   // const handleSubmit = async (e: any) => {
//   //   e.preventDefault();

//   //   const method = editing ? 'PUT' : 'POST';

//   //   const res = await fetch('/api/budget', {
//   //     method,
//   //     headers: { 'Content-Type': 'application/json' },
//   //     // body: JSON.stringify({
//   //     //   _id: currentMonthBudget?._id,
//   //     //   month: form.month || currentMonth,
//   //     //   amount: parseFloat(form.amount),
//   //     // }),
//   //     body: JSON.stringify({
//   //       _id: editing ? currentMonthBudget?._id : undefined, // only send _id if editing
//   //       month: form.month,
//   //       amount: parseFloat(form.amount),
//   //     }),      
//   //   });
//   //   checkExistingBudget(); // to refresh current month if needed
//   //   setForm({ month: '', amount: '' }); 

//   //   if (res.ok) {
//   //     const saved = await res.json();
//   //     setCurrentMonthBudget(saved);
//   //     setEditing(false);
//   //     setSubmitted(true);
//   //   }
//   // };
//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
  
//     const isNewMonth =
//       !currentMonthBudget || currentMonthBudget.month !== (form.month || currentMonth);
  
//     const method = isNewMonth ? 'POST' : 'PUT';
  
//     const res = await fetch('/api/budget', {
//       method,
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         _id: isNewMonth ? undefined : currentMonthBudget._id,
//         month: form.month || currentMonth,
//         amount: parseFloat(form.amount),
//       }),
//     });
  
//     if (res.ok) {
//       const saved = await res.json();
//       await checkExistingBudget(); // refresh data
//       setEditing(false);
//       setSubmitted(true);
//     }
//   };
  

//   if (submitted && !editing) {
//     return (
//       <div className="mt-4">
//         <h2 className="text-xl font-semibold">Budget for {currentMonth}</h2>
//         <p className="mt-2 font-medium">₹{currentMonthBudget?.amount}</p>
//         <Button className="mt-2" onClick={() => setEditing(true)}>Edit</Button>
//       </div>
//     );
//   }
  
  

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 mt-4">
//       <h2 className="text-xl font-semibold">{editing ? 'Edit Budget' : 'Set Budget'}</h2>

//       {/* {!submitted && (
//         <div>
//           <Label htmlFor="month">Month</Label>
//           <Input
//             id="month"
//             name="month"
//             type="month"
//             value={form.month}
//             onChange={(e) => setForm({ ...form, month: e.target.value })}
//             required
//           />
//         </div>
//       )} */}
//       {/* <div>
//         <Label htmlFor="month">Month</Label>
//         <Input
//           id="month"
//           name="month"
//           type="month"
//           value={form.month}
//           onChange={(e) => setForm({ ...form, month: e.target.value })}
//           required
//           disabled={!editing && submitted} // disables only when not editing
//         />
//       </div>
//        */}
//        <div>
//   <Label htmlFor="month">Month</Label>
//   <Input
//     id="month"
//     name="month"
//     type="month"
//     value={form.month}
//     onChange={(e) => setForm({ ...form, month: e.target.value })}
//     required
//   />
// </div>


//       <div>
//         <Label htmlFor="amount">Amount</Label>
//         <Input
//           id="amount"
//           name="amount"
//           type="number"
//           value={form.amount}
//           onChange={(e) => setForm({ ...form, amount: e.target.value })}
//           required
//         />
//       </div>

//       <Button type="submit">{editing ? 'Update Budget' : 'Submit'}</Button>
//     </form>
//   );
// };

// export default SetBudgetForm;


'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SetBudgetForm = () => {
  const [form, setForm] = useState({ month: '', amount: '' });
  const [submitted, setSubmitted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentMonthBudget, setCurrentMonthBudget] = useState<any>(null);
  const [allBudgets, setAllBudgets] = useState<any[]>([]);

  const currentMonth = new Date().toISOString().slice(0, 7);

  // Function to check for existing budget for the current month
  const checkExistingBudget = async () => {
    const res = await fetch('/api/budget');
    const budgets = await res.json();
    const existing = budgets.find((b: any) => b.month === currentMonth);
    if (existing) {
      setCurrentMonthBudget(existing);
      setSubmitted(true);
      setForm({ month: existing.month, amount: existing.amount });
    }
  };

  // Function to fetch all saved budgets
  const fetchAllBudgets = async () => {
    const res = await fetch('/api/budget');
    const budgets = await res.json();
    setAllBudgets(budgets);
  };

  // Fetch current budget and all budgets on component mount
  useEffect(() => {
    checkExistingBudget();
    fetchAllBudgets(); // Fetch all budgets when the component mounts
  }, []);

  // Handle form submission for both new and editing budgets
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // const isNewMonth = !currentMonthBudget || currentMonthBudget.month !== (form.month || currentMonth);
    const existingBudget = allBudgets.find((b) => b.month === form.month);
    const isNewMonth = !existingBudget;

    const method = isNewMonth ? 'POST' : 'PUT';

    const res = await fetch('/api/budget', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _id: isNewMonth ? undefined : currentMonthBudget?._id, // Pass _id if editing an existing budget
        month: form.month || currentMonth,
        amount: parseFloat(form.amount),
      }),
    });

    if (res.ok) {
      const saved = await res.json();
      await checkExistingBudget(); // Refresh the current month data
      await fetchAllBudgets(); // Refresh the list of all budgets
      setEditing(false);
      setSubmitted(true);
    }
  };

  // Handle the edit button to enable editing mode for any month
  const handleEdit = (month: string) => {
    const monthBudget = allBudgets.find((b) => b.month === month);
    if (monthBudget) {
      setCurrentMonthBudget(monthBudget);
      setForm({ month: monthBudget.month, amount: monthBudget.amount });
      setEditing(true);
      setSubmitted(false); // Set submitted to false when editing a budget
    }
  };
  const handleDelete = async (_id: string) => {
    const res = await fetch('/api/budget', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id }),
    });
  
    if (res.ok) {
      await fetchAllBudgets();
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
                    <td className="py-1  flex gap-2">
                      <Button onClick={() => handleEdit(b.month)}>Edit</Button>
                      <Button variant="destructive" onClick={() => handleDelete(b._id)}>Delete</Button>
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
