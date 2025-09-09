import { GoogleCalendarProvider } from '../services/calendar/GoogleCalendarProvider.js';
import { MockCalendarProvider } from '../services/calendar/MockCalendarProvider.js';
import { ConfigurationError } from '../errors/AppErrors.js';

/**
 * Factory para criação de provedores de calendário
 * Implementa o padrão Factory para desacoplar a criação de objetos
 * Princípio da Inversão de Dependência (DIP)
 */
export class CalendarProviderFactory {
  /**
   * Cria um provedor de calendário baseado nos parâmetros
   * @param {boolean} useMock - Se deve usar mock ou provedor real
   * @param {Object} credentials - Credenciais para provedor real
   * @returns {ICalendarProvider} Instância do provedor
   * @throws {ConfigurationError} Se as credenciais não forem fornecidas para provedor real
   */
  static create(useMock = false, credentials = null) {
    if (useMock) {
      return new MockCalendarProvider();
    }
    
    if (!credentials) {
      throw new ConfigurationError(
        'Credenciais são obrigatórias para provedor real',
        'credentials'
      );
    }
    
    return new GoogleCalendarProvider(credentials);
  }

  /**
   * Cria um provedor mock
   * @returns {MockCalendarProvider} Instância do provedor mock
   */
  static createMock() {
    return new MockCalendarProvider();
  }

  /**
   * Cria um provedor Google Calendar
   * @param {Object} credentials - Credenciais do Google
   * @returns {GoogleCalendarProvider} Instância do provedor Google
   * @throws {ConfigurationError} Se as credenciais não forem fornecidas
   */
  static createGoogle(credentials) {
    if (!credentials) {
      throw new ConfigurationError(
        'Credenciais são obrigatórias para GoogleCalendarProvider',
        'credentials'
      );
    }
    
    return new GoogleCalendarProvider(credentials);
  }

  /**
   * Lista os tipos de provedores disponíveis
   * @returns {Array<string>} Array com os tipos disponíveis
   */
  static getAvailableTypes() {
    return ['mock', 'google'];
  }

  /**
   * Verifica se um tipo de provedor é suportado
   * @param {string} type - Tipo do provedor
   * @returns {boolean} True se suportado
   */
  static isTypeSupported(type) {
    return this.getAvailableTypes().includes(type);
  }
}
