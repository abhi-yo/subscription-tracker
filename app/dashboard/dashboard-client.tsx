"use client";

import { BankTransaction } from "@/lib/services/google";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';

interface DashboardClientProps {
  bankTransactions: BankTransaction[];
}

export default function DashboardClient({ bankTransactions }: DashboardClientProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) { return "Invalid Date"; }
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
      const day = date.getDate().toString().padStart(2, '0'); 
      return `${year}-${month}-${day}`;
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return "Invalid Date";
    }
  };

  // Current month and year for filtering
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentMonthName = currentDate.toLocaleString('default', { month: 'long' });

  // Calculate Monthly Expenses (current month only)
  const currentMonthExpenses = bankTransactions
    .filter(tx => {
      const txDate = new Date(tx.date);
      return tx.type === 'debit' &&
             tx.currency === 'INR' &&
             txDate.getMonth() === currentMonth &&
             txDate.getFullYear() === currentYear;
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Calculate total of all visible transactions
  const filteredTransactions = bankTransactions.filter(tx => tx.type === 'debit');
  const totalAllTransactions = filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  // Group transactions by date for better organization
  const groupTransactionsByDate = (transactions: BankTransaction[]) => {
    const grouped: Record<string, BankTransaction[]> = {};
    
    transactions
      .filter(tx => tx.type === 'debit')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 50)
      .forEach(tx => {
        const dateKey = formatDate(tx.date);
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(tx);
      });
      
    return grouped;
  };

  const groupedTransactions = groupTransactionsByDate(bankTransactions);
  const transactionDates = Object.keys(groupedTransactions).sort().reverse();

  return (
    <main className="container mx-auto py-8 px-4">
      {/* Financial Summary Section */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-[#1a3329]">
          Your Financial Summary
        </h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          })}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#1a3329] text-lg">
              {currentMonthName} Expenses (INR)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#1a3329]">
              ₹{currentMonthExpenses.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              Current month transactions only
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#1a3329] text-lg">
              Total All Transactions (INR)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#1a3329]">
              ₹{totalAllTransactions.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              Sum of all {filteredTransactions.length} transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bank Transactions Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-[#1a3329]">
          Recent Bank Debits (INR)
        </h2>
        <div className="text-sm bg-gray-100 px-3 py-1 rounded-full">
          {filteredTransactions.length} transactions
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="bg-blue-100 border border-blue-300 text-blue-700 px-4 py-3 rounded-md" role="alert">
          <p>No recent debit transactions detected from bank alerts.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {transactionDates.map(date => (
            <div key={date} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 sticky top-0 bg-[#f9f5eb] py-2">
                {date}
              </h3>
              <div className="space-y-2">
                {groupedTransactions[date].map((tx, index) => (
                  <Card 
                    key={`bank-tx-${date}-${index}-${tx.id || index}`} 
                    className="bg-white hover:bg-gray-50 transition-colors shadow-sm overflow-hidden"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center gap-4">
                        <div className="flex-grow min-w-0">
                          <p className="font-medium text-[#1a3329] truncate" title={tx.description}>
                            {tx.description}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-md font-semibold text-red-600">
                            {tx.currency} {tx.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
} 