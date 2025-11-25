
import React, { useState, useCallback } from 'react';
import { type GameAnalysis } from '../types';
import { GameAnalysisList } from './GameAnalysisList';
import { fetchUpcomingMatches, generateGameAnalysis } from '../services/geminiService';

interface GameAnalysisTrackerProps {
  analyses: GameAnalysis[];
  addAnalyses: (analyses: Omit<GameAnalysis, 'id'>[]) => void;
  deleteAnalysis: (id: string) => void;
  deleteAllAnalyses: () => void;
}

interface UpcomingMatch {
    match: string;
    date: string;
}

export const GameAnalysisTracker: React.FC<GameAnalysisTrackerProps> = ({ analyses, addAnalyses, deleteAnalysis, deleteAllAnalyses }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [upcomingMatches, setUpcomingMatches] = useState<UpcomingMatch[]>([]);
  const [selectedMatches, setSelectedMatches] = useState<UpcomingMatch[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  const handleFetchMatches = useCallback(async () => {
    setIsLoadingMatches(true);
    setUpcomingMatches([]);
    setSelectedMatches([]);
    try {
        const result = await fetchUpcomingMatches(selectedDate);
        const cleanedString = result.replace(/^```json\s*|```$/g, '').trim();
        const matches = JSON.parse(cleanedString);
        if (Array.isArray(matches)) {
            setUpcomingMatches(matches);
        } else {
            throw new Error("Parsed data is not an array.");
        }
    } catch(e) {
        console.error("Failed to fetch or parse matches", e);
        alert("Não foi possível buscar os jogos. A resposta da IA pode estar em um formato inesperado.");
    } finally {
        setIsLoadingMatches(false);
    }
  }, [selectedDate]);

  const handleToggleMatchSelection = (match: UpcomingMatch) => {
    setSelectedMatches(prev => 
        prev.find(m => m.match === match.match) 
            ? prev.filter(m => m.match !== match.match) 
            : [...prev, match]
    );
  };

  const handleBatchAnalysis = useCallback(async () => {
    if (selectedMatches.length === 0) return;
    setIsLoadingAnalysis(true);
    try {
        const newAnalyses = [];
        for (const match of selectedMatches) {
            const result = await generateGameAnalysis(match.match);
            const cleanedString = result.replace(/^```json\s*|```$/g, '').trim();
            const analysisData = JSON.parse(cleanedString);
            newAnalyses.push({
                match: match.match,
                date: match.date,
                ...analysisData
            });
        }
        addAnalyses(newAnalyses);
        setSelectedMatches([]);
    } catch (e) {
        console.error("Failed to generate batch analysis", e);
        alert("Ocorreu um erro ao gerar as análises. Verifique o console.");
    } finally {
        setIsLoadingAnalysis(false);
    }
  }, [selectedMatches, addAnalyses]);

  const handleDeleteAll = () => {
    if (window.confirm("Tem certeza que deseja apagar TODAS as análises? Esta ação não pode ser desfeita.")) {
      deleteAllAnalyses();
    }
  };


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Assistente de Análise</h3>
                <div>
                    <label htmlFor="game-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data dos Jogos</label>
                    <input
                        type="date"
                        id="game-date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <button onClick={handleFetchMatches} disabled={isLoadingMatches} className="w-full p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400">
                    {isLoadingMatches ? 'Buscando...' : 'Buscar Jogos do Dia'}
                </button>
                {upcomingMatches.length > 0 && (
                    <div className="space-y-2 pt-2">
                        <h4 className="font-semibold">Jogos Encontrados:</h4>
                        <ul className="max-h-48 overflow-y-auto space-y-2 border-t border-b border-gray-200 dark:border-gray-700 py-2">
                            {upcomingMatches.map((match, index) => (
                                <li key={index} className="flex items-center text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                    <input
                                      type="checkbox"
                                      id={`match-${index}`}
                                      checked={selectedMatches.some(m => m.match === match.match)}
                                      onChange={() => handleToggleMatchSelection(match)}
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor={`match-${index}`} className="ml-3 text-gray-700 dark:text-gray-300">{match.match}</label>
                                </li>
                            ))}
                        </ul>
                         <button onClick={handleBatchAnalysis} disabled={isLoadingAnalysis || selectedMatches.length === 0} className="w-full p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400">
                            {isLoadingAnalysis ? 'Analisando...' : `Analisar e Adicionar (${selectedMatches.length})`}
                        </button>
                    </div>
                )}
            </div>
        </div>
        <div className="lg:col-span-2 space-y-4">
            {analyses.length > 0 && (
                <div className="flex justify-end">
                    <button 
                        onClick={handleDeleteAll}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                        Apagar Todas as Análises
                    </button>
                </div>
            )}
           <GameAnalysisList analyses={analyses} onDelete={deleteAnalysis} />
        </div>
      </div>
    </div>
  );
};
