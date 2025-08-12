# 💰 Sistema de Gerenciamento de Gastos de Viagem

## 📋 Visão Geral

Este projeto implementa um sistema completo de gerenciamento de gastos para viagens, desenvolvido em Angular com TypeScript. O sistema permite aos usuários registrar, editar, filtrar e analisar todos os gastos relacionados às suas viagens de forma intuitiva e eficiente.

## ✨ Funcionalidades Implementadas

### 🔧 Funcionalidades Principais
- ✅ **CRUD Completo de Gastos**: Criar, visualizar, editar e excluir gastos
- ✅ **Categorização Inteligente**: 11 categorias pré-definidas (Transporte, Hospedagem, Alimentação, etc.)
- ✅ **Sistema de Status**: Confirmado, Pendente, Cancelado, Reembolsado
- ✅ **Múltiplas Moedas**: Suporte a BRL, USD, EUR e outras moedas comuns
- ✅ **Formas de Pagamento**: Cartão de crédito/débito, PIX, dinheiro, etc.

### 🔍 Filtros e Busca
- ✅ **Busca Textual**: Por título, descrição, categoria ou local
- ✅ **Filtros por Categoria**: Filtragem por tipo de gasto
- ✅ **Filtros por Status**: Visualizar apenas gastos confirmados, pendentes, etc.
- ✅ **Ordenação**: Por data, valor ou categoria

### 📊 Relatórios e Análises
- ✅ **Resumo Financeiro**: Total gasto, quantidade de gastos, gasto médio
- ✅ **Análise por Categoria**: Identificação da categoria com maior gasto
- ✅ **Exportação CSV**: Download dos dados para análise externa
- ✅ **Dashboard Visual**: Cards informativos com métricas importantes

### 🎨 Interface do Usuário
- ✅ **Design Responsivo**: Funciona em desktop, tablet e mobile
- ✅ **Interface Intuitiva**: Formulários simples e navegação clara
- ✅ **Modal de Edição**: Formulário popup para adicionar/editar gastos
- ✅ **Feedback Visual**: Indicadores de status e ações do usuário

## 🏗️ Arquitetura do Sistema

### 📁 Estrutura de Arquivos
```
src/app/
├── components/
│   └── gastos-demo/              # Componente principal de demonstração
│       ├── gastos-demo.component.ts
│       ├── gastos-demo.component.html
│       └── gastos-demo.component.scss
├── models/
│   ├── gasto.model.ts            # Modelos de dados para gastos
│   └── dia-viagem.model.ts       # Modelos auxiliares
├── services/
│   └── gasto.service.ts          # Serviço de gerenciamento de gastos
└── app.component.ts              # Componente raiz da aplicação
```

### 🔧 Componentes Principais

#### 1. **GastosDemoComponent**
- Componente principal que demonstra todas as funcionalidades
- Interface completa para gerenciamento de gastos
- Integração com o serviço de gastos
- Formulários reativos para entrada de dados

#### 2. **GastoService**
- Serviço responsável por todas as operações CRUD
- Gerenciamento de estado com BehaviorSubject
- Métodos para filtros, busca e relatórios
- Exportação de dados em formato CSV

#### 3. **Modelos de Dados**
- **Gasto**: Interface principal para representar um gasto
- **NovoGasto**: Interface para criação de novos gastos
- **ResumoGastos**: Interface para dados de relatórios
- Enums para categorias, status e formas de pagamento

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- Angular CLI
- npm ou yarn

### Instalação e Execução
```bash
# 1. Instalar dependências
npm install

# 2. Executar em modo de desenvolvimento
ng serve

# 3. Acessar no browser
http://localhost:4200
```

### Build para Produção
```bash
# Gerar build otimizado
ng build --configuration production
```

## 📊 Funcionalidades em Detalhes

### 💳 Gestão de Gastos
- **Adicionar Gasto**: Formulário completo com validações
- **Editar Gasto**: Modificação de gastos existentes
- **Excluir Gasto**: Remoção com confirmação
- **Duplicar Gasto**: Criação rápida baseada em gasto existente

