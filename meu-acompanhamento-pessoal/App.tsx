
import React, { useState, useEffect, useCallback } from 'react';
import { FinanceTracker } from './components/FinanceTracker';
import { BettingTracker } from './components/BettingTracker';
import { DebtTracker } from './components/DebtTracker';
import { GameAnalysisTracker } from './components/GameAnalysisTracker';
import { IdeasTracker } from './components/IdeasTracker';
import { Home } from './components/Home';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AgendaTracker } from './components/AgendaTracker';
import { SalesTracker } from './components/SalesTracker';
import {
  type Transaction,
  type Bet,
  type Debt,
  type GameAnalysis,
  type Idea,
  type CalendarEvent,
  type Product,
  type Sale,
  type SalesScript,
  View,
} from './types';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.HOME);

  // States for each section
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [gameAnalyses, setGameAnalyses] = useState<GameAnalysis[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [salesScripts, setSalesScripts] = useState<SalesScript[]>([]);


  // Load data from localStorage on initial render
  useEffect(() => {
    const loadData = () => {
      try {
        setTransactions(JSON.parse(localStorage.getItem('transactions') || '[]'));
        setBets(JSON.parse(localStorage.getItem('bets') || '[]'));
        setDebts(JSON.parse(localStorage.getItem('debts') || '[]'));
        setGameAnalyses(JSON.parse(localStorage.getItem('gameAnalyses') || '[]'));
        setIdeas(JSON.parse(localStorage.getItem('ideas') || '[]'));
        setEvents(JSON.parse(localStorage.getItem('events') || '[]'));
        setProducts(JSON.parse(localStorage.getItem('products') || '[]'));
        setSales(JSON.parse(localStorage.getItem('sales') || '[]'));
        setSalesScripts(JSON.parse(localStorage.getItem('salesScripts') || '[]'));
      } catch (error) {
        console.error("Failed to load data from localStorage", error);
      }
    };
    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => { localStorage.setItem('transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('bets', JSON.stringify(bets)); }, [bets]);
  useEffect(() => { localStorage.setItem('debts', JSON.stringify(debts)); }, [debts]);
  useEffect(() => { localStorage.setItem('gameAnalyses', JSON.stringify(gameAnalyses)); }, [gameAnalyses]);
  useEffect(() => { localStorage.setItem('ideas', JSON.stringify(ideas)); }, [ideas]);
  useEffect(() => { localStorage.setItem('events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('sales', JSON.stringify(sales)); }, [sales]);
  useEffect(() => { localStorage.setItem('salesScripts', JSON.stringify(salesScripts)); }, [salesScripts]);


  // Handler functions
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => setTransactions(prev => [{ ...transaction, id: Date.now().toString() }, ...prev]);
  const deleteTransaction = (id: string) => setTransactions(prev => prev.filter(t => t.id !== id));

  const addBet = (bet: Omit<Bet, 'id'>) => setBets(prev => [{ ...bet, id: Date.now().toString() }, ...prev]);
  const deleteBet = (id: string) => setBets(prev => prev.filter(b => b.id !== id));
  const updateBet = (updatedBet: Bet) => setBets(prev => prev.map(b => b.id === updatedBet.id ? updatedBet : b));
  const updateMultipleBets = (updatedBets: Bet[]) => {
    setBets(prev => {
        const updatedMap = new Map(updatedBets.map(b => [b.id, b]));
        return prev.map(b => updatedMap.get(b.id) || b);
    });
  };

  const addDebt = (debt: Omit<Debt, 'id' | 'status'>) => setDebts(prev => [{ ...debt, id: Date.now().toString(), status: 'active' }, ...prev]);
  const updateDebt = (updatedDebt: Debt) => setDebts(prev => prev.map(d => d.id === updatedDebt.id ? updatedDebt : d));
  const deleteDebt = (id: string) => setDebts(prev => prev.filter(d => d.id !== id));

  const addAnalysis = (analysis: Omit<GameAnalysis, 'id'>) => setGameAnalyses(prev => [{ ...analysis, id: Date.now().toString() }, ...prev]);
  const addMultipleAnalyses = (analyses: Omit<GameAnalysis, 'id'>[]) => {
    const newAnalyses = analyses.map(a => ({ ...a, id: Date.now().toString() + Math.random() }));
    setGameAnalyses(prev => [...newAnalyses, ...prev]);
  };
  const deleteAnalysis = (id: string) => setGameAnalyses(prev => prev.filter(a => a.id !== id));
  const deleteAllAnalyses = () => setGameAnalyses([]);
  
  const addIdea = (idea: Omit<Idea, 'id' | 'date'>) => setIdeas(prev => [{ ...idea, id: Date.now().toString(), date: new Date().toISOString() }, ...prev]);
  const deleteIdea = (id: string) => setIdeas(prev => prev.filter(i => i.id !== id));

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => setEvents(prev => [{ ...event, id: Date.now().toString() }, ...prev]);
  const deleteEvent = (id: string) => setEvents(prev => prev.filter(e => e.id !== id));

  const addProduct = (product: Omit<Product, 'id'>) => setProducts(prev => [{ ...product, id: Date.now().toString() }, ...prev]);
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  
  const addSale = (sale: Omit<Sale, 'id'>) => setSales(prev => [{ ...sale, id: Date.now().toString() }, ...prev]);
  const deleteSale = (id: string) => setSales(prev => prev.filter(s => s.id !== id));

  const addSalesScript = (script: Omit<SalesScript, 'id'>) => setSalesScripts(prev => [{ ...script, id: Date.now().toString() }, ...prev]);
  const deleteSalesScript = (id: string) => setSalesScripts(prev => prev.filter(s => s.id !== id));

  const renderView = useCallback(() => {
    switch (view) {
      case View.HOME:
        return <Home transactions={transactions} bets={bets} debts={debts} ideas={ideas} />;
      case View.FINANCES:
        return <FinanceTracker transactions={transactions} addTransaction={addTransaction} deleteTransaction={deleteTransaction} />;
      case View.BETS:
        return <BettingTracker bets={bets} addBet={addBet} updateBet={updateBet} updateMultipleBets={updateMultipleBets} deleteBet={deleteBet} />;
      case View.DEBTS:
        return <DebtTracker debts={debts} addDebt={addDebt} updateDebt={updateDebt} deleteDebt={deleteDebt} />;
      case View.ANALYSES:
        return <GameAnalysisTracker analyses={gameAnalyses} addAnalyses={addMultipleAnalyses} deleteAnalysis={deleteAnalysis} deleteAllAnalyses={deleteAllAnalyses} />;
      case View.IDEAS:
        return <IdeasTracker ideas={ideas} addIdea={addIdea} deleteIdea={deleteIdea} />;
      case View.AGENDA:
        return <AgendaTracker events={events} addEvent={addEvent} deleteEvent={deleteEvent} />;
      case View.SALES:
        return <SalesTracker
                  products={products}
                  sales={sales}
                  scripts={salesScripts}
                  addProduct={addProduct}
                  deleteProduct={deleteProduct}
                  addSale={addSale}
                  deleteSale={deleteSale}
                  addSalesScript={addSalesScript}
                  deleteSalesScript={deleteSalesScript}
                />;
      default:
        return <Home transactions={transactions} bets={bets} debts={debts} ideas={ideas} />;
    }
  }, [view, transactions, bets, debts, gameAnalyses, ideas, events, products, sales, salesScripts]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar currentView={view} setView={setView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
