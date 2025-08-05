import { Injectable, signal, inject } from '@angular/core';
import { where, orderBy } from '@angular/fire/firestore';
import { DiaViagem, NovoDiaViagem, DiaCalculado, ValidationResult, DIAS_SEMANA } from '../models/dia-viagem.model';
import { Viagem } from '../models/viagem.model';
import { FirebaseBaseService } from './firebase-base.service';
import { ErrorHandlerService } from '../utils/error-handler.service';
import { DateService } from '../utils/date.service';

interface DiaViagemFirebase extends Omit<DiaViagem, 'id'> {
  // Interface para dados no Firebase (sem o ID que é gerado automaticamente)
}

@Injectable({
  providedIn: 'root'
})
export class DiaViagemService {
  private firebaseService = inject(FirebaseBaseService);
  private errorHandler = inject(ErrorHandlerService);
  private dateService = inject(DateService);

  private diasSignal = signal<DiaViagem[]>([]);
  private loadingSignal = signal<boolean>(false);

  readonly dias = this.diasSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  private readonly COLLECTION_NAME = 'dias-viagem';

  constructor() {
    this.carregarTodosDias();
  }

  private async carregarTodosDias(): Promise<void> {
    try {
      this.loadingSignal.set(true);

      this.firebaseService.getAll<DiaViagem>(
        this.COLLECTION_NAME,
        orderBy('data', 'asc')
      ).subscribe({
        next: (dias) => {
          // Converter timestamps do Firebase para Date
          const diasConvertidos = dias.map(dia => ({
            ...dia,
            data: this.firebaseService.convertTimestampToDate(dia.data),
            criadoEm: this.firebaseService.convertTimestampToDate(dia.criadoEm),
            atualizadoEm: this.firebaseService.convertTimestampToDate(dia.atualizadoEm)
          }));

          this.diasSignal.set(diasConvertidos);
          this.loadingSignal.set(false);
        },
        error: (error) => {
          console.error('Erro ao carregar dias:', error);
          this.errorHandler.showError('Erro ao carregar detalhes dos dias.');
          this.loadingSignal.set(false);
        }
      });
    } catch (error) {
      console.error('Erro ao configurar carregamento de dias:', error);
      this.loadingSignal.set(false);
    }
  }

  obterDiasPorViagem(viagemId: string): DiaViagem[] {
    return this.dias().filter(dia => dia.viagemId === viagemId);
  }