### 🏷️ Categorias Disponíveis
1. **Transporte** - Avião, carro, ônibus, táxi, etc.
2. **Hospedagem** - Hotel, pousada, Airbnb, etc.
3. **Alimentação** - Restaurantes, mercado, delivery, etc.
4. **Entretenimento** - Ingressos, tours, shows, etc.
5. **Compras** - Souvenirs, roupas, presentes, etc.
6. **Saúde** - Medicamentos, consultas, emergências
7. **Documentação** - Visto, passaporte, traduções
8. **Seguro** - Seguro viagem, saúde, bagagem
9. **Comunicação** - Internet, chip, roaming
10. **Emergência** - Imprevistos e situações urgentes
11. **Outros** - Gastos diversos não categorizados

### 💰 Status de Gastos
- **Confirmado** - Gasto realizado e confirmado
- **Pendente** - Gasto planejado ou aguardando confirmação
- **Cancelado** - Gasto cancelado ou não realizado
- **Reembolsado** - Gasto reembolsado

### 💳 Formas de Pagamento
- Cartão de Crédito
- Cartão de Débito
- Dinheiro
- PIX
- Transferência Bancária
- Boleto
- Cheque
- Outros

## 📈 Relatórios e Análises

### Dashboard Principal
- **Total de Gastos**: Quantidade total de registros
- **Valor Total**: Soma de todos os gastos confirmados
- **Gasto Médio**: Valor médio por gasto
- **Categoria Principal**: Categoria com maior valor gasto

### Exportação de Dados
- **Formato CSV**: Dados estruturados para análise
- **Campos Exportados**: Data, título, categoria, valor, forma de pagamento, status, local
- **Compatibilidade**: Excel, Google Sheets, outras ferramentas

## 🎨 Design e UX

### Características do Design
- **Cores Modernas**: Gradientes e paleta harmoniosa
- **Tipografia Clara**: Fontes system para melhor legibilidade
- **Espaçamento Consistente**: Layout organizado e respirável
- **Feedback Visual**: Estados hover, loading e confirmações

### Responsividade
- **Desktop**: Layout em grid com múltiplas colunas
- **Tablet**: Adaptação para telas médias
- **Mobile**: Interface otimizada para touch

## 🔧 Tecnologias Utilizadas

### Frontend
- **Angular 17+**: Framework principal
- **TypeScript**: Linguagem de programação
- **RxJS**: Programação reativa
- **SCSS**: Pré-processador CSS

### Funcionalidades Angular
- **Standalone Components**: Arquitetura moderna
- **Reactive Forms**: Formulários reativos
- **Services**: Injeção de dependências
- **Observables**: Gerenciamento de estado

## 📝 Exemplos de Uso

### Adicionando um Gasto
```typescript
const novoGasto: NovoGasto = {
  viagemId: 'viagem-1',
  titulo: 'Almoço no restaurante',
  valor: 45.50,
  categoria: 'Alimentação',
  data: new Date(),
  formaPagamento: 'Cartão de Crédito',
  moeda: 'BRL',
  status: 'Confirmado'
};
```

### Filtrando Gastos
```typescript
// Filtrar por categoria
this.filtroCategoria = 'Alimentação';

// Filtrar por status
this.filtroStatus = 'Confirmado';

// Buscar por texto
this.termoBusca = 'restaurante';
```

## 🚧 Melhorias Futuras

### Funcionalidades Planejadas
- [ ] **Integração com APIs de Câmbio**: Conversão automática de moedas
- [ ] **Gráficos Avançados**: Charts interativos com Chart.js
- [ ] **Notificações**: Alertas para gastos acima do orçamento
- [ ] **Backup na Nuvem**: Sincronização com serviços cloud
- [ ] **Relatórios PDF**: Geração de relatórios em PDF
- [ ] **Comparação de Viagens**: Análise comparativa entre viagens

### Melhorias Técnicas
- [ ] **Testes Unitários**: Cobertura completa com Jest
- [ ] **Testes E2E**: Testes de integração com Cypress
- [ ] **PWA**: Aplicativo web progressivo
- [ ] **Offline Support**: Funcionamento sem internet

## 📞 Suporte e Contribuição

### Como Contribuir
1. Fork do repositório
2. Criar branch para feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit das mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para branch (`git push origin feature/nova-funcionalidade`)
5. Abrir Pull Request

### Reportar Problemas
- Usar as Issues do GitHub
- Incluir descrição detalhada
- Adicionar steps para reproduzir
- Incluir screenshots se aplicável

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**Desenvolvido com ❤️ usando Angular + TypeScript**

*Sistema completo de gerenciamento de gastos de viagem - Simples, eficiente e intuitivo!*
