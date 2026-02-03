
import React, { useState, useEffect, useCallback } from 'react';
import ReceiptForm from './components/ReceiptForm.tsx';
import ReceiptTable from './components/ReceiptTable.tsx';
import Dashboard from './components/Dashboard.tsx';
import { ReceiptEntry, ReceiptStatus } from './types.ts';
import { analyzeFinanceData } from './services/geminiService.ts';

const STORAGE_KEY = 'smart_receipt_ledger_data';

// Fallback for crypto.randomUUID() which requires secure context
const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const App: React.FC = () => {
  const [entries, setEntries] = useState<ReceiptEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load data from localStorage", e);
      return [];
    }
  });
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const generateReceiptNo = useCallback(() => {
    const lastNum = entries.length > 0 
      ? Math.max(...entries.map(e => {
          const parts = e.receiptNo.split(' - ');
          return parts.length > 1 ? parseInt(parts[1]) : 0;
        })) 
      : 0;
    const nextNum = lastNum + 1;
    return `AB_RNC - ${nextNum.toString().padStart(2, '0')}`;
  }, [entries]);

  const handleAddEntry = (data: Omit<ReceiptEntry, 'id' | 'receiptNo' | 'amount' | 'totalAmount'>) => {
    const amount = data.quantity * data.price;
    const totalAmount = amount - data.discount;
    const newEntry: ReceiptEntry = {
      ...data,
      id: generateId(),
      receiptNo: generateReceiptNo(),
      amount,
      totalAmount,
    };
    setEntries(prev => [newEntry, ...prev]);
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm("Are you sure you want to delete this receipt?")) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleUpdateStatus = (id: string, status: ReceiptStatus) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  const handleAIAnalysis = async () => {
    if (entries.length === 0) {
      alert("Add some entries first for analysis.");
      return;
    }
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeFinanceData(entries);
      setAiAnalysis(analysis);
    } catch (err) {
      console.error("AI Analysis failed", err);
      setAiAnalysis("Error generating insights. Please try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Smart Ledger</h1>
              <p className="text-xs text-slate-500 font-medium">Finance & Receipt Tracker</p>
            </div>
          </div>
          <button 
            onClick={handleAIAnalysis}
            disabled={isAnalyzing}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all ${
              isAnalyzing ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 shadow-sm border border-indigo-200'
            }`}
          >
            {isAnalyzing ? (
              <svg className="animate-spin h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 11V5h2v6H9zm0 4v-2h2v2H9z" />
              </svg>
            )}
            AI Insights
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Dashboard entries={entries} aiAnalysis={aiAnalysis} />
        
        <div className="flex flex-col gap-8">
          <ReceiptForm 
            onAdd={handleAddEntry} 
            nextReceiptNo={generateReceiptNo()} 
          />
          
          <ReceiptTable 
            entries={entries} 
            onDelete={handleDeleteEntry}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      </main>

      <footer className="mt-20 border-t border-slate-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">© 2024 Smart Receipt Ledger System • All Financial Data is Processed Locally</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