  async adicionarDia(novoDia: NovoDiaViagem): Promise<void> {
    try {
      this.loadingSignal.set(true);

      // Validar campos obrigatórios
      const validationCampos = this.validarCamposObrigatorios(novoDia);
      if (!validationCampos.isValid) {
        throw new Error(validationCampos.errors.join(', '));
      }

      // Validar duplicação
      const validationDuplicacao = this.validarDuplicacao(novoDia.data, novoDia.viagemId);
      if (!validationDuplicacao.isValid) {
        throw new Error(validationDuplicacao.errors.join(', '));
      }

      const diaParaFirebase: DiaViagemFirebase = {
        ...novoDia,
        diaSemana: this.calcularDiaSemana(novoDia.data),
        criadoEm: this.dateService.createBrazilDate(),
        atualizadoEm: this.dateService.createBrazilDate()
      };

      const dadosPreparados = this.firebaseService.prepareDataForFirebase(diaParaFirebase);
      const id = await this.firebaseService.create(this.COLLECTION_NAME, dadosPreparados);

      // Adicionar localmente para feedback imediato
      const novoDiaCompleto: DiaViagem = {
        ...diaParaFirebase,
        id
      };

      this.diasSignal.update(dias => [...dias, novoDiaCompleto]);

    } catch (error) {
      console.error('Erro ao adicionar dia:', error);
      this.errorHandler.showError(error instanceof Error ? error.message : 'Erro ao adicionar detalhes do dia.');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async atualizarDia(id: string, dadosAtualizados: Partial<DiaViagem>): Promise<void> {
    try {
      this.loadingSignal.set(true);



      const dadosParaAtualizar = {
        ...dadosAtualizados,
        atualizadoEm: this.dateService.createBrazilDate()
      };

      // Recalcular dia da semana se a data foi alterada
      if (dadosAtualizados.data) {
        dadosParaAtualizar.diaSemana = this.calcularDiaSemana(dadosAtualizados.data);
      }

      console.log('Dados após processamento:', dadosParaAtualizar);

      const dadosPreparados = this.firebaseService.prepareDataForFirebase(dadosParaAtualizar);
      console.log('Dados preparados para Firebase:', dadosPreparados);

      await this.firebaseService.update(this.COLLECTION_NAME, id, dadosPreparados);

      // Atualizar localmente
      this.diasSignal.update(dias =>
        dias.map(dia => {
          if (dia.id === id) {
            const diaAtualizado = { ...dia, ...dadosParaAtualizar };
            console.log('Dia atualizado localmente:', diaAtualizado);
            return diaAtualizado;
          }
          return dia;
        })
      );

      console.log('=== FIM DEBUG ATUALIZAÇÃO ===');

    } catch (error) {
      console.error('Erro ao atualizar dia:', error);
      this.errorHandler.showError('Erro ao atualizar detalhes do dia.');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async removerDia(id: string): Promise<void> {
    try {
      this.loadingSignal.set(true);

      await this.firebaseService.delete(this.COLLECTION_NAME, id);

      // Remover localmente
      this.diasSignal.update(dias =>
        dias.filter(dia => dia.id !== id)
      );

    } catch (error) {
      console.error('Erro ao remover dia:', error);
      this.errorHandler.showError('Erro ao remover detalhes do dia.');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  obterDia(id: string): DiaViagem | undefined {
    return this.dias().find(dia => dia.id === id);
  }

  calcularDiasViagem(dataInicio: Date, dataFim: Date): Date[] {
    return this.dateService.getDateRange(dataInicio, dataFim);
  }

  calcularDiaSemana(data: Date): string {
    return this.dateService.getWeekdayName(data);
  }

  calcularDiasCalculados(viagem: Viagem): DiaCalculado[] {
    const todasAsDatas = this.calcularDiasViagem(viagem.dataInicio, viagem.dataFim);
    const diasComDetalhes = this.obterDiasPorViagem(viagem.id);

    return todasAsDatas.map(data => {
      const detalhes = diasComDetalhes.find(dia =>
        this.isSameDay(dia.data, data)
      );

      return {
        data,
        diaSemana: this.calcularDiaSemana(data),
        temDetalhes: !!detalhes,
        detalhes
      };
    });
  }

  validarData(data: Date, viagem: Viagem): ValidationResult {
    const errors: string[] = [];

    if (!data || isNaN(data.getTime())) {
      errors.push('Data inválida');
      return { isValid: false, errors };
    }

    const dataInicio = viagem.dataInicio;
    const dataFim = viagem.dataFim;

    // Normalizar datas para comparação (apenas dia/mês/ano)
    const dataNormalizada = this.dateService.normalizeDate(data);
    const inicioNormalizado = this.dateService.normalizeDate(dataInicio);
    const fimNormalizado = this.dateService.normalizeDate(dataFim);

    if (dataNormalizada < inicioNormalizado || dataNormalizada > fimNormalizado) {
      errors.push(`A data deve estar entre ${this.dateService.formatDate(dataInicio)} e ${this.dateService.formatDate(dataFim)}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }



  validarCamposObrigatorios(dia: NovoDiaViagem): ValidationResult {
    const errors: string[] = [];

    if (!dia.data) {
      errors.push('Data é obrigatória');
    }

    if (!dia.cidade || dia.cidade.trim() === '') {
      errors.push('Cidade é obrigatória');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validarDuplicacao(data: Date, viagemId: string): ValidationResult {
    const diasExistentes = this.obterDiasPorViagem(viagemId);
    const jaExiste = diasExistentes.some(dia => this.isSameDay(dia.data, data));

    return {
      isValid: !jaExiste,
      errors: jaExiste ? ['Já existe um registro para esta data'] : []
    };
  }

  isFimDeSemana(data: Date): boolean {
    return this.dateService.isWeekend(data);
  }

  private isSameDay(data1: Date, data2: Date): boolean {
    return data1.getFullYear() === data2.getFullYear() &&
      data1.getMonth() === data2.getMonth() &&
      data1.getDate() === data2.getDate();
  }

  // Método para carregar dias de uma viagem específica do Firebase
  async carregarDiasPorViagem(viagemId: string): Promise<void> {
    try {
      this.loadingSignal.set(true);

      this.firebaseService.getWhere<DiaViagem>(
        this.COLLECTION_NAME,
        'viagemId',
        '==',
        viagemId,
        orderBy('data', 'asc')
      ).subscribe({
        next: (dias) => {
          // Converter timestamps do Firebase para Date
          const diasConvertidos = dias.map(dia => ({
            ...dia,
            data: this.firebaseService.convertTimestampToDate(dia.data),
            criadoEm: this.firebaseService.convertTimestampToDate(dia.criadoEm),
            atualizadoEm: this.firebaseService.convertTimestampToDate(dia.atualizadoEm)
          }));

          // Atualizar apenas os dias desta viagem
          this.diasSignal.update(todosOsDias => {
            const diasOutrasViagens = todosOsDias.filter(dia => dia.viagemId !== viagemId);
            return [...diasOutrasViagens, ...diasConvertidos];
          });

          this.loadingSignal.set(false);
        },
        error: (error) => {
          console.error('Erro ao carregar dias da viagem:', error);
          this.errorHandler.showError('Erro ao carregar detalhes dos dias da viagem.');
          this.loadingSignal.set(false);
        }
      });
    } catch (error) {
      console.error('Erro ao configurar carregamento de dias da viagem:', error);
      this.loadingSignal.set(false);
    }
  }

  async obterDiaPorId(id: string): Promise<DiaViagem | null> {
    try {
      // Primeiro tentar buscar no cache local
      const diaLocal = this.obterDia(id);
      if (diaLocal) {
        return diaLocal;
      }

      // Se não encontrar localmente, buscar no Firebase
      const dia = await this.firebaseService.getById<DiaViagem>(this.COLLECTION_NAME, id).toPromise();

      if (dia) {
        // Converter timestamps
        const diaConvertido = {
          ...dia,
          data: this.firebaseService.convertTimestampToDate(dia.data),
          criadoEm: this.firebaseService.convertTimestampToDate(dia.criadoEm),
          atualizadoEm: this.firebaseService.convertTimestampToDate(dia.atualizadoEm)
        };
        
        return diaConvertido;
      }

      return null;
    } catch (error) {
      console.error('Erro ao obter dia por ID:', error);
      this.errorHandler.showError('Erro ao carregar detalhes do dia.');
      return null;
    }
  }

  // Método para recarregar todos os dias
  async recarregarDias(): Promise<void> {
    await this.carregarTodosDias();
  }

  // Método para buscar o dia anterior com dados preenchidos
  async buscarDiaAnterior(viagemId: string, dataAtual: Date): Promise<DiaViagem | null> {
    try {
      const diasDaViagem = this.obterDiasPorViagem(viagemId);

      // Filtrar dias anteriores à data atual e ordenar por data decrescente
      const diasAnteriores = diasDaViagem
        .filter(dia => dia.data < dataAtual)
        .sort((a, b) => b.data.getTime() - a.data.getTime());

      // Retornar o dia mais recente anterior à data atual
      return diasAnteriores.length > 0 ? diasAnteriores[0] : null;
    } catch (error) {
      console.error('Erro ao buscar dia anterior:', error);
      return null;
    }
  }
}