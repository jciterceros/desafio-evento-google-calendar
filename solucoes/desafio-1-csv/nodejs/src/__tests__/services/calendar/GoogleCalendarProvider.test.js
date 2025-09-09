import { describe, it, expect, vi, beforeEach } from 'vitest';
import { google } from 'googleapis';
import { GoogleCalendarProvider } from '../../../services/calendar/GoogleCalendarProvider.js';
import { ValidationUtils } from '../../../utils/ValidationUtils.js';

// Mock das dependências
vi.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: vi.fn()
    },
    calendar: vi.fn()
  }
}));

vi.mock('../../../utils/ValidationUtils.js', () => ({
  ValidationUtils: {
    validateCalendarEventData: vi.fn()
  }
}));

describe('GoogleCalendarProvider', () => {
  let googleProvider;
  let mockCredentials;
  let mockOAuth2;
  let mockCalendar;
  let validEventData;

  beforeEach(() => {
    mockCredentials = {
      client_id: 'test_client_id',
      client_secret: 'test_client_secret',
      redirect_uri: 'http://localhost:3000/callback'
    };

    mockOAuth2 = {
      setCredentials: vi.fn(),
      credentials: {}
    };

    mockCalendar = {
      events: {
        insert: vi.fn()
      }
    };

    google.auth.OAuth2.mockImplementation(() => mockOAuth2);
    google.calendar.mockReturnValue(mockCalendar);

    googleProvider = new GoogleCalendarProvider(mockCredentials);
    
    validEventData = {
      nomeevento: 'Evento Teste',
      startDateTime: '2024-03-15T14:30:00.000Z',
      endDateTime: '2024-03-15T15:30:00.000Z',
      notificacao: 15
    };

    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('deve inicializar com credenciais', () => {
      expect(googleProvider.credentials).toBe(mockCredentials);
      expect(googleProvider.auth).toBeNull();
      expect(googleProvider.calendar).toBeNull();
    });
  });

  describe('initialize', () => {
    it('deve inicializar OAuth2 e calendar com sucesso', async () => {
      await googleProvider.initialize();

      expect(google.auth.OAuth2).toHaveBeenCalledWith(
        'test_client_id',
        'test_client_secret',
        'http://localhost:3000/callback'
      );
      expect(google.calendar).toHaveBeenCalledWith({
        version: 'v3',
        auth: mockOAuth2
      });
      expect(googleProvider.auth).toBe(mockOAuth2);
      expect(googleProvider.calendar).toBe(mockCalendar);
    });

    it('deve lançar erro quando credenciais não são fornecidas', async () => {
      const provider = new GoogleCalendarProvider(null);
      
      await expect(provider.initialize()).rejects.toThrow('Credenciais não fornecidas para GoogleCalendarProvider');
    });
  });

  describe('createEvent', () => {
    beforeEach(async () => {
      await googleProvider.initialize();
    });

    it('deve criar evento no Google Calendar com sucesso', async () => {
      ValidationUtils.validateCalendarEventData.mockImplementation(() => {});
      mockOAuth2.credentials = { access_token: 'token123' };
      
      const mockResponse = {
        data: {
          id: 'google-event-123',
          summary: 'Evento Teste',
          start: { dateTime: '2024-03-15T14:30:00.000Z' },
          end: { dateTime: '2024-03-15T15:30:00.000Z' }
        }
      };
      
      mockCalendar.events.insert.mockResolvedValue(mockResponse);

      const result = await googleProvider.createEvent(validEventData);

      expect(ValidationUtils.validateCalendarEventData).toHaveBeenCalledWith(validEventData);
      expect(mockCalendar.events.insert).toHaveBeenCalledWith({
        calendarId: 'primary',
        resource: {
          summary: 'Evento Teste',
          start: {
            dateTime: '2024-03-15T14:30:00.000Z',
            timeZone: 'America/Sao_Paulo',
          },
          end: {
            dateTime: '2024-03-15T15:30:00.000Z',
            timeZone: 'America/Sao_Paulo',
          },
          reminders: {
            useDefault: false,
            overrides: [{
              method: 'popup',
              minutes: 15,
            }],
          },
        }
      });
      expect(result).toBe(mockResponse.data);
    });

    it('deve usar notificacao 0 quando não especificada', async () => {
      ValidationUtils.validateCalendarEventData.mockImplementation(() => {});
      mockOAuth2.credentials = { access_token: 'token123' };
      
      const eventDataWithoutNotification = {
        ...validEventData,
        notificacao: undefined
      };
      
      const mockResponse = { data: { id: 'event-123' } };
      mockCalendar.events.insert.mockResolvedValue(mockResponse);

      await googleProvider.createEvent(eventDataWithoutNotification);

      expect(mockCalendar.events.insert).toHaveBeenCalledWith({
        calendarId: 'primary',
        resource: expect.objectContaining({
          reminders: {
            useDefault: false,
            overrides: [{
              method: 'popup',
              minutes: 0,
            }],
          }
        })
      });
    });

    it('deve usar calendarId customizado', async () => {
      ValidationUtils.validateCalendarEventData.mockImplementation(() => {});
      mockOAuth2.credentials = { access_token: 'token123' };
      
      const mockResponse = { data: { id: 'event-123' } };
      mockCalendar.events.insert.mockResolvedValue(mockResponse);

      await googleProvider.createEvent(validEventData, 'custom-calendar-id');

      expect(mockCalendar.events.insert).toHaveBeenCalledWith({
        calendarId: 'custom-calendar-id',
        resource: expect.any(Object)
      });
    });

    it('deve lançar erro quando não está autenticado', async () => {
      ValidationUtils.validateCalendarEventData.mockImplementation(() => {});
      mockOAuth2.credentials = null;

      await expect(googleProvider.createEvent(validEventData))
        .rejects.toThrow('Provedor não está autenticado');
    });

    it('deve lançar erro quando validação falha', async () => {
      const errorMessage = 'Dados inválidos';
      ValidationUtils.validateCalendarEventData.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await expect(googleProvider.createEvent(validEventData)).rejects.toThrow(errorMessage);
    });

    it('deve lançar erro quando API do Google falha', async () => {
      ValidationUtils.validateCalendarEventData.mockImplementation(() => {});
      mockOAuth2.credentials = { access_token: 'token123' };
      
      const apiError = new Error('API Error');
      mockCalendar.events.insert.mockRejectedValue(apiError);

      await expect(googleProvider.createEvent(validEventData))
        .rejects.toThrow('Erro ao criar evento no Google Calendar: API Error');
    });
  });

  describe('isAuthenticated', () => {
    it('deve retornar false quando auth não está inicializado', async () => {
      const result = await googleProvider.isAuthenticated();
      expect(result).toBe(false);
    });

    it('deve retornar false quando não há credenciais', async () => {
      await googleProvider.initialize();
      mockOAuth2.credentials = null;

      const result = await googleProvider.isAuthenticated();
      expect(result).toBe(false);
    });

    it('deve retornar false quando não há access_token', async () => {
      await googleProvider.initialize();
      mockOAuth2.credentials = { refresh_token: 'refresh123' };

      const result = await googleProvider.isAuthenticated();
      expect(result).toBe(false);
    });

    it('deve retornar true quando token não tem data de expiração', async () => {
      await googleProvider.initialize();
      mockOAuth2.credentials = { access_token: 'token123' };

      const result = await googleProvider.isAuthenticated();
      expect(result).toBe(true);
    });

    it('deve retornar true quando token não está expirado', async () => {
      await googleProvider.initialize();
      const futureTime = Date.now() + 3600000; // 1 hora no futuro
      mockOAuth2.credentials = { 
        access_token: 'token123',
        expiry_date: futureTime
      };

      const result = await googleProvider.isAuthenticated();
      expect(result).toBe(true);
    });

    it('deve retornar false quando token está expirado', async () => {
      await googleProvider.initialize();
      const pastTime = Date.now() - 3600000; // 1 hora no passado
      mockOAuth2.credentials = { 
        access_token: 'token123',
        expiry_date: pastTime
      };

      const result = await googleProvider.isAuthenticated();
      expect(result).toBe(false);
    });

    it('deve considerar buffer de 5 minutos', async () => {
      await googleProvider.initialize();
      const nearExpiryTime = Date.now() + 4 * 60 * 1000; // 4 minutos no futuro
      mockOAuth2.credentials = { 
        access_token: 'token123',
        expiry_date: nearExpiryTime
      };

      const result = await googleProvider.isAuthenticated();
      expect(result).toBe(false);
    });
  });

  describe('setCredentials', () => {
    it('deve definir credenciais quando auth está inicializado', async () => {
      await googleProvider.initialize();
      const tokens = { access_token: 'new_token' };

      googleProvider.setCredentials(tokens);

      expect(mockOAuth2.setCredentials).toHaveBeenCalledWith(tokens);
    });

    it('deve não fazer nada quando auth não está inicializado', () => {
      const tokens = { access_token: 'new_token' };

      googleProvider.setCredentials(tokens);

      expect(mockOAuth2.setCredentials).not.toHaveBeenCalled();
    });
  });

  describe('getProviderInfo', () => {
    it('deve retornar informações quando não inicializado', () => {
      const info = googleProvider.getProviderInfo();

      expect(info).toEqual({
        name: 'GoogleCalendarProvider',
        type: 'google',
        authenticated: false
      });
    });

    it('deve retornar informações quando inicializado mas não autenticado', async () => {
      await googleProvider.initialize();
      mockOAuth2.credentials = null;

      const info = googleProvider.getProviderInfo();

      expect(info).toEqual({
        name: 'GoogleCalendarProvider',
        type: 'google',
        authenticated: false
      });
    });

    it('deve retornar informações quando autenticado', async () => {
      await googleProvider.initialize();
      mockOAuth2.credentials = { access_token: 'token123' };

      const info = googleProvider.getProviderInfo();

      expect(info).toEqual({
        name: 'GoogleCalendarProvider',
        type: 'google',
        authenticated: true
      });
    });
  });
});
