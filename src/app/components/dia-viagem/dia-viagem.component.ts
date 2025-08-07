import { Component, input, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DiaCalculado, DiaViagem } from '../../models/dia-viagem.model';
import { DiaViagemService } from '../../services/dia-viagem.service';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { DateService } from '../../utils/date.service';

@Component({
  selector: 'app-dia-viagem',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dia-viagem.component.html',
  styleUrl: './dia-viagem.component.scss'
})
export class DiaViagemComponent {
  diaCalculado = input.required<DiaCalculado>();
  viagemId = input.required<string>();

  expandido = signal(false);

  private router = inject(Router);
  private diaViagemService = inject(DiaViagemService);
  private errorHandler = inject(ErrorHandlerService);
  private dateService = inject(DateService);

  isFimDeSemana(): boolean {
    return this.diaViagemService.isFimDeSemana(this.diaCalculado().data);
  }

  toggleExpansao(): void {
    this.expandido.update(value => !value);
  }

  adicionarDetalhes(): void {
    const dataFormatada = this.dateService.formatDateForInput(this.diaCalculado().data);
    this.router.navigate(['/viagem', this.viagemId(), 'dia', 'novo'], {
      queryParams: { data: dataFormatada }
    });
  }

  editarDia(): void {
    if (this.diaCalculado().detalhes) {
      this.router.navigate(['/viagem', this.viagemId(), 'dia', this.diaCalculado().detalhes!.id, 'editar']);
    }
  }

  async removerDia(): Promise<void> {
    if (this.diaCalculado().detalhes && confirm('Tem certeza que deseja remover os detalhes deste dia?')) {
      try {
        await this.diaViagemService.removerDia(this.diaCalculado().detalhes!.id);
        this.errorHandler.showInfo('Detalhes do dia removidos com sucesso!');
      } catch (error) {
        console.error('Erro ao remover dia:', error);
        // Erro já tratado no serviço
      }
    }
  }

  formatarData(data: Date): string {
    return this.dateService.formatDate(data);
  }

  formatarTransporte(transporte: string): string {
    const transporteMap: Record<string, string> = {
      'Avião': 'Avião',
      'Carro': 'Carro',
      'Ônibus': 'Ônibus',
      'Trem': 'Trem',
      'Metro': 'Metrô',
      'Táxi': 'Táxi',
      'Uber': 'Uber/App',
      'A pé': 'A pé',
      'Bicicleta': 'Bicicleta',
      'Barco': 'Barco',
      'Outro': 'Outro',
      'N/A': 'N/A'
    };
    return transporteMap[transporte] || transporte;
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  formatarValorParcela(valor: number | string): string {
    // Se já é uma string formatada, retorna como está
    if (typeof valor === 'string') {
      return valor;
    }
    // Se é um número, formata como moeda
    if (typeof valor === 'number') {
      return this.formatarMoeda(valor);
    }
    return '(Não informado)';
  }

  formatarLinksHospedagem(links: string): { url: string; texto: string }[] {
    if (!links || links.trim() === '') {
      return [];
    }

    const linksValidos = links
      .split('\n')
      .map(link => link.trim())
      .filter(link => link.length > 0)
      .filter(link => {
        // Validar se é um link válido (começa com http/https ou www)
        return link.startsWith('http://') ||
          link.startsWith('https://') ||
          link.startsWith('www.') ||
          link.includes('.');
      });

    return linksValidos.map((link, index) => ({
      url: link.startsWith('http://') || link.startsWith('https://') ? link : 'https://' + link,
      texto: linksValidos.length === 1 ? 'Acesse aqui' : `Acesse aqui link ${index + 1}`
    }));
  }
}