# 📚 Exemplos Práticos - Sistema de Gerenciamento de Gastos

## 🎯 Casos de Uso Reais

### 1. **Viagem de Negócios - São Paulo**

#### Cenário
Executivo em viagem de 3 dias para São Paulo com orçamento de R$ 2.000,00

#### Gastos Registrados
```typescript
// Dia 1 - Chegada
{
  titulo: "Passagem aérea SP",
  valor: 450.00,
  categoria: "Transporte",
  formaPagamento: "Cartão de Crédito",
  status: "Confirmado",
  localGasto: "Aeroporto Congonhas"
}

{
  titulo: "Hotel Paulista - 2 diárias",
  valor: 380.00,
  categoria: "Hospedagem", 
  formaPagamento: "Cartão de Crédito",
  status: "Confirmado",
  localGasto: "Av. Paulista"
}

{
  titulo: "Jantar executivo",
  valor: 120.00,
  categoria: "Alimentação",
  formaPagamento: "Cartão Corporativo",
  status: "Confirmado",
  localGasto: "Restaurante Fasano"
}

// Dia 2 - Reuniões
{
  titulo: "Almoço com cliente",
  valor: 85.00,
  categoria: "Alimentação",
  formaPagamento: "Cartão Corporativo", 
  status: "Confirmado",
  localGasto: "Centro SP"
}

{
  titulo: "Uber para reuniões",
  valor: 45.00,
  categoria: "Transporte",
  formaPagamento: "Cartão de Débito",
  status: "Confirmado",
  localGasto: "Centro SP"
}

// Dia 3 - Retorno
{
  titulo: "Café da manhã hotel",
  valor: 25.00,
  categoria: "Alimentação",
  formaPagamento: "Dinheiro",
  status: "Confirmado",
  localGasto: "Hotel"
}
```

#### **Resultado da Análise**
- **Total Gasto**: R$ 1.105,00
- **Orçamento Restante**: R$ 895,00
- **Categoria Principal**: Hospedagem (34%)
- **Status**: Dentro do orçamento ✅

---

### 2. **Viagem de Lazer - Europa (15 dias)**

#### Cenário
Casal em lua de mel visitando Paris, Roma e Barcelona com orçamento de €3.500

#### Gastos por Categoria

**🚗 Transporte**
```typescript
{
  titulo: "Passagem Brasil-Paris",
  valor: 2800.00,
  categoria: "Transporte",
  moeda: "BRL",
  formaPagamento: "Cartão de Crédito",
  status: "Confirmado"
}

{
  titulo: "Trem Paris-Roma",
  valor: 180.00,
  categoria: "Transporte", 
  moeda: "EUR",
  formaPagamento: "Cartão de Débito",
  status: "Confirmado"
}

{
  titulo: "Voo Roma-Barcelona",
  valor: 95.00,
  categoria: "Transporte",
  moeda: "EUR", 
  formaPagamento: "Cartão de Crédito",
  status: "Confirmado"
}
```

**🏨 Hospedagem**
```typescript
{
  titulo: "Hotel Paris - 5 noites",
  valor: 650.00,
  categoria: "Hospedagem",
  moeda: "EUR",
  formaPagamento: "Cartão de Crédito",
  status: "Confirmado",
  localGasto: "Marais, Paris"
}

{
  titulo: "Airbnb Roma - 5 noites", 
  valor: 420.00,
  categoria: "Hospedagem",
  moeda: "EUR",
  formaPagamento: "Cartão de Débito",
  status: "Confirmado",
  localGasto: "Trastevere, Roma"
}

{
  titulo: "Hotel Barcelona - 5 noites",
  valor: 480.00,
  categoria: "Hospedagem",
  moeda: "EUR",
  formaPagamento: "Cartão de Crédito", 
  status: "Confirmado",
  localGasto: "Eixample, Barcelona"
}
```

**🎭 Entretenimento**
```typescript
{
  titulo: "Ingressos Torre Eiffel",
  valor: 58.00,
  categoria: "Entretenimento",
  moeda: "EUR",
  formaPagamento: "Cartão de Débito",
  status: "Confirmado",
  localGasto: "Paris"
}

{
  titulo: "Tour Coliseu Romano",
  valor: 85.00,
  categoria: "Entretenimento",
  moeda: "EUR", 
  formaPagamento: "Dinheiro",
  status: "Confirmado",
  localGasto: "Roma"
}

{
  titulo: "Sagrada Família + Park Güell",
  valor: 45.00,
  categoria: "Entretenimento",
  moeda: "EUR",
  formaPagamento: "Cartão de Crédito",
  status: "Confirmado", 
  localGasto: "Barcelona"
}
```

