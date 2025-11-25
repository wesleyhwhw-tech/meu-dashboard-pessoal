
import React from 'react';
import { type GameAnalysis } from '../types';

interface GameAnalysisListProps {
  analyses: GameAnalysis[];
  onDelete: (id: string) => void;
}

export const GameAnalysisList: React.FC<GameAnalysisListProps> = ({ analyses, onDelete }) => {
  if (analyses.length === 0) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center text-gray-500">
            Nenhuma análise de jogo registrada. Use o assistente para adicionar uma.
        </div>
    );
  }

  const sortedAnalyses = [...analyses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      {sortedAnalyses.map(item => (
        <div key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow relative">
           <button onClick={() => onDelete(item.id)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" title="Excluir Análise">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
           <h4 className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{item.match}</h4>
           <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{new Date(item.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>

            <div className="space-y-4 text-sm text-gray-800 dark:text-gray-200">
                <div>
                   <h5 className="font-semibold mb-1 text-gray-600 dark:text-gray-400">Pré-Análise:</h5>
                   <p className="whitespace-pre-wrap pl-2 border-l-2 border-gray-200 dark:border-gray-600">{item.analysis}</p>
                </div>
                {item.potentialEntries && (
                    <div>
                        <h5 className="font-semibold mb-1 text-gray-600 dark:text-gray-400">Possíveis Entradas:</h5>
                        <p className="whitespace-pre-wrap pl-2 border-l-2 border-gray-200 dark:border-gray-600">{item.potentialEntries}</p>
                    </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                        <h5 className="font-semibold text-gray-600 dark:text-gray-400">Árbitro e Cartões</h5>
                        <p>{item.referee || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{item.cardStats || 'N/A'}</p>
                    </div>
                    <div>
                        <h5 className="font-semibold text-gray-600 dark:text-gray-400">Escanteios</h5>
                        <p>{item.cornerScenario || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{item.teamCornerAverages || 'N/A'}</p>
                    </div>
                </div>
           </div>
        </div>
      ))}
    </>
  );
};
