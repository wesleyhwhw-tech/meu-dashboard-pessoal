
import React from 'react';
import { type Bet } from '../types';

interface BetListProps {
  bets: Bet[];
  onDelete: (id: string) => void;
  onCheckResult: (id: string) => void;
  onEdit: (bet: Bet) => void;
  checkingId: string | null;
}

const ResultBadge: React.FC<{ result: Bet['result'] }> = ({ result }) => {
  const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
  switch (result) {
    case 'won':
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Ganha</span>;
    case 'lost':
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>Perdida</span>;
    case 'pending':
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pendente</span>;
  }
};

export const BetList: React.FC<BetListProps> = ({ bets, onDelete, onCheckResult, onEdit, checkingId }) => {
  if (bets.length === 0) {
    return <div className="text-center py-8 text-gray-500">Nenhuma aposta registrada no período.</div>;
  }
  return (
     <div className="mt-6 flow-root">
       <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6">Aposta</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Data</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Status</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Lucro</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Ações</span>
                    </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
                    {bets.map((b) => (
                    <tr key={b.id}>
                        <td className="py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-900 dark:text-gray-100">{b.description}</span>
                            <span className="text-xs text-gray-500">
                                {b.stake.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} @ {b.odds.toFixed(2)}
                            </span>
                        </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(b.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                         <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"><ResultBadge result={b.result} /></td>
                        <td className={`whitespace-nowrap px-3 py-4 text-sm font-medium ${b.profit > 0 ? 'text-green-500' : b.profit < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                            {b.result !== 'pending' ? b.profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex items-center justify-end gap-x-4">
                            {b.result === 'pending' && (
                              <button 
                                onClick={() => onCheckResult(b.id)} 
                                disabled={checkingId === b.id}
                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 disabled:opacity-50 disabled:cursor-wait" 
                                title="Verificar Resultado com IA">
                                {checkingId === b.id ? (
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>
                                )}
                              </button>
                            )}
                             <button onClick={() => onEdit(b)} className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300" title="Editar Aposta">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <button onClick={() => onDelete(b.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Excluir Aposta">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};
