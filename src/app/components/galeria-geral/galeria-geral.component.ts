import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icons/icon.component';
import { FotoViagem } from '../../models/foto-viagem.model';
import { Firestore, collection, query, orderBy, getDocs } from '@angular/fire/firestore';
import { FotoViagemService } from '../../services/foto-viagem.service';

@Component({
  selector: 'app-galeria-geral',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './galeria-geral.component.html',
  styleUrl: './galeria-geral.component.scss'
})
export class GaleriaGeralComponent {
  private firestore = inject(Firestore);
  private fotoService = inject(FotoViagemService);
  
  isOpen = signal(false);
  fotos = signal<FotoViagem[]>([]);
  loading = signal(false);
  fotoSelecionada = signal<FotoViagem | null>(null);
  confirmandoRemocao = signal<FotoViagem | null>(null);

  async open(): Promise<void> {
    this.isOpen.set(true);
    this.loading.set(true);
    
    try {
      const fotosRef = collection(this.firestore, 'fotos');
      const q = query(fotosRef, orderBy('data', 'desc'));
      const snapshot = await getDocs(q);
      
      const fotos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FotoViagem[];
      
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

  formatarData(data: string): string {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }
}
