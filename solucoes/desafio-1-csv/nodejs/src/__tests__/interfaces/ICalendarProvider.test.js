/**
 * Testes unitários para a interface ICalendarProvider
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ICalendarProvider } from '../../interfaces/ICalendarProvider.js';

describe('ICalendarProvider', () => {
  let calendarProvider;

  beforeEach(() => {
    calendarProvider = new ICalendarProvider();
  });

  describe('createEvent', () => {
    it('deve lançar erro quando método não é implementado', async () => {
      const mockEventData = { nomeevento: 'Test Event', startDateTime: '2024-01-01T10:00:00Z' };
      
      await expect(async () => {
        await calendarProvider.createEvent(mockEventData);
      }).rejects.toThrow('Método createEvent deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', async () => {
      const mockEventData = { nomeevento: 'Test Event', startDateTime: '2024-01-01T10:00:00Z' };
      
      await expect(async () => {
        await calendarProvider.createEvent(mockEventData);
      }).rejects.toThrow(Error);
    });

    it('deve aceitar calendarId como parâmetro opcional', async () => {
      const mockEventData = { nomeevento: 'Test Event', startDateTime: '2024-01-01T10:00:00Z' };
      const calendarId = 'custom-calendar-id';
      
      await expect(async () => {
        await calendarProvider.createEvent(mockEventData, calendarId);
      }).rejects.toThrow('Método createEvent deve ser implementado pela classe filha');
    });
  });

  describe('isAuthenticated', () => {
    it('deve lançar erro quando método não é implementado', async () => {
      await expect(async () => {
        await calendarProvider.isAuthenticated();
      }).rejects.toThrow('Método isAuthenticated deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', async () => {
      await expect(async () => {
        await calendarProvider.isAuthenticated();
      }).rejects.toThrow(Error);
    });
  });

  describe('initialize', () => {
    it('deve lançar erro quando método não é implementado', async () => {
      await expect(async () => {
        await calendarProvider.initialize();
      }).rejects.toThrow('Método initialize deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', async () => {
      await expect(async () => {
        await calendarProvider.initialize();
      }).rejects.toThrow(Error);
    });
  });

  describe('validateEventData', () => {
    it('deve validar dados de evento com campos obrigatórios', () => {
      const validEventData = {
        nomeevento: 'Test Event',
        startDateTime: '2024-01-01T10:00:00Z',
        endDateTime: '2024-01-01T11:00:00Z'
      };

      expect(() => {
        calendarProvider.validateEventData(validEventData);
      }).not.toThrow();
    });

    it('deve lançar erro quando nomeevento está ausente', () => {
      const invalidEventData = {
        startDateTime: '2024-01-01T10:00:00Z',
        endDateTime: '2024-01-01T11:00:00Z'
      };

      expect(() => {
        calendarProvider.validateEventData(invalidEventData);
      }).toThrow('Campos obrigatórios não fornecidos: nomeevento, startDateTime, endDateTime');
    });

    it('deve lançar erro quando startDateTime está ausente', () => {
      const invalidEventData = {
        nomeevento: 'Test Event',
        endDateTime: '2024-01-01T11:00:00Z'
      };

      expect(() => {
        calendarProvider.validateEventData(invalidEventData);
      }).toThrow('Campos obrigatórios não fornecidos: nomeevento, startDateTime, endDateTime');
    });

    it('deve lançar erro quando endDateTime está ausente', () => {
      const invalidEventData = {
        nomeevento: 'Test Event',
        startDateTime: '2024-01-01T10:00:00Z'
      };

      expect(() => {
        calendarProvider.validateEventData(invalidEventData);
      }).toThrow('Campos obrigatórios não fornecidos: nomeevento, startDateTime, endDateTime');
    });

    it('deve lançar erro quando todos os campos obrigatórios estão ausentes', () => {
      const invalidEventData = {};

      expect(() => {
        calendarProvider.validateEventData(invalidEventData);
      }).toThrow('Campos obrigatórios não fornecidos: nomeevento, startDateTime, endDateTime');
    });

    it('deve lançar erro do tipo Error', () => {
      const invalidEventData = {};

      expect(() => {
        calendarProvider.validateEventData(invalidEventData);
      }).toThrow(Error);
    });
  });

  describe('getProviderInfo', () => {
    it('deve retornar informações básicas do provedor', () => {
      const info = calendarProvider.getProviderInfo();
      
      expect(info).toEqual({
        name: 'ICalendarProvider',
        type: 'unknown'
      });
    });

    it('deve retornar o nome da classe corretamente', () => {
      class MockCalendarProvider extends ICalendarProvider {
        async createEvent(eventData, calendarId = 'primary') {
          return { id: 'event123', ...eventData };
        }

        async isAuthenticated() {
          return true;
        }

        async initialize() {
          return true;
        }
      }

      const mockProvider = new MockCalendarProvider();
      const info = mockProvider.getProviderInfo();
      
      expect(info.name).toBe('MockCalendarProvider');
      expect(info.type).toBe('unknown');
    });
  });

  describe('herança e estrutura', () => {
    it('deve ser uma classe que pode ser instanciada', () => {
      expect(calendarProvider).toBeInstanceOf(ICalendarProvider);
    });

    it('deve ter todos os métodos definidos', () => {
      expect(typeof calendarProvider.createEvent).toBe('function');
      expect(typeof calendarProvider.isAuthenticated).toBe('function');
      expect(typeof calendarProvider.initialize).toBe('function');
      expect(typeof calendarProvider.validateEventData).toBe('function');
      expect(typeof calendarProvider.getProviderInfo).toBe('function');
    });
  });

  describe('implementação de interface', () => {
    it('deve permitir herança e implementação dos métodos', async () => {
      class MockCalendarProvider extends ICalendarProvider {
        async createEvent(eventData, calendarId = 'primary') {
          return { id: 'event123', calendarId, ...eventData };
        }

        async isAuthenticated() {
          return true;
        }

        async initialize() {
          return true;
        }
      }

      const mockProvider = new MockCalendarProvider();
      const mockEventData = {
        nomeevento: 'Test Event',
        startDateTime: '2024-01-01T10:00:00Z',
        endDateTime: '2024-01-01T11:00:00Z'
      };

      const isAuth = await mockProvider.isAuthenticated();
      expect(isAuth).toBe(true);

      const init = await mockProvider.initialize();
      expect(init).toBe(true);

      const event = await mockProvider.createEvent(mockEventData, 'custom-calendar');
      expect(event).toEqual({
        id: 'event123',
        calendarId: 'custom-calendar',
        ...mockEventData
      });

      // Teste do método validateEventData herdado
      expect(() => {
        mockProvider.validateEventData(mockEventData);
      }).not.toThrow();
    });
  });
});
