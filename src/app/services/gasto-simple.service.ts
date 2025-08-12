import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  Gasto, 
  NovoGasto, 
  ResumoGastos, 
  ComparacaoOrcamento,
  CategoriaGasto,
  StatusGasto,
  FormaPagamento,
  CATEGORIAS_GASTO
} from '../models/gasto.model';

/**
 * Serviço simplificado para gerenciamento de gastos de viagem
 * Versão funcional sem dependências externas
 */
@Injectable({
  providedIn: 'root'
})
export class GastoService {
  
  private gastosSubject = new BehaviorSubject<Gasto[]>([]);
  private gastos: Gasto[] = [];
  private nextId = 1;

  constructor() {
    this.inicializarDadosExemplo();
  }

  // Observable público para componentes se inscreverem
  public gastos$ = this.gastosSubject.asObservable();

  // Métodos básicos CRUD
  async criarGasto(novoGasto: NovoGasto): Promise<string> {
    const gasto: Gasto = {
      id: `gasto-${this.nextId++}`,
      ...novoGasto,
      status: novoGasto.status || 'Pendente',
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };

    this.gastos.push(gasto);
    this.gastosSubject.next([...this.gastos]);
    return gasto.id;
  }

  async atualizarGasto(id: string, dadosAtualizados: Partial<Gasto>): Promise<void> {
    const index = this.gastos.findIndex(g => g.id === id);
    if (index !== -1) {
      this.gastos[index] = {
        ...this.gastos[index],
        ...dadosAtualizados,
        atualizadoEm: new Date()
      };
      this.gastosSubject.next([...this.gastos]);
    }
  }

  async excluirGasto(id: string): Promise<void> {
    this.gastos = this.gastos.filter(g => g.id !== id);
    this.gastosSubject.next([...this.gastos]);
  }

  // Métodos de consulta
  getGastosPorViagem(viagemId: string): Observable<Gasto[]> {
    return of(this.gastos.filter(g => g.viagemId === viagemId));
  }

  getGastosPorDia(viagemId: string, diaViagemId: string): Observable<Gasto[]> {
    return of(this.gastos.filter(g => 
      g.viagemId === viagemId && g.diaViagemId === diaViagemId
    ));
  }

  getGastosPorStatus(viagemId: string, status: StatusGasto): Observable<Gasto[]> {
    return of(this.gastos.filter(g => 
      g.viagemId === viagemId && g.status === status
    ));
  }

  // Resumo e estatísticas
  calcularResumoGastos(viagemId: string): Observable<ResumoGastos> {
    return this.getGastosPorViagem(viagemId).pipe(
      map((gastos: Gasto[]) => {
        const gastosConfirmados = gastos.filter(g => g.status === 'Confirmado');
        const totalGasto = gastosConfirmados.reduce((total: number, gasto: Gasto) => total + gasto.valor, 0);

        // Total por categoria
        const totalPorCategoria: { [categoria: string]: number } = {};
        
        gastosConfirmados.forEach((gasto: Gasto) => {
          if (!totalPorCategoria[gasto.categoria]) {
            totalPorCategoria[gasto.categoria] = 0;
          }
          totalPorCategoria[gasto.categoria] += gasto.valor;
        });

        // Total por forma de pagamento
        const totalPorFormaPagamento: { [forma: string]: number } = {};
        gastosConfirmados.forEach((gasto: Gasto) => {
          if (!totalPorFormaPagamento[gasto.formaPagamento]) {
            totalPorFormaPagamento[gasto.formaPagamento] = 0;
          }
          totalPorFormaPagamento[gasto.formaPagamento] += gasto.valor;
        });

        // Total por moeda
        const totalPorMoeda: { [moeda: string]: number } = {};
        gastosConfirmados.forEach((gasto: Gasto) => {
          if (!totalPorMoeda[gasto.moeda]) {
            totalPorMoeda[gasto.moeda] = 0;
          }
          totalPorMoeda[gasto.moeda] += gasto.valor;
        });

        // Maior e menor gasto
        const maiorGasto = gastosConfirmados.length > 0 
          ? gastosConfirmados.reduce((max, g) => g.valor > max.valor ? g : max)
          : null;
        
        const menorGasto = gastosConfirmados.length > 0
          ? gastosConfirmados.reduce((min, g) => g.valor < min.valor ? g : min)
          : null;

        // Categoria com maior gasto
        const categoriaComMaiorGasto = Object.keys(totalPorCategoria).length > 0
          ? Object.entries(totalPorCategoria).reduce((a, b) => a[1] > b[1] ? a : b)[0]
          : '';

        // Gasto médio
        const gastoMedio = gastosConfirmados.length > 0 ? totalGasto / gastosConfirmados.length : 0;

        // Gastos recentes (últimos 5)
        const gastosRecentes = gastosConfirmados
          .sort((a, b) => b.data.getTime() - a.data.getTime())
          .slice(0, 5);

        return {
          totalGasto,
          totalPorCategoria,
          totalPorFormaPagamento,
          totalPorMoeda,
          gastoMedio,
          maiorGasto,
          menorGasto,
          gastosRecentes,
          categoriaComMaiorGasto,
          percentualDoOrcamento: 0 // Será calculado quando necessário
        };
      })
    );
  }

