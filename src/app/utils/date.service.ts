import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private readonly BRAZIL_LOCALE = 'pt-BR';

  /**
   * Cria uma nova data local (sem conversão de fuso horário)
   */
  createLocalDate(date?: string | number | Date): Date {
    if (!date) {
      return new Date();
    }
    
    if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // String no formato YYYY-MM-DD - cria data local sem ajuste de timezone
      const [year, month, day] = date.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    
    return new Date(date);
  }

  /**
   * Alias para createLocalDate - mantido para compatibilidade
   */
  createBrazilDate(date?: string | number | Date): Date {
    return this.createLocalDate(date);
  }

  /**
   * Formata uma data para exibição no padrão brasileiro (DD/MM/YYYY)
   * Usa a data local sem conversão de timezone
   */
  formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      // Se for string YYYY-MM-DD, formata diretamente
      if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
      }
      date = new Date(date);
    }
    
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Formata uma data com dia da semana para exibição
   */
  formatDateWithWeekday(date: Date | string): string {
    const d = typeof date === 'string' ? this.createLocalDate(date) : new Date(date);
    const weekday = this.getWeekdayName(d);
    const formatted = this.formatDate(d);
    return `${weekday}, ${formatted}`;
  }

  /**
   * Formata uma data para input HTML (YYYY-MM-DD)
   */
  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Cria uma data a partir de uma string de input (YYYY-MM-DD)
   * Retorna a data local sem ajuste de timezone
   */
  createDateFromInput(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  /**
   * Retorna a data de hoje no formato YYYY-MM-DD
   */
  getTodayString(): string {
    return this.formatDateForInput(new Date());
  }

  /**
   * Calcula o dia da semana em português
   */
  getWeekdayName(date: Date): string {
    const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return weekdays[date.getDay()];
  }

  /**
   * Verifica se é fim de semana
   */
  isWeekend(date: Date): boolean {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  /**
   * Calcula a diferença em dias entre duas datas
   */
  getDaysDifference(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
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
    const current = new Date(startDate);
    const end = new Date(endDate);
    
    current.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  }

  /**
   * Normaliza uma data para meia-noite
   */
  normalizeDate(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }
}
