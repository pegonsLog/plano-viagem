import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DiaViagem, DiaCalculado } from '../../models/dia-viagem.model';
import { Viagem } from '../../models/viagem.model';
import { DiaViagemService } from '../../services/dia-viagem.service';
import { ViagemService } from '../../services/viagem.service';
import { DateService } from '../../utils/date.service';
import { ErrorHandlerService } from '../../utils/error-handler.service';

@Component({
  selector: 'app-tabela-dias-planejados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabela-dias-planejados.html',
  styleUrl: './tabela-dias-planejados.scss'
})
export class TabelaDiasPlanejadosComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private diaViagemService = inject(DiaViagemService);
  private viagemService = inject(ViagemService);
  private dateService = inject(DateService);
  private errorHandler = inject(ErrorHandlerService);

  viagemId = signal('');
  viagem = signal<Viagem | null>(null);
  loading = signal(true);
  diaDetalhes = signal<DiaViagem | null>(null);

  diasCalculados = computed(() => {
    const viagemAtual = this.viagem();
    if (!viagemAtual) return [];

    return this.diaViagemService.calcularDiasCalculados(viagemAtual);
  });

  ngOnInit() {
    const viagemIdParam = this.route.snapshot.paramMap.get('id');
    if (viagemIdParam) {
      this.viagemId.set(viagemIdParam);
      this.carregarDados();
    } else {
      this.errorHandler.showError('ID da viagem não encontrado.');
      this.router.navigate(['/']);
    }
  }

  private async carregarDados() {
    try {
      this.loading.set(true);

      // Carregar dados da viagem
      const viagem = this.viagemService.obterViagem(this.viagemId());
      if (viagem) {
        this.viagem.set(viagem);

        // Carregar dias da viagem
        await this.diaViagemService.carregarDiasPorViagem(this.viagemId());
      } else {
        this.errorHandler.showError('Viagem não encontrada.');
        this.router.navigate(['/']);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      this.errorHandler.showError('Erro ao carregar dados da viagem.');
    } finally {
      this.loading.set(false);
    }
  }

  formatarData(data: Date): string {
    return this.dateService.formatDate(data);
  }

  adicionarDia(data: Date) {
    const dataFormatada = this.dateService.formatDateForInput(data);
    this.router.navigate(['/viagem', this.viagemId(), 'dia', 'novo'], {
      queryParams: { data: dataFormatada }
    });
  }

  editarDia(diaId: string) {
    this.router.navigate(['/viagem', this.viagemId(), 'dia', diaId, 'editar']);
  }

  visualizarDetalhes(dia: DiaViagem) {
    this.diaDetalhes.set(dia);
  }

  fecharDetalhes() {
    this.diaDetalhes.set(null);
  }

  voltarParaViagem() {
    this.router.navigate(['/viagem', this.viagemId()]);
  }
}