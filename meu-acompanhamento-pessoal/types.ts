
export enum View {
  HOME = 'home',
  FINANCES = 'finances',
  BETS = 'bets',
  DEBTS = 'debts',
  ANALYSES = 'analyses',
  IDEAS = 'ideas',
  AGENDA = 'agenda',
  SALES = 'sales',
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  category: string;
  amount: number;
  date: string;
}

export interface Bet {
  id: string;
  description: string;
  stake: number;
  odds: number;
  result: 'won' | 'lost' | 'pending';
  profit: number;
  date: string;
  category?: string;
}

export interface Debt {
  id: string;
  description: string;
  totalAmount: number;
  amountPaid: number;
  dueDate: string;
  status: 'active' | 'paid';
}

export interface GameAnalysis {
  id: string;
  date: string;
  match: string;
  analysis: string;
  potentialEntries?: string;
  referee?: string;
  cardStats?: string;
  cornerScenario?: string;
  teamCornerAverages?: string;
}

export type IdeaCategory = 'Renda Extra' | 'Automação' | 'Conteúdo' | 'Pessoal' | 'Trabalho';

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: IdeaCategory;
  date: string;
}

export interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    time: string;
    fullText: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    media?: string; // Base64 encoded image
}

export interface Sale {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    totalAmount: number;
    date: string;
}

export interface SalesScript {
    id: string;
    productId: string;
    productName: string;
    script: string;
}


// FIX: Add missing type definitions for ProductivityTracker
export interface ProductivityItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ProductivityData {
  dailyChecklist: ProductivityItem[];
  habits: ProductivityItem[];
  weeklyGoals: ProductivityItem[];
  monthlyGoals: ProductivityItem[];
  activeProjects: ProductivityItem[];
}

// FIX: Add missing type definitions for ContentTracker
export interface ContentIdea {
  id: string;
  text: string;
  type: 'quick' | 'video' | 'insight';
  status: 'idea';
}

export interface ContentData {
  contentIdeas: ContentIdea[];
}

// FIX: Add missing type definitions for ProjectTracker
export interface Project {
  id: string;
  name: string;
  assignedEarnings: number;
  status: 'Em Andamento' | 'Concluído' | 'Pausado';
}

export interface TimeLog {
  id: string;
  projectId: string;
  hours: number;
  date: string;
}
