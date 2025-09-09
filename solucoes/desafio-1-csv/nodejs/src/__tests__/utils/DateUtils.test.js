import { describe, it, expect } from 'vitest';
import { DateUtils } from '../../utils/DateUtils.js';

describe('DateUtils', () => {
  describe('parseDateTime', () => {
    it('deve converter string de data válida para Date', () => {
      const dateString = '15/03/2024 14:30:00';
      const result = DateUtils.parseDateTime(dateString);
      
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2); // Março (0-indexed)
      expect(result.getDate()).toBe(15);
      expect(result.getHours()).toBe(14);
      expect(result.getMinutes()).toBe(30);
      expect(result.getSeconds()).toBe(0);
    });

    it('deve lançar erro para formato inválido', () => {
      const invalidFormats = [
        '15-03-2024 14:30:00',
        '2024/03/15 14:30:00',
        '15/03/24 14:30:00',
        '15/03/2024 14:30',
        '15/03/2024',
        'data inválida'
      ];

      invalidFormats.forEach(format => {
        expect(() => DateUtils.parseDateTime(format))
          .toThrow('Formato de data inválido. Use DD/MM/YYYY HH:mm:ss');
      });
    });

  });

  describe('calculateEndTime', () => {
    it('deve calcular horário de fim corretamente', () => {
      const startDate = new Date('2024-03-15T14:30:00');
      const durationMinutes = 60;
      const result = DateUtils.calculateEndTime(startDate, durationMinutes);
      
      const expected = new Date('2024-03-15T15:30:00');
      expect(result.getTime()).toBe(expected.getTime());
    });

    it('deve lançar erro para duração de 0 minutos', () => {
      const startDate = new Date('2024-03-15T14:30:00');
      const durationMinutes = 0;
      
      expect(() => DateUtils.calculateEndTime(startDate, durationMinutes))
        .toThrow('durationMinutes deve ser um número positivo');
    });

    it('deve lançar erro para startDate inválido', () => {
      expect(() => DateUtils.calculateEndTime('not a date', 60))
        .toThrow('startDate deve ser uma instância de Date');
      
      expect(() => DateUtils.calculateEndTime(null, 60))
        .toThrow('startDate deve ser uma instância de Date');
    });

    it('deve lançar erro para durationMinutes inválido', () => {
      const startDate = new Date('2024-03-15T14:30:00');
      
      expect(() => DateUtils.calculateEndTime(startDate, -10))
        .toThrow('durationMinutes deve ser um número positivo');
      
      expect(() => DateUtils.calculateEndTime(startDate, '60'))
        .toThrow('durationMinutes deve ser um número positivo');
      
      expect(() => DateUtils.calculateEndTime(startDate, null))
        .toThrow('durationMinutes deve ser um número positivo');
    });
  });

  describe('formatForGoogleCalendar', () => {
    it('deve formatar data para ISO string', () => {
      const date = new Date('2024-03-15T14:30:00.000Z');
      const result = DateUtils.formatForGoogleCalendar(date);
      
      expect(result).toBe('2024-03-15T14:30:00.000Z');
    });

    it('deve lançar erro para data inválida', () => {
      expect(() => DateUtils.formatForGoogleCalendar('not a date'))
        .toThrow('date deve ser uma instância de Date');
      
      expect(() => DateUtils.formatForGoogleCalendar(null))
        .toThrow('date deve ser uma instância de Date');
    });
  });

  describe('isValidDateTimeFormat', () => {
    it('deve retornar true para formato válido', () => {
      const validFormats = [
        '15/03/2024 14:30:00',
        '01/01/2024 00:00:00',
        '31/12/2024 23:59:59'
      ];

      validFormats.forEach(format => {
        expect(DateUtils.isValidDateTimeFormat(format)).toBe(true);
      });
    });

    it('deve retornar false para formato inválido', () => {
      const invalidFormats = [
        '15-03-2024 14:30:00',
        '2024/03/15 14:30:00',
        '15/03/24 14:30:00',
        '15/03/2024 14:30',
        '15/03/2024',
        '',
        null,
        undefined
      ];

      invalidFormats.forEach(format => {
        expect(DateUtils.isValidDateTimeFormat(format)).toBe(false);
      });
    });
  });

  describe('isValidDate', () => {
    it('deve retornar true para data válida', () => {
      const validDate = new Date('2024-03-15T14:30:00');
      expect(DateUtils.isValidDate(validDate)).toBe(true);
    });

    it('deve retornar false para data inválida', () => {
      const invalidDate = new Date('invalid');
      expect(DateUtils.isValidDate(invalidDate)).toBe(false);
    });

    it('deve retornar false para valores não-Date', () => {
      expect(DateUtils.isValidDate('2024-03-15')).toBe(false);
      expect(DateUtils.isValidDate(null)).toBe(false);
      expect(DateUtils.isValidDate(undefined)).toBe(false);
      expect(DateUtils.isValidDate(123)).toBe(false);
    });
  });
});
