
import React from 'react';
import { ReceiptEntry, ReceiptStatus } from '../types.ts';

interface ReceiptTableProps {
  entries: ReceiptEntry[];
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: ReceiptStatus) => void;
}

const ReceiptTable: React.FC<ReceiptTableProps> = ({ entries, onDelete, onUpdateStatus }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">Ledger Details</h2>
        <span className="text-sm text-slate-500 font-medium">{entries.length} Records</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Receipt No.</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Item Description</th>
              <th className="px-6 py-4">Req.</th>
              <th className="px-6 py-4">Qty</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Disc.</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Total Amount</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-6 py-16 text-center text-slate-400 italic text-sm">
                  No records found in the ledger.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600">{entry.date}</td>
                  <td className="px-6 py-4 text-sm font-mono font-semibold text-indigo-600">{entry.receiptNo}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">{entry.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{entry.itemDescription}</td>
                  <td className="px-6 py-4 text-[10px] text-slate-500 italic max-w-[100px] truncate" title={entry.customerRequest}>
                    {entry.customerRequest || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{entry.quantity}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">₹{entry.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-red-500">-₹{entry.discount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">₹{entry.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{entry.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <select 
                      value={entry.status}
                      onChange={(e) => onUpdateStatus(entry.id, e.target.value as ReceiptStatus)}
                      className={`text-[11px] font-bold px-3 py-1 rounded-full border border-transparent focus:ring-2 focus:ring-offset-1 outline-none appearance-none cursor-pointer transition-all ${
                        entry.status === ReceiptStatus.PAID ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        entry.status === ReceiptStatus.PENDING ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-red-50 text-red-700 border-red-100'
                      }`}
                    >
                      <option value={ReceiptStatus.PAID}>{ReceiptStatus.PAID}</option>
                      <option value={ReceiptStatus.PENDING}>{ReceiptStatus.PENDING}</option>
                      <option value={ReceiptStatus.CANCELLED}>{ReceiptStatus.CANCELLED}</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onDelete(entry.id)}
                      className="text-slate-300 hover:text-red-600 transition-colors p-1"
                      title="Delete Entry"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceiptTable;
