export interface DiaViagem {
  id: string;
  viagemId: string;
  data: Date;
  diaSemana: string;
  transporte?: string;
  cidade: string;
  nomeHospedagem?: string;
  enderecoHospedagem?: string;
  contatoHospedagem?: string;
  numeroReserva?: string;
  horarioChecks?: string;
  deslocamentoLocal?: string;
  detalhesVoo?: string;
  observacoes?: string;
  formaPagamento?: string;
  titularCartao?: string;
  finalCartao?: string;
  quantidadeParcelas?: number;
  valorHospedagem?: number;
  valorParcela?: number;
  custoTransporte?: number;
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
  contatoHospedagem?: string;
  numeroReserva?: string;
  horarioChecks?: string;
  deslocamentoLocal?: string;
  detalhesVoo?: string;
  observacoes?: string;
  formaPagamento?: string;
  titularCartao?: string;
  finalCartao?: string;
  quantidadeParcelas?: number;
  valorHospedagem?: number;
  valorParcela?: number;
  custoTransporte?: number;
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
  | 'Avião'
  | 'Carro'
  | 'Ônibus'
  | 'Trem'
  | 'Metrô'
  | 'Táxi'
  | 'Uber/App'
  | 'A pé'
  | 'Bicicleta'
  | 'Barco'
  | 'Outro'
  | 'N/A';

export const TIPOS_TRANSPORTE: { value: TipoTransporte; label: string }[] = [
  { value: 'Avião', label: 'Avião' },
  { value: 'Carro', label: 'Carro' },
  { value: 'Ônibus', label: 'Ônibus' },
  { value: 'Trem', label: 'Trem' },
  { value: 'Metrô', label: 'Metrô' },
  { value: 'Táxi', label: 'Táxi' },
  { value: 'Uber/App', label: 'Uber/App' },
  { value: 'A pé', label: 'A pé' },
  { value: 'Bicicleta', label: 'Bicicleta' },
  { value: 'Barco', label: 'Barco' },
  { value: 'Outro', label: 'Outro' },
  { value: 'N/A', label: 'N/A' }
];

export const DIAS_SEMANA = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
  'Quinta-feira', 'Sexta-feira', 'Sábado'
];