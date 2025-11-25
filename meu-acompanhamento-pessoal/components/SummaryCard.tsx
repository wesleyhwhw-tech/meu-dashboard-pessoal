import React from 'react';

interface SummaryCardProps {
  title: string;
  value: number;
  format?: 'currency' | 'percentage';
  color?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, format, color = 'text-gray-900 dark:text-gray-100' }) => {
  const formattedValue = () => {
    switch (format) {
      case 'currency':
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      case 'percentage':
        return `${value.toFixed(2)}%`;
      default:
        return value;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</h3>
      <p className={`mt-1 text-3xl font-semibold ${color}`}>{formattedValue()}</p>
    </div>
  );
};
