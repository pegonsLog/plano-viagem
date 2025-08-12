# Sistema de Gerenciamento de Gastos de Viagem

Este sistema oferece uma solução completa para gerenciar gastos durante viagens, incluindo entrada, edição, análise e visualização de dados financeiros.

## 📋 Componentes Principais

### 1. **GerenciamentoGastosComponent**
Componente principal que integra todas as funcionalidades de gastos.

```typescript
<app-gerenciamento-gastos 
  [viagemId]="viagemId" 
  [diaViagemId]="diaViagemId">
</app-gerenciamento-gastos>
```

### 2. **FormularioGastoComponent**
Formulário para adicionar e editar gastos.

```typescript
<app-formulario-gasto 
  [viagemId]="viagemId"
  [diaViagemId]="diaViagemId"
  [gasto]="gastoParaEditar"
  [isModal]="true"
  (gastoSalvo)="onGastoSalvo()"
  (cancelar)="onCancelar()">
</app-formulario-gasto>
```

### 3. **ListaGastosComponent**
Lista todos os gastos com filtros e opções de edição.

```typescript
<app-lista-gastos 
  [viagemId]="viagemId"
  [diaViagemId]="diaViagemId"
  [mostrarFiltros]="true"
  [mostrarBotaoAdicionar]="true">
</app-lista-gastos>
```

### 4. **DashboardGastosComponent**
Dashboard com gráficos e análises visuais.

```typescript
<app-dashboard-gastos [viagemId]="viagemId">
</app-dashboard-gastos>
```

### 5. **AnaliseCategoriaGastosComponent**
Análise detalhada por categoria com recomendações.

```typescript
<app-analise-categoria-gastos [viagemId]="viagemId">
</app-analise-categoria-gastos>
```

## 🏗️ Estrutura de Dados

### Modelo Gasto
```typescript
interface Gasto {
  id: string;
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
  status: StatusGasto;
  criadoEm: Date;
  atualizadoEm: Date;
}
```

### Categorias Disponíveis
- **Transporte**: Avião, Trem, Ônibus, Táxi, Uber, etc.
- **Hospedagem**: Hotel, Pousada, Hostel, Airbnb, etc.
- **Alimentação**: Café da Manhã, Almoço, Jantar, Lanche, etc.
- **Entretenimento**: Ingressos, Tours, Shows, Cinema, etc.
- **Compras**: Souvenirs, Roupas, Eletrônicos, etc.
- **Saúde**: Medicamentos, Consulta Médica, etc.
- **Documentação**: Visto, Passaporte, etc.
- **Seguro**: Seguro Viagem, Seguro Saúde, etc.
- **Comunicação**: Internet, Chip Internacional, etc.
- **Emergência**: Médica, Perda de Documentos, etc.
- **Outros**: Diversos, Taxas, Gorjetas, etc.

## 🔧 Serviços

### GastoService
Serviço principal para gerenciar gastos:

```typescript
// Criar gasto
await this.gastoService.criarGasto(novoGasto);

// Atualizar gasto
await this.gastoService.atualizarGasto(id, dadosAtualizados);

// Excluir gasto
await this.gastoService.excluirGasto(id, viagemId);

// Obter gastos por viagem
this.gastoService.getGastosPorViagem(viagemId).subscribe(gastos => {
  // Processar gastos
});

// Calcular resumo
this.gastoService.calcularResumoGastos(viagemId).subscribe(resumo => {
  // Usar resumo
});

// Comparar com orçamento
this.gastoService.getComparacaoOrcamento(viagemId).subscribe(comparacao => {
  // Analisar orçamento
});

// Exportar para CSV
this.gastoService.exportarGastosCSV(viagemId).subscribe(csv => {
  // Baixar arquivo
});
```

## 📊 Funcionalidades

### ✅ Entrada de Dados
- Formulário completo com validação
- Suporte a múltiplas moedas
- Conversão automática de câmbio
- Upload de comprovantes
- Tags personalizadas
- Categorização automática

### ✅ Visualização e Filtros
- Lista paginada com busca
- Filtros por categoria, status, forma de pagamento
- Ordenação por data, valor, categoria
- Visualização em cards ou lista
- Ações rápidas (editar, excluir, duplicar)

