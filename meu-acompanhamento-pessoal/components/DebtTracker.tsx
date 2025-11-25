import React, { useMemo } from 'react';
import { type Debt } from '../types';
import { AddDebtForm } from './AddDebtForm';
import { DebtList } from './DebtList';
import { SummaryCard } from './SummaryCard';

interface DebtTrackerProps {
  debts: Debt[];
  addDebt: (debt: Omit<Debt, 'id' | 'status'>) => void;
  updateDebt: (debt: Debt) => void;
  deleteDebt: (id: string) => void;
}

export const DebtTracker: React.FC<DebtTrackerProps> = ({ debts, addDebt, updateDebt, deleteDebt }) => {

  const { totalOwed, totalPaid } = useMemo(() => {
    return debts.reduce((acc, debt) => {
        if (debt.status === 'active') {
            acc.totalOwed += debt.totalAmount - debt.amountPaid;
        }
        acc.totalPaid += debt.amountPaid;
        return acc;
    }, { totalOwed: 0, totalPaid: 0 });
  }, [debts]);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SummaryCard title="Total Devido (Ativas)" value={totalOwed} format="currency" color="text-red-500" />
        <SummaryCard title="Total Pago" value={totalPaid} format="currency" color="text-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AddDebtForm onAddDebt={addDebt} />
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Lista de Dívidas</h3>
            <DebtList debts={debts} onUpdate={updateDebt} onDelete={deleteDebt} />
        </div>
      </div>
    </div>
  );
};