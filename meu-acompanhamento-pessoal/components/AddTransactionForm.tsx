
import React, { useState } from 'react';
import { type Transaction } from '../types';

interface AddTransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onAddTransaction }) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date) return;
    onAddTransaction({
      type,
      description,
      category,
      amount: parseFloat(amount),
      date,
    });
    setDescription('');
    setCategory('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Adicionar Transação</h3>
      <div>
        <div className="flex rounded-md shadow-sm">
            <button type="button" onClick={() => setType('income')} className={`px-4 py-2 rounded-l-md w-1/2 ${type === 'income' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Receita</button>
            <button type="button" onClick={() => setType('expense')} className={`px-4 py-2 rounded-r-md w-1/2 ${type === 'expense' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Despesa</button>
        </div>
      </div>
      <input type="text" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
      <input type="text" placeholder="Categoria (opcional)" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
      <input type="number" placeholder="Valor" value={amount} onChange={(e) => setAmount(e.target.value)} required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" min="0.01" step="0.01" />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
      <button type="submit" className="w-full p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Adicionar</button>
    </form>
  );
};
