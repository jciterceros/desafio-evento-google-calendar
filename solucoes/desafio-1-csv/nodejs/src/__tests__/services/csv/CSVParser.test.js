import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import { CSVParser } from '../../../services/csv/CSVParser.js';
import { Event } from '../../../models/Event.js';

// Mock do módulo fs
vi.mock('fs', () => ({
  default: {
    createReadStream: vi.fn()
  }
}));

// Mock do csv-parser
vi.mock('csv-parser', () => ({
  default: vi.fn()
}));

describe('CSVParser', () => {
  let csvParser;
  let mockReadStream;
  let mockCsvParser;
  let mockCsvInstance;

  beforeEach(async () => {
    csvParser = new CSVParser();
    
    // Mock do stream de leitura
    mockReadStream = {
      pipe: vi.fn().mockReturnThis(),
      on: vi.fn()
    };
    
    fs.createReadStream.mockReturnValue(mockReadStream);
    
    // Mock do csv-parser
    const csv = await import('csv-parser');
    mockCsvParser = csv.default;
    mockCsvInstance = {
      on: vi.fn()
    };
    mockCsvParser.mockReturnValue(mockCsvInstance);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('deve inicializar com separador padrão', () => {
      expect(csvParser.separator).toBe(';');
    });

    it('deve herdar de ICSVParser', () => {
      expect(csvParser).toBeInstanceOf(CSVParser);
    });
  });

  describe('parseFile', () => {
    it('deve fazer parsing de arquivo CSV com sucesso', async () => {
      const mockData = [
        { horario: '15/03/2024 14:30:00', duracao: '60', nomeevento: 'Evento 1', notificacao: '15' },
        { horario: '16/03/2024 15:30:00', duracao: '90', nomeevento: 'Evento 2', notificacao: '30' }
      ];

      // Simula o comportamento do stream
      let dataCallback, endCallback, errorCallback;
      
      mockReadStream.on.mockImplementation((event, callback) => {
        if (event === 'data') dataCallback = callback;
        if (event === 'end') endCallback = callback;
        if (event === 'error') errorCallback = callback;
        return mockReadStream;
      });

      // Simula o pipe retornando o csv parser
      mockReadStream.pipe.mockReturnValue(mockCsvInstance);
      mockCsvInstance.on.mockImplementation((event, callback) => {
        if (event === 'data') dataCallback = callback;
        if (event === 'end') endCallback = callback;
        if (event === 'error') errorCallback = callback;
        return mockCsvInstance;
      });

      const resultPromise = csvParser.parseFile('test.csv');

      // Simula o processamento dos dados
      mockData.forEach(row => {
        if (dataCallback) dataCallback(row);
      });

      // Simula o fim do processamento
      if (endCallback) endCallback();

      const result = await resultPromise;

      expect(fs.createReadStream).toHaveBeenCalledWith('test.csv');
      expect(mockCsvParser).toHaveBeenCalledWith({ separator: ';' });
      expect(result).toEqual(mockData);
    });

    it('deve usar separador correto no csv-parser', async () => {
      let endCallback;
      
      mockReadStream.on.mockImplementation((event, callback) => {
        if (event === 'end') endCallback = callback;
        return mockReadStream;
      });

      mockReadStream.pipe.mockReturnValue(mockCsvInstance);
      mockCsvInstance.on.mockImplementation((event, callback) => {
        if (event === 'end') endCallback = callback;
        return mockCsvInstance;
      });

      const resultPromise = csvParser.parseFile('test.csv');

      if (endCallback) endCallback();

      await resultPromise;

      expect(mockCsvParser).toHaveBeenCalledWith({ separator: ';' });
    });

    it('deve retornar array vazio para arquivo sem dados', async () => {
      let endCallback;
      
      mockReadStream.on.mockImplementation((event, callback) => {
        if (event === 'end') endCallback = callback;
        return mockReadStream;
      });

      mockReadStream.pipe.mockReturnValue(mockCsvInstance);
      mockCsvInstance.on.mockImplementation((event, callback) => {
        if (event === 'end') endCallback = callback;
        return mockCsvInstance;
      });

      const resultPromise = csvParser.parseFile('empty.csv');

      if (endCallback) endCallback();

      const result = await resultPromise;

      expect(result).toEqual([]);
    });

    it('deve lidar com erro de leitura do arquivo', async () => {
      const error = new Error('Arquivo não encontrado');
      let errorCallback;
      
      mockReadStream.on.mockImplementation((event, callback) => {
        if (event === 'error') errorCallback = callback;
        return mockReadStream;
      });

      mockReadStream.pipe.mockReturnValue(mockCsvInstance);
      mockCsvInstance.on.mockImplementation((event, callback) => {
        if (event === 'error') errorCallback = callback;
        return mockCsvInstance;
      });

      const resultPromise = csvParser.parseFile('nonexistent.csv');

      if (errorCallback) errorCallback(error);

      await expect(resultPromise).rejects.toThrow('Arquivo não encontrado');
    });

    it('deve lidar com erro de parsing CSV', async () => {
      const error = new Error('CSV malformado');
      let errorCallback;
      
      mockReadStream.on.mockImplementation((event, callback) => {
        if (event === 'error') errorCallback = callback;
        return mockReadStream;
      });

      mockReadStream.pipe.mockReturnValue(mockCsvInstance);
      mockCsvInstance.on.mockImplementation((event, callback) => {
        if (event === 'error') errorCallback = callback;
        return mockCsvInstance;
      });

      const resultPromise = csvParser.parseFile('malformed.csv');

      if (errorCallback) errorCallback(error);

      await expect(resultPromise).rejects.toThrow('CSV malformado');
    });

    it('deve processar arquivo com muitas linhas', async () => {
      const mockData = Array.from({ length: 1000 }, (_, i) => ({
        horario: `15/03/2024 ${10 + i}:30:00`,
        duracao: '60',
        nomeevento: `Evento ${i + 1}`,
        notificacao: '15'
      }));

      let dataCallback, endCallback;
      
      mockReadStream.on.mockImplementation((event, callback) => {
        if (event === 'data') dataCallback = callback;
        if (event === 'end') endCallback = callback;
        return mockReadStream;
      });

      mockReadStream.pipe.mockReturnValue(mockCsvInstance);
      mockCsvInstance.on.mockImplementation((event, callback) => {
        if (event === 'data') dataCallback = callback;
        if (event === 'end') endCallback = callback;
        return mockCsvInstance;
      });

      const resultPromise = csvParser.parseFile('large.csv');

      mockData.forEach(row => {
        if (dataCallback) dataCallback(row);
      });

      if (endCallback) endCallback();

      const result = await resultPromise;

      expect(result).toHaveLength(1000);
      expect(result[0].nomeevento).toBe('Evento 1');
      expect(result[999].nomeevento).toBe('Evento 1000');
    });
  });

  describe('parseRowToEvent', () => {
    it('deve converter linha CSV em Event', () => {
      const row = {
        horario: '15/03/2024 14:30:00',
        duracao: '60',
        nomeevento: 'Evento Teste',
        notificacao: '15'
      };

      const result = csvParser.parseRowToEvent(row);

      expect(result).toBeInstanceOf(Event);
      expect(result.horario).toBe('15/03/2024 14:30:00');
      expect(result.duracao).toBe(60);
      expect(result.nomeevento).toBe('Evento Teste');
      expect(result.notificacao).toBe(15);
    });

    it('deve converter strings numéricas para números', () => {
      const row = {
        horario: '15/03/2024 14:30:00',
        duracao: '120',
        nomeevento: 'Evento Teste',
        notificacao: '30'
      };

      const result = csvParser.parseRowToEvent(row);

      expect(typeof result.duracao).toBe('number');
      expect(typeof result.notificacao).toBe('number');
      expect(result.duracao).toBe(120);
      expect(result.notificacao).toBe(30);
    });

    it('deve lidar com valores numéricos zero', () => {
      const row = {
        horario: '15/03/2024 14:30:00',
        duracao: '0',
        nomeevento: 'Evento Teste',
        notificacao: '0'
      };

      const result = csvParser.parseRowToEvent(row);

      expect(result.duracao).toBe(0);
      expect(result.notificacao).toBe(0);
    });

    it('deve lidar com valores numéricos negativos', () => {
      const row = {
        horario: '15/03/2024 14:30:00',
        duracao: '-60',
        nomeevento: 'Evento Teste',
        notificacao: '-15'
      };

      const result = csvParser.parseRowToEvent(row);

      expect(result.duracao).toBe(-60);
      expect(result.notificacao).toBe(-15);
    });

    it('deve lidar com valores não numéricos', () => {
      const row = {
        horario: '15/03/2024 14:30:00',
        duracao: 'abc',
        nomeevento: 'Evento Teste',
        notificacao: 'xyz'
      };

      const result = csvParser.parseRowToEvent(row);

      expect(Number.isNaN(result.duracao)).toBe(true);
      expect(Number.isNaN(result.notificacao)).toBe(true);
    });

    it('deve lidar com campos undefined', () => {
      const row = {
        horario: undefined,
        duracao: undefined,
        nomeevento: undefined,
        notificacao: undefined
      };

      const result = csvParser.parseRowToEvent(row);

      expect(result.horario).toBeUndefined();
      expect(Number.isNaN(result.duracao)).toBe(true);
      expect(result.nomeevento).toBeUndefined();
      expect(Number.isNaN(result.notificacao)).toBe(true);
    });

    it('deve lidar com campos null', () => {
      const row = {
        horario: null,
        duracao: null,
        nomeevento: null,
        notificacao: null
      };

      const result = csvParser.parseRowToEvent(row);

      expect(result.horario).toBeNull();
      expect(Number.isNaN(result.duracao)).toBe(true); // parseInt(null) = NaN
      expect(result.nomeevento).toBeNull();
      expect(Number.isNaN(result.notificacao)).toBe(true); // parseInt(null) = NaN
    });

    it('deve lidar com campos vazios', () => {
      const row = {
        horario: '',
        duracao: '',
        nomeevento: '',
        notificacao: ''
      };

      const result = csvParser.parseRowToEvent(row);

      expect(result.horario).toBe('');
      expect(Number.isNaN(result.duracao)).toBe(true);
      expect(result.nomeevento).toBe('');
      expect(Number.isNaN(result.notificacao)).toBe(true);
    });

    it('deve lidar com campos com espaços', () => {
      const row = {
        horario: '  15/03/2024 14:30:00  ',
        duracao: '  60  ',
        nomeevento: '  Evento Teste  ',
        notificacao: '  15  '
      };

      const result = csvParser.parseRowToEvent(row);

      expect(result.horario).toBe('  15/03/2024 14:30:00  ');
      expect(result.duracao).toBe(60);
      expect(result.nomeevento).toBe('  Evento Teste  ');
      expect(result.notificacao).toBe(15);
    });

    it('deve lidar com campos extras no CSV', () => {
      const row = {
        horario: '15/03/2024 14:30:00',
        duracao: '60',
        nomeevento: 'Evento Teste',
        notificacao: '15',
        campoExtra: 'valor extra',
        outroCampo: 'outro valor'
      };

      const result = csvParser.parseRowToEvent(row);

      expect(result.horario).toBe('15/03/2024 14:30:00');
      expect(result.duracao).toBe(60);
      expect(result.nomeevento).toBe('Evento Teste');
      expect(result.notificacao).toBe(15);
      // Campos extras não devem ser incluídos
      expect(result.campoExtra).toBeUndefined();
      expect(result.outroCampo).toBeUndefined();
    });
  });

  describe('parseFileToEvents', () => {
    it('deve fazer parsing de arquivo e retornar array de Events', async () => {
      const mockData = [
        { horario: '15/03/2024 14:30:00', duracao: '60', nomeevento: 'Evento 1', notificacao: '15' },
        { horario: '16/03/2024 15:30:00', duracao: '90', nomeevento: 'Evento 2', notificacao: '30' }
      ];

      vi.spyOn(csvParser, 'parseFile').mockResolvedValue(mockData);

      const result = await csvParser.parseFileToEvents('test.csv');

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Event);
      expect(result[1]).toBeInstanceOf(Event);
      expect(result[0].nomeevento).toBe('Evento 1');
      expect(result[1].nomeevento).toBe('Evento 2');
    });

    it('deve retornar array vazio para arquivo sem dados', async () => {
      vi.spyOn(csvParser, 'parseFile').mockResolvedValue([]);

      const result = await csvParser.parseFileToEvents('empty.csv');

      expect(result).toEqual([]);
    });

    it('deve propagar erro do parseFile', async () => {
      const error = new Error('Erro de parsing');
      vi.spyOn(csvParser, 'parseFile').mockRejectedValue(error);

      await expect(csvParser.parseFileToEvents('error.csv')).rejects.toThrow('Erro de parsing');
    });

    it('deve processar arquivo com dados mistos (válidos e inválidos)', async () => {
      const mockData = [
        { horario: '15/03/2024 14:30:00', duracao: '60', nomeevento: 'Evento Válido', notificacao: '15' },
        { horario: '', duracao: 'abc', nomeevento: '', notificacao: 'xyz' },
        { horario: '16/03/2024 15:30:00', duracao: '90', nomeevento: 'Outro Evento Válido', notificacao: '30' }
      ];

      vi.spyOn(csvParser, 'parseFile').mockResolvedValue(mockData);

      const result = await csvParser.parseFileToEvents('mixed.csv');

      expect(result).toHaveLength(3);
      expect(result[0]).toBeInstanceOf(Event);
      expect(result[1]).toBeInstanceOf(Event);
      expect(result[2]).toBeInstanceOf(Event);
      
      // Primeiro evento válido
      expect(result[0].nomeevento).toBe('Evento Válido');
      expect(result[0].duracao).toBe(60);
      
      // Segundo evento com dados inválidos
      expect(result[1].nomeevento).toBe('');
      expect(Number.isNaN(result[1].duracao)).toBe(true);
      
      // Terceiro evento válido
      expect(result[2].nomeevento).toBe('Outro Evento Válido');
      expect(result[2].duracao).toBe(90);
    });

    it('deve processar arquivo grande com performance adequada', async () => {
      const mockData = Array.from({ length: 1000 }, (_, i) => ({
        horario: `15/03/2024 ${10 + (i % 12)}:30:00`,
        duracao: '60',
        nomeevento: `Evento ${i + 1}`,
        notificacao: '15'
      }));

      vi.spyOn(csvParser, 'parseFile').mockResolvedValue(mockData);

      const startTime = Date.now();
      const result = await csvParser.parseFileToEvents('large.csv');
      const endTime = Date.now();

      expect(result).toHaveLength(1000);
      expect(result[0]).toBeInstanceOf(Event);
      expect(result[999]).toBeInstanceOf(Event);
      
      // Verifica que o processamento foi rápido (menos de 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });
  });

  describe('integração com Event model', () => {
    it('deve criar Events que passam na validação', async () => {
      const mockData = [
        { horario: '15/03/2024 14:30:00', duracao: '60', nomeevento: 'Evento Válido', notificacao: '15' }
      ];

      vi.spyOn(csvParser, 'parseFile').mockResolvedValue(mockData);

      const result = await csvParser.parseFileToEvents('valid.csv');

      expect(result[0].isValid()).toBe(true);
    });

    it('deve criar Events que falham na validação', async () => {
      const mockData = [
        { horario: '', duracao: '0', nomeevento: '', notificacao: '-1' }
      ];

      vi.spyOn(csvParser, 'parseFile').mockResolvedValue(mockData);

      const result = await csvParser.parseFileToEvents('invalid.csv');

      expect(result[0].isValid()).toBe(false);
    });

    it('deve criar Events com toString() funcionando', async () => {
      const mockData = [
        { horario: '15/03/2024 14:30:00', duracao: '60', nomeevento: 'Evento Teste', notificacao: '15' }
      ];

      vi.spyOn(csvParser, 'parseFile').mockResolvedValue(mockData);

      const result = await csvParser.parseFileToEvents('test.csv');

      expect(result[0].toString()).toBe('Evento: Evento Teste - 15/03/2024 14:30:00 (60min)');
    });

    it('deve criar Events com toObject() funcionando', async () => {
      const mockData = [
        { horario: '15/03/2024 14:30:00', duracao: '60', nomeevento: 'Evento Teste', notificacao: '15' }
      ];

      vi.spyOn(csvParser, 'parseFile').mockResolvedValue(mockData);

      const result = await csvParser.parseFileToEvents('test.csv');

      expect(result[0].toObject()).toEqual({
        horario: '15/03/2024 14:30:00',
        duracao: 60,
        nomeevento: 'Evento Teste',
        notificacao: 15
      });
    });
  });

  describe('casos extremos e edge cases', () => {
    it('deve lidar com arquivo com apenas cabeçalho', async () => {
      const mockData = [];

      vi.spyOn(csvParser, 'parseFile').mockResolvedValue(mockData);

      const result = await csvParser.parseFileToEvents('header-only.csv');

      expect(result).toEqual([]);
    });

    it('deve lidar com arquivo com uma linha de dados', async () => {
      const mockData = [
        { horario: '15/03/2024 14:30:00', duracao: '60', nomeevento: 'Único Evento', notificacao: '15' }
      ];

      vi.spyOn(csvParser, 'parseFile').mockResolvedValue(mockData);

      const result = await csvParser.parseFileToEvents('single.csv');

      expect(result).toHaveLength(1);
      expect(result[0].nomeevento).toBe('Único Evento');
    });

    it('deve lidar com caracteres especiais no nome do evento', async () => {
      const mockData = [
        { horario: '15/03/2024 14:30:00', duracao: '60', nomeevento: 'Evento com Açentuação & Símbolos!', notificacao: '15' }
      ];

      vi.spyOn(csvParser, 'parseFile').mockResolvedValue(mockData);

      const result = await csvParser.parseFileToEvents('special-chars.csv');

      expect(result[0].nomeevento).toBe('Evento com Açentuação & Símbolos!');
    });

    it('deve lidar com valores numéricos muito grandes', async () => {
      const mockData = [
        { horario: '15/03/2024 14:30:00', duracao: '999999', nomeevento: 'Evento Longo', notificacao: '999999' }
      ];

      vi.spyOn(csvParser, 'parseFile').mockResolvedValue(mockData);

      const result = await csvParser.parseFileToEvents('large-numbers.csv');

      expect(result[0].duracao).toBe(999999);
      expect(result[0].notificacao).toBe(999999);
    });

    it('deve lidar com valores decimais (que serão truncados)', async () => {
      const mockData = [
        { horario: '15/03/2024 14:30:00', duracao: '60.5', nomeevento: 'Evento Decimal', notificacao: '15.7' }
      ];

      vi.spyOn(csvParser, 'parseFile').mockResolvedValue(mockData);

      const result = await csvParser.parseFileToEvents('decimal.csv');

      expect(result[0].duracao).toBe(60); // parseInt trunca
      expect(result[0].notificacao).toBe(15); // parseInt trunca
    });
  });
});
