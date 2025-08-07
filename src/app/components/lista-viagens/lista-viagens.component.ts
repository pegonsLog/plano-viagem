import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ViagemService } from '../../services/viagem.service';
import { Viagem } from '../../models/viagem.model';
import { FormularioViagemComponent } from '../formulario-viagem/formulario-viagem.component';
import { DateService } from '../../utils/date.service';

@Component({
  selector: 'app-lista-viagens',
  standalone: true,
  imports: [CommonModule, FormularioViagemComponent],
  templateUrl: './lista-viagens.component.html',
  styleUrl: './lista-viagens.component.scss'
})
export class ListaViagensComponent {
  viagemService = inject(ViagemService);
  private router = inject(Router);
  private dateService = inject(DateService);
  mostrarFormulario = false;
  viagemParaEditar: Viagem | null = null;

  onViagemCriada() {
    this.mostrarFormulario = false;
    this.viagemParaEditar = null;
  }

  onViagemAtualizada() {
    this.mostrarFormulario = false;
    this.viagemParaEditar = null;
  }

  onCancelar() {
    this.mostrarFormulario = false;
    this.viagemParaEditar = null;
  }

  verDetalhesViagem(viagemId: string) {
    this.router.navigate(['/viagem', viagemId]);
  }

  verTabelaDias(viagemId: string) {
    this.router.navigate(['/viagem', viagemId, 'tabela-dias']);
  }

  verRelatorio(viagemId: string) {
    this.router.navigate(['/viagem', viagemId, 'relatorio']);
  }

  editarViagem(viagem: Viagem) {
    this.viagemParaEditar = viagem;
    this.mostrarFormulario = true;
  }

  async removerViagem(id: string) {
    if (confirm('Tem certeza que deseja remover esta viagem?')) {
      try {
        await this.viagemService.removerViagem(id);
      } catch (error) {
        // Erro já tratado no serviço
        console.error('Erro ao remover viagem:', error);
      }
    }
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'planejada': 'Planejada',
      'em-andamento': 'Em Andamento',
      'concluida': 'Concluída',
      'cancelada': 'Cancelada'
    };
    return labels[status] || status;
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
}