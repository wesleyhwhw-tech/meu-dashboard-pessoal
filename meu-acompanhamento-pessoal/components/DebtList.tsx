import React from 'react';
import { type Debt } from '../types';

interface DebtListProps {
  debts: Debt[];
  onUpdate: (debt: Debt) => void;
  onDelete: (id: string) => void;
}

const StatusBadge: React.FC<{ status: Debt['status'] }> = ({ status }) => {
  const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
  return status === 'active' ? (
    <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Ativa</span>
  ) : (
    <span className={`${baseClasses} bg-green-100 text-green-800`}>Paga</span>
  );
};

export const DebtList: React.FC<DebtListProps> = ({ debts, onUpdate, onDelete }) => {
  
  const handleMarkAsPaid = (debt: Debt) => {
    onUpdate({ ...debt, status: 'paid', amountPaid: debt.totalAmount });
  };

  if (debts.length === 0) {
    return <div className="text-center py-8 text-gray-500">Nenhuma dívida registrada.</div>;
  }
  
  return (
    <div className="flow-root">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6">Descrição</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Valor Restante</th>
                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Status</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
                {debts.map((debt) => (
                  <tr key={debt.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6">
                      <div className="flex flex-col">
                        <span>{debt.description}</span>
                        <span className="text-xs text-gray-500">Vence em: {new Date(debt.dueDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {(debt.totalAmount - debt.amountPaid).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <StatusBadge status={debt.status} />
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex items-center justify-end gap-x-4">
                        {debt.status === 'active' && (
                            <button onClick={() => handleMarkAsPaid(debt)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300" title="Marcar como Paga">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </button>
                        )}
                        <button onClick={() => onDelete(debt.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Excluir">
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