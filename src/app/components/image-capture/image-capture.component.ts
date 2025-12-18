import { Component, inject, signal, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageUploadService } from '../../services/image-upload.service';
import { IconComponent } from '../icons/icon.component';
import { FotoViagem } from '../../models/foto-viagem.model';

@Component({
  selector: 'app-image-capture',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './image-capture.component.html',
  styleUrl: './image-capture.component.scss'
})
export class ImageCaptureComponent {
  private imageUploadService = inject(ImageUploadService);
  
  viagemId = input.required<string>();
  
  imageUploaded = output<FotoViagem>();
  closed = output<void>();
  
  isOpen = signal(false);
  isMobile = signal(false);
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  uploading = signal(false);
  error = signal<string | null>(null);
  
  // Campos do formulário
  fotoData = signal<string>(this.getTodayDate());
  fotoDescricao = signal<string>('');
  
  constructor() {
    this.checkIfMobile();
  }
  
  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }
  
  private checkIfMobile(): void {
    this.isMobile.set(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }
  
  open(): void {
    this.isOpen.set(true);
    this.error.set(null);
    this.selectedFile.set(null);
    this.previewUrl.set(null);
    this.fotoData.set(this.getTodayDate());
    this.fotoDescricao.set('');
    this.checkIfMobile();
  }
  
  close(): void {
    this.isOpen.set(false);
    this.selectedFile.set(null);
    this.previewUrl.set(null);
    this.error.set(null);
    this.fotoDescricao.set('');
    this.closed.emit();
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processFile(input.files[0]);
    }
  }
  
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }
  
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }
  
  private processFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.error.set('Por favor, selecione apenas arquivos de imagem.');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      this.error.set('A imagem deve ter no máximo 10MB.');
      return;
    }
    
    this.selectedFile.set(file);
    this.error.set(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }
  
  async uploadImage(): Promise<void> {
    const file = this.selectedFile();
    if (!file) return;
    
    if (!this.fotoDescricao()) {
      this.error.set('Por favor, adicione uma descrição para a foto.');
      return;
    }
    
    this.uploading.set(true);
    this.error.set(null);
    
    try {
      const storagePath = this.imageUploadService.generateImagePath(this.viagemId(), file.name);
      const downloadURL = await this.imageUploadService.uploadImage(file, storagePath);
      
      const foto: FotoViagem = {
        viagemId: this.viagemId(),
        url: downloadURL,
        storagePath: storagePath,
        data: this.fotoData(),
        descricao: this.fotoDescricao(),
        criadoEm: new Date()
      };
      
      this.imageUploaded.emit(foto);
      this.close();
    } catch (err) {
      console.error('Erro ao fazer upload:', err);
      this.error.set('Erro ao fazer upload da imagem. Tente novamente.');
    } finally {
      this.uploading.set(false);
    }
  }
  
  removePreview(): void {
    this.selectedFile.set(null);
    this.previewUrl.set(null);
  }
  
  updateData(value: string): void {
    this.fotoData.set(value);
  }
  
  updateDescricao(value: string): void {
    this.fotoDescricao.set(value);
  }

  setFile(file: File): void {
    this.processFile(file);
  }
}
