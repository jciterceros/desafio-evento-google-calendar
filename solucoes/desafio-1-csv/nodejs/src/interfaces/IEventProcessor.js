/**
 * Interface para processadores de eventos
 * Define o contrato que todos os processadores de eventos devem implementar
 * Princípio da Segregação de Interface (ISP)
 */
export class IEventProcessor {
  /**
   * Processa um evento individual
   * @param {Event} event - Evento para processar
   * @returns {Object} Resultado do processamento
   */
  processEvent(event) {
    throw new Error('Método processEvent deve ser implementado pela classe filha');
  }

  /**
   * Processa múltiplos eventos
   * @param {Array<Event>} events - Array de eventos para processar
   * @returns {Object} Resultado do processamento
   */
  processEvents(events) {
    throw new Error('Método processEvents deve ser implementado pela classe filha');
  }

}
