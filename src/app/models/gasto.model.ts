export interface Gasto {
  id: string;
  viagemId: string;
  diaViagemId?: string; // Opcional, para gastos associados a um dia específico
  titulo: string;
  descricao?: string;
  valor: number;
  categoria: CategoriaGasto;
  subcategoria?: string;
  data: Date;
  formaPagamento: FormaPagamento;
  moeda: string;
  valorOriginal?: number; // Para conversões de moeda
  moedaOriginal?: string;
  taxaCambio?: number;
  comprovante?: string; // URL do comprovante/foto
  localGasto?: string;
  observacoes?: string;
  tags?: string[];
  status: StatusGasto;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface NovoGasto {
  viagemId: string;
  diaViagemId?: string;
  titulo: string;
  descricao?: string;
  valor: number;
  categoria: CategoriaGasto;
  subcategoria?: string;
  data: Date;
  formaPagamento: FormaPagamento;
  moeda: string;
  valorOriginal?: number;
  moedaOriginal?: string;
  taxaCambio?: number;
  comprovante?: string;
  localGasto?: string;
  observacoes?: string;
  tags?: string[];
  status?: StatusGasto;
}

export type CategoriaGasto =
  | 'Transporte'
  | 'Hospedagem'
  | 'Alimentação'
  | 'Entretenimento'
  | 'Compras'
  | 'Saúde'
  | 'Documentação'
  | 'Seguro'
  | 'Comunicação'
  | 'Emergência'
  | 'Outros';

export type FormaPagamento =
  | 'Dinheiro'
  | 'Cartão de Crédito'
  | 'Cartão de Débito'
  | 'PIX'
  | 'Transferência'
  | 'Cheque'
  | 'Vale Refeição'
  | 'Vale Alimentação'
  | 'Outros';

export const CATEGORIAS_GASTO: { value: CategoriaGasto; label: string; icon: string; subcategorias: string[] }[] = [
  {
    value: 'Transporte',
    label: 'Transporte',
    icon: 'directions_car',
    subcategorias: ['Avião', 'Trem', 'Ônibus', 'Táxi', 'Uber', 'Aluguel de Carro', 'Combustível', 'Pedágio', 'Estacionamento']
  },
  {
    value: 'Hospedagem',
    label: 'Hospedagem',
    icon: 'hotel',
    subcategorias: ['Hotel', 'Pousada', 'Hostel', 'Airbnb', 'Resort', 'Camping', 'Casa de Amigos']
  },
  {
    value: 'Alimentação',
    label: 'Alimentação',
    icon: 'restaurant',
    subcategorias: ['Café da Manhã', 'Almoço', 'Jantar', 'Lanche', 'Bebidas', 'Mercado', 'Delivery', 'Fast Food']
  },
  {
    value: 'Entretenimento',
    label: 'Entretenimento',
    icon: 'local_activity',
    subcategorias: ['Ingressos', 'Tours', 'Shows', 'Cinema', 'Museus', 'Parques', 'Esportes', 'Vida Noturna']
  },
  {
    value: 'Compras',
    label: 'Compras',
    icon: 'shopping_bag',
    subcategorias: ['Souvenirs', 'Roupas', 'Eletrônicos', 'Artesanato', 'Livros', 'Cosméticos', 'Presentes']
  },
  {
    value: 'Saúde',
    label: 'Saúde',
    icon: 'local_hospital',
    subcategorias: ['Medicamentos', 'Consulta Médica', 'Emergência', 'Farmácia', 'Exames']
  },
  {
    value: 'Documentação',
    label: 'Documentação',
    icon: 'description',
    subcategorias: ['Visto', 'Passaporte', 'Carteira de Motorista', 'Certificados', 'Traduções']
  },
  {
    value: 'Seguro',
    label: 'Seguro',
    icon: 'security',
    subcategorias: ['Seguro Viagem', 'Seguro Saúde', 'Seguro Bagagem', 'Seguro Veículo']
  },
  {
    value: 'Comunicação',
    label: 'Comunicação',
    icon: 'phone',
    subcategorias: ['Internet', 'Chip Internacional', 'Roaming', 'WiFi']
  },
  {
    value: 'Emergência',
    label: 'Emergência',
    icon: 'warning',
    subcategorias: ['Médica', 'Perda de Documentos', 'Cancelamentos', 'Imprevistos']
  },
  {
    value: 'Outros',
    label: 'Outros',
    icon: 'more_horiz',
    subcategorias: ['Diversos', 'Taxas', 'Gorjetas', 'Lavanderia']
  }
];

export type StatusGasto =
  | 'Confirmado'
  | 'Pendente'
  | 'Cancelado'
  | 'Reembolsado';

export const STATUS_GASTO: { value: StatusGasto; label: string; color: string }[] = [
  { value: 'Confirmado', label: 'Confirmado', color: 'success' },
  { value: 'Pendente', label: 'Pendente', color: 'warning' },
  { value: 'Cancelado', label: 'Cancelado', color: 'danger' },
  { value: 'Reembolsado', label: 'Reembolsado', color: 'info' }
];

export const MOEDAS_COMUNS = [
  { codigo: 'BRL', nome: 'Real Brasileiro', simbolo: 'R$' },
  { codigo: 'USD', nome: 'Dólar Americano', simbolo: '$' },
  { codigo: 'EUR', nome: 'Euro', simbolo: '€' },
  { codigo: 'GBP', nome: 'Libra Esterlina', simbolo: '£' },
  { codigo: 'JPY', nome: 'Iene Japonês', simbolo: '¥' },
  { codigo: 'ARS', nome: 'Peso Argentino', simbolo: '$' },
  { codigo: 'CLP', nome: 'Peso Chileno', simbolo: '$' },
  { codigo: 'UYU', nome: 'Peso Uruguaio', simbolo: '$' },
  { codigo: 'CAD', nome: 'Dólar Canadense', simbolo: 'C$' },
  { codigo: 'AUD', nome: 'Dólar Australiano', simbolo: 'A$' }
];

// Interfaces para relatórios e análises
export interface ResumoGastos {
  totalGasto: number;
  totalPorCategoria: { [categoria: string]: number };
  totalPorFormaPagamento: { [forma: string]: number };
  totalPorMoeda: { [moeda: string]: number };
  gastoMedio: number;
  maiorGasto: Gasto | null;
  menorGasto: Gasto | null;
  gastosRecentes: Gasto[];
  categoriaComMaiorGasto: string;
  percentualDoOrcamento: number;
}

export interface GastoPorPeriodo {
  periodo: string;
  valor: number;
  quantidade: number;
}

export interface ComparacaoOrcamento {
  orcamentoTotal: number;
  gastoAtual: number;
  percentualGasto: number;
  saldoRestante: number;
  projecaoGasto?: number;
  statusOrcamento: 'dentro' | 'atencao' | 'excedido';
}
