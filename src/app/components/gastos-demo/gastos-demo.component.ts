import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, timeout, catchError, of } from 'rxjs';
import { GastoService } from '../../services/gasto.service';
import { 
  Gasto, 
  NovoGasto, 
  CATEGORIAS_GASTO, 
  STATUS_GASTO, 
  MOEDAS_COMUNS,
  CategoriaGasto,
  StatusGasto,
  ResumoGastos
} from '../../models/gasto.model';
import { FORMAS_PAGAMENTO } from '../../models/dia-viagem.model';

@Component({
  selector: 'app-gastos-demo',
  templateUrl: './gastos-demo.component.html',
  styleUrls: ['./gastos-demo.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class GastosDemoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Dados
  gastos: Gasto[] = [];
  resumoGastos: ResumoGastos | null = null;
  isLoading = false;
  salvando = false; // evita duplo submit
  
  // Formulário
  mostrarFormulario = false;
  editandoGasto: Gasto | null = null;
  novoGasto: NovoGasto = this.criarGastoVazio();
  
  // Filtros
  termoBusca = '';
  filtroCategoria: CategoriaGasto | 'todas' = 'todas';
  filtroStatus: StatusGasto | 'todos' = 'todos';
  gastosFiltrados: Gasto[] = [];
  
  // Constantes
  categorias = CATEGORIAS_GASTO;
  statusGasto = STATUS_GASTO;
  formasPagamento = FORMAS_PAGAMENTO;
  moedas = MOEDAS_COMUNS;
  
  // ID da viagem, obtido da rota
  viagemId!: string;

  constructor(
    private gastoService: GastoService, 
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.viagemId = id;
      this.carregarDados();
    } else {
      console.error('ID da viagem não encontrado na rota!');
      alert('Erro: ID da viagem não encontrado. Não é possível carregar ou salvar gastos.');
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  carregarDados() {
    if (!this.viagemId) {
      console.error('carregarDados chamado sem viagemId!');
      return;
    }

    this.isLoading = true;
    // console.log(`[Debug] Iniciando carregamento de dados para viagemId: ${this.viagemId}`);

    this.gastoService.getGastosPorViagem(this.viagemId)
      .pipe(
        catchError(error => {
          console.error('[Debug] Erro capturado:', error);
          return of([]); // Retorna array vazio em caso de erro
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (gastos) => {
          if (Array.isArray(gastos) && gastos.length === 0) {
            // console.log('[Debug] Emissão vazia ignorada');
            return; // ignora a emissão inicial vazia
          }
          // console.log('[Debug] Dados válidos recebidos:', gastos);
          this.isLoading = false; // desativa loading somente com dados reais
          this.gastos = gastos;
          this.aplicarFiltros();
          this.carregarResumo();
          // console.log('[Debug] Carregamento de dados finalizado.');
        },
        error: (error) => {
          console.error('[Debug] Erro ao carregar gastos:', error);
          this.gastos = [];
          this.aplicarFiltros();
          this.isLoading = false;
        },
        complete: () => {
          // console.log('[Debug] Observable de gastos completado.');
        }
      });
  }

  carregarResumo() {
    this.gastoService.calcularResumoGastos(this.viagemId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resumo) => {
          this.resumoGastos = resumo;
          // evita ExpressionChangedAfterItHasBeenCheckedError
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao carregar resumo:', error);
        }
      });
  }

  aplicarFiltros() {
    // console.log('[Debug Component] Aplicando filtros. Gastos originais:', this.gastos);
    let gastosFiltrados = [...this.gastos];

    // Filtro por busca
    if (this.termoBusca.trim()) {
      const termo = this.termoBusca.toLowerCase();
      gastosFiltrados = gastosFiltrados.filter(gasto =>
        gasto.titulo.toLowerCase().includes(termo) ||
        gasto.descricao?.toLowerCase().includes(termo) ||
        gasto.categoria.toLowerCase().includes(termo)
      );
      // console.log('[Debug Component] Após filtro de busca:', gastosFiltrados);
    }

    // Filtro por categoria
    if (this.filtroCategoria !== 'todas') {
      gastosFiltrados = gastosFiltrados.filter(gasto => gasto.categoria === this.filtroCategoria);
      // console.log('[Debug Component] Após filtro de categoria:', gastosFiltrados);
    }

    // Filtro por status
    if (this.filtroStatus !== 'todos') {
      gastosFiltrados = gastosFiltrados.filter(gasto => gasto.status === this.filtroStatus);
      // console.log('[Debug Component] Após filtro de status:', gastosFiltrados);
    }

    // Ordenar por data (mais recente primeiro)
    gastosFiltrados.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    // console.log('[Debug Component] Gastos filtrados finais:', gastosFiltrados);
    this.gastosFiltrados = gastosFiltrados;
    // console.log('[Debug Component] gastosFiltrados.length após atribuição:', this.gastosFiltrados.length);
    // console.log('[Debug Component] isLoading:', this.isLoading);
    
    // Força a detecção de mudanças
    this.cdr.detectChanges();
    // console.log('[Debug Component] Detecção de mudanças forçada');
  }

  onFiltroChange() {
    this.aplicarFiltros();
  }

  onBuscaChange() {
    this.aplicarFiltros();
  }

  // Operações CRUD
  abrirFormulario() {
    this.mostrarFormulario = true;
    this.editandoGasto = null;
    this.novoGasto = this.criarGastoVazio();
  }

  editarGasto(gasto: Gasto) {
    this.mostrarFormulario = true;
    this.editandoGasto = gasto;
    this.novoGasto = {
      viagemId: gasto.viagemId,
      diaViagemId: gasto.diaViagemId,
      titulo: gasto.titulo,
      descricao: gasto.descricao,
      valor: gasto.valor,
      categoria: gasto.categoria,
      subcategoria: gasto.subcategoria,
      data: gasto.data,
      formaPagamento: gasto.formaPagamento,
      moeda: gasto.moeda,
      localGasto: gasto.localGasto,
      observacoes: gasto.observacoes,
      tags: gasto.tags,
      status: gasto.status
    };
  }

  async salvarGasto() {
  if (this.salvando) {
    console.warn('[Debug] salvarGasto ignorado, já em andamento');
    return;
  }
  this.salvando = true;
    if (!this.viagemId) {
      alert('Erro: ID da viagem não definido.');
      return;
    }

    try {
      const gastoPayload: any = { ...this.novoGasto, viagemId: this.viagemId };
      // Remove campos undefined que causam erro no Firestore
      Object.keys(gastoPayload).forEach(key => {
        if (gastoPayload[key] === undefined) {
          delete gastoPayload[key];
        }
      });

      if (this.editandoGasto) {
        await this.gastoService.atualizarGasto(this.editandoGasto.id, gastoPayload);
        // console.log('Gasto atualizado com sucesso!');
      } else {
        await this.gastoService.criarGasto(gastoPayload, this.viagemId);
        // console.log('Gasto criado com sucesso!');
      }
      
      this.fecharFormulario();
      // O carregarDados não é mais necessário aqui, pois o collectionData do Firestore atualiza a lista automaticamente.
    } catch (error) {
      console.error('Erro ao salvar gasto:', error);
      alert('Erro ao salvar gasto. Verifique o console para mais detalhes.');
    } finally {
      this.salvando = false;
    }
  }

  async excluirGasto(gasto: Gasto) {
    if (confirm(`Tem certeza que deseja excluir o gasto "${gasto.titulo}"?`)) {
      try {
        await this.gastoService.excluirGasto(gasto.id);
        // console.log('Gasto excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir gasto:', error);
        alert('Erro ao excluir gasto');
      }
    }
  }

  async duplicarGasto(gasto: Gasto) {
    try {
      await this.gastoService.duplicarGasto(gasto.id);
      // console.log('Gasto duplicado com sucesso!');
      // carregarDados() não é mais necessário aqui.
    } catch (error) {
      console.error('Erro ao duplicar gasto:', error);
      alert('Erro ao duplicar gasto');
    }
  }

  fecharFormulario() {
    this.mostrarFormulario = false;
    this.editandoGasto = null;
    this.novoGasto = this.criarGastoVazio();
    // Garante atualização imediata da interface
    this.cdr.detectChanges();
  }

  limparFiltros() {
    this.termoBusca = '';
    this.filtroCategoria = 'todas';
    this.filtroStatus = 'todos';
    this.aplicarFiltros();
  }

  exportarGastos() {
    this.gastoService.exportarGastosCSV(this.viagemId).subscribe({
      next: (csv) => {
        this.downloadCSV(csv, `gastos-${this.viagemId}.csv`);
        // console.log('Gastos exportados com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao exportar gastos:', error);
        alert('Erro ao exportar gastos');
      }
    });
  }

  private downloadCSV(csv: string, filename: string) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private criarGastoVazio(): NovoGasto {
    return {
      viagemId: this.viagemId,
      titulo: '',
      valor: 0,
      categoria: 'Outros',
      data: new Date(),
      formaPagamento: 'Dinheiro',
      moeda: 'BRL',
      status: 'Confirmado'
    };
  }

  // Métodos auxiliares
  formatarValor(valor: number, moeda: string): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: moeda === 'BRL' ? 'BRL' : 'USD',
      minimumFractionDigits: 2
    }).format(valor);
  }

  private readonly iconeEmojiMap: Record<string, string> = {
    directions_car: '🚗',
    hotel: '🏨',
    restaurant: '🍽️',
    local_activity: '🎟️',
    shopping_bag: '🛍️',
    local_hospital: '🏥',
    description: '📄',
    security: '🛡️',
    directions_phone: '📞',
    more_horiz: '➕',
    category: '🏷️'
  };

  getIconeCategoria(categoria: CategoriaGasto): string {
    const cat = this.categorias.find(c => c.value === categoria);
    const iconName = cat?.icon || 'category';
    return this.iconeEmojiMap[iconName] || '🏷️';
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  getCorStatus(status: StatusGasto): string {
    const statusObj = this.statusGasto.find(s => s.value === status);
    return statusObj?.color || 'medium';
  }

  trackByGastoId(index: number, gasto: Gasto): string {
    return gasto.id;
  }
}
