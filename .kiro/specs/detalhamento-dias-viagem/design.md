# Design Document

## Overview

O sistema de detalhamento de dias da viagem será implementado como uma extensão do app existente, adicionando uma nova camada de detalhamento que permite aos usuários criar itinerários completos. A arquitetura seguirá os padrões já estabelecidos no projeto, utilizando Angular Signals para gerenciamento de estado e componentes standalone para modularidade.

## Architecture

### Navegação e Roteamento
- Implementação de roteamento Angular para navegação entre lista de viagens e detalhes
- Rota parametrizada para detalhes da viagem: `/viagem/:id`
- Navegação mobile-first com botões de voltar e breadcrumbs

### Estrutura de Componentes
```
DetalhesViagemComponent (container)
├── HeaderViagemComponent (informações da viagem)
├── ListaDiasComponent (lista de dias)
│   └── DiaViagemComponent (card de cada dia)
│       ├── DetalhesDiaComponent (visualização)
│       └── FormularioDiaComponent (edição/criação)
└── NavigationComponent (navegação mobile)
```

### Gerenciamento de Estado
- Extensão do ViagemService para incluir operações de dias
- Novo DiaViagemService para operações específicas de dias
- Uso de Angular Signals para reatividade
- Estado local para formulários e UI

## Components and Interfaces

### 1. Modelo de Dados - DiaViagem

```typescript
interface DiaViagem {
  id: string;
  viagemId: string;
  data: Date;
  diaSemana: string;
  transporte?: string;
  cidade: string;
  nomeHospedagem?: string;
  enderecoHospedagem?: string;
  deslocamentoLocal?: string;
  observacoes?: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

interface NovoDiaViagem {
  viagemId: string;
  data: Date;
  transporte?: string;
  cidade: string;
  nomeHospedagem?: string;
  enderecoHospedagem?: string;
  deslocamentoLocal?: string;
  observacoes?: string;
}
```

### 2. DetalhesViagemComponent
**Responsabilidade:** Container principal para visualização e gerenciamento dos dias da viagem
**Props:** 
- `viagemId: string` (via route params)
**Estado:**
- `viagem: Signal<Viagem | null>`
- `dias: Signal<DiaViagem[]>`
- `diasCalculados: Signal<Date[]>` (todos os dias entre início e fim)

### 3. ListaDiasComponent
**Responsabilidade:** Renderização da lista de dias com scroll otimizado
**Props:**
- `dias: DiaViagem[]`
- `diasCalculados: Date[]`
- `viagemId: string`
**Eventos:**
- `adicionarDia: EventEmitter<Date>`
- `editarDia: EventEmitter<DiaViagem>`
- `removerDia: EventEmitter<string>`

### 4. DiaViagemComponent
**Responsabilidade:** Card individual de cada dia com estados vazio/preenchido
**Props:**
- `data: Date`
- `diaDetalhes?: DiaViagem`
- `viagemId: string`
**Estados:**
- `modoEdicao: boolean`
- `expandido: boolean`

### 5. FormularioDiaComponent
**Responsabilidade:** Formulário para criação/edição de detalhes do dia
**Props:**
- `diaViagem?: DiaViagem` (para edição)
- `data: Date`
- `viagemId: string`
**Eventos:**
- `salvar: EventEmitter<NovoDiaViagem | DiaViagem>`
- `cancelar: EventEmitter<void>`

### 6. DiaViagemService
**Responsabilidade:** Gerenciamento de operações CRUD para dias da viagem
**Métodos:**
- `obterDiasPorViagem(viagemId: string): Signal<DiaViagem[]>`
- `adicionarDia(novoDia: NovoDiaViagem): void`
- `atualizarDia(id: string, dados: Partial<DiaViagem>): void`
- `removerDia(id: string): void`
- `calcularDiasSemana(dataInicio: Date, dataFim: Date): Date[]`

## Data Models

### Extensão do Modelo Viagem
```typescript
// Adicionar ao modelo existente
interface Viagem {
  // ... campos existentes
  totalDias?: number; // calculado automaticamente
  diasDetalhados?: number; // quantos dias têm detalhes
}
```

### Estrutura de Dados dos Dias
```typescript
// Estrutura para armazenamento local
interface DadosViagem {
  viagem: Viagem;
  dias: DiaViagem[];
}

// Estrutura para cálculos de datas
interface DiaCalculado {
  data: Date;
  diaSemana: string;
  temDetalhes: boolean;
  detalhes?: DiaViagem;
}
```

## Error Handling

### Validação de Formulários
- Validação de campos obrigatórios (data, cidade)
- Validação de formato de data
- Validação de conflitos de data (não pode ser fora do período da viagem)
- Feedback visual imediato para erros

### Tratamento de Erros de Estado
- Fallback para viagem não encontrada
- Tratamento de dias duplicados
- Recuperação de estado em caso de erro de navegação
- Mensagens de erro user-friendly

### Validações de Negócio
```typescript
class ValidadorDiaViagem {
  static validarData(data: Date, viagem: Viagem): ValidationResult
  static validarCamposObrigatorios(dia: NovoDiaViagem): ValidationResult
  static validarDuplicacao(data: Date, dias: DiaViagem[]): ValidationResult
}
```

## Testing Strategy

### Testes Unitários
- **DiaViagemService**: Testes de CRUD operations, cálculos de data
- **FormularioDiaComponent**: Validação, submissão, cancelamento
- **DetalhesViagemComponent**: Carregamento de dados, navegação
- **Utilitários**: Funções de cálculo de data e formatação

### Testes de Integração
- Fluxo completo: adicionar → editar → remover dia
- Navegação entre componentes
- Persistência de dados
- Responsividade mobile

### Testes E2E
- Cenário completo de planejamento de viagem
- Teste de usabilidade mobile
- Performance com muitos dias
- Navegação e estado da aplicação

## Mobile-First Design Considerations

### Layout Responsivo
- Cards de dia otimizados para toque
- Formulários com inputs mobile-friendly
- Navegação por gestos (swipe entre dias)
- Botões com área de toque adequada (min 44px)

### Performance Mobile
- Lazy loading de dias para viagens longas
- Virtual scrolling para listas grandes
- Otimização de imagens e assets
- Minimização de re-renders

### UX Mobile
- Feedback tátil para ações
- Loading states para operações assíncronas
- Confirmações simplificadas
- Navegação intuitiva com breadcrumbs

### Acessibilidade Mobile
- Suporte a screen readers
- Contraste adequado para leitura ao sol
- Tamanhos de fonte escaláveis
- Navegação por teclado virtual

## Implementation Notes

### Roteamento
```typescript
const routes: Routes = [
  { path: '', component: ListaViagensComponent },
  { path: 'viagem/:id', component: DetalhesViagemComponent },
  { path: '**', redirectTo: '' }
];
```

### Cálculo de Dias
```typescript
function calcularDiasViagem(inicio: Date, fim: Date): Date[] {
  const dias: Date[] = [];
  const atual = new Date(inicio);
  
  while (atual <= fim) {
    dias.push(new Date(atual));
    atual.setDate(atual.getDate() + 1);
  }
  
  return dias;
}
```

### Otimização de Performance
- Uso de OnPush change detection
- TrackBy functions para listas
- Debounce em formulários
- Memoização de cálculos pesados