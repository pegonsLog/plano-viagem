import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, query, where, getDocs, Timestamp, CollectionReference, DocumentData, getDoc } from '@angular/fire/firestore';
import { Observable, from, of, map, shareReplay, distinctUntilChanged, filter } from 'rxjs';
import { Gasto, NovoGasto, StatusGasto, CategoriaGasto, FormaPagamento, ResumoGastos } from '../models/gasto.model';

@Injectable({
  providedIn: 'root'
})
export class GastoService {
  private gastosCollection: CollectionReference<DocumentData>;
  private gastosCache = new Map<string, Observable<Gasto[]>>();

  constructor(private firestore: Firestore) {
    this.gastosCollection = collection(this.firestore, 'gastos');
  }

  // Métodos básicos CRUD
  criarGasto(novoGasto: NovoGasto, viagemId: string): Promise<any> {
    
    const gastoParaSalvar = {
      ...novoGasto,
      viagemId, // Garante que o ID da viagem seja salvo
      status: novoGasto.status || 'Confirmado',
      moeda: novoGasto.moeda || 'BRL',
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    };
    
    
    return addDoc(this.gastosCollection, gastoParaSalvar)
      .then((docRef) => {

        return docRef;
      })
      .catch((error) => {
        console.error('[Debug Service] Erro ao salvar gasto:', error);
        throw error;
      });
  }

  atualizarGasto(id: string, dadosAtualizados: Partial<Gasto>): Promise<void> {
    const gastoDocRef = doc(this.firestore, `gastos/${id}`);

    let dadosParaAtualizar: any = {
      ...dadosAtualizados,
      atualizadoEm: Timestamp.now(),
    };

    // Converte data para Timestamp se vier como Date
    if (dadosParaAtualizar.data instanceof Date) {
      dadosParaAtualizar = {
        ...dadosParaAtualizar,
        data: Timestamp.fromDate(dadosParaAtualizar.data as Date),
      };
    }

    return updateDoc(gastoDocRef, dadosParaAtualizar);
  }

  excluirGasto(id: string): Promise<void> {
    const gastoDocRef = doc(this.firestore, `gastos/${id}`);
    return deleteDoc(gastoDocRef);
  }

  // Métodos de consulta
  getGastosPorViagem(viagemId: string): Observable<Gasto[]> {

    
    // Verifica se já existe no cache
    if (this.gastosCache.has(viagemId)) {

      return this.gastosCache.get(viagemId)!;
    }
    
    // Cria nova consulta e adiciona ao cache
    const q = query(this.gastosCollection, where('viagemId', '==', viagemId));
    const gastos$ = collectionData(q, { idField: 'id' }).pipe(
      map(gastos => {

        const gastosConvertidos = gastos.map(gasto => this.converterTimestampParaDate(gasto));

        return gastosConvertidos;
      }),
      filter(arr => arr.length > 0),
      map(gastos => {
    
        const gastosConvertidos = gastos.map(gasto => this.converterTimestampParaDate(gasto));

        return gastosConvertidos;
      }),
      distinctUntilChanged((prev, curr) => {
        if (prev.length !== curr.length) return false;
        return prev.every((p, i) => p.id === curr[i]?.id && p['atualizadoEm'] === curr[i]['atualizadoEm']);
      }),
      shareReplay(1) // Garante que todos os subscribers recebam o mesmo valor
    ) as Observable<Gasto[]>;
    
    // Adiciona ao cache
    this.gastosCache.set(viagemId, gastos$);

    
    return gastos$;
  }

  private converterTimestampParaDate(gasto: any): Gasto {
      const data = gasto.data instanceof Timestamp ? gasto.data.toDate() : gasto.data;
      const criadoEm = gasto.criadoEm instanceof Timestamp ? gasto.criadoEm.toDate() : gasto.criadoEm;
      const atualizadoEm = gasto.atualizadoEm instanceof Timestamp ? gasto.atualizadoEm.toDate() : gasto.atualizadoEm;
      
      return { ...gasto, data, criadoEm, atualizadoEm } as Gasto;
  }

  getGastoPorId(id: string): Observable<Gasto | null> {
    const gastoDocRef = doc(this.firestore, `gastos/${id}`);
    // Implementação simplificada. Para uma implementação completa, use docData.
    return from(getDocs(query(this.gastosCollection, where('id', '==', id)))).pipe(
        map(snapshot => {
            if (snapshot.empty) {
                return null;
            }
            const docData = snapshot.docs[0].data();
            return this.converterTimestampParaDate(docData);
        })
    );
  }

