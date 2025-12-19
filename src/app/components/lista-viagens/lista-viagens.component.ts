import { Component, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ViagemService } from '../../services/viagem.service';
import { Viagem } from '../../models/viagem.model';
import { FormularioViagemComponent } from '../formulario-viagem/formulario-viagem.component';
import { IconComponent } from '../icons/icon.component';
import { DateService } from '../../utils/date.service';
import { ImageCaptureComponent } from '../image-capture/image-capture.component';
import { GaleriaFotosComponent } from '../galeria-fotos/galeria-fotos.component';
import { GaleriaGeralComponent } from '../galeria-geral/galeria-geral.component';
import { FotoViagemService } from '../../services/foto-viagem.service';
import { FotoViagem } from '../../models/foto-viagem.model';

@Component({
  selector: 'app-lista-viagens',
  standalone: true,
  imports: [CommonModule, FormularioViagemComponent, IconComponent, ImageCaptureComponent, GaleriaFotosComponent, GaleriaGeralComponent],
  templateUrl: './lista-viagens.component.html',
  styleUrl: './lista-viagens.component.scss'
})
export class ListaViagensComponent {
  viagemService = inject(ViagemService);
  private router = inject(Router);
  private dateService = inject(DateService);
  private fotoService = inject(FotoViagemService);
  
  mostrarFormulario = false;
  viagemParaEditar: Viagem | null = null;
  
  // Fotos
  viagemIdParaFoto: string | null = null;
  viagemTituloParaFoto: string = '';
  
  imageCapture = viewChild<ImageCaptureComponent>('imageCapture');
  galeriaFotos = viewChild<GaleriaFotosComponent>('galeriaFotos');
  galeriaGeral = viewChild<GaleriaGeralComponent>('galeriaGeral');



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

  verChecklist(viagemId: string) {
    this.router.navigate(['/viagem', viagemId, 'checklist']);
  }

  verGastos(viagemId: string) {
    this.router.navigate(['/viagem', viagemId, 'gastos']);
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

  // Métodos de fotos
  abrirCaptura(viagem: Viagem): void {
    this.viagemIdParaFoto = viagem.id;
    this.viagemTituloParaFoto = viagem.titulo;
    // Aguarda o Angular renderizar o componente
    setTimeout(() => this.imageCapture()?.open(), 0);
  }

  abrirGaleria(viagem: Viagem): void {
    this.viagemIdParaFoto = viagem.id;
    this.viagemTituloParaFoto = viagem.titulo;
    // Aguarda o Angular renderizar o componente
    setTimeout(() => this.galeriaFotos()?.open(), 0);
  }

  async onFotoSalva(foto: FotoViagem): Promise<void> {
    try {
      await this.fotoService.salvarFoto(foto);
      // Recarrega a galeria se estiver aberta
      this.galeriaFotos()?.recarregarFotos();
    } catch (err) {
      console.error('Erro ao salvar foto:', err);
    }
  }

  onGaleriaAddPhoto(file: File): void {
    const capture = this.imageCapture();
    if (capture) {
      capture.open();
      capture.setFile(file);
    }
  }

  abrirGaleriaGeral(): void {
    this.galeriaGeral()?.open();
  }
}
