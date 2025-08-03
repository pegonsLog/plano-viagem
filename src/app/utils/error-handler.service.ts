import { Injectable, signal, inject } from '@angular/core';
import { DateService } from './date.service';

export interface ErrorMessage {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private dateService = inject(DateService);
  private errorsSignal = signal<ErrorMessage[]>([]);
  
  readonly errors = this.errorsSignal.asReadonly();

  showError(message: string): void {
    this.addError(message, 'error');
  }

  showWarning(message: string): void {
    this.addError(message, 'warning');
  }

  showInfo(message: string): void {
    this.addError(message, 'info');
  }

  clearError(id: string): void {
    this.errorsSignal.update(errors => 
      errors.filter(error => error.id !== id)
    );
  }

  clearAllErrors(): void {
    this.errorsSignal.set([]);
  }

  private addError(message: string, type: ErrorMessage['type']): void {
    const error: ErrorMessage = {
      id: this.generateId(),
      message,
      type,
      timestamp: this.dateService.createBrazilDate()
    };

    this.errorsSignal.update(errors => [...errors, error]);

    // Auto-remove após 5 segundos para info e warning
    if (type !== 'error') {
      setTimeout(() => {
        this.clearError(error.id);
      }, 5000);
    }
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}