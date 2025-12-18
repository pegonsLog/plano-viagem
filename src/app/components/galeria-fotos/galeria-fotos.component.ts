import { Component, inject, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icons/icon.component';
import { FotoViagemService } from '../../services/foto-viagem.service';
import { ImageUploadService } from '../../services/image-upload.service';
import { FotoViagem } from '../../models/foto-viagem.model';

@Component({
  selector: 'app-galeria-fotos',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './galeria-fotos.component.html',
  styleUrl: './galeria-fotos.component.scss'
})
export class GaleriaFotosComponent {
  private fotoService = inject(FotoViagemService);
  private imageUploadService = inject(ImageUploadService);
  
  viagemId = input.required<string>();
  viagemTitulo = input<string>('');
  
  closed = output<void>();
  addPhoto = output<File>();
  
  isOpen = signal(false);
  fotos = signal<FotoViagem[]>([]);
  loading = signal(false);
  fotoSelecionada = signal<FotoViagem | null>(null);
  confirmandoRemocao = signal<FotoViagem | null>(null);
  uploading = signal(false);

  async open(): Promise<void> {
    this.isOpen.set(true);
    this.loading.set(true);
    
    try {
      const fotos = await this.fotoService.carregarFotos(this.viagemId());
      this.fotos.set(fotos);
    } catch (err) {
      console.error('Erro ao carregar fotos:', err);
    } finally {
      this.loading.set(false);
    }
  }

  close(): void {
    this.isOpen.set(false);
    this.fotoSelecionada.set(null);
    this.confirmandoRemocao.set(null);
    this.closed.emit();
  }

  abrirFoto(foto: FotoViagem): void {
    this.fotoSelecionada.set(foto);
  }

  fecharFoto(): void {
    this.fotoSelecionada.set(null);
  }

  confirmarRemocao(foto: FotoViagem, event: Event): void {
    event.stopPropagation();
    this.confirmandoRemocao.set(foto);
  }

  cancelarRemocao(): void {
    this.confirmandoRemocao.set(null);
  }

  async removerFoto(): Promise<void> {
    const foto = this.confirmandoRemocao();
    if (!foto) return;

    try {
      await this.fotoService.removerFoto(foto);
      this.fotos.update(fotos => fotos.filter(f => f.id !== foto.id));
      this.confirmandoRemocao.set(null);
      
      if (this.fotoSelecionada()?.id === foto.id) {
        this.fotoSelecionada.set(null);
      }
    } catch (err) {
      console.error('Erro ao remover foto:', err);
    }
  }

  adicionarFoto(): void {
    // Não usado mais, mantido por compatibilidade
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 10MB.');
        return;
      }
      
      this.addPhoto.emit(file);
      input.value = ''; // Limpa o input para permitir selecionar o mesmo arquivo novamente
    }
  }

  formatarData(data: string): string {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  recarregarFotos(): void {
    this.open();
  }
}
