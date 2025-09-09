import { describe, it, expect } from 'vitest';
import { Event } from '../../models/Event.js';

describe('Event', () => {
  describe('constructor', () => {
    it('deve criar instância com dados válidos', () => {
      const data = {
        horario: '15/03/2024 14:30:00',
        duracao: '60',
        nomeevento: 'Evento Teste',
        notificacao: '15'
      };

      const event = new Event(data);

      expect(event.horario).toBe('15/03/2024 14:30:00');
      expect(event.duracao).toBe(60);
      expect(event.nomeevento).toBe('Evento Teste');
      expect(event.notificacao).toBe(15);
    });

    it('deve converter duracao e notificacao para números', () => {
      const data = {
        horario: '15/03/2024 14:30:00',
        duracao: '120',
        nomeevento: 'Evento Teste',
        notificacao: '30'
      };

      const event = new Event(data);

      expect(typeof event.duracao).toBe('number');
      expect(typeof event.notificacao).toBe('number');
      expect(event.duracao).toBe(120);
      expect(event.notificacao).toBe(30);
    });
  });

  describe('isValid', () => {
    it('deve retornar true para evento válido', () => {
      const data = {
        horario: '15/03/2024 14:30:00',
        duracao: '60',
        nomeevento: 'Evento Teste',
        notificacao: '15'
      };

      const event = new Event(data);
      expect(event.isValid()).toBe(true);
    });

    it('deve retornar false para horario ausente', () => {
      const data = {
        horario: null,
        duracao: '60',
        nomeevento: 'Evento Teste',
        notificacao: '15'
      };

      const event = new Event(data);
      expect(event.isValid()).toBe(false);
    });

    it('deve retornar false para duracao inválida', () => {
      const data = {
        horario: '15/03/2024 14:30:00',
        duracao: '0',
        nomeevento: 'Evento Teste',
        notificacao: '15'
      };

      const event = new Event(data);
      expect(event.isValid()).toBe(false);
    });

    it('deve retornar false para nomeevento ausente', () => {
      const data = {
        horario: '15/03/2024 14:30:00',
        duracao: '60',
        nomeevento: '',
        notificacao: '15'
      };

      const event = new Event(data);
      expect(event.isValid()).toBe(false);
    });

    it('deve retornar false para notificacao negativa', () => {
      const data = {
        horario: '15/03/2024 14:30:00',
        duracao: '60',
        nomeevento: 'Evento Teste',
        notificacao: '-5'
      };

      const event = new Event(data);
      expect(event.isValid()).toBe(false);
    });

    it('deve retornar true para notificacao zero', () => {
      const data = {
        horario: '15/03/2024 14:30:00',
        duracao: '60',
        nomeevento: 'Evento Teste',
        notificacao: '0'
      };

      const event = new Event(data);
      expect(event.isValid()).toBe(true);
    });
  });

  describe('toString', () => {
    it('deve retornar representação string correta', () => {
      const data = {
        horario: '15/03/2024 14:30:00',
        duracao: '60',
        nomeevento: 'Evento Teste',
        notificacao: '15'
      };

      const event = new Event(data);
      const result = event.toString();

      expect(result).toBe('Evento: Evento Teste - 15/03/2024 14:30:00 (60min)');
    });
  });

  describe('toObject', () => {
    it('deve retornar objeto com todas as propriedades', () => {
      const data = {
        horario: '15/03/2024 14:30:00',
        duracao: '60',
        nomeevento: 'Evento Teste',
        notificacao: '15'
      };

      const event = new Event(data);
      const result = event.toObject();

      expect(result).toEqual({
        horario: '15/03/2024 14:30:00',
        duracao: 60,
        nomeevento: 'Evento Teste',
        notificacao: 15
      });
    });

    it('deve retornar objeto independente da instância', () => {
      const data = {
        horario: '15/03/2024 14:30:00',
        duracao: '60',
        nomeevento: 'Evento Teste',
        notificacao: '15'
      };

      const event = new Event(data);
      const result = event.toObject();

      // Modificar a instância não deve afetar o objeto retornado
      event.horario = 'modificado';
      expect(result.horario).toBe('15/03/2024 14:30:00');
    });
  });
});
