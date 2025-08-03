export interface Viagem {
  id: string;
  titulo: string;
  destino: string;
  dataInicio: Date;
  dataFim: Date;
  orcamento: number;
  descricao?: string;
  status: 'planejada' | 'em-andamento' | 'concluida' | 'cancelada';
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
}