import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CalendarProviderFactory } from '../../factories/CalendarProviderFactory.js';
import { GoogleCalendarProvider } from '../../services/calendar/GoogleCalendarProvider.js';
import { MockCalendarProvider } from '../../services/calendar/MockCalendarProvider.js';
import { ConfigurationError } from '../../errors/AppErrors.js';

// Mock das dependências
vi.mock('../../services/calendar/GoogleCalendarProvider.js');
vi.mock('../../services/calendar/MockCalendarProvider.js');

describe('CalendarProviderFactory', () => {
  let mockGoogleProvider;
  let mockMockProvider;

  beforeEach(() => {
    // Reset dos mocks
    vi.clearAllMocks();
    
    // Criar instâncias mock
    mockGoogleProvider = {
      initialize: vi.fn(),
      createEvent: vi.fn(),
      isAuthenticated: vi.fn(),
      getProviderInfo: vi.fn()
    };
    
    mockMockProvider = {
      initialize: vi.fn(),
      createEvent: vi.fn(),
      isAuthenticated: vi.fn(),
      getEvents: vi.fn(),
      getEventsCount: vi.fn(),
      clearEvents: vi.fn(),
      getProviderInfo: vi.fn()
    };

    // Configurar os mocks das classes
    GoogleCalendarProvider.mockImplementation(() => mockGoogleProvider);
    MockCalendarProvider.mockImplementation(() => mockMockProvider);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('create()', () => {
    it('deve criar um MockCalendarProvider quando useMock for true', () => {
      // Arrange
      const useMock = true;
      const credentials = { client_id: 'test', client_secret: 'test' };

      // Act
      const result = CalendarProviderFactory.create(useMock, credentials);

      // Assert
      expect(MockCalendarProvider).toHaveBeenCalledTimes(1);
      expect(GoogleCalendarProvider).not.toHaveBeenCalled();
      expect(result).toBe(mockMockProvider);
    });

    it('deve criar um GoogleCalendarProvider quando useMock for false e credentials fornecidas', () => {
      // Arrange
      const useMock = false;
      const credentials = {
        client_id: 'test-client-id',
        client_secret: 'test-client-secret',
        redirect_uri: 'http://localhost:3000/callback'
      };

      // Act
      const result = CalendarProviderFactory.create(useMock, credentials);

      // Assert
      expect(GoogleCalendarProvider).toHaveBeenCalledTimes(1);
      expect(GoogleCalendarProvider).toHaveBeenCalledWith(credentials);
      expect(MockCalendarProvider).not.toHaveBeenCalled();
      expect(result).toBe(mockGoogleProvider);
    });

    it('deve usar GoogleCalendarProvider como padrão quando useMock for undefined', () => {
      // Arrange
      const credentials = { client_id: 'test', client_secret: 'test' };

      // Act
      const result = CalendarProviderFactory.create(undefined, credentials);

      // Assert
      expect(GoogleCalendarProvider).toHaveBeenCalledTimes(1);
      expect(GoogleCalendarProvider).toHaveBeenCalledWith(credentials);
      expect(MockCalendarProvider).not.toHaveBeenCalled();
      expect(result).toBe(mockGoogleProvider);
    });

    it('deve lançar ConfigurationError quando useMock for false e credentials for null', () => {
      // Arrange
      const useMock = false;
      const credentials = null;

      // Act & Assert
      expect(() => {
        CalendarProviderFactory.create(useMock, credentials);
      }).toThrow(ConfigurationError);

      expect(() => {
        CalendarProviderFactory.create(useMock, credentials);
      }).toThrow('Credenciais são obrigatórias para provedor real');

      expect(GoogleCalendarProvider).not.toHaveBeenCalled();
      expect(MockCalendarProvider).not.toHaveBeenCalled();
    });

    it('deve lançar ConfigurationError quando useMock for false e credentials for undefined', () => {
      // Arrange
      const useMock = false;

      // Act & Assert
      expect(() => {
        CalendarProviderFactory.create(useMock);
      }).toThrow(ConfigurationError);

      expect(() => {
        CalendarProviderFactory.create(useMock);
      }).toThrow('Credenciais são obrigatórias para provedor real');
    });

    it('deve aceitar credentials vazio quando useMock for false', () => {
      // Arrange
      const useMock = false;
      const credentials = {};

      // Act
      const result = CalendarProviderFactory.create(useMock, credentials);

      // Assert
      expect(GoogleCalendarProvider).toHaveBeenCalledWith(credentials);
      expect(result).toBe(mockGoogleProvider);
    });

    it('deve aceitar credentials válidas com propriedades mínimas', () => {
      // Arrange
      const useMock = false;
      const credentials = {
        client_id: 'test-id',
        client_secret: 'test-secret'
      };

      // Act
      const result = CalendarProviderFactory.create(useMock, credentials);

      // Assert
      expect(GoogleCalendarProvider).toHaveBeenCalledWith(credentials);
      expect(result).toBe(mockGoogleProvider);
    });
  });

  describe('createMock()', () => {
    it('deve criar uma instância de MockCalendarProvider', () => {
      // Act
      const result = CalendarProviderFactory.createMock();

      // Assert
      expect(MockCalendarProvider).toHaveBeenCalledTimes(1);
      expect(MockCalendarProvider).toHaveBeenCalledWith();
      expect(result).toBe(mockMockProvider);
    });

    it('deve sempre retornar uma nova instância', () => {
      // Act
      const result1 = CalendarProviderFactory.createMock();
      const result2 = CalendarProviderFactory.createMock();

      // Assert
      expect(MockCalendarProvider).toHaveBeenCalledTimes(2);
      expect(result1).toBe(mockMockProvider);
      expect(result2).toBe(mockMockProvider);
    });
  });

  describe('createGoogle()', () => {
    it('deve criar uma instância de GoogleCalendarProvider com credentials válidas', () => {
      // Arrange
      const credentials = {
        client_id: 'test-client-id',
        client_secret: 'test-client-secret',
        redirect_uri: 'http://localhost:3000/callback'
      };

      // Act
      const result = CalendarProviderFactory.createGoogle(credentials);

      // Assert
      expect(GoogleCalendarProvider).toHaveBeenCalledTimes(1);
      expect(GoogleCalendarProvider).toHaveBeenCalledWith(credentials);
      expect(result).toBe(mockGoogleProvider);
    });

    it('deve lançar ConfigurationError quando credentials for null', () => {
      // Arrange
      const credentials = null;

      // Act & Assert
      expect(() => {
        CalendarProviderFactory.createGoogle(credentials);
      }).toThrow(ConfigurationError);

      expect(() => {
        CalendarProviderFactory.createGoogle(credentials);
      }).toThrow('Credenciais são obrigatórias para GoogleCalendarProvider');

      expect(GoogleCalendarProvider).not.toHaveBeenCalled();
    });

    it('deve lançar ConfigurationError quando credentials for undefined', () => {
      // Act & Assert
      expect(() => {
        CalendarProviderFactory.createGoogle();
      }).toThrow(ConfigurationError);

      expect(() => {
        CalendarProviderFactory.createGoogle();
      }).toThrow('Credenciais são obrigatórias para GoogleCalendarProvider');
    });

    it('deve aceitar credentials vazio', () => {
      // Arrange
      const credentials = {};

      // Act
      const result = CalendarProviderFactory.createGoogle(credentials);

      // Assert
      expect(GoogleCalendarProvider).toHaveBeenCalledWith(credentials);
      expect(result).toBe(mockGoogleProvider);
    });

    it('deve aceitar credentials com propriedades mínimas', () => {
      // Arrange
      const credentials = {
        client_id: 'minimal-id',
        client_secret: 'minimal-secret'
      };

      // Act
      const result = CalendarProviderFactory.createGoogle(credentials);

      // Assert
      expect(GoogleCalendarProvider).toHaveBeenCalledWith(credentials);
      expect(result).toBe(mockGoogleProvider);
    });

    it('deve aceitar credentials com propriedades extras', () => {
      // Arrange
      const credentials = {
        client_id: 'test-id',
        client_secret: 'test-secret',
        redirect_uri: 'http://localhost:3000/callback',
        extra_property: 'extra_value',
        another_property: 123
      };

      // Act
      const result = CalendarProviderFactory.createGoogle(credentials);

      // Assert
      expect(GoogleCalendarProvider).toHaveBeenCalledWith(credentials);
      expect(result).toBe(mockGoogleProvider);
    });
  });

  describe('getAvailableTypes()', () => {
    it('deve retornar array com tipos disponíveis', () => {
      // Act
      const result = CalendarProviderFactory.getAvailableTypes();

      // Assert
      expect(result).toEqual(['mock', 'google']);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
    });

    it('deve retornar array imutável', () => {
      // Act
      const result = CalendarProviderFactory.getAvailableTypes();
      result.push('invalid');

      // Assert
      const newResult = CalendarProviderFactory.getAvailableTypes();
      expect(newResult).toEqual(['mock', 'google']);
      expect(newResult).toHaveLength(2);
    });

    it('deve sempre retornar arrays com mesmo conteúdo', () => {
      // Act
      const result1 = CalendarProviderFactory.getAvailableTypes();
      const result2 = CalendarProviderFactory.getAvailableTypes();

      // Assert
      expect(result1).toEqual(result2);
      expect(result1).toEqual(['mock', 'google']);
    });
  });

  describe('isTypeSupported()', () => {
    it('deve retornar true para tipo "mock"', () => {
      // Act
      const result = CalendarProviderFactory.isTypeSupported('mock');

      // Assert
      expect(result).toBe(true);
    });

    it('deve retornar true para tipo "google"', () => {
      // Act
      const result = CalendarProviderFactory.isTypeSupported('google');

      // Assert
      expect(result).toBe(true);
    });

    it('deve retornar false para tipo inválido', () => {
      // Act
      const result = CalendarProviderFactory.isTypeSupported('invalid');

      // Assert
      expect(result).toBe(false);
    });

    it('deve retornar false para string vazia', () => {
      // Act
      const result = CalendarProviderFactory.isTypeSupported('');

      // Assert
      expect(result).toBe(false);
    });

    it('deve retornar false para null', () => {
      // Act
      const result = CalendarProviderFactory.isTypeSupported(null);

      // Assert
      expect(result).toBe(false);
    });

    it('deve retornar false para undefined', () => {
      // Act
      const result = CalendarProviderFactory.isTypeSupported(undefined);

      // Assert
      expect(result).toBe(false);
    });

    it('deve ser case-sensitive', () => {
      // Act & Assert
      expect(CalendarProviderFactory.isTypeSupported('Mock')).toBe(false);
      expect(CalendarProviderFactory.isTypeSupported('Google')).toBe(false);
      expect(CalendarProviderFactory.isTypeSupported('MOCK')).toBe(false);
      expect(CalendarProviderFactory.isTypeSupported('GOOGLE')).toBe(false);
    });

    it('deve retornar false para tipos com espaços', () => {
      // Act & Assert
      expect(CalendarProviderFactory.isTypeSupported(' mock')).toBe(false);
      expect(CalendarProviderFactory.isTypeSupported('mock ')).toBe(false);
      expect(CalendarProviderFactory.isTypeSupported(' mock ')).toBe(false);
    });
  });

  describe('Integração com ConfigurationError', () => {
    it('deve lançar ConfigurationError com propriedades corretas no método create', () => {
      // Arrange
      const useMock = false;
      const credentials = null;

      // Act & Assert
      try {
        CalendarProviderFactory.create(useMock, credentials);
        expect.fail('Deveria ter lançado ConfigurationError');
      } catch (error) {
        expect(error).toBeInstanceOf(ConfigurationError);
        expect(error.name).toBe('ConfigurationError');
        expect(error.type).toBe('CONFIGURATION_ERROR');
        expect(error.configKey).toBe('credentials');
        expect(error.message).toBe('Credenciais são obrigatórias para provedor real');
      }
    });

    it('deve lançar ConfigurationError com propriedades corretas no método createGoogle', () => {
      // Arrange
      const credentials = null;

      // Act & Assert
      try {
        CalendarProviderFactory.createGoogle(credentials);
        expect.fail('Deveria ter lançado ConfigurationError');
      } catch (error) {
        expect(error).toBeInstanceOf(ConfigurationError);
        expect(error.name).toBe('ConfigurationError');
        expect(error.type).toBe('CONFIGURATION_ERROR');
        expect(error.configKey).toBe('credentials');
        expect(error.message).toBe('Credenciais são obrigatórias para GoogleCalendarProvider');
      }
    });
  });

  describe('Cenários de edge cases', () => {
    it('deve lidar com credentials como string vazia', () => {
      // Arrange
      const useMock = false;
      const credentials = '';

      // Act & Assert
      expect(() => {
        CalendarProviderFactory.create(useMock, credentials);
      }).toThrow(ConfigurationError);
    });

    it('deve aceitar credentials como número', () => {
      // Arrange
      const useMock = false;
      const credentials = 123;

      // Act
      const result = CalendarProviderFactory.create(useMock, credentials);

      // Assert
      expect(GoogleCalendarProvider).toHaveBeenCalledWith(credentials);
      expect(result).toBe(mockGoogleProvider);
    });

    it('deve aceitar credentials como array vazio', () => {
      // Arrange
      const useMock = false;
      const credentials = [];

      // Act
      const result = CalendarProviderFactory.create(useMock, credentials);

      // Assert
      expect(GoogleCalendarProvider).toHaveBeenCalledWith(credentials);
      expect(result).toBe(mockGoogleProvider);
    });

    it('deve aceitar useMock como string "true"', () => {
      // Arrange
      const useMock = 'true';
      const credentials = { client_id: 'test' };

      // Act
      const result = CalendarProviderFactory.create(useMock, credentials);

      // Assert
      expect(MockCalendarProvider).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockMockProvider);
    });

    it('deve aceitar useMock como string "false"', () => {
      // Arrange
      const useMock = 'false';
      const credentials = { client_id: 'test', client_secret: 'test' };

      // Act
      const result = CalendarProviderFactory.create(useMock, credentials);

      // Assert
      // String "false" é truthy, então vai usar MockCalendarProvider
      expect(MockCalendarProvider).toHaveBeenCalledTimes(1);
      expect(GoogleCalendarProvider).not.toHaveBeenCalled();
      expect(result).toBe(mockMockProvider);
    });
  });

  describe('Métodos estáticos', () => {
    it('deve ter todos os métodos como estáticos', () => {
      // Assert
      expect(typeof CalendarProviderFactory.create).toBe('function');
      expect(typeof CalendarProviderFactory.createMock).toBe('function');
      expect(typeof CalendarProviderFactory.createGoogle).toBe('function');
      expect(typeof CalendarProviderFactory.getAvailableTypes).toBe('function');
      expect(typeof CalendarProviderFactory.isTypeSupported).toBe('function');
    });

    it('deve permitir instanciação da factory (classe não é abstrata)', () => {
      // Act
      const instance = new CalendarProviderFactory();

      // Assert
      expect(instance).toBeInstanceOf(CalendarProviderFactory);
    });
  });
});
