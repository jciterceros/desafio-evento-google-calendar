/**
 * Testes unitários para a interface IEventValidator
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { IEventValidator } from '../../interfaces/IEventValidator.js';

describe('IEventValidator', () => {
  let validator;

  beforeEach(() => {
    validator = new IEventValidator();
  });

  describe('validateEvent', () => {
    it('deve lançar erro quando método não é implementado', () => {
      const mockEvent = { id: 1, name: 'Test Event' };
      
      expect(() => {
        validator.validateEvent(mockEvent);
      }).toThrow('Método validateEvent deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', () => {
      const mockEvent = { id: 1, name: 'Test Event' };
      
      expect(() => {
        validator.validateEvent(mockEvent);
      }).toThrow(Error);
    });
  });

  describe('validateEvents', () => {
    it('deve lançar erro quando método não é implementado', () => {
      const mockEvents = [
        { id: 1, name: 'Event 1' },
        { id: 2, name: 'Event 2' }
      ];
      
      expect(() => {
        validator.validateEvents(mockEvents);
      }).toThrow('Método validateEvents deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', () => {
      const mockEvents = [
        { id: 1, name: 'Event 1' },
        { id: 2, name: 'Event 2' }
      ];
      
      expect(() => {
        validator.validateEvents(mockEvents);
      }).toThrow(Error);
    });
  });

  describe('herança e estrutura', () => {
    it('deve ser uma classe que pode ser instanciada', () => {
      expect(validator).toBeInstanceOf(IEventValidator);
    });

    it('deve ter o método validateEvent definido', () => {
      expect(typeof validator.validateEvent).toBe('function');
    });

    it('deve ter o método validateEvents definido', () => {
      expect(typeof validator.validateEvents).toBe('function');
    });
  });

  describe('implementação de interface', () => {
    it('deve permitir herança e implementação dos métodos', () => {
      class MockEventValidator extends IEventValidator {
        validateEvent(event) {
          return { valid: true, event };
        }

        validateEvents(events) {
          return { 
            valid: events,
            invalid: []
          };
        }
      }

      const mockValidator = new MockEventValidator();
      const mockEvent = { id: 1, name: 'Test Event' };
      const mockEvents = [mockEvent];

      expect(mockValidator.validateEvent(mockEvent)).toEqual({
        valid: true,
        event: mockEvent
      });

      expect(mockValidator.validateEvents(mockEvents)).toEqual({
        valid: mockEvents,
        invalid: []
      });
    });
  });
});
