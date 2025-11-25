import React, { useState } from 'react';
import { type ProductivityData, type ProductivityItem } from '../types';
import { Card } from './Card';

interface ProductivityTrackerProps {
  data: ProductivityData;
  setData: React.Dispatch<React.SetStateAction<ProductivityData>>;
}

type ListType = keyof ProductivityData;

const ProductivityList: React.FC<{
  title: string;
  items: ProductivityItem[];
  listType: ListType;
  setData: React.Dispatch<React.SetStateAction<ProductivityData>>;
}> = ({ title, items, listType, setData }) => {
  const [newItemText, setNewItemText] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemText.trim() === '') return;
    const newItem: ProductivityItem = {
      id: Date.now().toString(),
      text: newItemText,
      completed: false,
    };
    setData(prevData => ({
      ...prevData,
      [listType]: [...prevData[listType], newItem],
    }));
    setNewItemText('');
  };

  const handleToggleItem = (id: string) => {
    setData(prevData => ({
      ...prevData,
      [listType]: prevData[listType].map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">{title}</h3>
      <ul className="space-y-2 mb-4">
        {items.map(item => (
          <li key={item.id} className="flex items-center">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => handleToggleItem(item.id)}
              className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className={`ml-3 text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
              {item.text}
            </span>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddItem} className="flex gap-2">
        <input
          type="text"
          value={newItemText}
          onChange={e => setNewItemText(e.target.value)}
          placeholder="Adicionar item..."
          className="flex-grow p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-sm"
        />
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm">
          +
        </button>
      </form>
    </Card>
  );
};

export const ProductivityTracker: React.FC<ProductivityTrackerProps> = ({ data, setData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="md:col-span-1 lg:col-span-1 space-y-6">
        <ProductivityList title="Checklist Diário" items={data.dailyChecklist} listType="dailyChecklist" setData={setData} />
        <ProductivityList title="Hábitos do Dia" items={data.habits} listType="habits" setData={setData} />
      </div>
       <div className="md:col-span-1 lg:col-span-1 space-y-6">
        <ProductivityList title="Metas da Semana" items={data.weeklyGoals} listType="weeklyGoals" setData={setData} />
        <ProductivityList title="Metas do Mês" items={data.monthlyGoals} listType="monthlyGoals" setData={setData} />
      </div>
       <div className="md:col-span-2 lg:col-span-1 space-y-6">
        <ProductivityList title="Projetos Ativos" items={data.activeProjects} listType="activeProjects" setData={setData} />
      </div>
    </div>
  );
};
