import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
            Meu Acompanhamento Pessoal
          </h1>
        </div>
      </div>
    </header>
  );
};
