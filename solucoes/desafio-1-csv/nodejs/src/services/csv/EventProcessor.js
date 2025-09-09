import { DateUtils } from '../../utils/DateUtils.js';
import { ValidationUtils } from '../../utils/ValidationUtils.js';
import { Event } from '../../models/Event.js';
import { CalendarEvent } from '../../models/CalendarEvent.js';
import { IEventProcessor } from '../../interfaces/IEventProcessor.js';

/**
 * Serviço responsável por processar eventos e convertê-los para formato de calendário
 * Princípio da Responsabilidade Única (SRP)
 * Implementa IEventProcessor
 */
export class EventProcessor extends IEventProcessor {
  constructor() {
    super();
  }
  /**
   * Processa um evento individual
   * @param {Event} event - Evento para processar
   * @returns {Object} Resultado do processamento
   */
  processEvent(event) {
    try {
      // Validar evento antes de processar
      ValidationUtils.validateEvent(event.toObject());
      
      // Converter horário para Date
      const startDateTime = DateUtils.parseDateTime(event.horario);
      
      // Calcular horário de fim
      const endDateTime = DateUtils.calculateEndTime(startDateTime, event.duracao);
      
      // Criar evento de calendário
      const calendarEvent = new CalendarEvent(event, startDateTime, endDateTime);
      
      return {
        success: true,
        data: calendarEvent.toProcessedData(),
        calendarEvent: calendarEvent,
        originalData: event.toObject()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        originalData: event.toObject()
      };
    }
  }

  /**
   * Processa múltiplos eventos
   * @param {Array<Event>} events - Array de eventos para processar
   * @returns {Object} Resultado do processamento
   */
  processEvents(events) {
    const processedEvents = events.map(event => this.processEvent(event));
    
    const successfulEvents = processedEvents.filter(e => e.success);
    const failedEvents = processedEvents.filter(e => !e.success);
    
    return {
      processedEvents,
      successfulEvents,
      failedEvents,
      totalProcessed: processedEvents.length,
      totalSuccessful: successfulEvents.length,
      totalFailed: failedEvents.length
    };
  }

}
