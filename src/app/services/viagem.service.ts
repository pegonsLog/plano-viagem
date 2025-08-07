import { Injectable, signal, inject } from '@angular/core';
import { orderBy } from '@angular/fire/firestore';
import { Viagem, NovaViagem } from '../models/viagem.model';
import { FirebaseBaseService } from './firebase-base.service';
import { ErrorHandlerService } from '../utils/error-handler.service';
import { DateService } from '../utils/date.service';

interface ViagemFirebase extends Omit<Viagem, 'id'> {
  // Interface para dados no Firebase (sem o ID que é gerado automaticamente)
}

@Injectable({
  providedIn: 'root'
})
export class ViagemService {
  private firebaseService = inject(FirebaseBaseService);
  private errorHandler = inject(ErrorHandlerService);
  private dateService = inject(DateService);
  
  private viagensSignal = signal<Viagem[]>([]);
  private loadingSignal = signal<boolean>(false);
  
  readonly viagens = this.viagensSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  
  private readonly COLLECTION_NAME = 'viagens';

  constructor() {
    this.carregarViagens();
  }

  private async carregarViagens(): Promise<void> {
    try {
      this.loadingSignal.set(true);
      
      this.firebaseService.getAll<Viagem>(
        this.COLLECTION_NAME,
        orderBy('dataFim', 'desc')
      ).subscribe({
        next: (viagens) => {
          // Converter timestamps do Firebase para Date
          const viagensConvertidas = viagens.map(viagem => ({
            ...viagem,
            dataInicio: this.firebaseService.convertTimestampToDate(viagem.dataInicio),
            dataFim: this.firebaseService.convertTimestampToDate(viagem.dataFim),
            criadaEm: this.firebaseService.convertTimestampToDate(viagem.criadaEm),
            atualizadaEm: this.firebaseService.convertTimestampToDate(viagem.atualizadaEm)
          }));
          
          this.viagensSignal.set(viagensConvertidas);
          this.loadingSignal.set(false);
        },
        error: (error) => {
          console.error('Erro ao carregar viagens:', error);
          this.errorHandler.showError('Erro ao carregar viagens. Tente novamente.');
          this.loadingSignal.set(false);
        }
      });
    } catch (error) {
      console.error('Erro ao configurar carregamento de viagens:', error);
      this.errorHandler.showError('Erro ao configurar carregamento de viagens.');
      this.loadingSignal.set(false);
    }
  }

  async adicionarViagem(novaViagem: NovaViagem): Promise<void> {
    try {
      this.loadingSignal.set(true);
      
      const viagemParaFirebase: ViagemFirebase = {
        ...novaViagem,
        status: 'planejada',
        criadaEm: this.dateService.createBrazilDate(),
        atualizadaEm: this.dateService.createBrazilDate()
      };

      const dadosPreparados = this.firebaseService.prepareDataForFirebase(viagemParaFirebase);
      const id = await this.firebaseService.create(this.COLLECTION_NAME, dadosPreparados);
      
      // Adicionar localmente para feedback imediato
      const novaViagemCompleta: Viagem = {
        ...viagemParaFirebase,
        id
      };
      
      this.viagensSignal.update(viagens => [novaViagemCompleta, ...viagens]);
      this.errorHandler.showInfo('Viagem adicionada com sucesso!');
      
    } catch (error) {
      console.error('Erro ao adicionar viagem:', error);
      this.errorHandler.showError('Erro ao adicionar viagem. Tente novamente.');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async atualizarViagem(id: string, dadosAtualizados: Partial<Viagem>): Promise<void> {
    try {
      this.loadingSignal.set(true);
      
      const dadosParaAtualizar = {
        ...dadosAtualizados,
        atualizadaEm: this.dateService.createBrazilDate()
      };
      
      const dadosPreparados = this.firebaseService.prepareDataForFirebase(dadosParaAtualizar);
      await this.firebaseService.update(this.COLLECTION_NAME, id, dadosPreparados);
      
      // Atualizar localmente
      this.viagensSignal.update(viagens => 
        viagens.map(viagem => 
          viagem.id === id 
            ? { ...viagem, ...dadosParaAtualizar }
            : viagem
        )
      );
      
      this.errorHandler.showInfo('Viagem atualizada com sucesso!');
      
    } catch (error) {
      console.error('Erro ao atualizar viagem:', error);
      this.errorHandler.showError('Erro ao atualizar viagem. Tente novamente.');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async removerViagem(id: string): Promise<void> {
    try {
      this.loadingSignal.set(true);
      
      await this.firebaseService.delete(this.COLLECTION_NAME, id);
      
      // Remover localmente
      this.viagensSignal.update(viagens => 
        viagens.filter(viagem => viagem.id !== id)
      );
      
      this.errorHandler.showInfo('Viagem removida com sucesso!');
      
    } catch (error) {
      console.error('Erro ao remover viagem:', error);
      this.errorHandler.showError('Erro ao remover viagem. Tente novamente.');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  obterViagem(id: string): Viagem | undefined {
    return this.viagens().find(viagem => viagem.id === id);
  }

  async obterViagemPorId(id: string): Promise<Viagem | null> {
    try {
      const viagem = await this.firebaseService.getById<Viagem>(this.COLLECTION_NAME, id).toPromise();
      
      if (viagem) {
        // Converter timestamps
        return {
          ...viagem,
          dataInicio: this.firebaseService.convertTimestampToDate(viagem.dataInicio),
          dataFim: this.firebaseService.convertTimestampToDate(viagem.dataFim),
          criadaEm: this.firebaseService.convertTimestampToDate(viagem.criadaEm),
          atualizadaEm: this.firebaseService.convertTimestampToDate(viagem.atualizadaEm)
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao obter viagem por ID:', error);
      this.errorHandler.showError('Erro ao carregar viagem.');
      return null;
    }
  }

  // Método para recarregar viagens manualmente
  async recarregarViagens(): Promise<void> {
    await this.carregarViagens();
  }
}