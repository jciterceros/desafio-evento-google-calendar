/**
 * Utilitários para manipulação de datas
 * Responsabilidade única: operações com datas
 */
export class DateUtils {
  /**
   * Converte string de data no formato DD/MM/YYYY HH:mm:ss para Date
   * @param {string} dateString - String no formato DD/MM/YYYY HH:mm:ss
   * @returns {Date} Objeto Date
   * @throws {Error} Se o formato for inválido
   */
  static parseDateTime(dateString) {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;
    const match = dateString.match(dateRegex);
    
    if (!match) {
      throw new Error('Formato de data inválido. Use DD/MM/YYYY HH:mm:ss');
    }
    
    const [, day, month, year, hour, minute, second] = match;
    const date = new Date(
      parseInt(year), 
      parseInt(month) - 1, 
      parseInt(day), 
      parseInt(hour), 
      parseInt(minute), 
      parseInt(second)
    );
    
    if (isNaN(date.getTime())) {
      throw new Error('Data inválida');
    }
    
    return date;
  }

  /**
   * Calcula o horário de fim baseado na data de início e duração em minutos
   * @param {Date} startDate - Data de início
   * @param {number} durationMinutes - Duração em minutos
   * @returns {Date} Data de fim
   */
  static calculateEndTime(startDate, durationMinutes) {
    if (!(startDate instanceof Date)) {
      throw new Error('startDate deve ser uma instância de Date');
    }
    
    if (typeof durationMinutes !== 'number' || durationMinutes <= 0) {
      throw new Error('durationMinutes deve ser um número positivo');
    }
    
    return new Date(startDate.getTime() + (durationMinutes * 60 * 1000));
  }

  /**
   * Formata data para ISO string (formato Google Calendar)
   * @param {Date} date - Data para formatar
   * @returns {string} Data em formato ISO
   */
  static formatForGoogleCalendar(date) {
    if (!(date instanceof Date)) {
      throw new Error('date deve ser uma instância de Date');
    }
    
    return date.toISOString();
  }

  /**
   * Valida se uma string está no formato de data esperado
   * @param {string} dateString - String para validar
   * @returns {boolean} True se válido
   */
  static isValidDateTimeFormat(dateString) {
    const dateRegex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/;
    return dateRegex.test(dateString);
  }

  /**
   * Verifica se uma data é válida
   * @param {Date} date - Data para verificar
   * @returns {boolean} True se válida
   */
  static isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
  }
}
