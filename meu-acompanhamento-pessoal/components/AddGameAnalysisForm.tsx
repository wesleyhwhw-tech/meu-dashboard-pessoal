import React, { useState, useEffect } from 'react';
import { type GameAnalysis } from '../types';

interface AddGameAnalysisFormProps {
  onAddAnalysis: (analysis: Omit<GameAnalysis, 'id'>) => void;
  initialState?: Omit<GameAnalysis, 'id'>;
  isLoading?: boolean;
}

export const AddGameAnalysisForm: React.FC<AddGameAnalysisFormProps> = ({ onAddAnalysis, initialState, isLoading }) => {
  const [match, setMatch] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [potentialEntries, setPotentialEntries] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if(initialState) {
        setMatch(initialState.match);
        setDate(initialState.date);
        setAnalysis(initialState.analysis);
        setPotentialEntries(initialState.potentialEntries);
    }
  }, [initialState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!match || !analysis || !date) return;
    onAddAnalysis({
      date,
      match,
      analysis,
      potentialEntries,
    });
    setMatch('');
    setAnalysis('');
    setPotentialEntries('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center rounded-lg z-10">
            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Adicionar Análise de Jogo</h3>
      <input type="text" placeholder="Partida (Ex: Time A vs Time B)" value={match} onChange={(e) => setMatch(e.target.value)} required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
      <textarea placeholder="Minha pré-análise..." value={analysis} onChange={(e) => setAnalysis(e.target.value)} required rows={4} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
      <textarea placeholder="Possíveis entradas para ficar de olho..." value={potentialEntries} onChange={(e) => setPotentialEntries(e.target.value)} rows={3} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
      <button type="submit" className="w-full p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Adicionar Análise</button>
    </form>
  );
};