  // Comparação com orçamento
  getComparacaoOrcamento(viagemId: string): Observable<ComparacaoOrcamento> {
    return this.getGastosPorViagem(viagemId).pipe(
      map((gastos: Gasto[]) => {
        const gastoAtual = gastos
          .filter(g => g.status === 'Confirmado')
          .reduce((total, gasto) => total + gasto.valor, 0);
        
        const orcamentoTotal = 5000; // Valor fixo para exemplo
        const percentualGasto = (gastoAtual / orcamentoTotal) * 100;
        const saldoRestante = orcamentoTotal - gastoAtual;
        
        let statusOrcamento: 'dentro' | 'atencao' | 'excedido';
        if (percentualGasto <= 75) {
          statusOrcamento = 'dentro';
        } else if (percentualGasto <= 100) {
          statusOrcamento = 'atencao';
        } else {
          statusOrcamento = 'excedido';
        }
        
        // Projeção baseada na média diária
        const diasComGastos = new Set(gastos.map(g => g.data.toDateString())).size;
        const mediaDiaria = diasComGastos > 0 ? gastoAtual / diasComGastos : 0;
        const diasRestantes = 7; // Exemplo: 7 dias restantes
        const projecaoGasto = gastoAtual + (mediaDiaria * diasRestantes);
        
        return {
          orcamentoTotal,
          gastoAtual,
          percentualGasto,
          saldoRestante,
          projecaoGasto,
          statusOrcamento
        };
      })
    );
  }

  // Filtros e busca
  filtrarGastos(
    viagemId: string,
    filtros: {
      categoria?: CategoriaGasto;
      status?: StatusGasto;
      formaPagamento?: string;
      dataInicio?: Date;
      dataFim?: Date;
      valorMinimo?: number;
      valorMaximo?: number;
    }
  ): Observable<Gasto[]> {
    return this.getGastosPorViagem(viagemId).pipe(
      map(gastos => {
        return gastos.filter(gasto => {
          if (filtros.categoria && gasto.categoria !== filtros.categoria) return false;
          if (filtros.status && gasto.status !== filtros.status) return false;
          if (filtros.formaPagamento && gasto.formaPagamento !== filtros.formaPagamento) return false;
          if (filtros.dataInicio && new Date(gasto.data) < filtros.dataInicio) return false;
          if (filtros.dataFim && new Date(gasto.data) > filtros.dataFim) return false;
          if (filtros.valorMinimo && gasto.valor < filtros.valorMinimo) return false;
          if (filtros.valorMaximo && gasto.valor > filtros.valorMaximo) return false;
          return true;
        });
      })
    );
  }

  // Exportação
  exportarGastosCSV(viagemId: string): Observable<string> {
    return this.getGastosPorViagem(viagemId).pipe(
      map(gastos => {
        const headers = [
          'ID', 'Título', 'Descrição', 'Valor', 'Categoria', 'Subcategoria',
          'Data', 'Forma de Pagamento', 'Moeda', 'Status', 'Local', 'Tags', 'Observações'
        ];
        
        const csvContent = [
          headers.join(','),
          ...gastos.map(gasto => [
            gasto.id,
            `"${gasto.titulo}"`,
            `"${gasto.descricao || ''}"`,
            gasto.valor,
            gasto.categoria,
            gasto.subcategoria || '',
            gasto.data.toISOString().split('T')[0],
            gasto.formaPagamento,
            gasto.moeda,
            gasto.status,
            `"${gasto.localGasto || ''}"`,
            `"${gasto.tags?.join(';') || ''}"`,
            `"${gasto.observacoes || ''}"`
          ].join(','))
        ].join('\n');
        
        return csvContent;
      })
    );
  }

