export interface Viagem {
  id: string;
  titulo: string;
  destino: string;
  dataInicio: Date;
  dataFim: Date;
  orcamento: number;
  descricao?: string;
  status: 'planejada' | 'em-andamento' | 'concluida' | 'cancelada';
  temPendencia?: boolean;
  motivoPendencia?: string;
  lembretesImportantes?: string;
  criadaEm: Date;
  atualizadaEm: Date;
  totalDias?: number;
  diasDetalhados?: number;
}

export interface NovaViagem {
  titulo: string;
  destino: string;
  dataInicio: Date;
  dataFim: Date;
  orcamento: number;
  descricao?: string;
  temPendencia?: boolean;
  motivoPendencia?: string;
  lembretesImportantes?: string;
}