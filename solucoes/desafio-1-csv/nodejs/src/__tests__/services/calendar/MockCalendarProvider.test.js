import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MockCalendarProvider } from '../../../services/calendar/MockCalendarProvider.js';
import { ValidationUtils } from '../../../utils/ValidationUtils.js';

// Mock ValidationUtils
vi.mock('../../../utils/ValidationUtils.js', () => ({
  ValidationUtils: {
    validateCalendarEventData: vi.fn()
  }
}));

describe('MockCalendarProvider', () => {
  let mockProvider;
  let validEventData;

  beforeEach(() => {
    mockProvider = new MockCalendarProvider();
    validEventData = {
      nomeevento: 'Evento Teste',
      startDateTime: '2024-03-15T14:30:00.000Z',
      endDateTime: '2024-03-15T15:30:00.000Z',
      notificacao: 15
    };
    
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('deve inicializar com arrays vazios e ID inicial', () => {
      expect(mockProvider.events).toEqual([]);
      expect(mockProvider.nextId).toBe(1);
    });
  });

  describe('initialize', () => {
    it('deve inicializar sem erros', async () => {
      await expect(mockProvider.initialize()).resolves.not.toThrow();
    });
  });

  describe('createEvent', () => {
    it('deve criar evento mock com sucesso', async () => {
      ValidationUtils.validateCalendarEventData.mockImplementation(() => {});

      const result = await mockProvider.createEvent(validEventData);

      expect(result).toMatchObject({
        id: 'mock-event-1',
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
        status: 'confirmed'
      });

      expect(result.id).toBe('mock-event-1');
      expect(result.created).toBeDefined();
      expect(result.updated).toBeDefined();
      expect(mockProvider.events).toHaveLength(1);
    });

    it('deve usar notificacao 0 quando não especificada', async () => {
      const eventDataWithoutNotification = {
        ...validEventData,
        notificacao: undefined
      };
      
      ValidationUtils.validateCalendarEventData.mockImplementation(() => {});

      const result = await mockProvider.createEvent(eventDataWithoutNotification);

      expect(result.reminders.overrides[0].minutes).toBe(0);
    });

    it('deve incrementar ID para múltiplos eventos', async () => {
      ValidationUtils.validateCalendarEventData.mockImplementation(() => {});

      const event1 = await mockProvider.createEvent(validEventData);
      const event2 = await mockProvider.createEvent({
        ...validEventData,
        nomeevento: 'Evento 2'
      });

      expect(event1.id).toBe('mock-event-1');
      expect(event2.id).toBe('mock-event-2');
      expect(mockProvider.events).toHaveLength(2);
    });

    it('deve simular delay de rede', async () => {
      ValidationUtils.validateCalendarEventData.mockImplementation(() => {});
      
      const startTime = Date.now();
      await mockProvider.createEvent(validEventData);
      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(100);
    });

    it('deve validar dados do evento', async () => {
      ValidationUtils.validateCalendarEventData.mockImplementation(() => {});

      await mockProvider.createEvent(validEventData);

      expect(ValidationUtils.validateCalendarEventData).toHaveBeenCalledWith(validEventData);
    });

    it('deve lançar erro quando validação falha', async () => {
      const errorMessage = 'Dados inválidos';
      ValidationUtils.validateCalendarEventData.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await expect(mockProvider.createEvent(validEventData)).rejects.toThrow(errorMessage);
    });

    it('deve aceitar calendarId customizado', async () => {
      ValidationUtils.validateCalendarEventData.mockImplementation(() => {});

      const result = await mockProvider.createEvent(validEventData, 'custom-calendar');

      expect(result).toBeDefined();
      expect(result.id).toBe('mock-event-1');
    });
  });

  describe('isAuthenticated', () => {
    it('deve sempre retornar true', async () => {
      const result = await mockProvider.isAuthenticated();
      expect(result).toBe(true);
    });
  });

  describe('getEvents', () => {
    it('deve retornar array vazio inicialmente', () => {
      const events = mockProvider.getEvents();
      expect(events).toEqual([]);
    });

    it('deve retornar cópia dos eventos criados', async () => {
      ValidationUtils.validateCalendarEventData.mockImplementation(() => {});

      await mockProvider.createEvent(validEventData);
      const events = mockProvider.getEvents();

      expect(events).toHaveLength(1);
      expect(events[0].summary).toBe('Evento Teste');
      
      // Modificar o array retornado não deve afetar o original
      events.push({ id: 'fake' });
      expect(mockProvider.getEvents()).toHaveLength(1);
    });
  });

  describe('getEventsCount', () => {
    it('deve retornar 0 inicialmente', () => {
      expect(mockProvider.getEventsCount()).toBe(0);
    });

    it('deve retornar número correto de eventos', async () => {
      ValidationUtils.validateCalendarEventData.mockImplementation(() => {});

      expect(mockProvider.getEventsCount()).toBe(0);
      
      await mockProvider.createEvent(validEventData);
      expect(mockProvider.getEventsCount()).toBe(1);
      
      await mockProvider.createEvent({
        ...validEventData,
        nomeevento: 'Evento 2'
      });
      expect(mockProvider.getEventsCount()).toBe(2);
    });
  });

  describe('clearEvents', () => {
    it('deve limpar eventos e resetar ID', async () => {
      ValidationUtils.validateCalendarEventData.mockImplementation(() => {});

      await mockProvider.createEvent(validEventData);
      await mockProvider.createEvent({
        ...validEventData,
        nomeevento: 'Evento 2'
      });

      expect(mockProvider.getEventsCount()).toBe(2);
      expect(mockProvider.nextId).toBe(3);

      mockProvider.clearEvents();

      expect(mockProvider.getEventsCount()).toBe(0);
      expect(mockProvider.nextId).toBe(1);
      expect(mockProvider.getEvents()).toEqual([]);
    });
  });

  describe('getProviderInfo', () => {
    it('deve retornar informações corretas do provedor', () => {
      const info = mockProvider.getProviderInfo();

      expect(info).toEqual({
        name: 'MockCalendarProvider',
        type: 'mock',
        authenticated: true,
        eventsCount: 0
      });
    });

    it('deve incluir contagem atual de eventos', async () => {
      ValidationUtils.validateCalendarEventData.mockImplementation(() => {});

      let info = mockProvider.getProviderInfo();
      expect(info.eventsCount).toBe(0);

      await mockProvider.createEvent(validEventData);
      
      info = mockProvider.getProviderInfo();
      expect(info.eventsCount).toBe(1);
    });
  });
});
