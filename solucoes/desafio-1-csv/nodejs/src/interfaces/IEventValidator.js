/**
 * Interface para validadores de eventos
 * Define o contrato que todos os validadores de eventos devem implementar
 * Princípio da Segregação de Interface (ISP)
 */
export class IEventValidator {
  /**
   * Valida um evento e retorna o resultado da validação
   * @param {Event} event - Evento para validar
   * @returns {Object} Resultado da validação
   */
  validateEvent(event) {
    throw new Error('Método validateEvent deve ser implementado pela classe filha');
  }

  /**
   * Valida múltiplos eventos
   * @param {Array<Event>} events - Array de eventos para validar
   * @returns {Object} Resultado da validação com eventos válidos e inválidos
   */
  validateEvents(events) {
    throw new Error('Método validateEvents deve ser implementado pela classe filha');
  }

}
