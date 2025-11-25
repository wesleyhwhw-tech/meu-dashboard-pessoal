
import React, { useState } from 'react';

interface DateFilterProps {
  onDateChange: (range: { start: Date | null, end: Date | null }) => void;
}

export const DateFilter: React.FC<DateFilterProps> = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApplyFilter = () => {
    // Parsing 'YYYY-MM-DD' with new Date() creates a date at UTC midnight.
    // To make the end date inclusive, we get the start of the *next* day 
    // and use a "less than" comparison in the filter.
    let end = null;
    if (endDate) {
        const endDateObj = new Date(endDate);
        // Add one day (in UTC)
        end = new Date(endDateObj.setUTCDate(endDateObj.getUTCDate() + 1));
    }

    onDateChange({
      start: startDate ? new Date(startDate) : null,
      end: end,
    });
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    onDateChange({ start: null, end: null });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col sm:flex-row items-center gap-4">
      <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mr-4">Filtrar por Data</h3>
      <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto">
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Início</label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fim</label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-2 sm:mt-0">
         <button onClick={handleApplyFilter} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm">Aplicar</button>
         <button onClick={handleClearFilter} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm">Limpar</button>
      </div>
    </div>
  );
};