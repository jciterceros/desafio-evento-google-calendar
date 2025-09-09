import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { App } from '../app.js';
import { CSVParser } from '../services/csv/CSVParser.js';
import { EventValidator } from '../services/csv/EventValidator.js';
import { EventProcessor } from '../services/csv/EventProcessor.js';
import { AuthenticationService } from '../services/auth/AuthenticationService.js';
import { TokenManager } from '../services/auth/TokenManager.js';
import { CalendarProviderFactory } from '../factories/CalendarProviderFactory.js';
import { APP_CONSTANTS } from '../constants/AppConstants.js';
import { ConfigurationError, FileProcessingError } from '../errors/AppErrors.js';
import fs from 'fs';
import path from 'path';

// Mock das dependências
vi.mock('../services/csv/CSVParser.js');
vi.mock('../services/csv/EventValidator.js');
vi.mock('../services/csv/EventProcessor.js');
vi.mock('../services/auth/AuthenticationService.js');
vi.mock('../services/auth/TokenManager.js');
vi.mock('../factories/CalendarProviderFactory.js');
vi.mock('fs');
vi.mock('path');

describe('App', () => {
  let app;
  let mockCSVParser;
  let mockEventValidator;
  let mockEventProcessor;
  let mockTokenManager;
  let mockAuthService;
  let mockCalendarProvider;

  beforeEach(() => {
    // Reset dos mocks
    vi.clearAllMocks();
    
    // Criar instâncias mock
    mockCSVParser = {
      parseFileToEvents: vi.fn()
    };
    
    mockEventValidator = {
      validateEvents: vi.fn()
    };
    
    mockEventProcessor = {
      processEvents: vi.fn()
    };
    
    mockTokenManager = {
      loadTokens: vi.fn(),
      saveTokens: vi.fn()
    };
    
    mockAuthService = {
      initialize: vi.fn(),
      loadSavedTokens: vi.fn(),
      ensureValidToken: vi.fn(),
      authenticate: vi.fn(),
      getAuthInstance: vi.fn()
    };
    
    mockCalendarProvider = {
      initialize: vi.fn(),
      createEvent: vi.fn(),
      setCredentials: vi.fn(),
      getEventsCount: vi.fn()
    };

    // Configurar os mocks das classes
    CSVParser.mockImplementation(() => mockCSVParser);
    EventValidator.mockImplementation(() => mockEventValidator);
    EventProcessor.mockImplementation(() => mockEventProcessor);
    TokenManager.mockImplementation(() => mockTokenManager);
    AuthenticationService.mockImplementation(() => mockAuthService);
    CalendarProviderFactory.createMock.mockReturnValue(mockCalendarProvider);
    CalendarProviderFactory.createGoogle.mockReturnValue(mockCalendarProvider);

    // Mock do fs
    vi.mocked(fs.readFileSync).mockReturnValue('{"web": {"client_id": "test", "client_secret": "test"}}');
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.mkdirSync).mockImplementation(() => {});
    vi.mocked(fs.writeFileSync).mockImplementation(() => {});

    // Mock do path
    vi.mocked(path.dirname).mockReturnValue('./output');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Constructor', () => {
    it('deve inicializar com useMock false por padrão', () => {
      // Act
      app = new App();

      // Assert
      expect(app.useMock).toBe(false);
      expect(app.calendarProvider).toBeNull();
      expect(app.authService).toBeNull();
    });

    it('deve inicializar com useMock true quando especificado', () => {
      // Act
      app = new App(true);

      // Assert
      expect(app.useMock).toBe(true);
    });

    it('deve inicializar todas as dependências', () => {
      // Act
      app = new App();

      // Assert
      expect(CSVParser).toHaveBeenCalledTimes(1);
      expect(EventValidator).toHaveBeenCalledTimes(1);
      expect(EventProcessor).toHaveBeenCalledTimes(1);
      expect(TokenManager).toHaveBeenCalledTimes(1);
      expect(app.csvParser).toBe(mockCSVParser);
      expect(app.eventValidator).toBe(mockEventValidator);
      expect(app.eventProcessor).toBe(mockEventProcessor);
      expect(app.tokenManager).toBe(mockTokenManager);
    });
  });

  describe('initialize()', () => {
    beforeEach(() => {
      app = new App();
    });

    it('deve inicializar em modo mock quando useMock for true', async () => {
      // Arrange
      app.useMock = true;

      // Act
      await app.initialize();

      // Assert
      expect(CalendarProviderFactory.createMock).toHaveBeenCalledTimes(1);
      expect(mockCalendarProvider.initialize).toHaveBeenCalledTimes(1);
      expect(app.calendarProvider).toBe(mockCalendarProvider);
    });

    it('deve inicializar em modo real quando useMock for false', async () => {
      // Arrange
      app.useMock = false;
      mockAuthService.getAuthInstance.mockReturnValue({
        credentials: { access_token: 'test-token' }
      });
      mockAuthService.loadSavedTokens.mockReturnValue({ access_token: 'test-token' });
      mockAuthService.ensureValidToken.mockResolvedValue(true);

      // Act
      await app.initialize();

      // Assert
      expect(fs.readFileSync).toHaveBeenCalledWith('./config/credentials.json', 'utf8');
      expect(AuthenticationService).toHaveBeenCalledWith(
        expect.objectContaining({
          client_id: 'test',
          client_secret: 'test'
        }),
        mockTokenManager
      );
      expect(CalendarProviderFactory.createGoogle).toHaveBeenCalledTimes(1);
      expect(mockAuthService.initialize).toHaveBeenCalledTimes(1);
      expect(mockCalendarProvider.initialize).toHaveBeenCalledTimes(1);
      expect(mockCalendarProvider.setCredentials).toHaveBeenCalledWith({ access_token: 'test-token' });
    });

    it('deve iniciar autenticação quando tokens não forem encontrados', async () => {
      // Arrange
      app.useMock = false;
      mockAuthService.loadSavedTokens.mockReturnValue(null);
      mockAuthService.getAuthInstance.mockReturnValue({
        credentials: { access_token: 'new-token' }
      });

      // Act
      await app.initialize();

      // Assert
      expect(mockAuthService.authenticate).toHaveBeenCalledTimes(1);
    });

    it('deve iniciar autenticação quando token expirar', async () => {
      // Arrange
      app.useMock = false;
      mockAuthService.loadSavedTokens.mockReturnValue({ access_token: 'expired-token' });
      mockAuthService.ensureValidToken.mockResolvedValue(false);
      mockAuthService.getAuthInstance.mockReturnValue({
        credentials: { access_token: 'new-token' }
      });

      // Act
      await app.initialize();

      // Assert
      expect(mockAuthService.authenticate).toHaveBeenCalledTimes(1);
    });

    it('deve lançar erro quando inicialização falhar', async () => {
      // Arrange
      app.useMock = false;
      fs.readFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      // Act & Assert
      await expect(app.initialize()).rejects.toThrow(ConfigurationError);
    });
  });

  describe('loadCredentials()', () => {
    beforeEach(() => {
      app = new App();
    });

    it('deve carregar credenciais do arquivo JSON', () => {
      // Arrange
      const mockCredentials = {
        web: {
          client_id: 'test-client-id',
          client_secret: 'test-client-secret',
          redirect_uris: ['http://localhost:3000/callback']
        }
      };
      fs.readFileSync.mockReturnValue(JSON.stringify(mockCredentials));

      // Act
      const result = app.loadCredentials();

      // Assert
      expect(fs.readFileSync).toHaveBeenCalledWith('./config/credentials.json', 'utf8');
      expect(result).toEqual({
        client_id: 'test-client-id',
        client_secret: 'test-client-secret',
        redirect_uri: 'http://localhost:3000/callback'
      });
    });

    it('deve usar redirect_uri padrão quando não especificado', () => {
      // Arrange
      const mockCredentials = {
        web: {
          client_id: 'test-client-id',
          client_secret: 'test-client-secret'
        }
      };
      fs.readFileSync.mockReturnValue(JSON.stringify(mockCredentials));

      // Act
      const result = app.loadCredentials();

      // Assert
      expect(result.redirect_uri).toBe(`http://localhost:${APP_CONSTANTS.CALLBACK_PORT}${APP_CONSTANTS.CALLBACK_PATH}`);
    });

    it('deve retornar credenciais diretas quando não houver formato web', () => {
      // Arrange
      const mockCredentials = {
        client_id: 'direct-client-id',
        client_secret: 'direct-client-secret'
      };
      fs.readFileSync.mockReturnValue(JSON.stringify(mockCredentials));

      // Act
      const result = app.loadCredentials();

      // Assert
      expect(result).toEqual(mockCredentials);
    });

    it('deve lançar ConfigurationError quando arquivo não for encontrado', () => {
      // Arrange
      fs.readFileSync.mockImplementation(() => {
        throw new Error('ENOENT: no such file or directory');
      });

      // Act & Assert
      expect(() => app.loadCredentials()).toThrow(ConfigurationError);
      expect(() => app.loadCredentials()).toThrow('Erro ao carregar credenciais: ENOENT: no such file or directory');
    });

    it('deve lançar ConfigurationError quando JSON for inválido', () => {
      // Arrange
      fs.readFileSync.mockReturnValue('invalid json');

      // Act & Assert
      expect(() => app.loadCredentials()).toThrow(ConfigurationError);
    });
  });

  describe('processCSV()', () => {
    beforeEach(() => {
      app = new App();
      app.calendarProvider = mockCalendarProvider;
    });

    it('deve processar arquivo CSV com sucesso', async () => {
      // Arrange
      const mockEvents = [
        { nomeevento: 'Evento 1', startDateTime: '2023-12-25T10:00:00', endDateTime: '2023-12-25T11:00:00' },
        { nomeevento: 'Evento 2', startDateTime: '2023-12-25T14:00:00', endDateTime: '2023-12-25T15:00:00' }
      ];

      const mockValidation = {
        totalValid: 2,
        totalInvalid: 0,
        validEvents: mockEvents,
        invalidEvents: []
      };

      const mockProcessedEvents = {
        totalSuccessful: 2,
        totalFailed: 0,
        successfulEvents: [
          { data: { nomeevento: 'Evento 1' }, originalData: mockEvents[0] },
          { data: { nomeevento: 'Evento 2' }, originalData: mockEvents[1] }
        ],
        failedEvents: []
      };

      mockCSVParser.parseFileToEvents.mockResolvedValue(mockEvents);
      mockEventValidator.validateEvents.mockReturnValue(mockValidation);
      mockEventProcessor.processEvents.mockReturnValue(mockProcessedEvents);
      mockCalendarProvider.createEvent.mockResolvedValue({ id: 'event-1', summary: 'Evento 1' });

      // Act
      const result = await app.processCSV('./test.csv');

      // Assert
      expect(mockCSVParser.parseFileToEvents).toHaveBeenCalledWith('./test.csv');
      expect(mockEventValidator.validateEvents).toHaveBeenCalledWith(mockEvents);
      expect(mockEventProcessor.processEvents).toHaveBeenCalledWith(mockEvents);
      expect(mockCalendarProvider.createEvent).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
      expect(result[0].success).toBe(true);
      expect(result[0].event).toEqual({ id: 'event-1', summary: 'Evento 1' });
    });

    it('deve lidar com eventos que falham na criação', async () => {
      // Arrange
      const mockEvents = [{ nomeevento: 'Evento 1' }];
      const mockValidation = {
        totalValid: 1,
        totalInvalid: 0,
        validEvents: mockEvents,
        invalidEvents: []
      };
      const mockProcessedEvents = {
        totalSuccessful: 1,
        totalFailed: 0,
        successfulEvents: [{ data: { nomeevento: 'Evento 1' }, originalData: mockEvents[0] }],
        failedEvents: []
      };

      mockCSVParser.parseFileToEvents.mockResolvedValue(mockEvents);
      mockEventValidator.validateEvents.mockReturnValue(mockValidation);
      mockEventProcessor.processEvents.mockReturnValue(mockProcessedEvents);
      mockCalendarProvider.createEvent.mockRejectedValue(new Error('Calendar error'));

      // Act
      const result = await app.processCSV('./test.csv');

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].success).toBe(false);
      expect(result[0].error).toBe('Calendar error');
    });

    it('deve incluir eventos inválidos nos resultados', async () => {
      // Arrange
      const mockEvents = [{ nomeevento: 'Evento Inválido' }];
      const mockValidation = {
        totalValid: 0,
        totalInvalid: 1,
        validEvents: [],
        invalidEvents: [{
          event: { toObject: () => ({ nomeevento: 'Evento Inválido' }) },
          errors: ['Nome do evento é obrigatório']
        }]
      };
      const mockProcessedEvents = {
        totalSuccessful: 0,
        totalFailed: 0,
        successfulEvents: [],
        failedEvents: []
      };

      mockCSVParser.parseFileToEvents.mockResolvedValue(mockEvents);
      mockEventValidator.validateEvents.mockReturnValue(mockValidation);
      mockEventProcessor.processEvents.mockReturnValue(mockProcessedEvents);

      // Act
      const result = await app.processCSV('./test.csv');

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].success).toBe(false);
      expect(result[0].error).toBe('Evento inválido: Nome do evento é obrigatório');
    });

    it('deve incluir eventos que falharam no processamento', async () => {
      // Arrange
      const mockEvents = [{ nomeevento: 'Evento 1' }];
      const mockValidation = {
        totalValid: 1,
        totalInvalid: 0,
        validEvents: mockEvents,
        invalidEvents: []
      };
      const mockProcessedEvents = {
        totalSuccessful: 0,
        totalFailed: 1,
        successfulEvents: [],
        failedEvents: [{
          success: false,
          error: 'Processing error',
          originalData: mockEvents[0]
        }]
      };

      mockCSVParser.parseFileToEvents.mockResolvedValue(mockEvents);
      mockEventValidator.validateEvents.mockReturnValue(mockValidation);
      mockEventProcessor.processEvents.mockReturnValue(mockProcessedEvents);

      // Act
      const result = await app.processCSV('./test.csv');

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].success).toBe(false);
      expect(result[0].error).toBe('Processing error');
    });

    it('deve lançar erro quando processamento falhar', async () => {
      // Arrange
      mockCSVParser.parseFileToEvents.mockRejectedValue(new Error('CSV parsing error'));

      // Act & Assert
      await expect(app.processCSV('./test.csv')).rejects.toThrow('CSV parsing error');
    });
  });

  describe('saveResults()', () => {
    beforeEach(() => {
      app = new App();
      app.useMock = false;
      app.calendarProvider = mockCalendarProvider;
    });

    it('deve salvar resultados com sucesso', () => {
      // Arrange
      const results = [
        { success: true, event: { id: '1' } },
        { success: false, error: 'Error' }
      ];

      // Act
      app.saveResults(results);

      // Assert
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        APP_CONSTANTS.DEFAULT_OUTPUT_FILE,
        JSON.stringify(results, null, 2)
      );
    });

    it('deve criar diretório se não existir', () => {
      // Arrange
      const results = [{ success: true }];
      fs.existsSync.mockReturnValue(false);
      path.dirname.mockReturnValue('./custom');

      // Act
      app.saveResults(results, './custom/output.json');

      // Assert
      expect(path.dirname).toHaveBeenCalledWith('./custom/output.json');
      expect(fs.mkdirSync).toHaveBeenCalledWith('./custom', { recursive: true });
    });

    it('deve mostrar estatísticas corretas', () => {
      // Arrange
      const results = [
        { success: true, event: { id: '1' } },
        { success: true, event: { id: '2' } },
        { success: false, error: 'Error 1' },
        { success: false, error: 'Error 2' }
      ];

      // Act
      app.saveResults(results);

      // Assert
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('deve mostrar contagem de eventos mock quando em modo mock', () => {
      // Arrange
      app.useMock = true;
      const results = [{ success: true }];
      mockCalendarProvider.getEventsCount.mockReturnValue(5);

      // Act
      app.saveResults(results);

      // Assert
      expect(mockCalendarProvider.getEventsCount).toHaveBeenCalledTimes(1);
    });

    it('deve lidar com erro ao salvar arquivo', () => {
      // Arrange
      const results = [{ success: true }];
      fs.writeFileSync.mockImplementation(() => {
        throw new Error('Write error');
      });

      // Act & Assert
      expect(() => app.saveResults(results)).not.toThrow();
    });
  });

  describe('run()', () => {
    beforeEach(() => {
      app = new App();
      app.initialize = vi.fn();
      app.processCSV = vi.fn();
      app.saveResults = vi.fn();
    });

    it('deve executar fluxo completo com sucesso', async () => {
      // Arrange
      const mockResults = [{ success: true }];
      app.initialize.mockResolvedValue();
      app.processCSV.mockResolvedValue(mockResults);

      // Act
      await app.run('./test.csv');

      // Assert
      expect(app.initialize).toHaveBeenCalledTimes(1);
      expect(app.processCSV).toHaveBeenCalledWith('./test.csv');
      expect(app.saveResults).toHaveBeenCalledWith(mockResults);
    });

    it('deve usar arquivo CSV padrão quando não especificado', async () => {
      // Arrange
      const mockResults = [{ success: true }];
      app.initialize.mockResolvedValue();
      app.processCSV.mockResolvedValue(mockResults);

      // Act
      await app.run();

      // Assert
      expect(app.processCSV).toHaveBeenCalledWith(APP_CONSTANTS.DEFAULT_CSV_FILE);
    });

    it('deve sair com código 1 quando erro ocorrer', async () => {
      // Arrange
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});
      app.initialize.mockRejectedValue(new Error('Initialization error'));

      // Act
      await app.run();

      // Assert
      expect(exitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('main()', () => {
    it('deve verificar se process.argv.includes funciona corretamente', () => {
      // Arrange
      const originalArgv = process.argv;
      process.argv = ['node', 'app.js', '--mock'];

      // Act & Assert
      expect(process.argv.includes('--mock')).toBe(true);

      // Cleanup
      process.argv = originalArgv;
    });

    it('deve verificar se process.argv.includes retorna false sem --mock', () => {
      // Arrange
      const originalArgv = process.argv;
      process.argv = ['node', 'app.js'];

      // Act & Assert
      expect(process.argv.includes('--mock')).toBe(false);

      // Cleanup
      process.argv = originalArgv;
    });
  });

  describe('Cenários de erro', () => {
    beforeEach(() => {
      app = new App();
    });

    it('deve lidar com erro de inicialização em modo real', async () => {
      // Arrange
      app.useMock = false;
      fs.readFileSync.mockImplementation(() => {
        throw new Error('Credentials not found');
      });

      // Act & Assert
      await expect(app.initialize()).rejects.toThrow(ConfigurationError);
    });

    it('deve lidar com erro de processamento CSV', async () => {
      // Arrange
      app.calendarProvider = mockCalendarProvider;
      mockCSVParser.parseFileToEvents.mockRejectedValue(new Error('File not found'));

      // Act & Assert
      await expect(app.processCSV('./nonexistent.csv')).rejects.toThrow('File not found');
    });

    it('deve lidar com erro de autenticação', async () => {
      // Arrange
      app.useMock = false;
      mockAuthService.loadSavedTokens.mockReturnValue(null);
      mockAuthService.authenticate.mockRejectedValue(new Error('Authentication failed'));

      // Act & Assert
      await expect(app.initialize()).rejects.toThrow('Authentication failed');
    });
  });

  describe('Integração com dependências', () => {
    it('deve usar todas as dependências corretamente', () => {
      // Act
      app = new App();

      // Assert
      expect(CSVParser).toHaveBeenCalledTimes(1);
      expect(EventValidator).toHaveBeenCalledTimes(1);
      expect(EventProcessor).toHaveBeenCalledTimes(1);
      expect(TokenManager).toHaveBeenCalledTimes(1);
    });

    it('deve usar CalendarProviderFactory corretamente', async () => {
      // Arrange
      app = new App(true);

      // Act
      await app.initialize();

      // Assert
      expect(CalendarProviderFactory.createMock).toHaveBeenCalledTimes(1);
    });
  });
});