#### **Análise Financeira**
- **Total em EUR**: €2.013,00
- **Orçamento Restante**: €1.487,00
- **Distribuição**:
  - Hospedagem: 77% (€1.550)
  - Entretenimento: 9% (€188)
  - Transporte: 14% (€275)

---

### 3. **Viagem Familiar - Praia (7 dias)**

#### Cenário
Família de 4 pessoas (2 adultos + 2 crianças) em Florianópolis

#### Gastos Detalhados

**📱 Planejamento e Preparação**
```typescript
{
  titulo: "Seguro viagem família",
  valor: 180.00,
  categoria: "Seguro",
  formaPagamento: "PIX",
  status: "Confirmado",
  observacoes: "Cobertura para 4 pessoas"
}

{
  titulo: "Chip de internet",
  valor: 35.00,
  categoria: "Comunicação", 
  formaPagamento: "Cartão de Débito",
  status: "Confirmado"
}
```

**🏖️ Hospedagem e Alimentação**
```typescript
{
  titulo: "Pousada Praia Mole - 7 diárias",
  valor: 1400.00,
  categoria: "Hospedagem",
  formaPagamento: "Cartão de Crédito",
  status: "Confirmado",
  localGasto: "Florianópolis"
}

{
  titulo: "Mercado - compras semana",
  valor: 320.00,
  categoria: "Alimentação",
  formaPagamento: "Cartão de Débito", 
  status: "Confirmado",
  localGasto: "Supermercado Big"
}

{
  titulo: "Restaurante frutos do mar",
  valor: 180.00,
  categoria: "Alimentação",
  formaPagamento: "Dinheiro",
  status: "Confirmado",
  localGasto: "Lagoa da Conceição"
}
```

**🎪 Atividades Familiares**
```typescript
{
  titulo: "Beto Carrero World",
  valor: 480.00,
  categoria: "Entretenimento", 
  formaPagamento: "Cartão de Crédito",
  status: "Confirmado",
  localGasto: "Penha",
  observacoes: "4 ingressos"
}

{
  titulo: "Passeio de barco",
  valor: 240.00,
  categoria: "Entretenimento",
  formaPagamento: "PIX",
  status: "Confirmado",
  localGasto: "Centro de Floripa"
}
```

**🚗 Transporte**
```typescript
{
  titulo: "Aluguel carro 7 dias",
  valor: 420.00,
  categoria: "Transporte",
  formaPagamento: "Cartão de Crédito",
  status: "Confirmado"
}

{
  titulo: "Combustível",
  valor: 180.00,
  categoria: "Transporte",
  formaPagamento: "Cartão de Débito",
  status: "Confirmado"
}

{
  titulo: "Pedágios",
  valor: 45.00,
  categoria: "Transporte", 
  formaPagamento: "Dinheiro",
  status: "Confirmado"
}
```

#### **Resumo da Viagem**
- **Total Gasto**: R$ 3.480,00
- **Gasto por Pessoa**: R$ 870,00
- **Gasto por Dia**: R$ 497,14
- **Categoria Principal**: Hospedagem (40%)

---

## 🔍 Cenários de Filtros e Buscas

### **Filtros Úteis**

#### 1. **Gastos Pendentes de Confirmação**
```typescript
// Filtrar apenas gastos pendentes
filtroStatus = 'Pendente'

// Resultado: Mostra gastos que ainda precisam ser confirmados
// Útil para: Controle de gastos planejados vs realizados
```

#### 2. **Gastos de Alimentação Acima de R$ 100**
```typescript
// Filtrar por categoria + busca por valor
filtroCategoria = 'Alimentação'
termoBusca = '100' // ou usar filtro de valor customizado

// Resultado: Restaurantes e refeições mais caras
// Útil para: Identificar gastos excessivos com comida
```

