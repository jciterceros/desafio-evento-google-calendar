import { DateUtils } from './DateUtils.js';

/**
 * Utilitários para validação
 * Responsabilidade única: validações de dados
 */
export class ValidationUtils {
  /**
   * Valida se um valor não é nulo, undefined ou string vazia
   * @param {any} value - Valor para validar
   * @param {string} fieldName - Nome do campo para mensagem de erro
   * @throws {Error} Se o valor for inválido
   */
  static validateRequired(value, fieldName) {
    if (value === null || value === undefined || value === '') {
      throw new Error(`${fieldName} é obrigatório`);
    }
  }

  /**
   * Valida se um número é positivo
   * @param {number} value - Valor para validar
   * @param {string} fieldName - Nome do campo para mensagem de erro
   * @throws {Error} Se o valor for inválido
   */
  static validatePositiveNumber(value, fieldName) {
    if (typeof value !== 'number' || value <= 0) {
      throw new Error(`${fieldName} deve ser um número maior que zero`);
    }
  }

  /**
   * Valida se um número é não-negativo
   * @param {number} value - Valor para validar
   * @param {string} fieldName - Nome do campo para mensagem de erro
   * @throws {Error} Se o valor for inválido
   */
  static validateNonNegativeNumber(value, fieldName) {
    if (typeof value !== 'number' || value < 0) {
      throw new Error(`${fieldName} não pode ser negativo`);
    }
  }

  /**
   * Valida formato de data/hora
   * @param {string} dateString - String de data para validar
   * @param {string} fieldName - Nome do campo para mensagem de erro
   * @throws {Error} Se o formato for inválido
   */
  static validateDateTimeFormat(dateString, fieldName) {
    if (!DateUtils.isValidDateTimeFormat(dateString)) {
      throw new Error(`${fieldName} deve estar no formato DD/MM/YYYY HH:mm:ss`);
    }
  }

  /**
   * Valida um evento completo
   * @param {Object} event - Objeto evento para validar
   * @throws {Error} Se o evento for inválido
   */
  static validateEvent(event) {
    // Campos obrigatórios
    this.validateRequired(event.horario, 'horario');
    this.validateRequired(event.duracao, 'duracao');
    this.validateRequired(event.nomeevento, 'nomeevento');
    this.validateRequired(event.notificacao, 'notificacao');

    // Validações específicas
    this.validateDateTimeFormat(event.horario, 'horario');
    this.validatePositiveNumber(event.duracao, 'duracao');
    this.validateNonNegativeNumber(event.notificacao, 'notificacao');

    // Validar se a data é válida
    try {
      DateUtils.parseDateTime(event.horario);
    } catch (error) {
      throw new Error(`Data inválida: ${error.message}`);
    }
  }

  /**
   * Valida dados de evento para Google Calendar
   * @param {Object} eventData - Dados do evento para validar
   * @throws {Error} Se os dados forem inválidos
   */
  static validateCalendarEventData(eventData) {
    this.validateRequired(eventData.nomeevento, 'nomeevento');
    this.validateRequired(eventData.startDateTime, 'startDateTime');
    this.validateRequired(eventData.endDateTime, 'startDateTime');

    // Validar se as datas são válidas
    const startDate = new Date(eventData.startDateTime);
    const endDate = new Date(eventData.endDateTime);

    if (!DateUtils.isValidDate(startDate)) {
      throw new Error('startDateTime deve ser uma data válida');
    }

    if (!DateUtils.isValidDate(endDate)) {
      throw new Error('endDateTime deve ser uma data válida');
    }

    if (endDate <= startDate) {
      throw new Error('endDateTime deve ser posterior a startDateTime');
    }
  }
}
