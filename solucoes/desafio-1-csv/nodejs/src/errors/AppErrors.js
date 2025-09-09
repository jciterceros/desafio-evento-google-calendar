/**
 * Classes de erro customizadas
 * Melhora o tratamento de erros e facilita debugging
 */

/**
 * Erro de validação
 */
export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.type = 'VALIDATION_ERROR';
  }
}

/**
 * Erro de autenticação
 */
export class AuthenticationError extends Error {
  constructor(message, code = null) {
    super(message);
    this.name = 'AuthenticationError';
    this.code = code;
    this.type = 'AUTHENTICATION_ERROR';
  }
}

/**
 * Erro de configuração
 */
export class ConfigurationError extends Error {
  constructor(message, configKey = null) {
    super(message);
    this.name = 'ConfigurationError';
    this.configKey = configKey;
    this.type = 'CONFIGURATION_ERROR';
  }
}

/**
 * Erro de processamento de arquivo
 */
export class FileProcessingError extends Error {
  constructor(message, filePath = null) {
    super(message);
    this.name = 'FileProcessingError';
    this.filePath = filePath;
    this.type = 'FILE_PROCESSING_ERROR';
  }
}

/**
 * Erro de calendário
 */
export class CalendarError extends Error {
  constructor(message, calendarId = null) {
    super(message);
    this.name = 'CalendarError';
    this.calendarId = calendarId;
    this.type = 'CALENDAR_ERROR';
  }
}

/**
 * Erro de token
 */
export class TokenError extends Error {
  constructor(message, tokenType = null) {
    super(message);
    this.name = 'TokenError';
    this.tokenType = tokenType;
    this.type = 'TOKEN_ERROR';
  }
}
