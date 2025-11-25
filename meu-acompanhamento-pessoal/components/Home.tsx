
import React, { useMemo } from 'react';
import { type Transaction, type Bet, type Debt, type Idea } from '../types';
import { SummaryCard } from './SummaryCard';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

interface HomeProps {
  transactions: Transaction[];
  bets: Bet[];
  debts: Debt[];
  ideas: Idea[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const Home: React.FC<HomeProps> = ({ transactions, bets, debts, ideas }) => {
  const { netBalance, expenseByCategory, monthlySummary } = useMemo(() => {
    const expenseByCategory: { [key: string]: number } = {};
    const monthlySummary: { [key: string]: { name: string, Receita: number, Despesa: number } } = {};
    let netBalance = 0;

    transactions.forEach(t => {
      netBalance += t.type === 'income' ? t.amount : -t.amount;
      const month = new Date(t.date).toLocaleString('pt-BR', { month: 'short', year: '2-digit', timeZone: 'UTC' });
      if (!monthlySummary[month]) {
        monthlySummary[month] = { name: month, Receita: 0, Despesa: 0 };
      }

      if (t.type === 'expense') {
        const category = t.category || 'Outros';
        expenseByCategory[category] = (expenseByCategory[category] || 0) + t.amount;
        monthlySummary[month].Despesa += t.amount;
      } else {
        monthlySummary[month].Receita += t.amount;
      }
    });

    return {
      netBalance,
      expenseByCategory: Object.entries(expenseByCategory).map(([name, value]) => ({ name, value })),
      monthlySummary: Object.values(monthlySummary).reverse(),
    };
  }, [transactions]);

  const { totalProfit, profitEvolution } = useMemo(() => {
    let cumulativeProfit = 0;
    const sortedBets = bets
        .filter(b => b.result !== 'pending')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
    const profitEvolution = sortedBets.map((b, index) => {
        cumulativeProfit += b.profit;
        return { name: `Aposta ${index + 1}`, Lucro: cumulativeProfit };
    });

    return { totalProfit: cumulativeProfit, profitEvolution };
  }, [bets]);

  const totalOwed = useMemo(() => {
    return debts.reduce((acc, debt) => (debt.status === 'active' ? acc + (debt.totalAmount - debt.amountPaid) : acc), 0);
  }, [debts]);
  
  // FIX: Use a new property `activityType` to distinguish between transactions and bets,
  // to avoid overwriting the original `type` property of a transaction.
  const recentActivity = useMemo(() => {
    const lastTransactions = transactions.slice(0, 3).map(t => ({...t, activityType: 'transaction' as const}));
    const lastBets = bets.slice(0, 3).map(b => ({...b, activityType: 'bet' as const}));
    return [...lastTransactions, ...lastBets]
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
  }, [transactions, bets]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard de Resumo</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Seus principais indicadores em um só lugar.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Saldo Financeiro" value={netBalance} format="currency" color={netBalance >= 0 ? 'text-green-500' : 'text-red-500'} />
        <SummaryCard title="Lucro de Apostas" value={totalProfit} format="currency" color={totalProfit >= 0 ? 'text-green-500' : 'text-red-500'} />
        <SummaryCard title="Dívidas Ativas" value={totalOwed} format="currency" color="text-orange-500" />
        <SummaryCard title="Ideias Registradas" value={ideas.length} color="text-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-medium mb-4">Resumo Financeiro Mensal</h3>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlySummary}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                    <Legend />
                    <Bar dataKey="Receita" fill="#22c55e" />
                    <Bar dataKey="Despesa" fill="#ef4444" />
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-medium mb-4">Despesas por Categoria</h3>
             <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                         {expenseByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>
      
       <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-medium mb-4">Evolução do Lucro em Apostas</h3>
                 <ResponsiveContainer width="100%" height={250}>
                     <LineChart data={profitEvolution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                        <Line type="monotone" dataKey="Lucro" stroke="#8884d8" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 6 }}/>
                     </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-medium mb-4">Atividade Recente</h3>
                <ul className="space-y-3">
                    {/* FIX: Use `activityType` to correctly discriminate between item types and access their properties. */}
                    {recentActivity.map((item) => (
                        <li key={item.id} className="flex items-center justify-between text-sm">
                            <div className="flex flex-col">
                               <span>{item.description}</span>
                               <span className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString('pt-BR')} - {item.activityType === 'transaction' ? 'Finanças' : 'Aposta'}</span>
                            </div>
                           {item.activityType === 'transaction' ? (
                                <span className={item.type === 'income' ? 'font-semibold text-green-500' : 'font-semibold text-red-500'}>
                                    {item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                           ) : (
                                <span className="font-semibold">{item.result}</span>
                           )}
                        </li>
                    ))}
                     {recentActivity.length === 0 && <p className="text-center text-gray-500 pt-8">Nenhuma atividade recente.</p>}
                </ul>
            </div>
       </div>

    </div>
  );
};