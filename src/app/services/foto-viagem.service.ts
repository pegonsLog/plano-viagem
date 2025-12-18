import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, deleteDoc, doc, orderBy } from '@angular/fire/firestore';
import { FotoViagem } from '../models/foto-viagem.model';
import { ImageUploadService } from './image-upload.service';

@Injectable({
  providedIn: 'root'
})
export class FotoViagemService {
  private firestore = inject(Firestore);
  private imageUploadService = inject(ImageUploadService);
  
  fotos = signal<FotoViagem[]>([]);
  loading = signal(false);

  async salvarFoto(foto: FotoViagem): Promise<string> {
    const fotosRef = collection(this.firestore, 'fotos');
    const docRef = await addDoc(fotosRef, {
      ...foto,
      criadoEm: new Date()
    });
    return docRef.id;
  }

  async carregarFotos(viagemId: string): Promise<FotoViagem[]> {
    this.loading.set(true);
    try {
      const fotosRef = collection(this.firestore, 'fotos');
      const q = query(
        fotosRef, 
        where('viagemId', '==', viagemId),
        orderBy('data', 'desc')
      );
      const snapshot = await getDocs(q);
      
      const fotos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FotoViagem[];
      
      this.fotos.set(fotos);
      return fotos;
    } finally {
      this.loading.set(false);
    }
  }

  async removerFoto(foto: FotoViagem): Promise<void> {
    if (!foto.id) return;
    
    // Remove do Storage
    try {
      await this.imageUploadService.deleteImage(foto.storagePath);
    } catch (err) {
      console.warn('Erro ao remover imagem do storage:', err);
    }
    
    // Remove do Firestore
    const fotoRef = doc(this.firestore, 'fotos', foto.id);
    await deleteDoc(fotoRef);
    
    // Atualiza lista local
    this.fotos.update(fotos => fotos.filter(f => f.id !== foto.id));
  }
}
