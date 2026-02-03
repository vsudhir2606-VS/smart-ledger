
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { ReceiptEntry, ReceiptStatus, FinancialSummary } from '../types';

interface DashboardProps {
  entries: ReceiptEntry[];
  aiAnalysis: string | null;
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444']; // Paid, Pending, Cancelled

const Dashboard: React.FC<DashboardProps> = ({ entries, aiAnalysis }) => {
  const summary: FinancialSummary = entries.reduce((acc, curr) => {
    if (curr.status === ReceiptStatus.PAID) {
      acc.totalRevenue += curr.totalAmount;
      acc.paidCount++;
    } else if (curr.status === ReceiptStatus.PENDING) {
      acc.pendingAmount += curr.totalAmount;
      acc.pendingCount++;
    } else if (curr.status === ReceiptStatus.CANCELLED) {
      acc.cancelledAmount += curr.totalAmount;
      acc.cancelledCount++;
    }
    return acc;
  }, {
    totalRevenue: 0,
    pendingAmount: 0,
    cancelledAmount: 0,
    paidCount: 0,
    pendingCount: 0,
    cancelledCount: 0
  });

  const chartData = [
    { name: 'Paid', value: summary.totalRevenue, count: summary.paidCount },
    { name: 'Pending', value: summary.pendingAmount, count: summary.pendingCount },
    { name: 'Cancelled', value: summary.cancelledAmount, count: summary.cancelledCount },
  ];

  const pieData = [
    { name: 'Paid', value: summary.paidCount },
    { name: 'Pending', value: summary.pendingCount },
    { name: 'Cancelled', value: summary.cancelledCount },
  ];

  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Revenue (Paid)</span>
          <span className="text-3xl font-bold text-emerald-600 mt-2">₹{summary.totalRevenue.toLocaleString()}</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Pending Amount</span>
          <span className="text-3xl font-bold text-amber-500 mt-2">₹{summary.pendingAmount.toLocaleString()}</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-red-100 flex flex-col items-center bg-red-50">
          <span className="text-sm font-medium text-red-800 uppercase tracking-wider">Cancelled Total</span>
          <span className="text-3xl font-bold text-red-600 mt-2">₹{summary.cancelledAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Financial Volume Overview</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `₹${value}`} />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Status Distribution</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>

      {aiAnalysis && (
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 11V5h2v6H9zm0 4v-2h2v2H9z" />
            </svg>
            <h3 className="font-semibold text-indigo-900">AI Financial Insights</h3>
          </div>
          <p className="text-indigo-800 text-sm leading-relaxed whitespace-pre-wrap">{aiAnalysis}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
