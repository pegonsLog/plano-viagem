import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ViagemService } from '../../services/viagem.service';
import { DiaViagemService } from '../../services/dia-viagem.service';
import { Viagem } from '../../models/viagem.model';
import { DiaCalculado } from '../../models/dia-viagem.model';
import { ListaDiasComponent } from '../lista-dias/lista-dias.component';
import { DateService } from '../../utils/date.service';

@Component({
  selector: 'app-detalhes-viagem',
  standalone: true,
  imports: [CommonModule, ListaDiasComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detalhes-viagem.component.html',
  styleUrl: './detalhes-viagem.component.scss'
})
export class DetalhesViagemComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private viagemService = inject(ViagemService);
  private diaViagemService = inject(DiaViagemService);
  private dateService = inject(DateService);

  viagem = signal<Viagem | null>(null);

  diasCalculados = computed(() => {
    const viagemData = this.viagem();
    if (!viagemData) return [];
    return this.diaViagemService.calcularDiasCalculados(viagemData);
  });

  totalDias = computed(() => {
    const viagemData = this.viagem();
    if (!viagemData) return 0;
    return this.dateService.getDaysDifference(viagemData.dataInicio, viagemData.dataFim);
  });

  diasComDetalhes = computed(() => {
    return this.diasCalculados().filter(dia => dia.temDetalhes).length;
  });

  diasSemDetalhes = computed(() => {
    return this.diasCalculados().filter(dia => !dia.temDetalhes).length;
  });

  diasConcluidos = computed(() => {
    return this.diasCalculados().filter(dia => 
      dia.temDetalhes && dia.detalhes?.status !== 'Pendente'
    ).length;
  });

  diasComPendencia = computed(() => {
    return this.diasCalculados().filter(dia => 
      dia.temDetalhes && dia.detalhes?.status === 'Pendente'
    ).length;
  });

  ngOnInit() {
    const viagemId = this.route.snapshot.paramMap.get('id');
    if (viagemId) {
      const viagemData = this.viagemService.obterViagem(viagemId);
      if (viagemData) {
        this.viagem.set(viagemData);
      }
    }
  }

  voltarParaLista() {
    this.router.navigate(['/']);
  }

  formatarData(data: Date): string {
    return this.dateService.formatDate(data);
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  verTabelaDias() {
    const viagemData = this.viagem();
    if (viagemData) {
      this.router.navigate(['/viagem', viagemData.id, 'tabela-dias']);
    }
  }

  verRelatorio() {
    const viagemData = this.viagem();
    if (viagemData) {
      this.router.navigate(['/viagem', viagemData.id, 'relatorio']);
    }
  }
}