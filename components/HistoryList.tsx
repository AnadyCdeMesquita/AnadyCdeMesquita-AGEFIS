
import React from 'react';
import { Trash2, AlertTriangle, ShieldCheck, User } from 'lucide-react';
import { Demanda, AutuacaoStatus } from '../types';

interface HistoryListProps {
  demandas: Demanda[];
  onDelete: (id: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ demandas, onDelete }) => {
  if (demandas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-3">
        <div className="bg-slate-50 p-4 rounded-full">
          <Trash2 size={32} className="opacity-20" />
        </div>
        <p className="text-sm font-medium">Nenhum registro encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {demandas.map((demanda) => (
        <div 
          key={demanda.id}
          className="p-4 rounded-xl border border-slate-100 hover:border-blue-100 hover:shadow-sm transition-all bg-white group"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-1.5 text-blue-600 mb-0.5">
                <User size={12} />
                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-tight">{demanda.fiscalResponsavel}</h4>
              </div>
              <p className="text-xs text-slate-500 font-medium">{demanda.cameraHorario}</p>
            </div>
            <button 
              onClick={() => onDelete(demanda.id)}
              className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {new Date(demanda.dataRealizacao).toLocaleDateString('pt-BR')}
            </span>
            <div className={`
              flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider
              ${demanda.statusAutuacao === AutuacaoStatus.AUTUADO 
                ? 'bg-amber-100 text-amber-700' 
                : 'bg-emerald-100 text-emerald-700'}
            `}>
              {demanda.statusAutuacao === AutuacaoStatus.AUTUADO ? <AlertTriangle size={10} /> : <ShieldCheck size={10} />}
              {demanda.statusAutuacao}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
