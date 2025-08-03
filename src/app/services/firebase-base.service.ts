import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  DocumentData,
  QueryConstraint
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseBaseService {
  private firestore = inject(Firestore);

  // Criar documento
  async create<T>(collectionName: string, data: T): Promise<string> {
    const collectionRef = collection(this.firestore, collectionName);
    const docRef = await addDoc(collectionRef, data as DocumentData);
    return docRef.id;
  }

  // Obter todos os documentos
  getAll<T>(collectionName: string, ...constraints: QueryConstraint[]): Observable<T[]> {
    const collectionRef = collection(this.firestore, collectionName);
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as T))
      )
    );
  }

  // Obter documento por ID
  getById<T>(collectionName: string, id: string): Observable<T | null> {
    const docRef = doc(this.firestore, collectionName, id);
    return from(getDoc(docRef)).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          return {
            id: docSnap.id,
            ...docSnap.data()
          } as T;
        }
        return null;
      })
    );
  }

  // Atualizar documento
  async update(collectionName: string, id: string, data: Partial<any>): Promise<void> {
    const docRef = doc(this.firestore, collectionName, id);
    await updateDoc(docRef, data);
  }

  // Deletar documento
  async delete(collectionName: string, id: string): Promise<void> {
    const docRef = doc(this.firestore, collectionName, id);
    await deleteDoc(docRef);
  }

  // Obter documentos com filtro
  getWhere<T>(
    collectionName: string, 
    field: string, 
    operator: any, 
    value: any,
    ...additionalConstraints: QueryConstraint[]
  ): Observable<T[]> {
    const collectionRef = collection(this.firestore, collectionName);
    const constraints = [where(field, operator, value), ...additionalConstraints];
    const q = query(collectionRef, ...constraints);
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as T))
      )
    );
  }

  // Converter Timestamp do Firebase para Date
  convertTimestampToDate(timestamp: any): Date {
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate();
    }
    return timestamp instanceof Date ? timestamp : new Date(timestamp);
  }

  // Preparar dados para o Firebase (converter Dates)
  prepareDataForFirebase(data: any): any {
    const prepared = { ...data };
    
    // Converter todas as propriedades Date para Timestamp
    Object.keys(prepared).forEach(key => {
      if (prepared[key] instanceof Date) {
        // Manter como Date, o Firebase converterá automaticamente
        prepared[key] = prepared[key];
      }
    });
    
    return prepared;
  }
}