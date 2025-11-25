
import React, { useState, useCallback } from 'react';
import { generateFinancialInsights, generateBettingInsights } from '../services/geminiService';
import { type Transaction, type Bet } from '../types';
import ReactMarkdown from 'react-markdown';

interface GeminiInsightsProps {
  data: Transaction[] | Bet[];
  type: 'finance' | 'betting';
}

export const GeminiInsights: React.FC<GeminiInsightsProps> = ({ data, type }) => {
  const [insights, setInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getInsights = useCallback(async () => {
    if (data.length === 0) {
      setInsights("Não há dados suficientes para gerar uma análise.");
      return;
    }

    setIsLoading(true);
    setInsights('');

    try {
      const result =
        type === 'finance'
          ? await generateFinancialInsights(data as Transaction[])
          : await generateBettingInsights(data as Bet[]);
      setInsights(result);
    } catch (error) {
      console.error("Failed to get insights:", error);
      setInsights("Ocorreu um erro ao buscar os insights. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, [data, type]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Análise com IA (Gemini)</h3>
        <button
          onClick={getInsights}
          disabled={isLoading || data.length === 0}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l.707-.707M6.343 17.657l.707.707m12.728 0l-.707.707M12 21v-1" /></svg>
          )}
          {isLoading ? 'Analisando...' : 'Gerar Análise'}
        </button>
      </div>
      <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 min-h-[100px]">
        {insights ? (
           <ReactMarkdown>{insights}</ReactMarkdown>
        ) : (
            <p className="text-center text-gray-400">Clique em "Gerar Análise" para obter insights sobre seus dados.</p>
        )}
      </div>
    </div>
  );
};