  // Resumo e estatísticas
  calcularResumoGastos(viagemId: string): Observable<ResumoGastos> {
    return this.getGastosPorViagem(viagemId).pipe(
      map((gastos: Gasto[]) => {
        const gastosConfirmados = gastos.filter((g: Gasto) => g.status === 'Confirmado');
        const totalGasto = gastosConfirmados.reduce((total: number, gasto: Gasto) => total + gasto.valor, 0);

        // Total por categoria
        const totalPorCategoria: { [categoria: string]: number } = {};
        gastosConfirmados.forEach((gasto: Gasto) => {
          const categoria = gasto.categoria;
          totalPorCategoria[categoria] = (totalPorCategoria[categoria] || 0) + gasto.valor;
        });

        // Total por forma de pagamento
        const totalPorFormaPagamento: { [forma: string]: number } = {};
        gastosConfirmados.forEach((gasto: Gasto) => {
          const forma = gasto.formaPagamento;
          totalPorFormaPagamento[forma] = (totalPorFormaPagamento[forma] || 0) + gasto.valor;
        });

        // Total por moeda
        const totalPorMoeda: { [moeda: string]: number } = {};
        gastosConfirmados.forEach((gasto: Gasto) => {
          const moeda = gasto.moeda;
          totalPorMoeda[moeda] = (totalPorMoeda[moeda] || 0) + gasto.valor;
        });

        // Gastos por status
        const gastosPorStatus: { [status: string]: number } = {};
        gastos.forEach((gasto: Gasto) => {
          const status = gasto.status;
          gastosPorStatus[status] = (gastosPorStatus[status] || 0) + 1;
        });

        const quantidadeGastos = gastosConfirmados.length;
        const gastoMedio = quantidadeGastos > 0 ? totalGasto / quantidadeGastos : 0;
        
        // Gastos recentes (últimos 5)
        const gastosRecentes = gastosConfirmados
          .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
          .slice(0, 5);

        // Maior e menor gasto
        const gastosOrdenados = [...gastosConfirmados].sort((a, b) => b.valor - a.valor);
        const maiorGasto = gastosOrdenados[0] || null;
        const menorGasto = gastosOrdenados[gastosOrdenados.length - 1] || null;

        // Categoria com maior gasto
        const categoriaComMaiorGasto = Object.entries(totalPorCategoria)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || '';

        // Percentual do orçamento (assumindo orçamento padrão)
        const orcamentoTotal = 5000;
        const percentualDoOrcamento = orcamentoTotal > 0 ? (totalGasto / orcamentoTotal) * 100 : 0;

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
          percentualDoOrcamento
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

  // Duplicar gasto
  async duplicarGasto(gastoId: string): Promise<void> {
    const docRef = doc(this.firestore, `gastos/${gastoId}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const gastoOriginal = docSnap.data() as Gasto;
      
      // Remove o ID e outras propriedades geradas para que o Firestore crie um novo documento
      const { id, criadoEm, atualizadoEm, ...dadosParaCopia } = gastoOriginal;

      const novoGasto: NovoGasto = {
        ...dadosParaCopia,
        titulo: `${gastoOriginal.titulo} (Cópia)`,
        data: new Date(), // Usa a data atual para a cópia
        status: 'Confirmado', // Define um status padrão para a cópia
      };
      await this.criarGasto(novoGasto, gastoOriginal.viagemId);
    } else {
      throw new Error('Gasto original não encontrado para duplicação.');
    }
  }

  // Exportação CSV
  exportarGastosCSV(viagemId: string): Observable<string> {
    return this.getGastosPorViagem(viagemId).pipe(
      map(gastos => {
        const headers = ['Data', 'Título', 'Categoria', 'Valor', 'Forma de Pagamento', 'Status', 'Local'];
        const csvContent = [
          headers.join(','),
          ...gastos.map(gasto => [
            new Date(gasto.data).toLocaleDateString('pt-BR'),
            `"${gasto.titulo}"`,
            gasto.categoria,
            gasto.valor.toFixed(2),
            gasto.formaPagamento,
            gasto.status,
            `"${gasto.localGasto || ''}"`
          ].join(','))
        ].join('\n');
        
        return csvContent;
      })
    );
  }

  // Buscar gastos por texto
  buscarGastos(viagemId: string, termo: string): Observable<Gasto[]> {
    return this.getGastosPorViagem(viagemId).pipe(
      map(gastos => {
        const termoBusca = termo.toLowerCase();
        return gastos.filter(gasto =>
          gasto.titulo.toLowerCase().includes(termoBusca) ||
          (gasto.descricao && gasto.descricao.toLowerCase().includes(termoBusca)) ||
          gasto.categoria.toLowerCase().includes(termoBusca) ||
          (gasto.subcategoria && gasto.subcategoria.toLowerCase().includes(termoBusca)) ||
          (gasto.localGasto && gasto.localGasto.toLowerCase().includes(termoBusca)) ||
          (gasto.tags && gasto.tags.some(tag => tag.toLowerCase().includes(termoBusca)))
        );
      })
    );
  }

  
}
