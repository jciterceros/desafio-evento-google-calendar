/**
 * Testes unitários para as classes de erro customizadas
 */

import { describe, it, expect } from 'vitest';
import {
  ValidationError,
  AuthenticationError,
  ConfigurationError,
  FileProcessingError,
  CalendarError,
  TokenError
} from '../../errors/AppErrors.js';

describe('AppErrors', () => {
  describe('ValidationError', () => {
    it('deve criar uma instância de ValidationError com mensagem', () => {
      const error = new ValidationError('Campo obrigatório');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe('Campo obrigatório');
      expect(error.name).toBe('ValidationError');
      expect(error.type).toBe('VALIDATION_ERROR');
      expect(error.field).toBeNull();
    });

    it('deve criar uma instância de ValidationError com mensagem e campo', () => {
      const error = new ValidationError('Email inválido', 'email');
      
      expect(error.message).toBe('Email inválido');
      expect(error.name).toBe('ValidationError');
      expect(error.type).toBe('VALIDATION_ERROR');
      expect(error.field).toBe('email');
    });

    it('deve herdar corretamente de Error', () => {
      const error = new ValidationError('Teste');
      
      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
    });

    it('deve permitir captura com try/catch', () => {
      let caughtError = null;
      
      try {
        throw new ValidationError('Erro de validação');
      } catch (error) {
        caughtError = error;
      }
      
      expect(caughtError).toBeInstanceOf(ValidationError);
      expect(caughtError.message).toBe('Erro de validação');
    });
  });

  describe('AuthenticationError', () => {
    it('deve criar uma instância de AuthenticationError com mensagem', () => {
      const error = new AuthenticationError('Credenciais inválidas');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.message).toBe('Credenciais inválidas');
      expect(error.name).toBe('AuthenticationError');
      expect(error.type).toBe('AUTHENTICATION_ERROR');
      expect(error.code).toBeNull();
    });

    it('deve criar uma instância de AuthenticationError com mensagem e código', () => {
      const error = new AuthenticationError('Token expirado', 'TOKEN_EXPIRED');
      
      expect(error.message).toBe('Token expirado');
      expect(error.name).toBe('AuthenticationError');
      expect(error.type).toBe('AUTHENTICATION_ERROR');
      expect(error.code).toBe('TOKEN_EXPIRED');
    });

    it('deve herdar corretamente de Error', () => {
      const error = new AuthenticationError('Teste');
      
      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
    });

    it('deve permitir captura com try/catch', () => {
      let caughtError = null;
      
      try {
        throw new AuthenticationError('Erro de autenticação');
      } catch (error) {
        caughtError = error;
      }
      
      expect(caughtError).toBeInstanceOf(AuthenticationError);
      expect(caughtError.message).toBe('Erro de autenticação');
    });
  });

  describe('ConfigurationError', () => {
    it('deve criar uma instância de ConfigurationError com mensagem', () => {
      const error = new ConfigurationError('Configuração não encontrada');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ConfigurationError);
      expect(error.message).toBe('Configuração não encontrada');
      expect(error.name).toBe('ConfigurationError');
      expect(error.type).toBe('CONFIGURATION_ERROR');
      expect(error.configKey).toBeNull();
    });

    it('deve criar uma instância de ConfigurationError com mensagem e chave de configuração', () => {
      const error = new ConfigurationError('API key não configurada', 'API_KEY');
      
      expect(error.message).toBe('API key não configurada');
      expect(error.name).toBe('ConfigurationError');
      expect(error.type).toBe('CONFIGURATION_ERROR');
      expect(error.configKey).toBe('API_KEY');
    });

    it('deve herdar corretamente de Error', () => {
      const error = new ConfigurationError('Teste');
      
      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
    });

    it('deve permitir captura com try/catch', () => {
      let caughtError = null;
      
      try {
        throw new ConfigurationError('Erro de configuração');
      } catch (error) {
        caughtError = error;
      }
      
      expect(caughtError).toBeInstanceOf(ConfigurationError);
      expect(caughtError.message).toBe('Erro de configuração');
    });
  });

  describe('FileProcessingError', () => {
    it('deve criar uma instância de FileProcessingError com mensagem', () => {
      const error = new FileProcessingError('Erro ao processar arquivo');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(FileProcessingError);
      expect(error.message).toBe('Erro ao processar arquivo');
      expect(error.name).toBe('FileProcessingError');
      expect(error.type).toBe('FILE_PROCESSING_ERROR');
      expect(error.filePath).toBeNull();
    });

    it('deve criar uma instância de FileProcessingError com mensagem e caminho do arquivo', () => {
      const error = new FileProcessingError('Arquivo não encontrado', '/path/to/file.csv');
      
      expect(error.message).toBe('Arquivo não encontrado');
      expect(error.name).toBe('FileProcessingError');
      expect(error.type).toBe('FILE_PROCESSING_ERROR');
      expect(error.filePath).toBe('/path/to/file.csv');
    });

    it('deve herdar corretamente de Error', () => {
      const error = new FileProcessingError('Teste');
      
      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
    });

    it('deve permitir captura com try/catch', () => {
      let caughtError = null;
      
      try {
        throw new FileProcessingError('Erro de processamento de arquivo');
      } catch (error) {
        caughtError = error;
      }
      
      expect(caughtError).toBeInstanceOf(FileProcessingError);
      expect(caughtError.message).toBe('Erro de processamento de arquivo');
    });
  });

  describe('CalendarError', () => {
    it('deve criar uma instância de CalendarError com mensagem', () => {
      const error = new CalendarError('Erro no calendário');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(CalendarError);
      expect(error.message).toBe('Erro no calendário');
      expect(error.name).toBe('CalendarError');
      expect(error.type).toBe('CALENDAR_ERROR');
      expect(error.calendarId).toBeNull();
    });

    it('deve criar uma instância de CalendarError com mensagem e ID do calendário', () => {
      const error = new CalendarError('Calendário não encontrado', 'primary');
      
      expect(error.message).toBe('Calendário não encontrado');
      expect(error.name).toBe('CalendarError');
      expect(error.type).toBe('CALENDAR_ERROR');
      expect(error.calendarId).toBe('primary');
    });

    it('deve herdar corretamente de Error', () => {
      const error = new CalendarError('Teste');
      
      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
    });

    it('deve permitir captura com try/catch', () => {
      let caughtError = null;
      
      try {
        throw new CalendarError('Erro de calendário');
      } catch (error) {
        caughtError = error;
      }
      
      expect(caughtError).toBeInstanceOf(CalendarError);
      expect(caughtError.message).toBe('Erro de calendário');
    });
  });

  describe('TokenError', () => {
    it('deve criar uma instância de TokenError com mensagem', () => {
      const error = new TokenError('Erro no token');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(TokenError);
      expect(error.message).toBe('Erro no token');
      expect(error.name).toBe('TokenError');
      expect(error.type).toBe('TOKEN_ERROR');
      expect(error.tokenType).toBeNull();
    });

    it('deve criar uma instância de TokenError com mensagem e tipo de token', () => {
      const error = new TokenError('Token de acesso inválido', 'access_token');
      
      expect(error.message).toBe('Token de acesso inválido');
      expect(error.name).toBe('TokenError');
      expect(error.type).toBe('TOKEN_ERROR');
      expect(error.tokenType).toBe('access_token');
    });

    it('deve herdar corretamente de Error', () => {
      const error = new TokenError('Teste');
      
      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
    });

    it('deve permitir captura com try/catch', () => {
      let caughtError = null;
      
      try {
        throw new TokenError('Erro de token');
      } catch (error) {
        caughtError = error;
      }
      
      expect(caughtError).toBeInstanceOf(TokenError);
      expect(caughtError.message).toBe('Erro de token');
    });
  });

  describe('Comportamento geral das classes de erro', () => {
    it('todas as classes devem ter propriedades name e type corretas', () => {
      const errors = [
        { class: ValidationError, name: 'ValidationError', type: 'VALIDATION_ERROR' },
        { class: AuthenticationError, name: 'AuthenticationError', type: 'AUTHENTICATION_ERROR' },
        { class: ConfigurationError, name: 'ConfigurationError', type: 'CONFIGURATION_ERROR' },
        { class: FileProcessingError, name: 'FileProcessingError', type: 'FILE_PROCESSING_ERROR' },
        { class: CalendarError, name: 'CalendarError', type: 'CALENDAR_ERROR' },
        { class: TokenError, name: 'TokenError', type: 'TOKEN_ERROR' }
      ];

      errors.forEach(({ class: ErrorClass, name, type }) => {
        const error = new ErrorClass('Teste');
        expect(error.name).toBe(name);
        expect(error.type).toBe(type);
      });
    });

    it('todas as classes devem herdar de Error', () => {
      const errorClasses = [
        ValidationError,
        AuthenticationError,
        ConfigurationError,
        FileProcessingError,
        CalendarError,
        TokenError
      ];

      errorClasses.forEach(ErrorClass => {
        const error = new ErrorClass('Teste');
        expect(error).toBeInstanceOf(Error);
        expect(error.stack).toBeDefined();
      });
    });

    it('deve permitir verificação de tipo usando instanceof', () => {
      const validationError = new ValidationError('Teste');
      const authError = new AuthenticationError('Teste');
      const configError = new ConfigurationError('Teste');

      expect(validationError instanceof ValidationError).toBe(true);
      expect(validationError instanceof Error).toBe(true);
      expect(validationError instanceof AuthenticationError).toBe(false);

      expect(authError instanceof AuthenticationError).toBe(true);
      expect(authError instanceof Error).toBe(true);
      expect(authError instanceof ValidationError).toBe(false);

      expect(configError instanceof ConfigurationError).toBe(true);
      expect(configError instanceof Error).toBe(true);
      expect(configError instanceof ValidationError).toBe(false);
    });
  });
});
