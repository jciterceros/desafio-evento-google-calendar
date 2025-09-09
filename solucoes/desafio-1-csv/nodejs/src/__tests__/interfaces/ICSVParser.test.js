/**
 * Testes unitários para a interface ICSVParser
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ICSVParser } from '../../interfaces/ICSVParser.js';

describe('ICSVParser', () => {
  let parser;

  beforeEach(() => {
    parser = new ICSVParser();
  });

  describe('parseFile', () => {
    it('deve lançar erro quando método não é implementado', async () => {
      const filePath = '/path/to/file.csv';
      
      await expect(async () => {
        await parser.parseFile(filePath);
      }).rejects.toThrow('Método parseFile deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', async () => {
      const filePath = '/path/to/file.csv';
      
      await expect(async () => {
        await parser.parseFile(filePath);
      }).rejects.toThrow(Error);
    });
  });

  describe('parseRowToEvent', () => {
    it('deve lançar erro quando método não é implementado', () => {
      const mockRow = { nomeevento: 'Test Event', data: '2024-01-01' };
      
      expect(() => {
        parser.parseRowToEvent(mockRow);
      }).toThrow('Método parseRowToEvent deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', () => {
      const mockRow = { nomeevento: 'Test Event', data: '2024-01-01' };
      
      expect(() => {
        parser.parseRowToEvent(mockRow);
      }).toThrow(Error);
    });
  });

  describe('parseFileToEvents', () => {
    it('deve lançar erro quando método não é implementado', async () => {
      const filePath = '/path/to/file.csv';
      
      await expect(async () => {
        await parser.parseFileToEvents(filePath);
      }).rejects.toThrow('Método parseFileToEvents deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', async () => {
      const filePath = '/path/to/file.csv';
      
      await expect(async () => {
        await parser.parseFileToEvents(filePath);
      }).rejects.toThrow(Error);
    });
  });

  describe('herança e estrutura', () => {
    it('deve ser uma classe que pode ser instanciada', () => {
      expect(parser).toBeInstanceOf(ICSVParser);
    });

    it('deve ter o método parseFile definido', () => {
      expect(typeof parser.parseFile).toBe('function');
    });

    it('deve ter o método parseRowToEvent definido', () => {
      expect(typeof parser.parseRowToEvent).toBe('function');
    });

    it('deve ter o método parseFileToEvents definido', () => {
      expect(typeof parser.parseFileToEvents).toBe('function');
    });
  });

  describe('implementação de interface', () => {
    it('deve permitir herança e implementação dos métodos', async () => {
      class MockCSVParser extends ICSVParser {
        async parseFile(filePath) {
          return [{ nomeevento: 'Test Event', data: '2024-01-01' }];
        }

        parseRowToEvent(row) {
          return { id: 1, name: row.nomeevento };
        }

        async parseFileToEvents(filePath) {
          const data = await this.parseFile(filePath);
          return data.map(row => this.parseRowToEvent(row));
        }
      }

      const mockParser = new MockCSVParser();
      const mockRow = { nomeevento: 'Test Event', data: '2024-01-01' };
      const filePath = '/path/to/file.csv';

      const fileData = await mockParser.parseFile(filePath);
      expect(fileData).toEqual([{ nomeevento: 'Test Event', data: '2024-01-01' }]);

      const event = mockParser.parseRowToEvent(mockRow);
      expect(event).toEqual({ id: 1, name: 'Test Event' });

      const events = await mockParser.parseFileToEvents(filePath);
      expect(events).toEqual([{ id: 1, name: 'Test Event' }]);
    });
  });
});
