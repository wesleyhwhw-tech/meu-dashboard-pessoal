import React, { useState, useMemo } from 'react';
import { type Project, type TimeLog } from '../types';
import { DateFilter } from './DateFilter';
import { Card } from './Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// --- Helper Components ---

const AddProjectForm: React.FC<{ onAddProject: (p: Omit<Project, 'id'>) => void }> = ({ onAddProject }) => {
    const [name, setName] = useState('');
    const [earnings, setEarnings] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name) return;
        onAddProject({ name, assignedEarnings: parseFloat(earnings) || 0, status: 'Em Andamento' });
        setName('');
        setEarnings('');
    };

    return (
        <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Novo Projeto</h3>
                <input type="text" placeholder="Nome do Projeto" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                <input type="number" placeholder="Ganhos Atribuídos (opcional)" value={earnings} onChange={e => setEarnings(e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" min="0" step="0.01" />
                <button type="submit" className="w-full p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Adicionar Projeto</button>
            </form>
        </Card>
    );
};

const LogTimeForm: React.FC<{ projects: Project[], onLogTime: (log: Omit<TimeLog, 'id'>) => void }> = ({ projects, onLogTime }) => {
    const [projectId, setProjectId] = useState('');
    const [hours, setHours] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectId || !hours) return;
        onLogTime({ projectId, hours: parseFloat(hours), date });
        setHours('');
        setProjectId('');
    };

    if (projects.length === 0) {
        return <Card><p className="text-center text-sm text-gray-500">Adicione um projeto para poder registrar horas.</p></Card>
    }

    return (
        <Card>
             <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Registrar Horas</h3>
                <select value={projectId} onChange={e => setProjectId(e.target.value)} required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    <option value="" disabled>Selecione um projeto</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <div className="flex gap-4">
                    <input type="number" placeholder="Horas" value={hours} onChange={e => setHours(e.target.value)} required className="w-1/2 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" min="0.1" step="0.1" />
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-1/2 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <button type="submit" className="w-full p-2 bg-green-600 text-white rounded-md hover:bg-green-700">Registrar</button>
            </form>
        </Card>
    );
};


// --- Main Component ---

interface ProjectTrackerProps {
  projects: Project[];
  timeLogs: TimeLog[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addTimeLog: (log: Omit<TimeLog, 'id'>) => void;
  deleteTimeLog: (id: string) => void;
}

export const ProjectTracker: React.FC<ProjectTrackerProps> = ({ projects, timeLogs, addProject, updateProject, deleteProject, addTimeLog }) => {
    const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null });

    const filteredTimeLogs = useMemo(() => {
        return timeLogs.filter(log => {
          const logDate = new Date(log.date);
          if (dateRange.start && logDate < dateRange.start) return false;
          if (dateRange.end && logDate >= dateRange.end) return false;
          return true;
        });
    }, [timeLogs, dateRange]);

    const projectData = useMemo(() => {
        const dataMap = new Map<string, { project: Project, totalHours: number }>();
        projects.forEach(p => {
            dataMap.set(p.id, { project: p, totalHours: 0 });
        });

        filteredTimeLogs.forEach(log => {
            const entry = dataMap.get(log.projectId);
            if(entry) {
                entry.totalHours += log.hours;
            }
        });
        
        return Array.from(dataMap.values());
    }, [projects, filteredTimeLogs]);

    const chartData = useMemo(() => {
        return projectData
            .filter(d => d.totalHours > 0)
            .map(d => ({ name: d.project.name, 'Horas Gastas': d.totalHours }));
    }, [projectData]);

    return (
        <div className="space-y-6">
            <DateFilter onDateChange={setDateRange} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <AddProjectForm onAddProject={addProject} />
                    <LogTimeForm projects={projects} onLogTime={addTimeLog} />
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Duração dos Eventos</h3>
                         {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
                                    <XAxis type="number" />
                                    <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                                    <Legend />
                                    <Bar dataKey="Horas Gastas" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[200px] text-gray-500">
                                Nenhum registro de horas no período.
                            </div>
                        )}
                    </Card>
                    <Card>
                        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Status dos Projetos</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold">Projeto</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold">Horas</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold">Ganhos</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold">Rend./Hora</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold">Status</th>
                                        <th className="relative py-3.5 pl-3 pr-4"><span className="sr-only">Delete</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                    {projectData.map(({ project, totalHours }) => {
                                        const hourlyRate = totalHours > 0 ? project.assignedEarnings / totalHours : 0;
                                        return (
                                            <tr key={project.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium">{project.name}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm">{totalHours.toFixed(1)}h</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-green-500">{project.assignedEarnings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm">{hourlyRate.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                    <select value={project.status} onChange={(e) => updateProject({ ...project, status: e.target.value as Project['status']})} className="p-1 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-xs">
                                                        <option>Em Andamento</option>
                                                        <option>Concluído</option>
                                                        <option>Pausado</option>
                                                    </select>
                                                </td>
                                                <td className="py-4 pl-3 pr-4">
                                                    <button onClick={() => deleteProject(project.id)} className="text-red-500 hover:text-red-700">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
