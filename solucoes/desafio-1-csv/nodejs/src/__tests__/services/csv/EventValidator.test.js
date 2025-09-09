import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventValidator } from '../../../services/csv/EventValidator.js';
import { Event } from '../../../models/Event.js';
import { ValidationUtils } from '../../../utils/ValidationUtils.js';

// Mock ValidationUtils
vi.mock('../../../utils/ValidationUtils.js', () => ({
  ValidationUtils: {
    validateEvent: vi.fn()
  }
}));

describe('EventValidator', () => {
  let eventValidator;
  let mockEvent;

  beforeEach(() => {
    eventValidator = new EventValidator();
    mockEvent = new Event({
      horario: '15/03/2024 14:30:00',
      duracao: '60',
      nomeevento: 'Evento Teste',
      notificacao: '15'
    });
    
    vi.clearAllMocks();
  });

  describe('validateEvent', () => {
    it('deve retornar resultado válido para evento válido', () => {
      ValidationUtils.validateEvent.mockImplementation(() => {}); // não lança erro

      const result = eventValidator.validateEvent(mockEvent);

      expect(result).toEqual({
        isValid: true,
        event: mockEvent,
        errors: []
      });
      expect(ValidationUtils.validateEvent).toHaveBeenCalledWith(mockEvent.toObject());
    });

    it('deve retornar resultado inválido para evento com erro', () => {
      const errorMessage = 'horario é obrigatório';
      ValidationUtils.validateEvent.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      const result = eventValidator.validateEvent(mockEvent);

      expect(result).toEqual({
        isValid: false,
        event: mockEvent,
        errors: [errorMessage]
      });
    });

    it('deve capturar diferentes tipos de erro', () => {
      const errorMessages = [
        'duracao deve ser um número maior que zero',
        'notificacao não pode ser negativo',
        'Data inválida: formato incorreto'
      ];

      errorMessages.forEach((message, index) => {
        ValidationUtils.validateEvent.mockImplementation(() => {
          throw new Error(message);
        });

        const result = eventValidator.validateEvent(mockEvent);

        expect(result.isValid).toBe(false);
        expect(result.errors).toEqual([message]);
      });
    });
  });

  describe('validateEvents', () => {
    it('deve validar múltiplos eventos e separar válidos e inválidos', () => {
      const validEvent1 = new Event({
        horario: '15/03/2024 14:30:00',
        duracao: '60',
        nomeevento: 'Evento Válido 1',
        notificacao: '15'
      });

      const validEvent2 = new Event({
        horario: '16/03/2024 15:30:00',
        duracao: '90',
        nomeevento: 'Evento Válido 2',
        notificacao: '30'
      });

      const invalidEvent = new Event({
        horario: null,
        duracao: '60',
        nomeevento: 'Evento Inválido',
        notificacao: '15'
      });

      const events = [validEvent1, invalidEvent, validEvent2];

      // Mock para eventos válidos e inválidos
      ValidationUtils.validateEvent
        .mockImplementationOnce(() => {}) // validEvent1 - válido
        .mockImplementationOnce(() => { throw new Error('horario é obrigatório'); }) // invalidEvent - inválido
        .mockImplementationOnce(() => {}); // validEvent2 - válido

      const result = eventValidator.validateEvents(events);

      expect(result.validEvents).toHaveLength(2);
      expect(result.invalidEvents).toHaveLength(1);
      expect(result.totalValid).toBe(2);
      expect(result.totalInvalid).toBe(1);

      expect(result.validEvents[0]).toBe(validEvent1);
      expect(result.validEvents[1]).toBe(validEvent2);

      expect(result.invalidEvents[0]).toEqual({
        event: invalidEvent,
        errors: ['horario é obrigatório']
      });
    });

    it('deve retornar arrays vazios para lista vazia', () => {
      ValidationUtils.validateEvent.mockImplementation(() => {});

      const result = eventValidator.validateEvents([]);

      expect(result.validEvents).toEqual([]);
      expect(result.invalidEvents).toEqual([]);
      expect(result.totalValid).toBe(0);
      expect(result.totalInvalid).toBe(0);
    });

    it('deve processar todos os eventos como inválidos', () => {
      const invalidEvent1 = new Event({
        horario: null,
        duracao: '60',
        nomeevento: 'Evento Inválido 1',
        notificacao: '15'
      });

      const invalidEvent2 = new Event({
        horario: '16/03/2024 15:30:00',
        duracao: '-10',
        nomeevento: 'Evento Inválido 2',
        notificacao: '30'
      });

      const events = [invalidEvent1, invalidEvent2];

      ValidationUtils.validateEvent
        .mockImplementationOnce(() => { throw new Error('horario é obrigatório'); })
        .mockImplementationOnce(() => { throw new Error('duracao deve ser um número maior que zero'); });

      const result = eventValidator.validateEvents(events);

      expect(result.validEvents).toEqual([]);
      expect(result.invalidEvents).toHaveLength(2);
      expect(result.totalValid).toBe(0);
      expect(result.totalInvalid).toBe(2);
    });

    it('deve processar todos os eventos como válidos', () => {
      const validEvent1 = new Event({
        horario: '15/03/2024 14:30:00',
        duracao: '60',
        nomeevento: 'Evento Válido 1',
        notificacao: '15'
      });

      const validEvent2 = new Event({
        horario: '16/03/2024 15:30:00',
        duracao: '90',
        nomeevento: 'Evento Válido 2',
        notificacao: '30'
      });

      const events = [validEvent1, validEvent2];

      ValidationUtils.validateEvent.mockImplementation(() => {}); // todos válidos

      const result = eventValidator.validateEvents(events);

      expect(result.validEvents).toHaveLength(2);
      expect(result.invalidEvents).toEqual([]);
      expect(result.totalValid).toBe(2);
      expect(result.totalInvalid).toBe(0);
    });
  });
});
