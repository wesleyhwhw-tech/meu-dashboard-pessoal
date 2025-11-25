
import React, { useState, useEffect } from 'react';
import { type Bet } from '../types';

interface EditBetModalProps {
  bet: Bet;
  onSave: (updatedBet: Bet) => void;
  onClose: () => void;
}

export const EditBetModal: React.FC<EditBetModalProps> = ({ bet, onSave, onClose }) => {
  const [description, setDescription] = useState(bet.description);
  const [stake, setStake] = useState(bet.stake.toString());
  const [odds, setOdds] = useState(bet.odds.toString());
  const [result, setResult] = useState(bet.result);
  const [date, setDate] = useState(bet.date);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stakeNum = parseFloat(stake);
    const oddsNum = parseFloat(odds);
    let profit = 0;
    if (result === 'won') {
      profit = stakeNum * oddsNum - stakeNum;
    } else if (result === 'lost') {
      profit = -stakeNum;
    }

    onSave({
      ...bet,
      description,
      stake: stakeNum,
      odds: oddsNum,
      result,
      profit,
      date,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md m-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Editar Aposta</h3>
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
          <div className="flex justify-end gap-4 pt-4">
             <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">Cancelar</button>
             <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
};
