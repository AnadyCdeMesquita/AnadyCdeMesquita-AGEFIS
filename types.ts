
export enum AutuacaoStatus {
  AUTUADO = 'AUTUADO',
  NAO_AUTUADO = 'NÃO AUTUADO'
}

export interface Demanda {
  id: string;
  fiscalResponsavel: string;
  cameraHorario: string;
  dataRealizacao: string;
  statusAutuacao: AutuacaoStatus;
  timestamp: number;
}

export type TabType = 'registrar' | 'painel';