### ✅ Dashboard e Gráficos
- Gráfico de gastos por categoria (donut)
- Evolução temporal dos gastos (linha)
- Distribuição por forma de pagamento (barras)
- Comparação com orçamento (donut)
- Cards de resumo com KPIs

### ✅ Análise Avançada
- Análise por categoria com tendências
- Recomendações personalizadas
- Identificação de padrões de gasto
- Alertas de orçamento
- Insights automáticos

### ✅ Exportação e Relatórios
- Exportação para CSV
- Relatórios detalhados
- Resumos por período
- Comparações históricas

## 🚀 Como Usar

### 1. Integração Básica
```typescript
import { GerenciamentoGastosComponent } from './components/gerenciamento-gastos/gerenciamento-gastos.component';

@Component({
  selector: 'app-viagem-detalhes',
  template: `
    <app-gerenciamento-gastos 
      [viagemId]="viagem.id">
    </app-gerenciamento-gastos>
  `,
  imports: [GerenciamentoGastosComponent]
})
export class ViagemDetalhesComponent {
  viagem = { id: 'viagem-123' };
}
```

### 2. Integração com Modal
```typescript
import { ModalController } from '@ionic/angular';
import { FormularioGastoComponent } from './components/formulario-gasto/formulario-gasto.component';

async abrirFormularioGasto() {
  const modal = await this.modalController.create({
    component: FormularioGastoComponent,
    componentProps: {
      viagemId: this.viagemId,
      isModal: true
    }
  });

  modal.onDidDismiss().then(() => {
    this.recarregarGastos();
  });

  await modal.present();
}
```

### 3. Dashboard Personalizado
```typescript
import { DashboardGastosComponent } from './components/dashboard-gastos/dashboard-gastos.component';

@Component({
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="dashboard">
          <ion-icon name="analytics"></ion-icon>
          <ion-label>Dashboard</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
    
    <ion-router-outlet></ion-router-outlet>
  `
})
export class GastosTabsComponent {}
```

## 🎨 Personalização

### Temas e Cores
O sistema usa as variáveis CSS do Ionic para cores:
```scss
:root {
  --ion-color-primary: #3880ff;
  --ion-color-success: #2dd36f;
  --ion-color-warning: #ffc409;
  --ion-color-danger: #eb445a;
}
```

### Categorias Personalizadas
Para adicionar novas categorias, edite o arquivo `gasto.model.ts`:
```typescript
export const CATEGORIAS_GASTO = [
  // ... categorias existentes
  {
    value: 'NovaCategoria',
    label: 'Nova Categoria',
    icon: 'novo-icone',
    subcategorias: ['Sub1', 'Sub2']
  }
];
```

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 📱 Mobile (iOS/Android)
- 💻 Desktop
- 📱 Tablet
- 🌐 PWA

## 🔒 Segurança

- Validação de dados no frontend e backend
- Sanitização de inputs
- Proteção contra XSS
- Autenticação obrigatória
- Dados criptografados

## 🧪 Testes

Para testar o sistema:
```bash
# Testes unitários
ng test

# Testes e2e
ng e2e

# Testes específicos de gastos
ng test --include="**/gasto*.spec.ts"
```

## 📈 Performance

- Lazy loading de componentes
- Virtual scrolling para listas grandes
- Debounce em buscas
- Cache de dados
- Otimização de imagens
- Compressão de dados

## 🔄 Atualizações Futuras

### Planejadas
- [ ] Integração com APIs de câmbio em tempo real
- [ ] OCR para leitura automática de recibos
- [ ] Notificações push para lembretes
- [ ] Sincronização offline
- [ ] Integração com bancos
- [ ] Relatórios em PDF
- [ ] Compartilhamento de gastos
- [ ] Metas de economia
- [ ] Comparação entre viagens
- [ ] IA para categorização automática

### Em Consideração
- [ ] Integração com cartões de crédito
- [ ] Geolocalização automática
- [ ] Reconhecimento de voz
- [ ] Widgets para tela inicial
- [ ] Integração com calendário
- [ ] Backup automático na nuvem

## 🆘 Suporte

Para dúvidas ou problemas:
1. Consulte esta documentação
2. Verifique os logs do console
3. Teste em ambiente de desenvolvimento
4. Reporte bugs com detalhes

## 📄 Licença

Este sistema faz parte do aplicativo Plano de Viagem e segue a mesma licença do projeto principal.