#### 3. **Gastos em Dinheiro para Controle**
```typescript
// Filtrar por forma de pagamento
filtroFormaPagamento = 'Dinheiro'

// Resultado: Todos os gastos pagos em espécie
// Útil para: Controle de caixa e planejamento de saques
```

### **Buscas Inteligentes**

#### 1. **Busca por Local**
```typescript
termoBusca = 'aeroporto'
// Encontra: "Taxi aeroporto", "Lanche aeroporto", "Estacionamento aeroporto"
```

#### 2. **Busca por Tipo de Estabelecimento**
```typescript
termoBusca = 'hotel'
// Encontra: "Hotel Copacabana", "Taxa hotel", "Café da manhã hotel"
```

#### 3. **Busca por Evento**
```typescript
termoBusca = 'reunião'
// Encontra: "Almoço reunião", "Uber para reunião", "Café reunião cliente"
```

---

## 📊 Relatórios Personalizados

### **Análise de Orçamento**

#### Exemplo: Viagem Europa
```typescript
// Dados do Resumo
{
  totalGasto: 2013.00,
  orcamentoTotal: 3500.00,
  percentualGasto: 57.5,
  saldoRestante: 1487.00,
  statusOrcamento: 'dentro' // 'dentro' | 'atencao' | 'excedido'
}

// Análise por Categoria
{
  'Hospedagem': { valor: 1550.00, percentual: 77.0 },
  'Transporte': { valor: 275.00, percentual: 13.7 },
  'Entretenimento': { valor: 188.00, percentual: 9.3 }
}
```

### **Comparação de Viagens**

#### Viagem Negócios vs Lazer
```typescript
// Negócios (3 dias)
{
  totalGasto: 1105.00,
  gastoPorDia: 368.33,
  categoriasPrincipais: ['Hospedagem', 'Transporte', 'Alimentação']
}

// Lazer (15 dias) 
{
  totalGasto: 2013.00, // em EUR
  gastoPorDia: 134.20,
  categoriasPrincipais: ['Hospedagem', 'Transporte', 'Entretenimento']
}
```

---

## 🚀 Funcionalidades Avançadas

### **1. Exportação CSV Personalizada**

```csv
Data,Título,Categoria,Valor,Forma Pagamento,Status,Local
2024-01-15,"Almoço executivo",Alimentação,120.00,"Cartão Corporativo",Confirmado,"Restaurante Fasano"
2024-01-15,"Hotel Paulista",Hospedagem,380.00,"Cartão de Crédito",Confirmado,"Av. Paulista"
2024-01-16,"Uber reuniões",Transporte,45.00,"Cartão de Débito",Confirmado,"Centro SP"
```

### **2. Duplicação Inteligente de Gastos**

```typescript
// Gasto Original
{
  titulo: "Café da manhã hotel",
  valor: 25.00,
  categoria: "Alimentação"
}

// Após Duplicar
{
  titulo: "Café da manhã hotel (Cópia)",
  valor: 25.00,
  categoria: "Alimentação",
  data: new Date() // Data atual
}
```

### **3. Tags para Organização**

```typescript
{
  titulo: "Jantar romântico",
  valor: 150.00,
  categoria: "Alimentação",
  tags: ["lua-de-mel", "especial", "aniversário"],
  localGasto: "Paris"
}

// Busca por tag: "lua-de-mel"
// Resultado: Todos os gastos marcados com essa tag
```

---

## 💡 Dicas de Uso

### **Para Viagens de Negócios**
1. **Separe por cliente**: Use tags para identificar gastos por cliente
2. **Categorize corretamente**: Facilita relatórios de reembolso
3. **Fotografe comprovantes**: Adicione links na observação
4. **Exporte regularmente**: Gere relatórios mensais

### **Para Viagens de Lazer**
1. **Defina orçamento por categoria**: Controle gastos por tipo
2. **Use múltiplas moedas**: Registre valores na moeda local
3. **Marque gastos especiais**: Use tags para momentos únicos
4. **Analise padrões**: Identifique onde gasta mais

### **Para Viagens Familiares**
1. **Divida por pessoa**: Use observações para especificar
2. **Planeje atividades**: Registre gastos pendentes
3. **Controle alimentação**: Separe mercado de restaurantes
4. **Monitore entretenimento**: Acompanhe gastos com diversão

---

**🎯 O sistema está pronto para gerenciar qualquer tipo de viagem com eficiência e organização!**
