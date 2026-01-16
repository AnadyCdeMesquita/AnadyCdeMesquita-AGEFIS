
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  History, 
  Trash2, 
  AlertCircle,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { Demanda, TabType, AutuacaoStatus } from './types';
import RegistrationForm from './components/RegistrationForm';
import Dashboard from './components/Dashboard';
import HistoryList from './components/HistoryList';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('registrar');
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('demandas_app_data');
    if (saved) {
      try {
        setDemandas(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('demandas_app_data', JSON.stringify(demandas));
  }, [demandas]);

  const addDemanda = (newDemanda: Omit<Demanda, 'id' | 'timestamp'>) => {
    const demanda: Demanda = {
      ...newDemanda,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setDemandas([demanda, ...demandas]);
  };

  const clearHistory = () => {
    if (window.confirm("Deseja realmente limpar todo o histórico?")) {
      setDemandas([]);
    }
  };

  const deleteDemanda = (id: string) => {
    setDemandas(demandas.filter(d => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-blue-700 text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-50">
        <h1 className="text-xl font-bold tracking-tight">CONTROLE DE DEMANDA</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-0 z-40 bg-blue-900 text-white w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <div className="hidden md:block mb-10">
            <h1 className="text-2xl font-black tracking-tighter text-blue-100">CONTROLE DE DEMANDA</h1>
            <p className="text-blue-300 text-xs mt-1 uppercase font-semibold">Sistema de Gestão Fiscal</p>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => { setActiveTab('registrar'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'registrar' ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-200 hover:bg-blue-800'}`}
            >
              <ClipboardList size={20} />
              <span className="font-medium">Registrar Demanda</span>
            </button>
            <button
              onClick={() => { setActiveTab('painel'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'painel' ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-200 hover:bg-blue-800'}`}
            >
              <LayoutDashboard size={20} />
              <span className="font-medium">Painel de Controle</span>
            </button>
          </nav>

          <div className="absolute bottom-8 left-6 right-6">
             <button
              onClick={clearHistory}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors text-sm"
            >
              <Trash2 size={16} />
              Limpeza Geral
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'registrar' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7">
                <RegistrationForm onSave={addDemanda} />
              </div>
              <div className="lg:col-span-5">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <History size={20} className="text-blue-500" />
                      Histórico Recente
                    </h2>
                    <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
                      {demandas.length} registros
                    </span>
                  </div>
                  <div className="flex-1">
                    <HistoryList 
                      demandas={demandas.slice(0, 5)} 
                      onDelete={deleteDemanda}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'painel' && (
            <Dashboard demandas={demandas} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
