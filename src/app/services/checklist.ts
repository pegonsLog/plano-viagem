import { Injectable, inject } from '@angular/core';
import { orderBy } from '@angular/fire/firestore';
import { ChecklistItem, NovoChecklistItem } from '../models/checklist-item.model';
import { FirebaseBaseService } from './firebase-base.service';
import { ErrorHandlerService } from '../utils/error-handler.service';
import { DateService } from '../utils/date.service';
import { firstValueFrom, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
  private firebaseService = inject(FirebaseBaseService);
  private errorHandler = inject(ErrorHandlerService);
  private dateService = inject(DateService);

  private readonly VIAGEM_COLLECTION = 'viagens';
  private readonly CHECKLIST_COLLECTION = 'checklistItems';

  getChecklistItems(viagemId: string): Observable<ChecklistItem[]> {
    return this.firebaseService.getWhereSnapshot<ChecklistItem>(
      this.CHECKLIST_COLLECTION,
      'viagemId',
      '==',
      viagemId,
      orderBy('criadoEm', 'asc')
    ).pipe(
      map(items => items.map(item => ({
        ...item,
        criadoEm: this.firebaseService.convertTimestampToDate(item.criadoEm)
      })))
    );
  }

  async adicionarItem(item: Omit<NovoChecklistItem, 'concluido' | 'viagemId'>, viagemId: string): Promise<void> {
    try {
      const novoItem: NovoChecklistItem = {
        ...item,
        viagemId,
        concluido: false,
      };
      const itemComData = {
        ...novoItem,
        criadoEm: this.dateService.createBrazilDate()
      };
      const dadosPreparados = this.firebaseService.prepareDataForFirebase(itemComData);
      await this.firebaseService.create(this.CHECKLIST_COLLECTION, dadosPreparados);
      await this.atualizarContadores(viagemId);
      this.errorHandler.showInfo('Item adicionado ao checklist!');
    } catch (error) {
      this.errorHandler.showError('Erro ao adicionar item.');
      throw error;
    }
  }

  async toggleConcluido(itemId: string, viagemId: string, concluido: boolean): Promise<void> {
    try {
      await this.firebaseService.update(this.CHECKLIST_COLLECTION, itemId, { concluido });
      await this.atualizarContadores(viagemId);
    } catch (error) {
      this.errorHandler.showError('Erro ao atualizar item.');
      throw error;
    }
  }

  async removerItem(itemId: string, viagemId: string): Promise<void> {
    try {
      await this.firebaseService.delete(this.CHECKLIST_COLLECTION, itemId);
      await this.atualizarContadores(viagemId);
      this.errorHandler.showInfo('Item removido do checklist.');
    } catch (error) {
      this.errorHandler.showError('Erro ao remover item.');
      throw error;
    }
  }

  async atualizarItem(itemId: string, novaDescricao: string): Promise<void> {
    try {
      await this.firebaseService.update(this.CHECKLIST_COLLECTION, itemId, { descricao: novaDescricao });
      this.errorHandler.showInfo('Item atualizado!');
    } catch (error) {
      this.errorHandler.showError('Erro ao atualizar item.');
      throw error;
    }
  }

  private async atualizarContadores(viagemId: string): Promise<void> {
    try {
      const items$ = this.firebaseService.getWhere<ChecklistItem>(
        this.CHECKLIST_COLLECTION,
        'viagemId',
        '==',
        viagemId
      );
      const items = await firstValueFrom(items$);

      const totalChecklistItems = items.length;
      const checklistItemsConcluidos = items.filter(item => item.concluido).length;

      const dadosParaAtualizar = {
        totalChecklistItems,
        checklistItemsConcluidos,
        atualizadaEm: this.dateService.createBrazilDate()
      };

      await this.firebaseService.update(this.VIAGEM_COLLECTION, viagemId, dadosParaAtualizar);
    } catch (error) {
      this.errorHandler.showError('Erro ao sincronizar checklist.');
      throw error;
    }
  }
}
