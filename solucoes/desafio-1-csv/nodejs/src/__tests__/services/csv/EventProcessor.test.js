import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventProcessor } from '../../../services/csv/EventProcessor.js';
import { Event } from '../../../models/Event.js';
import { CalendarEvent } from '../../../models/CalendarEvent.js';
import { DateUtils } from '../../../utils/DateUtils.js';
import { ValidationUtils } from '../../../utils/ValidationUtils.js';

// Mock das dependências
vi.mock('../../../utils/DateUtils.js', () => ({
  DateUtils: {
    parseDateTime: vi.fn(),
    calculateEndTime: vi.fn()
  }
}));

vi.mock('../../../utils/ValidationUtils.js', () => ({
  ValidationUtils: {
    validateEvent: vi.fn()
  }
}));

describe('EventProcessor', () => {
  let eventProcessor;
  let mockEvent;
  let mockStartDate;
  let mockEndDate;

  beforeEach(() => {
    eventProcessor = new EventProcessor();
    mockEvent = new Event({
      horario: '15/03/2024 14:30:00',
      duracao: '60',
      nomeevento: 'Evento Teste',
      notificacao: '15'
    });
    
    mockStartDate = new Date('2024-03-15T14:30:00.000Z');
    mockEndDate = new Date('2024-03-15T15:30:00.000Z');
    
    vi.clearAllMocks();
  });

  describe('processEvent', () => {
    it('deve processar evento válido com sucesso', () => {
      ValidationUtils.validateEvent.mockImplementation(() => {});
      DateUtils.parseDateTime.mockReturnValue(mockStartDate);
      DateUtils.calculateEndTime.mockReturnValue(mockEndDate);

      const result = eventProcessor.processEvent(mockEvent);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        nomeevento: 'Evento Teste',
        startDateTime: '2024-03-15T14:30:00.000Z',
        endDateTime: '2024-03-15T15:30:00.000Z',
        notificacao: 15
      });
      expect(result.calendarEvent).toBeInstanceOf(CalendarEvent);
      expect(result.originalData).toEqual(mockEvent.toObject());

      expect(ValidationUtils.validateEvent).toHaveBeenCalledWith(mockEvent.toObject());
      expect(DateUtils.parseDateTime).toHaveBeenCalledWith('15/03/2024 14:30:00');
      expect(DateUtils.calculateEndTime).toHaveBeenCalledWith(mockStartDate, 60);
    });

    it('deve retornar erro para evento inválido', () => {
      const errorMessage = 'horario é obrigatório';
      ValidationUtils.validateEvent.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      const result = eventProcessor.processEvent(mockEvent);

      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(result.originalData).toEqual(mockEvent.toObject());
      expect(result.data).toBeUndefined();
      expect(result.calendarEvent).toBeUndefined();
    });

    it('deve retornar erro para data inválida', () => {
      ValidationUtils.validateEvent.mockImplementation(() => {});
      DateUtils.parseDateTime.mockImplementation(() => {
        throw new Error('Data inválida');
      });

      const result = eventProcessor.processEvent(mockEvent);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Data inválida');
    });

    it('deve retornar erro para cálculo de fim inválido', () => {
      ValidationUtils.validateEvent.mockImplementation(() => {});
      DateUtils.parseDateTime.mockReturnValue(mockStartDate);
      DateUtils.calculateEndTime.mockImplementation(() => {
        throw new Error('Duração inválida');
      });

      const result = eventProcessor.processEvent(mockEvent);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Duração inválida');
    });
  });

  describe('processEvents', () => {
    it('deve processar múltiplos eventos com sucesso', () => {
      const event1 = new Event({
        horario: '15/03/2024 14:30:00',
        duracao: '60',
        nomeevento: 'Evento 1',
        notificacao: '15'
      });

      const event2 = new Event({
        horario: '16/03/2024 15:30:00',
        duracao: '90',
        nomeevento: 'Evento 2',
        notificacao: '30'
      });

      const events = [event1, event2];

      ValidationUtils.validateEvent.mockImplementation(() => {});
      DateUtils.parseDateTime
        .mockReturnValueOnce(new Date('2024-03-15T14:30:00'))
        .mockReturnValueOnce(new Date('2024-03-16T15:30:00'));
      DateUtils.calculateEndTime
        .mockReturnValueOnce(new Date('2024-03-15T15:30:00'))
        .mockReturnValueOnce(new Date('2024-03-16T17:00:00'));

      const result = eventProcessor.processEvents(events);

      expect(result.totalProcessed).toBe(2);
      expect(result.totalSuccessful).toBe(2);
      expect(result.totalFailed).toBe(0);
      expect(result.successfulEvents).toHaveLength(2);
      expect(result.failedEvents).toHaveLength(0);
      expect(result.processedEvents).toHaveLength(2);
    });

    it('deve processar eventos com alguns falhando', () => {
      const validEvent = new Event({
        horario: '15/03/2024 14:30:00',
        duracao: '60',
        nomeevento: 'Evento Válido',
        notificacao: '15'
      });

      const invalidEvent = new Event({
        horario: null,
        duracao: '60',
        nomeevento: 'Evento Inválido',
        notificacao: '15'
      });

      const events = [validEvent, invalidEvent];

      ValidationUtils.validateEvent
        .mockImplementationOnce(() => {}) // evento válido
        .mockImplementationOnce(() => { throw new Error('horario é obrigatório'); }); // evento inválido

      DateUtils.parseDateTime.mockReturnValue(new Date('2024-03-15T14:30:00'));
      DateUtils.calculateEndTime.mockReturnValue(new Date('2024-03-15T15:30:00'));

      const result = eventProcessor.processEvents(events);

      expect(result.totalProcessed).toBe(2);
      expect(result.totalSuccessful).toBe(1);
      expect(result.totalFailed).toBe(1);
      expect(result.successfulEvents).toHaveLength(1);
      expect(result.failedEvents).toHaveLength(1);
    });

    it('deve processar todos os eventos como falhando', () => {
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

      const result = eventProcessor.processEvents(events);

      expect(result.totalProcessed).toBe(2);
      expect(result.totalSuccessful).toBe(0);
      expect(result.totalFailed).toBe(2);
      expect(result.successfulEvents).toHaveLength(0);
      expect(result.failedEvents).toHaveLength(2);
    });

    it('deve retornar resultado vazio para array vazio', () => {
      const result = eventProcessor.processEvents([]);

      expect(result.totalProcessed).toBe(0);
      expect(result.totalSuccessful).toBe(0);
      expect(result.totalFailed).toBe(0);
      expect(result.successfulEvents).toEqual([]);
      expect(result.failedEvents).toEqual([]);
      expect(result.processedEvents).toEqual([]);
    });
  });
});
