
import React, { useState, useCallback } from 'react';
import { type CalendarEvent } from '../types';
import { Card } from './Card';
import { parseEventFromText } from '../services/geminiService';

interface AgendaTrackerProps {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteEvent: (id: string) => void;
}

export const AgendaTracker: React.FC<AgendaTrackerProps> = ({ events, addEvent, deleteEvent }) => {
    const [eventText, setEventText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAddEvent = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (eventText.trim() === '') return;
        setIsLoading(true);
        try {
            const result = await parseEventFromText(eventText);
            const parsedEvent = JSON.parse(result);

            if(parsedEvent.title && parsedEvent.date && parsedEvent.time) {
                addEvent({ ...parsedEvent, fullText: eventText });
                setEventText('');
            } else {
                alert("Não foi possível extrair os detalhes do evento. Tente ser mais específico, incluindo título, data e hora.");
            }
        } catch(err) {
            console.error("Failed to parse event:", err);
            alert("Ocorreu um erro ao processar seu pedido. Verifique o formato e tente novamente.");
        } finally {
            setIsLoading(false);
        }
    }, [eventText, addEvent]);

    const sortedEvents = [...events].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                 <Card>
                    <form onSubmit={handleAddEvent} className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Agendar com IA</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Escreva seu compromisso. Ex: "Reunião de equipe amanhã às 10:30"
                        </p>
                        <div>
                            <textarea
                                value={eventText}
                                onChange={e => setEventText(e.target.value)}
                                rows={4}
                                placeholder="Descreva o evento..."
                                className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                                required
                            />
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-semibold disabled:bg-gray-400">
                            {isLoading ? 'Agendando...' : 'Agendar Evento'}
                        </button>
                    </form>
                    <div className="mt-4 text-xs text-gray-400 dark:text-gray-500 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <strong>Nota:</strong> Esta é uma agenda local e não sincroniza com o Google Calendar. Os eventos ficam salvos apenas neste navegador.
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Meus Compromissos</h3>
                     <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                        {sortedEvents.length === 0 ? (
                            <p className="text-center text-gray-500 py-10">Nenhum compromisso agendado.</p>
                        ) : (
                            sortedEvents.map(event => (
                                <div key={event.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-start justify-between">
                                    <div>
                                        <p className="font-bold text-indigo-600 dark:text-indigo-400">{event.title}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
                                            <span className="mx-2">|</span>
                                            {event.time}
                                        </p>
                                    </div>
                                    <button onClick={() => deleteEvent(event.id)} className="text-red-500 hover:text-red-700 ml-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};
