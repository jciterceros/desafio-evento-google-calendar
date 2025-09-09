import { describe, it, expect, vi } from 'vitest';
import { ValidationUtils } from '../../utils/ValidationUtils.js';
import { DateUtils } from '../../utils/DateUtils.js';

// Mock DateUtils para controlar o comportamento dos testes
vi.mock('../../utils/DateUtils.js', () => ({
  DateUtils: {
    isValidDateTimeFormat: vi.fn(),
    parseDateTime: vi.fn(),
    isValidDate: vi.fn()
  }
}));

describe('ValidationUtils', () => {
  describe('validateRequired', () => {
    it('deve passar para valores válidos', () => {
      expect(() => ValidationUtils.validateRequired('valor', 'campo')).not.toThrow();
      expect(() => ValidationUtils.validateRequired(0, 'campo')).not.toThrow();
      expect(() => ValidationUtils.validateRequired(false, 'campo')).not.toThrow();
    });

    it('deve lançar erro para valores nulos, undefined ou vazios', () => {
      expect(() => ValidationUtils.validateRequired(null, 'campo'))
        .toThrow('campo é obrigatório');
      
      expect(() => ValidationUtils.validateRequired(undefined, 'campo'))
        .toThrow('campo é obrigatório');
      
      expect(() => ValidationUtils.validateRequired('', 'campo'))
        .toThrow('campo é obrigatório');
    });
  });

  describe('validatePositiveNumber', () => {
    it('deve passar para números positivos', () => {
      expect(() => ValidationUtils.validatePositiveNumber(1, 'campo')).not.toThrow();
      expect(() => ValidationUtils.validatePositiveNumber(100, 'campo')).not.toThrow();
      expect(() => ValidationUtils.validatePositiveNumber(0.5, 'campo')).not.toThrow();
    });

    it('deve lançar erro para números não positivos', () => {
      expect(() => ValidationUtils.validatePositiveNumber(0, 'campo'))
        .toThrow('campo deve ser um número maior que zero');
      
      expect(() => ValidationUtils.validatePositiveNumber(-1, 'campo'))
        .toThrow('campo deve ser um número maior que zero');
    });

    it('deve lançar erro para valores não numéricos', () => {
      expect(() => ValidationUtils.validatePositiveNumber('1', 'campo'))
        .toThrow('campo deve ser um número maior que zero');
      
      expect(() => ValidationUtils.validatePositiveNumber(null, 'campo'))
        .toThrow('campo deve ser um número maior que zero');
    });
  });

  describe('validateNonNegativeNumber', () => {
    it('deve passar para números não negativos', () => {
      expect(() => ValidationUtils.validateNonNegativeNumber(0, 'campo')).not.toThrow();
      expect(() => ValidationUtils.validateNonNegativeNumber(1, 'campo')).not.toThrow();
      expect(() => ValidationUtils.validateNonNegativeNumber(100, 'campo')).not.toThrow();
    });

    it('deve lançar erro para números negativos', () => {
      expect(() => ValidationUtils.validateNonNegativeNumber(-1, 'campo'))
        .toThrow('campo não pode ser negativo');
    });

    it('deve lançar erro para valores não numéricos', () => {
      expect(() => ValidationUtils.validateNonNegativeNumber('0', 'campo'))
        .toThrow('campo não pode ser negativo');
    });
  });

  describe('validateDateTimeFormat', () => {
    it('deve passar para formato válido', () => {
      DateUtils.isValidDateTimeFormat.mockReturnValue(true);
      
      expect(() => ValidationUtils.validateDateTimeFormat('15/03/2024 14:30:00', 'campo'))
        .not.toThrow();
    });

    it('deve lançar erro para formato inválido', () => {
      DateUtils.isValidDateTimeFormat.mockReturnValue(false);
      
      expect(() => ValidationUtils.validateDateTimeFormat('formato inválido', 'campo'))
        .toThrow('campo deve estar no formato DD/MM/YYYY HH:mm:ss');
    });
  });

  describe('validateEvent', () => {
    const validEvent = {
      horario: '15/03/2024 14:30:00',
      duracao: 60,
      nomeevento: 'Evento Teste',
      notificacao: 15
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('deve passar para evento válido', () => {
      DateUtils.isValidDateTimeFormat.mockReturnValue(true);
      DateUtils.parseDateTime.mockReturnValue(new Date('2024-03-15T14:30:00'));

      expect(() => ValidationUtils.validateEvent(validEvent)).not.toThrow();
    });

    it('deve lançar erro para campos obrigatórios ausentes', () => {
      const invalidEvents = [
        { ...validEvent, horario: null },
        { ...validEvent, duracao: null },
        { ...validEvent, nomeevento: null },
        { ...validEvent, notificacao: null }
      ];

      invalidEvents.forEach(event => {
        expect(() => ValidationUtils.validateEvent(event)).toThrow();
      });
    });

    it('deve lançar erro para duração inválida', () => {
      DateUtils.isValidDateTimeFormat.mockReturnValue(true);
      DateUtils.parseDateTime.mockReturnValue(new Date('2024-03-15T14:30:00'));

      const invalidEvent = { ...validEvent, duracao: -10 };
      expect(() => ValidationUtils.validateEvent(invalidEvent))
        .toThrow('duracao deve ser um número maior que zero');
    });

    it('deve lançar erro para notificação negativa', () => {
      DateUtils.isValidDateTimeFormat.mockReturnValue(true);
      DateUtils.parseDateTime.mockReturnValue(new Date('2024-03-15T14:30:00'));

      const invalidEvent = { ...validEvent, notificacao: -5 };
      expect(() => ValidationUtils.validateEvent(invalidEvent))
        .toThrow('notificacao não pode ser negativo');
    });

    it('deve lançar erro para formato de data inválido', () => {
      DateUtils.isValidDateTimeFormat.mockReturnValue(false);

      expect(() => ValidationUtils.validateEvent(validEvent))
        .toThrow('horario deve estar no formato DD/MM/YYYY HH:mm:ss');
    });

    it('deve lançar erro para data inválida', () => {
      DateUtils.isValidDateTimeFormat.mockReturnValue(true);
      DateUtils.parseDateTime.mockImplementation(() => {
        throw new Error('Data inválida');
      });

      expect(() => ValidationUtils.validateEvent(validEvent))
        .toThrow('Data inválida: Data inválida');
    });
  });

  describe('validateCalendarEventData', () => {
    const validEventData = {
      nomeevento: 'Evento Teste',
      startDateTime: '2024-03-15T14:30:00.000Z',
      endDateTime: '2024-03-15T15:30:00.000Z'
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('deve passar para dados válidos', () => {
      DateUtils.isValidDate.mockReturnValue(true);

      expect(() => ValidationUtils.validateCalendarEventData(validEventData)).not.toThrow();
    });

    it('deve lançar erro para campos obrigatórios ausentes', () => {
      const invalidData = [
        { ...validEventData, nomeevento: null },
        { ...validEventData, startDateTime: null },
        { ...validEventData, endDateTime: null }
      ];

      invalidData.forEach(data => {
        expect(() => ValidationUtils.validateCalendarEventData(data)).toThrow();
      });
    });

    it('deve lançar erro para startDateTime inválida', () => {
      DateUtils.isValidDate.mockReturnValueOnce(false);

      expect(() => ValidationUtils.validateCalendarEventData(validEventData))
        .toThrow('startDateTime deve ser uma data válida');
    });

    it('deve lançar erro para endDateTime inválida', () => {
      DateUtils.isValidDate
        .mockReturnValueOnce(true)  // startDateTime válida
        .mockReturnValueOnce(false); // endDateTime inválida

      expect(() => ValidationUtils.validateCalendarEventData(validEventData))
        .toThrow('endDateTime deve ser uma data válida');
    });

    it('deve lançar erro quando endDateTime é anterior ou igual a startDateTime', () => {
      DateUtils.isValidDate.mockReturnValue(true);

      const invalidData = {
        ...validEventData,
        startDateTime: '2024-03-15T15:30:00.000Z',
        endDateTime: '2024-03-15T14:30:00.000Z' // anterior
      };

      expect(() => ValidationUtils.validateCalendarEventData(invalidData))
        .toThrow('endDateTime deve ser posterior a startDateTime');

      const equalData = {
        ...validEventData,
        startDateTime: '2024-03-15T14:30:00.000Z',
        endDateTime: '2024-03-15T14:30:00.000Z' // igual
      };

      expect(() => ValidationUtils.validateCalendarEventData(equalData))
        .toThrow('endDateTime deve ser posterior a startDateTime');
    });
  });
});
