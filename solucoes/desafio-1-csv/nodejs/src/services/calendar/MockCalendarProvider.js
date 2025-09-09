import { CalendarProvider } from './CalendarProvider.js';
import { ValidationUtils } from '../../utils/ValidationUtils.js';

/**
 * Provedor mock de calendário para testes
 * Implementa CalendarProvider seguindo o princípio da Inversão de Dependência (DIP)
 */
export class MockCalendarProvider extends CalendarProvider {
  constructor() {
    super();
    this.events = [];
    this.nextId = 1;
  }

  /**
   * Inicializa o provedor mock
   */
  async initialize() {
    console.log('🔧 MockCalendarProvider inicializado');
  }

  /**
   * Cria um evento mock
   * @param {Object} eventData - Dados do evento
   * @param {string} calendarId - ID do calendário (ignorado no mock)
   * @returns {Promise<Object>} Evento mock criado
   */
  async createEvent(eventData, calendarId = 'primary') {
    // Validar dados
    this.validateEventData(eventData);
    ValidationUtils.validateCalendarEventData(eventData);

    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const event = {
      id: `mock-event-${this.nextId++}`,
      summary: eventData.nomeevento,
      start: {
        dateTime: eventData.startDateTime,
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: eventData.endDateTime,
        timeZone: 'America/Sao_Paulo',
      },
      reminders: {
        useDefault: false,
        overrides: [{
          method: 'popup',
          minutes: eventData.notificacao || 0,
        }],
      },
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      status: 'confirmed'
    };

    this.events.push(event);
    console.log(`📅 [MOCK] Evento criado: ${event.summary} (${event.id})`);
    return event;
  }

  /**
   * Verifica se o provedor está autenticado (sempre true para mock)
   * @returns {Promise<boolean>} Sempre true
   */
  async isAuthenticated() {
    return true;
  }

  /**
   * Retorna todos os eventos mock criados
   * @returns {Array} Array de eventos mock
   */
  getEvents() {
    return [...this.events];
  }

  /**
   * Retorna o número de eventos mock criados
   * @returns {number} Número de eventos
   */
  getEventsCount() {
    return this.events.length;
  }

  /**
   * Limpa todos os eventos mock
   */
  clearEvents() {
    this.events = [];
    this.nextId = 1;
    console.log('🧹 Eventos mock limpos');
  }

  /**
   * Retorna informações sobre o provedor
   * @returns {Object} Informações do provedor
   */
  getProviderInfo() {
    return {
      name: 'MockCalendarProvider',
      type: 'mock',
      authenticated: true,
      eventsCount: this.events.length
    };
  }
}
