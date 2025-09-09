import { google } from 'googleapis';
import { CalendarProvider } from './CalendarProvider.js';
import { ValidationUtils } from '../../utils/ValidationUtils.js';

/**
 * Provedor de calendário para Google Calendar
 * Implementa CalendarProvider seguindo o princípio da Inversão de Dependência (DIP)
 */
export class GoogleCalendarProvider extends CalendarProvider {
  constructor(credentials) {
    super();
    this.credentials = credentials;
    this.auth = null;
    this.calendar = null;
  }

  /**
   * Inicializa o provedor Google Calendar
   */
  async initialize() {
    if (!this.credentials) {
      throw new Error('Credenciais não fornecidas para GoogleCalendarProvider');
    }

    this.auth = new google.auth.OAuth2(
      this.credentials.client_id,
      this.credentials.client_secret,
      this.credentials.redirect_uri
    );
    
    this.calendar = google.calendar({ version: 'v3', auth: this.auth });
    
    console.log('✅ GoogleCalendarProvider inicializado');
  }

  /**
   * Cria um evento no Google Calendar
   * @param {Object} eventData - Dados do evento
   * @param {string} calendarId - ID do calendário
   * @returns {Promise<Object>} Evento criado
   */
  async createEvent(eventData, calendarId = 'primary') {
    // Validar dados
    this.validateEventData(eventData);
    ValidationUtils.validateCalendarEventData(eventData);

    // Verificar autenticação
    if (!await this.isAuthenticated()) {
      throw new Error('Provedor não está autenticado');
    }

    // Formatar evento para Google Calendar
    const event = {
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
    };

    try {
      const response = await this.calendar.events.insert({
        calendarId: calendarId,
        resource: event,
      });
      
      console.log(`📅 Evento criado no Google Calendar: ${event.summary}`);
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao criar evento no Google Calendar: ${error.message}`);
    }
  }

  /**
   * Verifica se o provedor está autenticado
   * @returns {Promise<boolean>} True se autenticado
   */
  async isAuthenticated() {
    if (!this.auth) return false;
    
    const tokens = this.auth.credentials;
    if (!tokens || !tokens.access_token) return false;
    
    if (tokens.expiry_date) {
      const now = new Date().getTime();
      const buffer = 5 * 60 * 1000; // 5 minutos
      return now < (tokens.expiry_date - buffer);
    }
    
    return true;
  }

  /**
   * Define as credenciais de autenticação
   * @param {Object} tokens - Tokens de autenticação
   */
  setCredentials(tokens) {
    if (this.auth) {
      this.auth.setCredentials(tokens);
    }
  }

  /**
   * Retorna informações sobre o provedor
   * @returns {Object} Informações do provedor
   */
  getProviderInfo() {
    return {
      name: 'GoogleCalendarProvider',
      type: 'google',
      authenticated: this.auth ? !!this.auth.credentials : false
    };
  }
}
