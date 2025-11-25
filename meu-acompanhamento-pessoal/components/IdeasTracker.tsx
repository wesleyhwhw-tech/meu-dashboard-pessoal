import React, { useState } from 'react';
import { type Idea, type IdeaCategory } from '../types';
import { Card } from './Card';

interface IdeasTrackerProps {
  ideas: Idea[];
  addIdea: (idea: Omit<Idea, 'id' | 'date'>) => void;
  deleteIdea: (id: string) => void;
}

const ideaCategories: IdeaCategory[] = ['Renda Extra', 'Automação', 'Conteúdo', 'Pessoal', 'Trabalho'];

const categoryColors: Record<IdeaCategory, string> = {
  'Renda Extra': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'Automação': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'Conteúdo': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'Pessoal': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'Trabalho': 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200',
};

export const IdeasTracker: React.FC<IdeasTrackerProps> = ({ ideas, addIdea, deleteIdea }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IdeaCategory>('Pessoal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '' || description.trim() === '') return;
    addIdea({ title, description, category });
    setTitle('');
    setDescription('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Registrar Nova Ideia</h3>
            <div>
              <label htmlFor="idea-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
              <input type="text" id="idea-title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div>
              <label htmlFor="idea-desc" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
              <textarea id="idea-desc" value={description} onChange={e => setDescription(e.target.value)} required rows={5} className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div>
              <label htmlFor="idea-cat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoria</label>
              <select id="idea-cat" value={category} onChange={e => setCategory(e.target.value as IdeaCategory)} className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                {ideaCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-semibold">Salvar Ideia</button>
          </form>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <div className="space-y-4">
          {ideas.length === 0 ? (
            <Card className="text-center text-gray-500">Nenhuma ideia registrada ainda.</Card>
          ) : (
            ideas.map(idea => (
              <Card key={idea.id} className="relative">
                <button onClick={() => deleteIdea(idea.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">{idea.title}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryColors[idea.category]}`}>{idea.category}</span>
                </div>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{new Date(idea.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{idea.description}</p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
