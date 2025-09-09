/**
 * Testes unitários para a interface IEventProcessor
 */

import { describe, it, expect } from 'vitest';
import { IEventProcessor } from '../../interfaces/IEventProcessor.js';

describe('IEventProcessor', () => {
  let processor;

  beforeEach(() => {
    processor = new IEventProcessor();
  });

  describe('processEvent', () => {
    it('deve lançar erro quando método não é implementado', () => {
      const mockEvent = { id: 1, name: 'Test Event' };
      
      expect(() => {
        processor.processEvent(mockEvent);
      }).toThrow('Método processEvent deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', () => {
      const mockEvent = { id: 1, name: 'Test Event' };
      
      expect(() => {
        processor.processEvent(mockEvent);
      }).toThrow(Error);
    });
  });

  describe('processEvents', () => {
    it('deve lançar erro quando método não é implementado', () => {
      const mockEvents = [
        { id: 1, name: 'Event 1' },
        { id: 2, name: 'Event 2' }
      ];
      
      expect(() => {
        processor.processEvents(mockEvents);
      }).toThrow('Método processEvents deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', () => {
      const mockEvents = [
        { id: 1, name: 'Event 1' },
        { id: 2, name: 'Event 2' }
      ];
      
      expect(() => {
        processor.processEvents(mockEvents);
      }).toThrow(Error);
    });
  });

  describe('herança e estrutura', () => {
    it('deve ser uma classe que pode ser instanciada', () => {
      expect(processor).toBeInstanceOf(IEventProcessor);
    });

    it('deve ter o método processEvent definido', () => {
      expect(typeof processor.processEvent).toBe('function');
    });

    it('deve ter o método processEvents definido', () => {
      expect(typeof processor.processEvents).toBe('function');
    });
  });

  describe('implementação de interface', () => {
    it('deve permitir herança e implementação dos métodos', () => {
      class MockEventProcessor extends IEventProcessor {
        processEvent(event) {
          return { processed: true, event };
        }

        processEvents(events) {
          return { processed: true, events };
        }
      }

      const mockProcessor = new MockEventProcessor();
      const mockEvent = { id: 1, name: 'Test Event' };
      const mockEvents = [mockEvent];

      expect(mockProcessor.processEvent(mockEvent)).toEqual({
        processed: true,
        event: mockEvent
      });

      expect(mockProcessor.processEvents(mockEvents)).toEqual({
        processed: true,
        events: mockEvents
      });
    });
  });
});
