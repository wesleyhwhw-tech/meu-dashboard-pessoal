
import React, { useState, useMemo } from 'react';
import { type Transaction } from '../types';
import { GeminiInsights } from './GeminiInsights';
import { SummaryCard } from './SummaryCard';
import { AddTransactionForm } from './AddTransactionForm';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DateFilter } from './DateFilter';
import { TransactionList } from './TransactionList';

interface FinanceTrackerProps {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
}

export const FinanceTracker: React.FC<FinanceTrackerProps> = ({ transactions, addTransaction, deleteTransaction }) => {
  const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      if (dateRange.start && transactionDate < dateRange.start) return false;
      if (dateRange.end && transactionDate >= dateRange.end) return false;
      return true;
    });
  }, [transactions, dateRange]);

  const { totalIncome, totalExpense, netBalance } = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, t) => {
        if (t.type === 'income') acc.totalIncome += t.amount;
        else acc.totalExpense += t.amount;
        acc.netBalance = acc.totalIncome - acc.totalExpense;
        return acc;
      },
      { totalIncome: 0, totalExpense: 0, netBalance: 0 }
    );
  }, [filteredTransactions]);
  
  const chartData = useMemo(() => {
    const dataByMonth: { [key: string]: { name: string, Receita: number, Despesa: number } } = {};
    filteredTransactions.forEach(t => {
        const month = new Date(t.date).toLocaleString('pt-BR', { month: 'short', year: '2-digit', timeZone: 'UTC' });
        if (!dataByMonth[month]) {
            dataByMonth[month] = { name: month, Receita: 0, Despesa: 0 };
        }
        if (t.type === 'income') {
            dataByMonth[month].Receita += t.amount;
        } else {
            dataByMonth[month].Despesa += t.amount;
        }
    });
    return Object.values(dataByMonth).reverse();
  }, [filteredTransactions]);

  return (
    <div className="space-y-6">
      <DateFilter onDateChange={setDateRange} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Receita Total" value={totalIncome} format="currency" color="text-green-500" />
        <SummaryCard title="Despesa Total" value={totalExpense} format="currency" color="text-red-500" />
        <SummaryCard title="Saldo Líquido" value={netBalance} format="currency" color={netBalance >= 0 ? 'text-blue-500' : 'text-orange-500'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <AddTransactionForm onAddTransaction={addTransaction} />
          <GeminiInsights data={filteredTransactions} type="finance" />
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Visão Geral Mensal</h3>
           {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                    <Legend />
                    <Bar dataKey="Receita" fill="#22c55e" />
                    <Bar dataKey="Despesa" fill="#ef4444" />
                </BarChart>
            </ResponsiveContainer>
           ) : (
             <div className="flex items-center justify-center h-[250px] text-gray-500">
               Nenhum dado para o período selecionado.
             </div>
           )}
          <TransactionList transactions={filteredTransactions} onDelete={deleteTransaction} />
        </div>
      </div>
    </div>
  );
};
