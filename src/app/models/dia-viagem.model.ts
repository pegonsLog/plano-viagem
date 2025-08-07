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
  linkHospedagem?: string;
  deslocamentoLocal?: string;
  detalhesVoo?: string;
  observacoes?: string;
  formaPagamento?: string;
  formaPagamentoTransporte?: string;
  titularCartao?: string;
  finalCartao?: string;
  quantidadeParcelas?: number;
  valorHospedagem?: number;
  valorParcela?: number;
  custoTransporte?: number;
  status?: string;
  motivoPendencia?: string;
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
  linkHospedagem?: string;
  deslocamentoLocal?: string;
  detalhesVoo?: string;
  observacoes?: string;
  formaPagamento?: string;
  formaPagamentoTransporte?: string;
  titularCartao?: string;
  finalCartao?: string;
  quantidadeParcelas?: number;
  valorHospedagem?: number;
  valorParcela?: number;
  custoTransporte?: number;
  status?: string;
  motivoPendencia?: string;
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

export type FormaPagamento =
  | 'Cartão de Crédito'
  | 'Cartão de Débito'
  | 'Dinheiro'
  | 'PIX'
  | 'Transferência Bancária'
  | 'Boleto'
  | 'Cheque'
  | 'Outro';

export const FORMAS_PAGAMENTO: { value: FormaPagamento; label: string }[] = [
  { value: 'Cartão de Crédito', label: 'Cartão de Crédito' },
  { value: 'Cartão de Débito', label: 'Cartão de Débito' },
  { value: 'Dinheiro', label: 'Dinheiro' },
  { value: 'PIX', label: 'PIX' },
  { value: 'Transferência Bancária', label: 'Transferência Bancária' },
  { value: 'Boleto', label: 'Boleto' },
  { value: 'Cheque', label: 'Cheque' },
  { value: 'Outro', label: 'Outro' }
];

export type StatusDia =
  | 'Pendente'
  | 'Concluído';

export const STATUS_DIA: { value: StatusDia; label: string }[] = [
  { value: 'Pendente', label: 'Pendente' },
  { value: 'Concluído', label: 'Concluído' }
];

export type MotivoPendencia =
  | 'Aguardando Confirmação'
  | 'Aguardando Pagamento'
  | 'Aguardando Documentação'
  | 'Problema com Reserva'
  | 'Cancelamento Pendente'
  | 'Reagendamento Necessário'
  | 'Falta de Disponibilidade'
  | 'Outro';

export const MOTIVOS_PENDENCIA: { value: MotivoPendencia; label: string }[] = [
  { value: 'Aguardando Confirmação', label: 'Aguardando Confirmação' },
  { value: 'Aguardando Pagamento', label: 'Aguardando Pagamento' },
  { value: 'Aguardando Documentação', label: 'Aguardando Documentação' },
  { value: 'Problema com Reserva', label: 'Problema com Reserva' },
  { value: 'Cancelamento Pendente', label: 'Cancelamento Pendente' },
  { value: 'Reagendamento Necessário', label: 'Reagendamento Necessário' },
  { value: 'Falta de Disponibilidade', label: 'Falta de Disponibilidade' },
  { value: 'Outro', label: 'Outro' }
];