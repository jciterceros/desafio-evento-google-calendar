import { describe, it, expect } from 'vitest';
import { CalendarEvent } from '../../models/CalendarEvent.js';
import { Event } from '../../models/Event.js';

describe('CalendarEvent', () => {
  let mockEvent;
  let startDateTime;
  let endDateTime;

  beforeEach(() => {
    mockEvent = new Event({
      horario: '15/03/2024 14:30:00',
      duracao: '60',
      nomeevento: 'Evento Teste',
      notificacao: '15'
    });
    
    startDateTime = new Date('2024-03-15T14:30:00.000Z');
    endDateTime = new Date('2024-03-15T15:30:00.000Z');
  });

  describe('constructor', () => {
    it('deve criar instância com parâmetros válidos', () => {
      const calendarEvent = new CalendarEvent(mockEvent, startDateTime, endDateTime);

      expect(calendarEvent.event).toBe(mockEvent);
      expect(calendarEvent.startDateTime).toBe(startDateTime);
      expect(calendarEvent.endDateTime).toBe(endDateTime);
    });

    it('deve lançar erro para event inválido', () => {
      expect(() => new CalendarEvent('not an event', startDateTime, endDateTime))
        .toThrow('Event deve ser uma instância da classe Event');
      
      expect(() => new CalendarEvent(null, startDateTime, endDateTime))
        .toThrow('Event deve ser uma instância da classe Event');
    });
  });

  describe('isValid', () => {
    it('deve retornar true para evento de calendário válido', () => {
      const calendarEvent = new CalendarEvent(mockEvent, startDateTime, endDateTime);
      expect(calendarEvent.isValid()).toBe(true);
    });

    it('deve retornar false para event inválido', () => {
      const invalidEvent = new Event({
        horario: null,
        duracao: '60',
        nomeevento: 'Evento Teste',
        notificacao: '15'
      });

      const calendarEvent = new CalendarEvent(invalidEvent, startDateTime, endDateTime);
      expect(calendarEvent.isValid()).toBe(false);
    });

    it('deve retornar false para startDateTime inválida', () => {
      const calendarEvent = new CalendarEvent(mockEvent, 'not a date', endDateTime);
      expect(calendarEvent.isValid()).toBe(false);
    });

    it('deve retornar false para endDateTime inválida', () => {
      const calendarEvent = new CalendarEvent(mockEvent, startDateTime, 'not a date');
      expect(calendarEvent.isValid()).toBe(false);
    });

    it('deve retornar false quando endDateTime é anterior ou igual a startDateTime', () => {
      const earlierEndDateTime = new Date('2024-03-15T13:30:00.000Z');
      const calendarEvent = new CalendarEvent(mockEvent, startDateTime, earlierEndDateTime);
      expect(calendarEvent.isValid()).toBe(false);

      const sameEndDateTime = new Date('2024-03-15T14:30:00.000Z');
      const calendarEvent2 = new CalendarEvent(mockEvent, startDateTime, sameEndDateTime);
      expect(calendarEvent2.isValid()).toBe(false);
    });
  });

  describe('toGoogleCalendarFormat', () => {
    it('deve retornar formato correto para Google Calendar', () => {
      const calendarEvent = new CalendarEvent(mockEvent, startDateTime, endDateTime);
      const result = calendarEvent.toGoogleCalendarFormat();

      expect(result).toEqual({
        summary: 'Evento Teste',
        start: {
          dateTime: '2024-03-15T14:30:00.000Z',
          timeZone: 'America/Sao_Paulo',
        },
        end: {
          dateTime: '2024-03-15T15:30:00.000Z',
          timeZone: 'America/Sao_Paulo',
        },
        reminders: {
          useDefault: false,
          overrides: [{
            method: 'popup',
            minutes: 15,
          }],
        },
      });
    });

    it('deve usar notificacao 0 quando não especificada', () => {
      const eventWithoutNotification = new Event({
        horario: '15/03/2024 14:30:00',
        duracao: '60',
        nomeevento: 'Evento Teste',
        notificacao: '0'
      });

      const calendarEvent = new CalendarEvent(eventWithoutNotification, startDateTime, endDateTime);
      const result = calendarEvent.toGoogleCalendarFormat();

      expect(result.reminders.overrides[0].minutes).toBe(0);
    });

    it('deve lançar erro para evento de calendário inválido', () => {
      const invalidEvent = new Event({
        horario: null,
        duracao: '60',
        nomeevento: 'Evento Teste',
        notificacao: '15'
      });

      const calendarEvent = new CalendarEvent(invalidEvent, startDateTime, endDateTime);
      
      expect(() => calendarEvent.toGoogleCalendarFormat())
        .toThrow('Evento de calendário inválido');
    });
  });

  describe('toProcessedData', () => {
    it('deve retornar dados processados corretamente', () => {
      const calendarEvent = new CalendarEvent(mockEvent, startDateTime, endDateTime);
      const result = calendarEvent.toProcessedData();

      expect(result).toEqual({
        nomeevento: 'Evento Teste',
        startDateTime: '2024-03-15T14:30:00.000Z',
        endDateTime: '2024-03-15T15:30:00.000Z',
        notificacao: 15
      });
    });
  });

  describe('toString', () => {
    it('deve retornar representação string correta', () => {
      const calendarEvent = new CalendarEvent(mockEvent, startDateTime, endDateTime);
      const result = calendarEvent.toString();

      expect(result).toBe('CalendarEvent: Evento Teste - 2024-03-15T14:30:00.000Z até 2024-03-15T15:30:00.000Z');
    });
  });
});
