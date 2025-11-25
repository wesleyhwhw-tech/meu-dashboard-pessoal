
import React, { useState } from 'react';
import { type Bet } from '../types';

interface AddBetFormProps {
  onAddBet: (bet: Omit<Bet, 'id'>) => void;
}

export const AddBetForm: React.FC<AddBetFormProps> = ({ onAddBet }) => {
  const [description, setDescription] = useState('');
  const [stake, setStake] = useState('');
  const [odds, setOdds] = useState('');
  const [result, setResult] = useState<'won' | 'lost' | 'pending'>('pending');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !stake || !odds || !date) return;
    const stakeNum = parseFloat(stake);
    const oddsNum = parseFloat(odds);
    let profit = 0;
    if (result === 'won') {
      profit = stakeNum * oddsNum - stakeNum;
    } else if (result === 'lost') {
      profit = -stakeNum;
    }

    onAddBet({
      description,
      stake: stakeNum,
      odds: oddsNum,
      result,
      profit,
      date,
    });

    setDescription('');
    setStake('');
    setOdds('');
    setResult('pending');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Adicionar Aposta</h3>
      <input type="text" placeholder="Descrição da Aposta" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
      <div className="flex gap-4">
        <input type="number" placeholder="Valor (Stake)" value={stake} onChange={(e) => setStake(e.target.value)} required className="w-1/2 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" min="0.01" step="0.01" />
        <input type="number" placeholder="Odds" value={odds} onChange={(e) => setOdds(e.target.value)} required className="w-1/2 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" min="1.01" step="0.01" />
      </div>
      <select value={result} onChange={(e) => setResult(e.target.value as any)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
        <option value="pending">Pendente</option>
        <option value="won">Ganha</option>
        <option value="lost">Perdida</option>
      </select>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
      <button type="submit" className="w-full p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Adicionar</button>
    </form>
  );
};
