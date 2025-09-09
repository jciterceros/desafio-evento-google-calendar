import { describe, it, expect, beforeEach } from 'vitest';
import { CalendarProvider } from '../../../services/calendar/CalendarProvider.js';

/**
 * Classe de teste concreta para testar CalendarProvider
 * Implementa os métodos abstratos para permitir instanciação
 */
class TestCalendarProvider extends CalendarProvider {
  constructor() {
    super();
    this.initialized = false;
    this.authenticated = false;
  }

  async createEvent(eventData, calendarId = 'primary') {
    this.validateEventData(eventData);
    return {
      id: 'test-event-1',
      summary: eventData.nomeevento,
      start: eventData.startDateTime,
      end: eventData.endDateTime,
      calendarId
    };
  }

  async isAuthenticated() {
    return this.authenticated;
  }

  async initialize() {
    this.initialized = true;
  }

  getProviderInfo() {
    return {
      name: 'TestCalendarProvider',
      type: 'test'
    };
  }
}

describe('CalendarProvider', () => {
  let provider;

  beforeEach(() => {
    provider = new TestCalendarProvider();
  });

  describe('constructor', () => {
    it('deve criar instância da classe abstrata através de classe concreta', () => {
      expect(provider).toBeDefined();
      expect(provider).toBeInstanceOf(CalendarProvider);
      expect(provider).toBeInstanceOf(TestCalendarProvider);
    });
  });

  describe('createEvent', () => {
    const validEventData = {
      nomeevento: 'Evento Teste',
      startDateTime: '2024-03-15T14:30:00',
      endDateTime: '2024-03-15T15:30:00'
    };

    it('deve criar evento com dados válidos', async () => {
      const result = await provider.createEvent(validEventData);

      expect(result).toBeDefined();
      expect(result.id).toBe('test-event-1');
      expect(result.summary).toBe('Evento Teste');
      expect(result.start).toBe('2024-03-15T14:30:00');
      expect(result.end).toBe('2024-03-15T15:30:00');
      expect(result.calendarId).toBe('primary');
    });

    it('deve usar calendarId customizado quando fornecido', async () => {
      const customCalendarId = 'custom-calendar-id';
      const result = await provider.createEvent(validEventData, customCalendarId);

      expect(result.calendarId).toBe(customCalendarId);
    });

    it('deve usar calendarId padrão quando não fornecido', async () => {
      const result = await provider.createEvent(validEventData);

      expect(result.calendarId).toBe('primary');
    });

    it('deve validar dados do evento antes de criar', async () => {
      const invalidEventData = {
        nomeevento: 'Evento Teste'
        // startDateTime e endDateTime ausentes
      };

      await expect(provider.createEvent(invalidEventData))
        .rejects
        .toThrow('Campos obrigatórios não fornecidos: nomeevento, startDateTime, endDateTime');
    });
  });

  describe('isAuthenticated', () => {
    it('deve retornar false inicialmente', async () => {
      const result = await provider.isAuthenticated();
      expect(result).toBe(false);
    });

    it('deve retornar true quando autenticado', async () => {
      provider.authenticated = true;
      const result = await provider.isAuthenticated();
      expect(result).toBe(true);
    });
  });

  describe('initialize', () => {
    it('deve inicializar o provedor', async () => {
      expect(provider.initialized).toBe(false);
      
      await provider.initialize();
      
      expect(provider.initialized).toBe(true);
    });

    it('deve retornar Promise<void>', async () => {
      const result = await provider.initialize();
      expect(result).toBeUndefined();
    });
  });

  describe('validateEventData', () => {
    it('deve passar para dados válidos', () => {
      const validData = {
        nomeevento: 'Evento Teste',
        startDateTime: '2024-03-15T14:30:00',
        endDateTime: '2024-03-15T15:30:00'
      };

      expect(() => provider.validateEventData(validData)).not.toThrow();
    });

    it('deve lançar erro quando nomeevento está ausente', () => {
      const invalidData = {
        startDateTime: '2024-03-15T14:30:00',
        endDateTime: '2024-03-15T15:30:00'
      };

      expect(() => provider.validateEventData(invalidData))
        .toThrow('Campos obrigatórios não fornecidos: nomeevento, startDateTime, endDateTime');
    });

    it('deve lançar erro quando startDateTime está ausente', () => {
      const invalidData = {
        nomeevento: 'Evento Teste',
        endDateTime: '2024-03-15T15:30:00'
      };

      expect(() => provider.validateEventData(invalidData))
        .toThrow('Campos obrigatórios não fornecidos: nomeevento, startDateTime, endDateTime');
    });

    it('deve lançar erro quando endDateTime está ausente', () => {
      const invalidData = {
        nomeevento: 'Evento Teste',
        startDateTime: '2024-03-15T14:30:00'
      };

      expect(() => provider.validateEventData(invalidData))
        .toThrow('Campos obrigatórios não fornecidos: nomeevento, startDateTime, endDateTime');
    });

    it('deve lançar erro quando nomeevento é string vazia', () => {
      const invalidData = {
        nomeevento: '',
        startDateTime: '2024-03-15T14:30:00',
        endDateTime: '2024-03-15T15:30:00'
      };

      expect(() => provider.validateEventData(invalidData))
        .toThrow('Campos obrigatórios não fornecidos: nomeevento, startDateTime, endDateTime');
    });

    it('deve lançar erro quando startDateTime é string vazia', () => {
      const invalidData = {
        nomeevento: 'Evento Teste',
        startDateTime: '',
        endDateTime: '2024-03-15T15:30:00'
      };

      expect(() => provider.validateEventData(invalidData))
        .toThrow('Campos obrigatórios não fornecidos: nomeevento, startDateTime, endDateTime');
    });

    it('deve lançar erro quando endDateTime é string vazia', () => {
      const invalidData = {
        nomeevento: 'Evento Teste',
        startDateTime: '2024-03-15T14:30:00',
        endDateTime: ''
      };

      expect(() => provider.validateEventData(invalidData))
        .toThrow('Campos obrigatórios não fornecidos: nomeevento, startDateTime, endDateTime');
    });

    it('deve lançar erro quando nomeevento é null', () => {
      const invalidData = {
        nomeevento: null,
        startDateTime: '2024-03-15T14:30:00',
        endDateTime: '2024-03-15T15:30:00'
      };

      expect(() => provider.validateEventData(invalidData))
        .toThrow('Campos obrigatórios não fornecidos: nomeevento, startDateTime, endDateTime');
    });

    it('deve lançar erro quando startDateTime é null', () => {
      const invalidData = {
        nomeevento: 'Evento Teste',
        startDateTime: null,
        endDateTime: '2024-03-15T15:30:00'
      };

      expect(() => provider.validateEventData(invalidData))
        .toThrow('Campos obrigatórios não fornecidos: nomeevento, startDateTime, endDateTime');
    });

    it('deve lançar erro quando endDateTime é null', () => {
      const invalidData = {
        nomeevento: 'Evento Teste',
        startDateTime: '2024-03-15T14:30:00',
        endDateTime: null
      };

      expect(() => provider.validateEventData(invalidData))
        .toThrow('Campos obrigatórios não fornecidos: nomeevento, startDateTime, endDateTime');
    });

    it('deve lançar erro quando nomeevento é undefined', () => {
      const invalidData = {
        nomeevento: undefined,
        startDateTime: '2024-03-15T14:30:00',
        endDateTime: '2024-03-15T15:30:00'
      };

      expect(() => provider.validateEventData(invalidData))
        .toThrow('Campos obrigatórios não fornecidos: nomeevento, startDateTime, endDateTime');
    });

    it('deve lançar erro quando startDateTime é undefined', () => {
      const invalidData = {
        nomeevento: 'Evento Teste',
        startDateTime: undefined,
        endDateTime: '2024-03-15T15:30:00'
      };

      expect(() => provider.validateEventData(invalidData))
        .toThrow('Campos obrigatórios não fornecidos: nomeevento, startDateTime, endDateTime');
    });

    it('deve lançar erro quando endDateTime é undefined', () => {
      const invalidData = {
        nomeevento: 'Evento Teste',
        startDateTime: '2024-03-15T14:30:00',
        endDateTime: undefined
      };

      expect(() => provider.validateEventData(invalidData))
        .toThrow('Campos obrigatórios não fornecidos: nomeevento, startDateTime, endDateTime');
    });

    it('deve lançar erro quando todos os campos estão ausentes', () => {
      const invalidData = {};

      expect(() => provider.validateEventData(invalidData))
        .toThrow('Campos obrigatórios não fornecidos: nomeevento, startDateTime, endDateTime');
    });

    it('deve lançar erro quando dados são null', () => {
      expect(() => provider.validateEventData(null))
        .toThrow('Cannot read properties of null');
    });

    it('deve lançar erro quando dados são undefined', () => {
      expect(() => provider.validateEventData(undefined))
        .toThrow('Cannot read properties of undefined');
    });
  });

  describe('getProviderInfo', () => {
    it('deve retornar informações do provedor', () => {
      const info = provider.getProviderInfo();

      expect(info).toBeDefined();
      expect(info).toHaveProperty('name');
      expect(info).toHaveProperty('type');
      expect(info.name).toBe('TestCalendarProvider');
      expect(info.type).toBe('test');
    });

    it('deve retornar objeto com estrutura correta', () => {
      const info = provider.getProviderInfo();

      expect(typeof info).toBe('object');
      expect(info).not.toBeNull();
      expect(Array.isArray(info)).toBe(false);
    });
  });

  describe('Herança e Polimorfismo', () => {
    it('deve ser instância de CalendarProvider', () => {
      expect(provider).toBeInstanceOf(CalendarProvider);
    });

    it('deve ser instância de TestCalendarProvider', () => {
      expect(provider).toBeInstanceOf(TestCalendarProvider);
    });

    it('deve ter todos os métodos da classe pai', () => {
      expect(typeof provider.createEvent).toBe('function');
      expect(typeof provider.isAuthenticated).toBe('function');
      expect(typeof provider.initialize).toBe('function');
      expect(typeof provider.validateEventData).toBe('function');
      expect(typeof provider.getProviderInfo).toBe('function');
    });

    it('deve implementar interface ICalendarProvider', () => {
      // Verifica se todos os métodos da interface estão presentes
      expect(typeof provider.createEvent).toBe('function');
      expect(typeof provider.isAuthenticated).toBe('function');
      expect(typeof provider.initialize).toBe('function');
      expect(typeof provider.validateEventData).toBe('function');
      expect(typeof provider.getProviderInfo).toBe('function');
    });
  });

  describe('Métodos Abstratos da Classe Base', () => {
    let abstractProvider;

    beforeEach(() => {
      // Cria uma instância da classe abstrata diretamente para testar os métodos não implementados
      abstractProvider = new CalendarProvider();
    });

    it('deve lançar erro ao chamar createEvent na classe abstrata', async () => {
      const eventData = {
        nomeevento: 'Evento Teste',
        startDateTime: '2024-03-15T14:30:00',
        endDateTime: '2024-03-15T15:30:00'
      };

      await expect(abstractProvider.createEvent(eventData))
        .rejects
        .toThrow('Método createEvent deve ser implementado pela classe filha');
    });

    it('deve lançar erro ao chamar isAuthenticated na classe abstrata', async () => {
      await expect(abstractProvider.isAuthenticated())
        .rejects
        .toThrow('Método isAuthenticated deve ser implementado pela classe filha');
    });

    it('deve lançar erro ao chamar initialize na classe abstrata', async () => {
      await expect(abstractProvider.initialize())
        .rejects
        .toThrow('Método initialize deve ser implementado pela classe filha');
    });

    it('deve retornar informações padrão do provedor na classe abstrata', () => {
      const info = abstractProvider.getProviderInfo();

      expect(info).toBeDefined();
      expect(info).toHaveProperty('name');
      expect(info).toHaveProperty('type');
      expect(info.name).toBe('CalendarProvider');
      expect(info.type).toBe('unknown');
    });

    it('deve ter constructor.name correto na classe abstrata', () => {
      expect(abstractProvider.constructor.name).toBe('CalendarProvider');
    });
  });

  describe('Integração com métodos', () => {
    it('deve usar validateEventData em createEvent', async () => {
      const invalidData = {
        nomeevento: 'Evento Teste'
        // campos obrigatórios ausentes
      };

      await expect(provider.createEvent(invalidData))
        .rejects
        .toThrow('Campos obrigatórios não fornecidos: nomeevento, startDateTime, endDateTime');
    });

    it('deve funcionar com fluxo completo de inicialização e autenticação', async () => {
      // Inicializar
      await provider.initialize();
      expect(provider.initialized).toBe(true);

      // Verificar autenticação inicial
      let isAuth = await provider.isAuthenticated();
      expect(isAuth).toBe(false);

      // Simular autenticação
      provider.authenticated = true;
      isAuth = await provider.isAuthenticated();
      expect(isAuth).toBe(true);

      // Criar evento
      const eventData = {
        nomeevento: 'Evento Completo',
        startDateTime: '2024-03-15T14:30:00',
        endDateTime: '2024-03-15T15:30:00'
      };

      const result = await provider.createEvent(eventData);
      expect(result).toBeDefined();
      expect(result.summary).toBe('Evento Completo');
    });
  });

  describe('Tratamento de erros', () => {
    it('deve lançar erro com mensagem específica para validação', () => {
      const invalidData = { nomeevento: 'Teste' };

      expect(() => provider.validateEventData(invalidData))
        .toThrow('Campos obrigatórios não fornecidos: nomeevento, startDateTime, endDateTime');
    });

    it('deve manter consistência nas mensagens de erro', () => {
      const testCases = [
        { nomeevento: 'Teste' },
        { startDateTime: '2024-03-15T14:30:00' },
        { endDateTime: '2024-03-15T15:30:00' },
        {}
      ];

      testCases.forEach(data => {
        expect(() => provider.validateEventData(data))
          .toThrow('Campos obrigatórios não fornecidos: nomeevento, startDateTime, endDateTime');
      });
    });
  });

  describe('Validação de tipos', () => {
    it('deve aceitar strings não vazias como válidas', () => {
      const validData = {
        nomeevento: 'Evento Válido',
        startDateTime: '2024-03-15T14:30:00',
        endDateTime: '2024-03-15T15:30:00'
      };

      expect(() => provider.validateEventData(validData)).not.toThrow();
    });

    it('deve aceitar strings com espaços como válidas', () => {
      const validData = {
        nomeevento: '  Evento com Espaços  ',
        startDateTime: '2024-03-15T14:30:00',
        endDateTime: '2024-03-15T15:30:00'
      };

      expect(() => provider.validateEventData(validData)).not.toThrow();
    });

    it('deve aceitar strings com caracteres especiais', () => {
      const validData = {
        nomeevento: 'Evento com Acentos: Ação & Reunião',
        startDateTime: '2024-03-15T14:30:00',
        endDateTime: '2024-03-15T15:30:00'
      };

      expect(() => provider.validateEventData(validData)).not.toThrow();
    });
  });
});
