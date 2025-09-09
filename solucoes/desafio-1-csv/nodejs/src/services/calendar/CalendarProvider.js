import { ICalendarProvider } from '../../interfaces/ICalendarProvider.js';

/**
 * Classe abstrata para provedores de calendário
 * Princípio da Inversão de Dependência (DIP)
 * Implementa ICalendarProvider
 */
export class CalendarProvider extends ICalendarProvider {
  /**
   * Cria um evento no calendário
   * @param {Object} eventData - Dados do evento
   * @param {string} calendarId - ID do calendário (opcional)
   * @returns {Promise<Object>} Evento criado
   * @throws {Error} Se a criação falhar
   */
  async createEvent(eventData, calendarId = 'primary') {
    throw new Error('Método createEvent deve ser implementado pela classe filha');
  }

  /**
   * Verifica se o provedor está autenticado
   * @returns {Promise<boolean>} True se autenticado
   */
  async isAuthenticated() {
    throw new Error('Método isAuthenticated deve ser implementado pela classe filha');
  }

  /**
   * Inicializa o provedor
   * @returns {Promise<void>}
   */
  async initialize() {
    throw new Error('Método initialize deve ser implementado pela classe filha');
  }

  /**
   * Valida dados do evento antes de criar
   * @param {Object} eventData - Dados do evento
   * @throws {Error} Se os dados forem inválidos
   */
  validateEventData(eventData) {
    if (!eventData.nomeevento || !eventData.startDateTime || !eventData.endDateTime) {
      throw new Error('Campos obrigatórios não fornecidos: nomeevento, startDateTime, endDateTime');
    }
  }

  /**
   * Retorna informações sobre o provedor
   * @returns {Object} Informações do provedor
   */
  getProviderInfo() {
    return {
      name: this.constructor.name,
      type: 'unknown'
    };
  }
}
