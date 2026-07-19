import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Search, Filter, Download, ChevronLeft, ChevronRight, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock Data
const generateMockTxns = () => {
  return Array.from({ length: 20 }).map((_, i) => {
    const isFraud = Math.random() > 0.85;
    return {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date(Date.now() - Math.random() * 10000000000).toLocaleString(),
      merchant: ['Amazon', 'Netflix', 'Apple Store', 'Best Buy', 'Uber', 'Unknown Entity', 'Crypto Exchange'][Math.floor(Math.random() * 7)],
      amount: (Math.random() * 2500).toFixed(2),
      risk: isFraud ? (0.8 + Math.random() * 0.19).toFixed(2) : (0.01 + Math.random() * 0.1).toFixed(2),
      status: isFraud ? 'Blocked' : 'Approved'
    };
  });
};

const MOCK_DATA = generateMockTxns();

export const FraudAnalystWorkspace = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6 pb-12 w-full animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <PageHeader 
          title="Transactions" 
          description="Global ledger of processed events." 
        />
        <Button variant="outline" className="flex items-center gap-2 text-sm bg-white border-slate-200">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <div className="bg-white rounded-[1.25rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by ID, Merchant, or Amount..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2 text-sm bg-white border-slate-200 w-full sm:w-auto">
            <Filter className="w-4 h-4" /> Filters
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="p-4 font-semibold">Transaction ID</th>
                <th className="p-4 font-semibold">Date & Time</th>
                <th className="p-4 font-semibold">Merchant</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">AI Risk Score</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {MOCK_DATA.map((tx, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                  <td className="p-4 font-mono text-xs text-slate-500 group-hover:text-emerald-600 transition-colors">{tx.id}</td>
                  <td className="p-4 text-slate-600">{tx.date}</td>
                  <td className="p-4 font-medium text-slate-900">{tx.merchant}</td>
                  <td className="p-4 font-semibold text-slate-900">${tx.amount}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${tx.status === 'Blocked' ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${parseFloat(tx.risk) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{tx.risk}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider
                      ${tx.status === 'Blocked' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}
                    `}>
                      {tx.status === 'Blocked' ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-sm text-slate-500">
          <div>Showing 1 to 20 of 2,492 entries</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0"><ChevronLeft className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" className="h-8 bg-emerald-50 text-emerald-700 border-emerald-200">1</Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">2</Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">3</Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0"><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>

      </div>
    </div>
  );
};
