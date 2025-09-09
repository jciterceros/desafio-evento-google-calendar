import { ValidationUtils } from '../../utils/ValidationUtils.js';
import { IEventValidator } from '../../interfaces/IEventValidator.js';

/**
 * Serviço responsável apenas por validar eventos
 * Princípio da Responsabilidade Única (SRP)
 * Implementa IEventValidator
 */
export class EventValidator extends IEventValidator {
  constructor() {
    super();
  }
  /**
   * Valida um evento e retorna o resultado da validação
   * @param {Event} event - Evento para validar
   * @returns {Object} Resultado da validação
   */
  validateEvent(event) {
    try {
      // Validar campos obrigatórios e formato
      ValidationUtils.validateEvent(event.toObject());
      
      return {
        isValid: true,
        event: event,
        errors: []
      };
    } catch (error) {
      return {
        isValid: false,
        event: event,
        errors: [error.message]
      };
    }
  }

  /**
   * Valida múltiplos eventos
   * @param {Array<Event>} events - Array de eventos para validar
   * @returns {Object} Resultado da validação com eventos válidos e inválidos
   */
  validateEvents(events) {
    const validEvents = [];
    const invalidEvents = [];

    events.forEach(event => {
      const validation = this.validateEvent(event);
      
      if (validation.isValid) {
        validEvents.push(validation.event);
      } else {
        invalidEvents.push({
          event: validation.event,
          errors: validation.errors
        });
      }
    });

    return {
      validEvents,
      invalidEvents,
      totalValid: validEvents.length,
      totalInvalid: invalidEvents.length
    };
  }

}
