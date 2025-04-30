'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import BudgetComparisonChart from '@/components/ui/BudgetComaprisonChart';
import Insights from '@/components/ui/insights';
import Link from 'next/link';
import CategoryPieChart from '@/components/ui/categories';

type Transaction = {
    _id: string;
    amount: number;
    date: string;
    description: string;
    category: string;
};

const Dashboard = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        fetch('/api/transactions')
            .then((res) => res.json())
            .then((data) => setTransactions(data));
    }, []);

    const totalExpenses = transactions.reduce((acc, t) => acc + Number(t.amount), 0);

    const categoryData = transactions.reduce((acc: any, t: any) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
    }, {});

    return (
        <div className="relative min-h-screen">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30 -z-10"
                style={{ backgroundImage: "url('../Background-img.jpg')" }}
            />
            <div className="relative z-10 p-6 space-y-6 ">
                <div className="bg-gray-100 min-h-screen p-6 bg-cover bg-opacity-70"
                    style={{
                        backgroundImage: "url('../Background-img.jpg')"
                    }}
                >
                    <div className='max-w-md mx-auto mt-10 space-y-4'>
                        <nav className="bg-blue-600 text-white p-4 rounded-md shadow-md">
                            <div className="container mx-auto flex justify-between items-center">
                                <Link href="/" className="text-lg font-semibold hover:text-gray-200">Transactions</Link>
                            </div>
                        </nav>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
                        <Card className="bg-white p-4 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                            <CardContent className="text-center">
                                <h3 className="text-xl font-semibold text-gray-700">Total Expenses</h3>
                                <p className="text-2xl font-bold text-blue-600 mt-2">₹{totalExpenses}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white p-4 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                            <CardContent className="text-center">
                                <h3 className="text-xl font-semibold text-gray-700">Categories</h3>
                                <p className="text-2xl font-bold text-blue-600 mt-2">{Object.keys(categoryData).length}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white p-4 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                            <CardContent className="text-center">
                                <h3 className="text-xl font-semibold text-gray-700">Transactions</h3>
                                <p className="text-2xl font-bold text-blue-600 mt-2">{transactions.length}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Category-wise Expenses</h2>
                        <CategoryPieChart/>
                    </div>

                    <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Budget Comparison</h2>
                        <BudgetComparisonChart />
                    </div>

                    <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Insights</h2>
                        <Insights />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
