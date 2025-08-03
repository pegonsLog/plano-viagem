import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private readonly BRAZIL_TIMEZONE = 'America/Sao_Paulo';
  private readonly BRAZIL_LOCALE = 'pt-BR';

  /**
   * Cria uma nova data no fuso horário do Brasil
   */
  createBrazilDate(date?: string | number | Date): Date {
    if (!date) {
      // Retorna a data atual no fuso horário do Brasil
      return new Date(new Date().toLocaleString('en-US', { timeZone: this.BRAZIL_TIMEZONE }));
    }
    
    if (typeof date === 'string' && date.includes('T')) {
      // Se é uma string ISO, converte para o fuso horário do Brasil
      return new Date(new Date(date).toLocaleString('en-US', { timeZone: this.BRAZIL_TIMEZONE }));
    }
    
    return new Date(date);
  }

  /**
   * Formata uma data para exibição no padrão brasileiro
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString(this.BRAZIL_LOCALE, {
      timeZone: this.BRAZIL_TIMEZONE
    });
  }

  /**
   * Formata uma data com dia da semana para exibição
   */
  formatDateWithWeekday(date: Date): string {
    return new Date(date).toLocaleDateString(this.BRAZIL_LOCALE, {
      timeZone: this.BRAZIL_TIMEZONE,
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  /**
   * Formata uma data para input HTML (YYYY-MM-DD)
   */
  formatDateForInput(date: Date): string {
    // Converte para o fuso horário do Brasil antes de formatar
    const brazilDate = new Date(date.toLocaleString('en-US', { timeZone: this.BRAZIL_TIMEZONE }));
    const year = brazilDate.getFullYear();
    const month = String(brazilDate.getMonth() + 1).padStart(2, '0');
    const day = String(brazilDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Cria uma data a partir de uma string de input (YYYY-MM-DD)
   */
  createDateFromInput(dateString: string): Date {
    // Cria a data assumindo o fuso horário do Brasil
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  /**
   * Calcula o dia da semana em português
   */
  getWeekdayName(date: Date): string {
    return new Date(date).toLocaleDateString(this.BRAZIL_LOCALE, {
      timeZone: this.BRAZIL_TIMEZONE,
      weekday: 'long'
    });
  }

  /**
   * Verifica se é fim de semana
   */
  isWeekend(date: Date): boolean {
    const brazilDate = new Date(date.toLocaleString('en-US', { timeZone: this.BRAZIL_TIMEZONE }));
    const dayOfWeek = brazilDate.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Domingo ou Sábado
  }

  /**
   * Calcula a diferença em dias entre duas datas
   */
  getDaysDifference(startDate: Date, endDate: Date): number {
    const start = new Date(startDate.toLocaleString('en-US', { timeZone: this.BRAZIL_TIMEZONE }));
    const end = new Date(endDate.toLocaleString('en-US', { timeZone: this.BRAZIL_TIMEZONE }));
    
    // Normaliza as datas para meia-noite
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  /**
   * Gera array de datas entre duas datas
   */
  getDateRange(startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = [];
    const current = new Date(startDate.toLocaleString('en-US', { timeZone: this.BRAZIL_TIMEZONE }));
    const end = new Date(endDate.toLocaleString('en-US', { timeZone: this.BRAZIL_TIMEZONE }));
    
    // Normaliza as datas
    current.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  }

  /**
   * Normaliza uma data para meia-noite no fuso horário do Brasil
   */
  normalizeDate(date: Date): Date {
    const brazilDate = new Date(date.toLocaleString('en-US', { timeZone: this.BRAZIL_TIMEZONE }));
    brazilDate.setHours(0, 0, 0, 0);
    return brazilDate;
  }
}