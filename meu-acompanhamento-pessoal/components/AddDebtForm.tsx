import React, { useState } from 'react';
import { type Debt } from '../types';

interface AddDebtFormProps {
  onAddDebt: (debt: Omit<Debt, 'id' | 'status'>) => void;
}

export const AddDebtForm: React.FC<AddDebtFormProps> = ({ onAddDebt }) => {
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !totalAmount || !dueDate) return;
    onAddDebt({
      description,
      totalAmount: parseFloat(totalAmount),
      amountPaid: amountPaid ? parseFloat(amountPaid) : 0,
      dueDate,
    });
    setDescription('');
    setTotalAmount('');
    setAmountPaid('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Adicionar Dívida</h3>
      <input type="text" placeholder="Descrição da Dívida" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
      <div className="flex gap-4">
        <input type="number" placeholder="Valor Total" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} required className="w-1/2 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" min="0.01" step="0.01" />
        <input type="number" placeholder="Valor Pago (Opcional)" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} className="w-1/2 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" min="0" step="0.01" />
      </div>
      <div>
        <label htmlFor="due-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Vencimento</label>
        <input type="date" id="due-date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className="w-full mt-1 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
      </div>
      <button type="submit" className="w-full p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Adicionar Dívida</button>
    </form>
  );
};