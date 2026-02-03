
import React, { useState } from 'react';
import { ReceiptEntry, ReceiptStatus } from '../types.ts';

interface ReceiptFormProps {
  onAdd: (entry: Omit<ReceiptEntry, 'id' | 'receiptNo' | 'amount' | 'totalAmount'>) => void;
  nextReceiptNo: string;
}

const ReceiptForm: React.FC<ReceiptFormProps> = ({ onAdd, nextReceiptNo }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    name: '',
    itemDescription: '',
    customerRequest: '',
    quantity: 1,
    price: 0,
    discount: 0,
    status: ReceiptStatus.PENDING,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.itemDescription) {
      alert("Please fill in customer name and item description.");
      return;
    }
    onAdd(formData);
    setFormData({
      ...formData,
      name: '',
      itemDescription: '',
      customerRequest: '',
      quantity: 1,
      price: 0,
      discount: 0,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'quantity' || name === 'price' || name === 'discount') ? Number(value) : value
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">New Receipt Entry</h2>
        <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
          Receipt No: {nextReceiptNo}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-tight">Date</label>
          <input 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleChange}
            className="border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-tight">Customer Name</label>
          <input 
            type="text" 
            name="name" 
            placeholder="Client Name"
            value={formData.name} 
            onChange={handleChange}
            className="border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-tight">Item Description</label>
          <input 
            type="text" 
            name="itemDescription" 
            placeholder="Service/Product"
            value={formData.itemDescription} 
            onChange={handleChange}
            className="border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-tight">Customer Request</label>
          <input 
            type="text" 
            name="customerRequest" 
            placeholder="Notes..."
            value={formData.customerRequest} 
            onChange={handleChange}
            className="border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-tight">Quantity</label>
          <input 
            type="number" 
            name="quantity" 
            min="1"
            value={formData.quantity} 
            onChange={handleChange}
            className="border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-tight">Price (₹)</label>
          <input 
            type="number" 
            name="price" 
            min="0"
            value={formData.price} 
            onChange={handleChange}
            className="border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-tight">Discount (₹)</label>
          <input 
            type="number" 
            name="discount" 
            min="0"
            value={formData.discount} 
            onChange={handleChange}
            className="border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-tight">Status</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
            className="border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value={ReceiptStatus.PAID}>{ReceiptStatus.PAID}</option>
            <option value={ReceiptStatus.PENDING}>{ReceiptStatus.PENDING}</option>
            <option value={ReceiptStatus.CANCELLED}>{ReceiptStatus.CANCELLED}</option>
          </select>
        </div>

        <div className="md:col-span-2 lg:col-span-4 mt-2">
          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-md transition-all active:scale-[0.98]"
          >
            Add Receipt to Ledger
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReceiptForm;
