import { describe, it, expect } from 'vitest';
import { APP_CONSTANTS } from '../../constants/AppConstants.js';

describe('AppConstants', () => {
  describe('Estrutura geral', () => {
    it('deve exportar APP_CONSTANTS como objeto', () => {
      // Assert
      expect(APP_CONSTANTS).toBeDefined();
      expect(typeof APP_CONSTANTS).toBe('object');
      expect(APP_CONSTANTS).not.toBeNull();
    });

    it('deve ter todas as propriedades principais', () => {
      // Assert
      expect(APP_CONSTANTS).toHaveProperty('CSV_SEPARATOR');
      expect(APP_CONSTANTS).toHaveProperty('DEFAULT_CALENDAR_ID');
      expect(APP_CONSTANTS).toHaveProperty('DEFAULT_TIMEZONE');
      expect(APP_CONSTANTS).toHaveProperty('TOKEN_BUFFER_MINUTES');
      expect(APP_CONSTANTS).toHaveProperty('TOKEN_FILE_PATH');
      expect(APP_CONSTANTS).toHaveProperty('CALLBACK_PORT');
      expect(APP_CONSTANTS).toHaveProperty('CALLBACK_PATH');
      expect(APP_CONSTANTS).toHaveProperty('DEFAULT_CSV_FILE');
      expect(APP_CONSTANTS).toHaveProperty('DEFAULT_OUTPUT_FILE');
      expect(APP_CONSTANTS).toHaveProperty('GOOGLE_CALENDAR_SCOPES');
      expect(APP_CONSTANTS).toHaveProperty('DATE_TIME_FORMAT');
      expect(APP_CONSTANTS).toHaveProperty('DATE_TIME_REGEX');
      expect(APP_CONSTANTS).toHaveProperty('MESSAGES');
    });
  });

  describe('CSV_SEPARATOR', () => {
    it('deve ser um ponto e vírgula', () => {
      // Assert
      expect(APP_CONSTANTS.CSV_SEPARATOR).toBe(';');
    });

    it('deve ser uma string', () => {
      // Assert
      expect(typeof APP_CONSTANTS.CSV_SEPARATOR).toBe('string');
    });

    it('deve ter comprimento de 1 caractere', () => {
      // Assert
      expect(APP_CONSTANTS.CSV_SEPARATOR).toHaveLength(1);
    });
  });

  describe('DEFAULT_CALENDAR_ID', () => {
    it('deve ser "primary"', () => {
      // Assert
      expect(APP_CONSTANTS.DEFAULT_CALENDAR_ID).toBe('primary');
    });

    it('deve ser uma string', () => {
      // Assert
      expect(typeof APP_CONSTANTS.DEFAULT_CALENDAR_ID).toBe('string');
    });

    it('deve ser não vazio', () => {
      // Assert
      expect(APP_CONSTANTS.DEFAULT_CALENDAR_ID).toBeTruthy();
      expect(APP_CONSTANTS.DEFAULT_CALENDAR_ID.length).toBeGreaterThan(0);
    });
  });

  describe('DEFAULT_TIMEZONE', () => {
    it('deve ser "America/Sao_Paulo"', () => {
      // Assert
      expect(APP_CONSTANTS.DEFAULT_TIMEZONE).toBe('America/Sao_Paulo');
    });

    it('deve ser uma string', () => {
      // Assert
      expect(typeof APP_CONSTANTS.DEFAULT_TIMEZONE).toBe('string');
    });

    it('deve conter informações de timezone válidas', () => {
      // Assert
      expect(APP_CONSTANTS.DEFAULT_TIMEZONE).toContain('America/');
      expect(APP_CONSTANTS.DEFAULT_TIMEZONE).toContain('Sao_Paulo');
    });
  });

  describe('TOKEN_BUFFER_MINUTES', () => {
    it('deve ser 5', () => {
      // Assert
      expect(APP_CONSTANTS.TOKEN_BUFFER_MINUTES).toBe(5);
    });

    it('deve ser um número', () => {
      // Assert
      expect(typeof APP_CONSTANTS.TOKEN_BUFFER_MINUTES).toBe('number');
    });

    it('deve ser um número positivo', () => {
      // Assert
      expect(APP_CONSTANTS.TOKEN_BUFFER_MINUTES).toBeGreaterThan(0);
    });

    it('deve ser um número inteiro', () => {
      // Assert
      expect(Number.isInteger(APP_CONSTANTS.TOKEN_BUFFER_MINUTES)).toBe(true);
    });
  });

  describe('TOKEN_FILE_PATH', () => {
    it('deve ser "./config/tokens.json"', () => {
      // Assert
      expect(APP_CONSTANTS.TOKEN_FILE_PATH).toBe('./config/tokens.json');
    });

    it('deve ser uma string', () => {
      // Assert
      expect(typeof APP_CONSTANTS.TOKEN_FILE_PATH).toBe('string');
    });

    it('deve terminar com .json', () => {
      // Assert
      expect(APP_CONSTANTS.TOKEN_FILE_PATH).toMatch(/\.json$/);
    });

    it('deve conter "config" no caminho', () => {
      // Assert
      expect(APP_CONSTANTS.TOKEN_FILE_PATH).toContain('config');
    });
  });

  describe('CALLBACK_PORT', () => {
    it('deve ser 3000', () => {
      // Assert
      expect(APP_CONSTANTS.CALLBACK_PORT).toBe(3000);
    });

    it('deve ser um número', () => {
      // Assert
      expect(typeof APP_CONSTANTS.CALLBACK_PORT).toBe('number');
    });

    it('deve ser uma porta válida', () => {
      // Assert
      expect(APP_CONSTANTS.CALLBACK_PORT).toBeGreaterThan(0);
      expect(APP_CONSTANTS.CALLBACK_PORT).toBeLessThanOrEqual(65535);
    });

    it('deve ser um número inteiro', () => {
      // Assert
      expect(Number.isInteger(APP_CONSTANTS.CALLBACK_PORT)).toBe(true);
    });
  });

  describe('CALLBACK_PATH', () => {
    it('deve ser "/callback"', () => {
      // Assert
      expect(APP_CONSTANTS.CALLBACK_PATH).toBe('/callback');
    });

    it('deve ser uma string', () => {
      // Assert
      expect(typeof APP_CONSTANTS.CALLBACK_PATH).toBe('string');
    });

    it('deve começar com "/"', () => {
      // Assert
      expect(APP_CONSTANTS.CALLBACK_PATH).toMatch(/^\//);
    });

    it('deve conter "callback"', () => {
      // Assert
      expect(APP_CONSTANTS.CALLBACK_PATH).toContain('callback');
    });
  });

  describe('DEFAULT_CSV_FILE', () => {
    it('deve ser "./data/eventos.csv"', () => {
      // Assert
      expect(APP_CONSTANTS.DEFAULT_CSV_FILE).toBe('./data/eventos.csv');
    });

    it('deve ser uma string', () => {
      // Assert
      expect(typeof APP_CONSTANTS.DEFAULT_CSV_FILE).toBe('string');
    });

    it('deve terminar com .csv', () => {
      // Assert
      expect(APP_CONSTANTS.DEFAULT_CSV_FILE).toMatch(/\.csv$/);
    });

    it('deve conter "data" no caminho', () => {
      // Assert
      expect(APP_CONSTANTS.DEFAULT_CSV_FILE).toContain('data');
    });
  });

  describe('DEFAULT_OUTPUT_FILE', () => {
    it('deve ser "./output/results.json"', () => {
      // Assert
      expect(APP_CONSTANTS.DEFAULT_OUTPUT_FILE).toBe('./output/results.json');
    });

    it('deve ser uma string', () => {
      // Assert
      expect(typeof APP_CONSTANTS.DEFAULT_OUTPUT_FILE).toBe('string');
    });

    it('deve terminar com .json', () => {
      // Assert
      expect(APP_CONSTANTS.DEFAULT_OUTPUT_FILE).toMatch(/\.json$/);
    });

    it('deve conter "output" no caminho', () => {
      // Assert
      expect(APP_CONSTANTS.DEFAULT_OUTPUT_FILE).toContain('output');
    });
  });

  describe('GOOGLE_CALENDAR_SCOPES', () => {
    it('deve ser um array', () => {
      // Assert
      expect(Array.isArray(APP_CONSTANTS.GOOGLE_CALENDAR_SCOPES)).toBe(true);
    });

    it('deve ter 2 elementos', () => {
      // Assert
      expect(APP_CONSTANTS.GOOGLE_CALENDAR_SCOPES).toHaveLength(2);
    });

    it('deve conter scope de calendar', () => {
      // Assert
      expect(APP_CONSTANTS.GOOGLE_CALENDAR_SCOPES).toContain(
        'https://www.googleapis.com/auth/calendar'
      );
    });

    it('deve conter scope de calendar.events', () => {
      // Assert
      expect(APP_CONSTANTS.GOOGLE_CALENDAR_SCOPES).toContain(
        'https://www.googleapis.com/auth/calendar.events'
      );
    });

    it('deve ter todos os elementos como strings', () => {
      // Assert
      APP_CONSTANTS.GOOGLE_CALENDAR_SCOPES.forEach(scope => {
        expect(typeof scope).toBe('string');
      });
    });

    it('deve ter todos os elementos começando com https://www.googleapis.com', () => {
      // Assert
      APP_CONSTANTS.GOOGLE_CALENDAR_SCOPES.forEach(scope => {
        expect(scope).toMatch(/^https:\/\/www\.googleapis\.com/);
      });
    });

    it('deve ter elementos únicos', () => {
      // Arrange
      const uniqueScopes = [...new Set(APP_CONSTANTS.GOOGLE_CALENDAR_SCOPES)];

      // Assert
      expect(uniqueScopes).toHaveLength(APP_CONSTANTS.GOOGLE_CALENDAR_SCOPES.length);
    });
  });

  describe('DATE_TIME_FORMAT', () => {
    it('deve ser "DD/MM/YYYY HH:mm:ss"', () => {
      // Assert
      expect(APP_CONSTANTS.DATE_TIME_FORMAT).toBe('DD/MM/YYYY HH:mm:ss');
    });

    it('deve ser uma string', () => {
      // Assert
      expect(typeof APP_CONSTANTS.DATE_TIME_FORMAT).toBe('string');
    });

    it('deve conter formato de data brasileiro', () => {
      // Assert
      expect(APP_CONSTANTS.DATE_TIME_FORMAT).toContain('DD/MM/YYYY');
    });

    it('deve conter formato de hora', () => {
      // Assert
      expect(APP_CONSTANTS.DATE_TIME_FORMAT).toContain('HH:mm:ss');
    });
  });

  describe('DATE_TIME_REGEX', () => {
    it('deve ser uma expressão regular', () => {
      // Assert
      expect(APP_CONSTANTS.DATE_TIME_REGEX).toBeInstanceOf(RegExp);
    });

    it('deve validar formato DD/MM/YYYY HH:mm:ss', () => {
      // Arrange
      const validDate = '25/12/2023 14:30:45';
      const invalidDate1 = '2023-12-25 14:30:45';
      const invalidDate2 = '25/12/23 14:30:45';
      const invalidDate3 = '25/12/2023 14:30';

      // Assert
      expect(APP_CONSTANTS.DATE_TIME_REGEX.test(validDate)).toBe(true);
      expect(APP_CONSTANTS.DATE_TIME_REGEX.test(invalidDate1)).toBe(false);
      expect(APP_CONSTANTS.DATE_TIME_REGEX.test(invalidDate2)).toBe(false);
      expect(APP_CONSTANTS.DATE_TIME_REGEX.test(invalidDate3)).toBe(false);
    });

    it('deve capturar grupos de data e hora', () => {
      // Arrange
      const testDate = '25/12/2023 14:30:45';
      const match = testDate.match(APP_CONSTANTS.DATE_TIME_REGEX);

      // Assert
      expect(match).not.toBeNull();
      expect(match[1]).toBe('25'); // dia
      expect(match[2]).toBe('12'); // mês
      expect(match[3]).toBe('2023'); // ano
      expect(match[4]).toBe('14'); // hora
      expect(match[5]).toBe('30'); // minuto
      expect(match[6]).toBe('45'); // segundo
    });

    it('deve rejeitar datas inválidas', () => {
      // Arrange
      const invalidDates = [
        '25/12/2023', // sem hora
        '14:30:45', // sem data
        '25-12-2023 14:30:45', // formato errado
        '25/12/2023 14:30:45:123' // formato errado
      ];

      // Assert
      invalidDates.forEach(date => {
        expect(APP_CONSTANTS.DATE_TIME_REGEX.test(date)).toBe(false);
      });
    });

    it('deve aceitar datas que passam na regex mas podem ser inválidas logicamente', () => {
      // Arrange
      const logicallyInvalidButRegexValid = [
        '32/12/2023 14:30:45', // dia inválido
        '25/13/2023 14:30:45', // mês inválido
        '25/12/2023 25:30:45', // hora inválida
        '25/12/2023 14:60:45', // minuto inválido
        '25/12/2023 14:30:60' // segundo inválido
      ];

      // Assert
      // A regex só valida formato, não valores lógicos
      logicallyInvalidButRegexValid.forEach(date => {
        expect(APP_CONSTANTS.DATE_TIME_REGEX.test(date)).toBe(true);
      });
    });
  });

  describe('MESSAGES', () => {
    it('deve ser um objeto', () => {
      // Assert
      expect(typeof APP_CONSTANTS.MESSAGES).toBe('object');
      expect(APP_CONSTANTS.MESSAGES).not.toBeNull();
    });

    it('deve ter todas as mensagens esperadas', () => {
      // Assert
      expect(APP_CONSTANTS.MESSAGES).toHaveProperty('APP_STARTING');
      expect(APP_CONSTANTS.MESSAGES).toHaveProperty('MOCK_MODE_ACTIVATED');
      expect(APP_CONSTANTS.MESSAGES).toHaveProperty('LOADING_CREDENTIALS');
      expect(APP_CONSTANTS.MESSAGES).toHaveProperty('CHECKING_TOKENS');
      expect(APP_CONSTANTS.MESSAGES).toHaveProperty('TOKENS_NOT_FOUND');
      expect(APP_CONSTANTS.MESSAGES).toHaveProperty('TOKEN_EXPIRED');
      expect(APP_CONSTANTS.MESSAGES).toHaveProperty('APP_INITIALIZED');
      expect(APP_CONSTANTS.MESSAGES).toHaveProperty('PROCESSING_FILE');
      expect(APP_CONSTANTS.MESSAGES).toHaveProperty('EVENTS_FOUND');
      expect(APP_CONSTANTS.MESSAGES).toHaveProperty('VALID_EVENTS');
      expect(APP_CONSTANTS.MESSAGES).toHaveProperty('INVALID_EVENTS');
      expect(APP_CONSTANTS.MESSAGES).toHaveProperty('PROCESSED_SUCCESSFULLY');
      expect(APP_CONSTANTS.MESSAGES).toHaveProperty('PROCESSING_FAILED');
      expect(APP_CONSTANTS.MESSAGES).toHaveProperty('RESULTS_SAVED');
      expect(APP_CONSTANTS.MESSAGES).toHaveProperty('SUMMARY');
      expect(APP_CONSTANTS.MESSAGES).toHaveProperty('EVENTS_CREATED');
      expect(APP_CONSTANTS.MESSAGES).toHaveProperty('EVENTS_ERROR');
      expect(APP_CONSTANTS.MESSAGES).toHaveProperty('TOTAL_MOCK_EVENTS');
      expect(APP_CONSTANTS.MESSAGES).toHaveProperty('APP_EXECUTED');
    });

    it('deve ter todas as mensagens como strings', () => {
      // Assert
      Object.values(APP_CONSTANTS.MESSAGES).forEach(message => {
        expect(typeof message).toBe('string');
      });
    });

    it('deve ter mensagens não vazias', () => {
      // Assert
      Object.values(APP_CONSTANTS.MESSAGES).forEach(message => {
        expect(message.length).toBeGreaterThan(0);
      });
    });

    it('deve ter mensagens com emojis apropriados', () => {
      // Assert
      expect(APP_CONSTANTS.MESSAGES.APP_STARTING).toMatch(/🚀/);
      expect(APP_CONSTANTS.MESSAGES.MOCK_MODE_ACTIVATED).toMatch(/🔧/);
      expect(APP_CONSTANTS.MESSAGES.LOADING_CREDENTIALS).toMatch(/📋/);
      expect(APP_CONSTANTS.MESSAGES.CHECKING_TOKENS).toMatch(/🔑/);
      expect(APP_CONSTANTS.MESSAGES.TOKENS_NOT_FOUND).toMatch(/🔐/);
      expect(APP_CONSTANTS.MESSAGES.TOKEN_EXPIRED).toMatch(/🔐/);
      expect(APP_CONSTANTS.MESSAGES.APP_INITIALIZED).toMatch(/✅/);
      expect(APP_CONSTANTS.MESSAGES.PROCESSING_FILE).toMatch(/📁/);
      expect(APP_CONSTANTS.MESSAGES.EVENTS_FOUND).toMatch(/📊/);
      expect(APP_CONSTANTS.MESSAGES.VALID_EVENTS).toMatch(/✅/);
      expect(APP_CONSTANTS.MESSAGES.INVALID_EVENTS).toMatch(/❌/);
      expect(APP_CONSTANTS.MESSAGES.PROCESSED_SUCCESSFULLY).toMatch(/🔄/);
      expect(APP_CONSTANTS.MESSAGES.PROCESSING_FAILED).toMatch(/⚠️/);
      expect(APP_CONSTANTS.MESSAGES.RESULTS_SAVED).toMatch(/💾/);
      expect(APP_CONSTANTS.MESSAGES.SUMMARY).toMatch(/📊/);
      expect(APP_CONSTANTS.MESSAGES.EVENTS_CREATED).toMatch(/✅/);
      expect(APP_CONSTANTS.MESSAGES.EVENTS_ERROR).toMatch(/❌/);
      expect(APP_CONSTANTS.MESSAGES.TOTAL_MOCK_EVENTS).toMatch(/🔧/);
      expect(APP_CONSTANTS.MESSAGES.APP_EXECUTED).toMatch(/🎉/);
    });

    it('deve ter mensagens específicas com conteúdo esperado', () => {
      // Assert
      expect(APP_CONSTANTS.MESSAGES.APP_STARTING).toBe('🚀 Iniciando aplicação refatorada...');
      expect(APP_CONSTANTS.MESSAGES.MOCK_MODE_ACTIVATED).toBe('🔧 Modo mock ativado');
      expect(APP_CONSTANTS.MESSAGES.LOADING_CREDENTIALS).toBe('📋 Carregando credenciais...');
      expect(APP_CONSTANTS.MESSAGES.CHECKING_TOKENS).toBe('🔑 Verificando tokens...');
      expect(APP_CONSTANTS.MESSAGES.TOKENS_NOT_FOUND).toBe('🔐 Tokens não encontrados, iniciando autenticação...');
      expect(APP_CONSTANTS.MESSAGES.TOKEN_EXPIRED).toBe('🔐 Token expirado, iniciando autenticação...');
      expect(APP_CONSTANTS.MESSAGES.APP_INITIALIZED).toBe('✅ Aplicação inicializada com sucesso!');
      expect(APP_CONSTANTS.MESSAGES.PROCESSING_FILE).toBe('📁 Processando arquivo:');
      expect(APP_CONSTANTS.MESSAGES.EVENTS_FOUND).toBe('📊 eventos encontrados');
      expect(APP_CONSTANTS.MESSAGES.VALID_EVENTS).toBe('✅ eventos válidos');
      expect(APP_CONSTANTS.MESSAGES.INVALID_EVENTS).toBe('❌ eventos inválidos');
      expect(APP_CONSTANTS.MESSAGES.PROCESSED_SUCCESSFULLY).toBe('🔄 eventos processados com sucesso');
      expect(APP_CONSTANTS.MESSAGES.PROCESSING_FAILED).toBe('⚠️ eventos falharam no processamento');
      expect(APP_CONSTANTS.MESSAGES.RESULTS_SAVED).toBe('💾 Resultados salvos em:');
      expect(APP_CONSTANTS.MESSAGES.SUMMARY).toBe('📊 Resumo:');
      expect(APP_CONSTANTS.MESSAGES.EVENTS_CREATED).toBe('✅ eventos criados com sucesso');
      expect(APP_CONSTANTS.MESSAGES.EVENTS_ERROR).toBe('❌ eventos com erro');
      expect(APP_CONSTANTS.MESSAGES.TOTAL_MOCK_EVENTS).toBe('🔧 Total de eventos mock:');
      expect(APP_CONSTANTS.MESSAGES.APP_EXECUTED).toBe('🎉 Aplicação executada com sucesso!');
    });
  });

  describe('Imutabilidade', () => {
    it('deve ser um objeto modificável (não congelado)', () => {
      // Assert
      expect(Object.isFrozen(APP_CONSTANTS)).toBe(false);
    });

    it('deve ter propriedades configuráveis', () => {
      // Assert
      Object.keys(APP_CONSTANTS).forEach(key => {
        const descriptor = Object.getOwnPropertyDescriptor(APP_CONSTANTS, key);
        expect(descriptor.configurable).toBe(true);
      });
    });

    it('deve ter propriedades graváveis', () => {
      // Assert
      Object.keys(APP_CONSTANTS).forEach(key => {
        const descriptor = Object.getOwnPropertyDescriptor(APP_CONSTANTS, key);
        expect(descriptor.writable).toBe(true);
      });
    });

    it('deve ter MESSAGES como objeto modificável', () => {
      // Assert
      expect(Object.isFrozen(APP_CONSTANTS.MESSAGES)).toBe(false);
    });

    it('deve permitir modificação de valores (teste prático)', () => {
      // Arrange
      const originalValue = APP_CONSTANTS.CSV_SEPARATOR;
      
      // Act
      APP_CONSTANTS.CSV_SEPARATOR = ',';
      
      // Assert
      expect(APP_CONSTANTS.CSV_SEPARATOR).toBe(',');
      
      // Cleanup
      APP_CONSTANTS.CSV_SEPARATOR = originalValue;
    });
  });

  describe('Consistência de tipos', () => {
    it('deve ter tipos consistentes para todas as propriedades', () => {
      // Assert
      expect(typeof APP_CONSTANTS.CSV_SEPARATOR).toBe('string');
      expect(typeof APP_CONSTANTS.DEFAULT_CALENDAR_ID).toBe('string');
      expect(typeof APP_CONSTANTS.DEFAULT_TIMEZONE).toBe('string');
      expect(typeof APP_CONSTANTS.TOKEN_BUFFER_MINUTES).toBe('number');
      expect(typeof APP_CONSTANTS.TOKEN_FILE_PATH).toBe('string');
      expect(typeof APP_CONSTANTS.CALLBACK_PORT).toBe('number');
      expect(typeof APP_CONSTANTS.CALLBACK_PATH).toBe('string');
      expect(typeof APP_CONSTANTS.DEFAULT_CSV_FILE).toBe('string');
      expect(typeof APP_CONSTANTS.DEFAULT_OUTPUT_FILE).toBe('string');
      expect(Array.isArray(APP_CONSTANTS.GOOGLE_CALENDAR_SCOPES)).toBe(true);
      expect(typeof APP_CONSTANTS.DATE_TIME_FORMAT).toBe('string');
      expect(APP_CONSTANTS.DATE_TIME_REGEX).toBeInstanceOf(RegExp);
      expect(typeof APP_CONSTANTS.MESSAGES).toBe('object');
    });
  });

  describe('Validação de valores', () => {
    it('deve ter valores válidos para portas', () => {
      // Assert
      expect(APP_CONSTANTS.CALLBACK_PORT).toBeGreaterThan(0);
      expect(APP_CONSTANTS.CALLBACK_PORT).toBeLessThanOrEqual(65535);
    });

    it('deve ter valores válidos para timezone', () => {
      // Assert
      expect(APP_CONSTANTS.DEFAULT_TIMEZONE).toMatch(/^[A-Za-z_]+\/[A-Za-z_]+$/);
    });

    it('deve ter valores válidos para caminhos de arquivo', () => {
      // Assert
      expect(APP_CONSTANTS.TOKEN_FILE_PATH).toMatch(/^\.\/.*\.json$/);
      expect(APP_CONSTANTS.DEFAULT_CSV_FILE).toMatch(/^\.\/.*\.csv$/);
      expect(APP_CONSTANTS.DEFAULT_OUTPUT_FILE).toMatch(/^\.\/.*\.json$/);
    });

    it('deve ter valores válidos para URLs de scope', () => {
      // Assert
      APP_CONSTANTS.GOOGLE_CALENDAR_SCOPES.forEach(scope => {
        expect(scope).toMatch(/^https:\/\/www\.googleapis\.com\/auth\/calendar/);
      });
    });
  });
});
