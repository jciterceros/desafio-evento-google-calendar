import { Event } from './Event.js';

/**
 * Modelo de domínio para Evento de Calendário
 * Representa um evento processado e pronto para ser criado no calendário
 */
export class CalendarEvent {
  constructor(event, startDateTime, endDateTime) {
    if (!(event instanceof Event)) {
      throw new Error('Event deve ser uma instância da classe Event');
    }
    
    this.event = event;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
  }

  /**
   * Valida se o evento de calendário está completo
   */
  isValid() {
    return !!(
      this.event &&
      this.event.isValid() &&
      this.startDateTime instanceof Date &&
      this.endDateTime instanceof Date &&
      this.endDateTime > this.startDateTime
    );
  }

  /**
   * Converte para formato do Google Calendar
   */
  toGoogleCalendarFormat() {
    if (!this.isValid()) {
      throw new Error('Evento de calendário inválido');
    }

    return {
      summary: this.event.nomeevento,
      start: {
        dateTime: this.startDateTime.toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: this.endDateTime.toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      reminders: {
        useDefault: false,
        overrides: [{
          method: 'popup',
          minutes: this.event.notificacao || 0,
        }],
      },
    };
  }

  /**
   * Converte para formato de dados processados
   */
  toProcessedData() {
    return {
      nomeevento: this.event.nomeevento,
      startDateTime: this.startDateTime.toISOString(),
      endDateTime: this.endDateTime.toISOString(),
      notificacao: this.event.notificacao
    };
  }

  /**
   * Retorna uma representação string do evento de calendário
   */
  toString() {
    return `CalendarEvent: ${this.event.nomeevento} - ${this.startDateTime.toISOString()} até ${this.endDateTime.toISOString()}`;
  }
}
