import { Component, OnInit, WritableSignal, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ChecklistItem } from '../../models/checklist-item.model';
import { ChecklistService } from '../../services/checklist';

@Component({
  selector: 'app-checklist-viagem',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checklist-viagem.html',
  styleUrls: ['./checklist-viagem.scss']
})
export class ChecklistViagemComponent implements OnInit {
  viagemId!: string;

  private checklistService = inject(ChecklistService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  checklistItems$!: Observable<ChecklistItem[]>;
  itemForm: FormGroup;

  loading: WritableSignal<boolean> = signal(true);
  isFormularioAberto: WritableSignal<boolean> = signal(false);
  itemSelecionado: WritableSignal<ChecklistItem | null> = signal(null);
  isConfirmacaoRemoverAberto: WritableSignal<boolean> = signal(false);
  itemParaRemoverId: WritableSignal<string | null> = signal(null);

  constructor() {
    this.itemForm = this.fb.group({
      descricao: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.viagemId = id;
      this.carregarItens();
    } else {
      console.error('ID da viagem não encontrado na rota.');
      this.loading.set(false);
    }
  }

  carregarItens(): void {
    this.loading.set(true);
    this.checklistItems$ = this.checklistService.getChecklistItems(this.viagemId);
    this.checklistItems$.subscribe(() => this.loading.set(false));
  }

  abrirFormulario(item: ChecklistItem | null = null): void {
    if (item) {
      this.itemSelecionado.set(item);
      this.itemForm.patchValue({ descricao: item.descricao });
    } else {
      this.itemSelecionado.set(null);
      this.itemForm.reset();
    }
    this.isFormularioAberto.set(true);
  }

  fecharFormulario(): void {
    this.isFormularioAberto.set(false);
    this.itemSelecionado.set(null);
    this.itemForm.reset();
  }

  async salvarItem(): Promise<void> {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const { descricao } = this.itemForm.value;
    const itemAtual = this.itemSelecionado();

    if (!this.viagemId) {
      console.error('ID da viagem é indefinido. Não é possível salvar o item.');
      return;
    }

    try {
      if (itemAtual) {
        await this.checklistService.atualizarItem(itemAtual.id, descricao);
      } else {
        await this.checklistService.adicionarItem({ descricao }, this.viagemId);
      }
      this.fecharFormulario();
    } catch (error) {
      console.error('Erro ao salvar item', error);
    }
  }

  toggleConcluido(itemId: string, concluido: boolean): void {
    this.checklistService.toggleConcluido(itemId, this.viagemId, concluido);
  }

  abrirConfirmacaoRemover(itemId: string): void {
    this.itemParaRemoverId.set(itemId);
    this.isConfirmacaoRemoverAberto.set(true);
  }

  fecharConfirmacaoRemover(): void {
    this.itemParaRemoverId.set(null);
    this.isConfirmacaoRemoverAberto.set(false);
  }

  confirmarRemocao(): void {
    const itemId = this.itemParaRemoverId();
    if (itemId && this.viagemId) {
      this.checklistService.removerItem(itemId, this.viagemId);
    }
    this.fecharConfirmacaoRemover();
  }

  trackById(index: number, item: ChecklistItem): string {
    return item.id;
  }

  voltarParaLista(): void {
    this.router.navigate(['/lista-viagens']);
  }
}
