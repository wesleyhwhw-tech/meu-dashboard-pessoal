
import React, { useState, useMemo, useCallback } from 'react';
import { type Bet } from '../types';
import { GeminiInsights } from './GeminiInsights';
import { SummaryCard } from './SummaryCard';
import { AddBetForm } from './AddBetForm';
import { BetList } from './BetList';
import { DateFilter } from './DateFilter';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { checkBetResult } from '../services/geminiService';
import { EditBetModal } from './EditBetModal';


interface BettingTrackerProps {
  bets: Bet[];
  addBet: (bet: Omit<Bet, 'id'>) => void;
  updateBet: (bet: Bet) => void;
  updateMultipleBets: (bets: Bet[]) => void;
  deleteBet: (id: string) => void;
}

export const BettingTracker: React.FC<BettingTrackerProps> = ({ bets, addBet, updateBet, updateMultipleBets, deleteBet }) => {
  const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null });
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [isCheckingAll, setIsCheckingAll] = useState(false);
  const [editingBet, setEditingBet] = useState<Bet | null>(null);


  const filteredBets = useMemo(() => {
    return bets
      .filter(b => {
        const betDate = new Date(b.date);
        if (dateRange.start && betDate < dateRange.start) return false;
        if (dateRange.end && betDate >= dateRange.end) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [bets, dateRange]);

  const handleCheckResult = useCallback(async (betId: string) => {
    const betToCheck = bets.find(b => b.id === betId);
    if (!betToCheck) return;

    setCheckingId(betId);
    try {
        const { result, profit } = await checkBetResult(betToCheck);
        if (result !== 'pending') {
            updateBet({ ...betToCheck, result, profit });
        } else {
            alert('Não foi possível determinar o resultado da aposta automaticamente.');
        }
    } catch (e) {
        console.error("Error checking bet result:", e);
        alert('Ocorreu um erro ao verificar o resultado.');
    } finally {
        setCheckingId(null);
    }
  }, [bets, updateBet]);

  const handleCheckAllResults = useCallback(async () => {
    const pendingBets = filteredBets.filter(b => b.result === 'pending');
    if (pendingBets.length === 0) {
        alert("Nenhuma aposta pendente para verificar.");
        return;
    }

    setIsCheckingAll(true);
    try {
        const results = await Promise.all(
            pendingBets.map(async (bet) => {
                const { result, profit } = await checkBetResult(bet);
                return { ...bet, result, profit };
            })
        );
        const updatedBets = results.filter(b => b.result !== 'pending');
        if (updatedBets.length > 0) {
            updateMultipleBets(updatedBets);
        }
        alert(`${updatedBets.length} de ${pendingBets.length} apostas foram atualizadas.`);
    } catch (e) {
        console.error("Error checking all bet results:", e);
        alert('Ocorreu um erro ao verificar as apostas em massa.');
    } finally {
        setIsCheckingAll(false);
    }
  }, [filteredBets, updateMultipleBets]);


  const { totalStaked, totalProfit, roi } = useMemo(() => {
    const result = filteredBets.reduce(
      (acc, b) => {
        if (b.result !== 'pending') {
          acc.totalStaked += b.stake;
          acc.totalProfit += b.profit;
        }
        return acc;
      },
      { totalStaked: 0, totalProfit: 0 }
    );
    const roi = result.totalStaked > 0 ? (result.totalProfit / result.totalStaked) * 100 : 0;
    return { ...result, roi };
  }, [filteredBets]);
  
  const chartData = useMemo(() => {
    let cumulativeProfit = 0;
    return filteredBets
        .filter(b => b.result !== 'pending')
        .slice()
        .reverse()
        .map((b, index) => {
            cumulativeProfit += b.profit;
            return {
                name: `Aposta ${index + 1}`,
                date: new Date(b.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
                Lucro: cumulativeProfit,
            };
        });
  }, [filteredBets]);

  const handleEditSave = (updatedBet: Bet) => {
    updateBet(updatedBet);
    setEditingBet(null);
  };

  return (
    <div className="space-y-6">
      {editingBet && (
          <EditBetModal
            bet={editingBet}
            onSave={handleEditSave}
            onClose={() => setEditingBet(null)}
          />
      )}
      <DateFilter onDateChange={setDateRange} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Total Apostado" value={totalStaked} format="currency" color="text-blue-500" />
        <SummaryCard title="Lucro/Prejuízo" value={totalProfit} format="currency" color={totalProfit >= 0 ? 'text-green-500' : 'text-red-500'} />
        <SummaryCard title="ROI" value={roi} format="percentage" color={roi >= 0 ? 'text-green-500' : 'text-red-500'} />
        <SummaryCard title="Total de Apostas" value={filteredBets.filter(b => b.result !== 'pending').length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <AddBetForm onAddBet={addBet} />
          <GeminiInsights data={filteredBets} type="betting" />
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Evolução do Lucro</h3>
                <button
                    onClick={handleCheckAllResults}
                    disabled={isCheckingAll}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                    title="Verificar o resultado de todas as apostas pendentes"
                >
                    {isCheckingAll ? 'Verificando...' : 'Verificar Todas Pendentes'}
                </button>
            </div>
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                      <Legend />
                      <Line type="monotone" dataKey="Lucro" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-gray-500">
                Dados insuficientes para exibir o gráfico de evolução.
              </div>
            )}
          <BetList bets={filteredBets} onDelete={deleteBet} onCheckResult={handleCheckResult} checkingId={checkingId} onEdit={setEditingBet} />
        </div>
      </div>
    </div>
  );
};
