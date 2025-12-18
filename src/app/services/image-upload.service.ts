import { Injectable, inject, signal } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private storage = inject(Storage);
  
  uploading = signal(false);
  uploadProgress = signal(0);
  
  async uploadImage(file: File, path: string): Promise<string> {
    this.uploading.set(true);
    this.uploadProgress.set(0);
    
    try {
      const storageRef = ref(this.storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      this.uploadProgress.set(100);
      return downloadURL;
    } finally {
      this.uploading.set(false);
    }
  }
  
  async deleteImage(path: string): Promise<void> {
    const storageRef = ref(this.storage, path);
    await deleteObject(storageRef);
  }
  
  generateImagePath(viagemId: string, fileName: string): string {
    const timestamp = Date.now();
    const extension = fileName.split('.').pop() || 'jpg';
    return `viagens/${viagemId}/fotos/${timestamp}.${extension}`;
  }
}
