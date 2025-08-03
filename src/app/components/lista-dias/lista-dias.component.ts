import { Component, input, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiaCalculado } from '../../models/dia-viagem.model';
import { DiaViagemService } from '../../services/dia-viagem.service';
import { DiaViagemComponent } from '../dia-viagem/dia-viagem.component';

@Component({
  selector: 'app-lista-dias',
  standalone: true,
  imports: [CommonModule, DiaViagemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lista-dias.component.html',
  styleUrl: './lista-dias.component.scss'
})
export class ListaDiasComponent {
  diasCalculados = input.required<DiaCalculado[]>();
  viagemId = input.required<string>();

  private diaViagemService = inject(DiaViagemService);

  trackByData(index: number, dia: DiaCalculado): number {
    return dia.data.getTime();
  }
}