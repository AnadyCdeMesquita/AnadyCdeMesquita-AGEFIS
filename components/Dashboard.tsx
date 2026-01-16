
import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Users, 
  TrendingUp,
  Activity
} from 'lucide-react';
import { Demanda, AutuacaoStatus } from '../types';

interface DashboardProps {
  demandas: Demanda[];
}

const Dashboard: React.FC<DashboardProps> = ({ demandas }) => {
  const stats = useMemo(() => {
    const total = demandas.length;
    const autuados = demandas.filter(d => d.statusAutuacao === AutuacaoStatus.AUTUADO).length;
    const naoAutuados = total - autuados;
    
    // Group by Fiscal Responsável
    const fiscais: Record<string, number> = {};
    demandas.forEach(d => {
      fiscais[d.fiscalResponsavel] = (fiscais[d.fiscalResponsavel] || 0) + 1;
    });

    const topFiscais = Object.entries(fiscais)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const pieData = [
      { name: 'Autuados', value: autuados, color: '#f59e0b' },
      { name: 'Não Autuados', value: naoAutuados, color: '#10b981' }
    ];

    return { total, autuados, naoAutuados, topFiscais, pieData };
  }, [demandas]);

  if (demandas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Activity size={48} className="mb-4 opacity-20" />
        <h3 className="text-xl font-bold text-slate-700">Painel Vazio</h3>
        <p>Registre algumas demandas para visualizar os dados estatísticos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Activity className="text-blue-500" />} 
          label="Total de Demandas" 
          value={stats.total.toString()} 
          color="blue"
        />
        <StatCard 
          icon={<ShieldCheck className="text-emerald-500" />} 
          label="Não Autuados" 
          value={stats.naoAutuados.toString()} 
          color="emerald"
        />
        <StatCard 
          icon={<AlertTriangle className="text-amber-500" />} 
          label="Autuados" 
          value={stats.autuados.toString()} 
          color="amber"
        />
        <StatCard 
          icon={<Users className="text-indigo-500" />} 
          label="Fiscais Ativos" 
          value={stats.topFiscais.length.toString()} 
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart: Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" />
            Distribuição de Status
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {stats.pieData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-semibold text-slate-600">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart: Top Fiscais */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Users size={20} className="text-blue-500" />
            Atividade por Fiscal
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topFiscais} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }}
                  width={120}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                  {stats.topFiscais.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'blue' | 'emerald' | 'amber' | 'indigo';
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => {
  const colors = {
    blue: 'border-blue-100 bg-blue-50/30',
    emerald: 'border-emerald-100 bg-emerald-50/30',
    amber: 'border-amber-100 bg-amber-50/30',
    indigo: 'border-indigo-100 bg-indigo-50/30'
  };

  return (
    <div className={`p-6 rounded-2xl border ${colors[color]} transition-transform hover:scale-[1.02]`}>
      <div className="flex items-center gap-4">
        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
          {icon}
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-black text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
