import React, { useState } from 'react';
import { type ContentData, type ContentIdea } from '../types';
import { Card } from './Card';

interface ContentTrackerProps {
  data: ContentData;
  setData: React.Dispatch<React.SetStateAction<ContentData>>;
}

const IdeaBank: React.FC<{
    ideas: ContentIdea[];
    setData: React.Dispatch<React.SetStateAction<ContentData>>;
}> = ({ ideas, setData }) => {
    const [newIdeaText, setNewIdeaText] = useState('');
    const [ideaType, setIdeaType] = useState<ContentIdea['type']>('quick');

    const handleAddIdea = (e: React.FormEvent) => {
        e.preventDefault();
        if (newIdeaText.trim() === '') return;
        const newIdea: ContentIdea = {
            id: Date.now().toString(),
            text: newIdeaText,
            type: ideaType,
            status: 'idea',
        };
        setData(prev => ({ ...prev, contentIdeas: [...prev.contentIdeas, newIdea] }));
        setNewIdeaText('');
    };

    const handleDeleteIdea = (id: string) => {
        setData(prev => ({ ...prev, contentIdeas: prev.contentIdeas.filter(idea => idea.id !== id) }));
    };

    return (
        <Card className="flex flex-col h-full">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Banco de Ideias</h3>
            <form onSubmit={handleAddIdea} className="space-y-3 mb-4">
                <textarea
                    value={newIdeaText}
                    onChange={e => setNewIdeaText(e.target.value)}
                    placeholder="Nova ideia de conteúdo..."
                    rows={3}
                    className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-sm"
                />
                <div className="flex justify-between items-center">
                    <select value={ideaType} onChange={e => setIdeaType(e.target.value as any)} className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-sm">
                        <option value="quick">Ideia Rápida</option>
                        <option value="video">Vídeo</option>
                        <option value="insight">Insight</option>
                    </select>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm">Adicionar</button>
                </div>
            </form>
            <div className="flex-grow overflow-y-auto pr-2">
                <ul className="space-y-2">
                    {ideas.map(idea => (
                        <li key={idea.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm text-gray-800 dark:text-gray-200">{idea.text}</span>
                            <button onClick={() => handleDeleteIdea(idea.id)} className="text-red-500 hover:text-red-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </Card>
    );
}

export const ContentTracker: React.FC<ContentTrackerProps> = ({ data, setData }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Controle de Crescimento</h3>
                <p className="text-center text-gray-500 py-10">
                    Funcionalidade de acompanhamento de métricas em desenvolvimento.
                </p>
            </Card>
            <IdeaBank ideas={data.contentIdeas} setData={setData} />
        </div>
    );
};
