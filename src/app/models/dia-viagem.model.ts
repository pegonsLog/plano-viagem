export interface DiaViagem {
  id: string;
  viagemId: string;
  data: Date;
  diaSemana: string;
  transporte?: string;
  cidade: string;
  nomeHospedagem?: string;
  enderecoHospedagem?: string;
  deslocamentoLocal?: string;
  detalhesVoo?: string;
  observacoes?: string;
  formaPagamento?: string;
  titularCartao?: string;
  finalCartao?: string;
  quantidadeParcelas?: number;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface NovoDiaViagem {
  viagemId: string;
  data: Date;
  transporte?: string;
  cidade: string;
  nomeHospedagem?: string;
  enderecoHospedagem?: string;
  deslocamentoLocal?: string;
  detalhesVoo?: string;
  observacoes?: string;
  formaPagamento?: string;
  titularCartao?: string;
  finalCartao?: string;
  quantidadeParcelas?: number;
}

export interface DiaCalculado {
  data: Date;
  diaSemana: string;
  temDetalhes: boolean;
  detalhes?: DiaViagem;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export type TipoTransporte =
  | 'aviao'
  | 'carro'
  | 'onibus'
  | 'trem'
  | 'metro'
  | 'taxi'
  | 'uber'
  | 'a-pe'
  | 'bicicleta'
  | 'barco'
  | 'outro'
  | 'na';

export const TIPOS_TRANSPORTE: { value: TipoTransporte; label: string }[] = [
  { value: 'aviao', label: 'Avião' },
  { value: 'carro', label: 'Carro' },
  { value: 'onibus', label: 'Ônibus' },
  { value: 'trem', label: 'Trem' },
  { value: 'metro', label: 'Metrô' },
  { value: 'taxi', label: 'Táxi' },
  { value: 'uber', label: 'Uber/App' },
  { value: 'a-pe', label: 'A pé' },
  { value: 'bicicleta', label: 'Bicicleta' },
  { value: 'barco', label: 'Barco' },
  { value: 'outro', label: 'Outro' },
  { value: 'na', label: 'N/A' }
];

export const DIAS_SEMANA = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
  'Quinta-feira', 'Sexta-feira', 'Sábado'
];