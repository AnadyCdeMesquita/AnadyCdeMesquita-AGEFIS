
import React, { useState } from 'react';
import { Calendar, Camera, User, CheckCircle2, Info } from 'lucide-react';
import { AutuacaoStatus, Demanda } from '../types';

interface RegistrationFormProps {
  onSave: (demanda: Omit<Demanda, 'id' | 'timestamp'>) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSave }) => {
  const [fiscal, setFiscal] = useState('');
  const [camera, setCamera] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<AutuacaoStatus>(AutuacaoStatus.NAO_AUTUADO);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fiscal || !camera) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    onSave({
      fiscalResponsavel: fiscal,
      cameraHorario: camera,
      dataRealizacao: data,
      statusAutuacao: status
    });

    // Reset and feedback
    setFiscal('');
    setCamera('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const toggleStatus = () => {
    setStatus(prev => prev === AutuacaoStatus.AUTUADO ? AutuacaoStatus.NAO_AUTUADO : AutuacaoStatus.AUTUADO);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-blue-600 p-6 text-white">
        <h2 className="text-xl font-bold">Registrar Nova Demanda</h2>
        <p className="text-blue-100 text-sm mt-1 opacity-90">Preencha as informações para registro oficial no sistema.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {showSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle2 size={20} />
            <span className="font-medium">Demanda registrada com sucesso!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fiscal Responsável */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <User size={16} className="text-blue-500" />
              Fiscal Responsável
            </label>
            <input
              type="text"
              value={fiscal}
              onChange={(e) => setFiscal(e.target.value)}
              placeholder="Nome do Fiscal"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-slate-50 hover:bg-white"
              required
            />
          </div>

          {/* Câmera e Horário */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Camera size={16} className="text-blue-500" />
              Câmera e Horário
            </label>
            <input
              type="text"
              value={camera}
              onChange={(e) => setCamera(e.target.value)}
              placeholder="Ex: Câmera 02 - 10:45"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-slate-50 hover:bg-white"
              required
            />
          </div>

          {/* Data de Realização */}
          <div className="space-y-2 relative">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Calendar size={16} className="text-blue-500" />
              Data de Realização
            </label>
            <div className="relative group">
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-slate-50 hover:bg-white appearance-none"
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Calendar size={18} />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
              <Info size={10} />
              Dica: Clique no ícone do calendário para alterar a data.
            </p>
          </div>
        </div>

        {/* Status de Autuação */}
        <div className="pt-4 border-t border-slate-100">
          <label className="text-sm font-semibold text-slate-700 block mb-3">Status de Autuação</label>
          <button
            type="button"
            onClick={toggleStatus}
            className={`
              w-full py-4 rounded-xl font-bold text-center border-2 transition-all flex items-center justify-center gap-3
              ${status === AutuacaoStatus.AUTUADO 
                ? 'bg-amber-50 border-amber-500 text-amber-700' 
                : 'bg-slate-50 border-slate-200 text-slate-600'}
            `}
          >
            {status === AutuacaoStatus.AUTUADO ? (
              <span className="flex items-center gap-2 uppercase tracking-wide">AUTUADO</span>
            ) : (
              <span className="flex items-center gap-2 uppercase tracking-wide">NÃO AUTUADO</span>
            )}
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={20} />
          Finalizar Registro
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