  // Inicialização com dados de exemplo
  private inicializarDadosExemplo(): void {
    const gastosExemplo: Gasto[] = [
      {
        id: 'gasto-1',
        viagemId: 'viagem-exemplo-123',
        titulo: 'Passagem aérea',
        descricao: 'Voo São Paulo - Paris',
        valor: 1200,
        categoria: 'Transporte',
        subcategoria: 'Avião',
        data: new Date('2024-03-10'),
        formaPagamento: 'Cartão de Crédito',
        moeda: 'BRL',
        status: 'Confirmado',
        localGasto: 'Aeroporto de Guarulhos',
        tags: ['viagem', 'internacional'],
        criadoEm: new Date('2024-03-01'),
        atualizadoEm: new Date('2024-03-01')
      },
      {
        id: 'gasto-2',
        viagemId: 'viagem-exemplo-123',
        titulo: 'Hotel Le Marais',
        descricao: 'Hospedagem por 7 noites',
        valor: 850,
        categoria: 'Hospedagem',
        subcategoria: 'Hotel',
        data: new Date('2024-03-15'),
        formaPagamento: 'Cartão de Crédito',
        moeda: 'BRL',
        status: 'Confirmado',
        localGasto: 'Paris, França',
        tags: ['hospedagem', 'centro'],
        criadoEm: new Date('2024-03-02'),
        atualizadoEm: new Date('2024-03-02')
      },
      {
        id: 'gasto-3',
        viagemId: 'viagem-exemplo-123',
        titulo: 'Jantar no Bistrot Paul Bert',
        descricao: 'Restaurante tradicional francês',
        valor: 125.50,
        categoria: 'Alimentação',
        subcategoria: 'Jantar',
        data: new Date('2024-03-16'),
        formaPagamento: 'Dinheiro',
        moeda: 'EUR',
        valorOriginal: 125.50,
        moedaOriginal: 'EUR',
        taxaCambio: 5.8,
        status: 'Confirmado',
        localGasto: 'Paris, França',
        tags: ['restaurante', 'francês'],
        criadoEm: new Date('2024-03-16'),
        atualizadoEm: new Date('2024-03-16')
      }
    ];

    this.gastos = gastosExemplo;
    this.nextId = 4;
    this.gastosSubject.next([...this.gastos]);
  }

  // Métodos utilitários
  duplicarGasto(gastoId: string): Observable<string> {
    const gastoOriginal = this.gastos.find(g => g.id === gastoId);
    if (!gastoOriginal) {
      return of('');
    }

    const novoGasto: NovoGasto = {
      viagemId: gastoOriginal.viagemId,
      diaViagemId: gastoOriginal.diaViagemId,
      titulo: `${gastoOriginal.titulo} (cópia)`,
      descricao: gastoOriginal.descricao,
      valor: gastoOriginal.valor,
      categoria: gastoOriginal.categoria,
      subcategoria: gastoOriginal.subcategoria,
      data: new Date(),
      formaPagamento: gastoOriginal.formaPagamento,
      moeda: gastoOriginal.moeda,
      valorOriginal: gastoOriginal.valorOriginal,
      moedaOriginal: gastoOriginal.moedaOriginal,
      taxaCambio: gastoOriginal.taxaCambio,
      comprovante: gastoOriginal.comprovante,
      localGasto: gastoOriginal.localGasto,
      observacoes: gastoOriginal.observacoes,
      tags: gastoOriginal.tags ? [...gastoOriginal.tags] : undefined,
      status: 'Pendente'
    };

    return new Observable<string>(observer => {
      this.criarGasto(novoGasto).then(id => {
        observer.next(id);
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  obterGastoPorId(id: string): Observable<Gasto | null> {
    const gasto = this.gastos.find(g => g.id === id);
    return of(gasto || null);
  }
}
