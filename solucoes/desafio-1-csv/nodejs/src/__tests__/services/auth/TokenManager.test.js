import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import { TokenManager } from '../../../services/auth/TokenManager.js';

// Mock do módulo fs
vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
    mkdirSync: vi.fn(),
    unlinkSync: vi.fn()
  }
}));

describe('TokenManager', () => {
  let tokenManager;

  beforeEach(() => {
    tokenManager = new TokenManager();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('deve inicializar com caminho padrão', () => {
      const defaultManager = new TokenManager();
      expect(defaultManager.tokenFilePath).toBe('./config/tokens.json');
    });

    it('deve inicializar com caminho customizado', () => {
      const customPath = './custom/tokens.json';
      const customManager = new TokenManager(customPath);
      expect(customManager.tokenFilePath).toBe(customPath);
    });
  });

  describe('loadTokens', () => {
    it('deve carregar tokens quando arquivo existe', () => {
      const mockTokens = {
        access_token: 'access_token_123',
        refresh_token: 'refresh_token_123',
        expiry_date: Date.now() + 3600000
      };

      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockTokens));

      const result = tokenManager.loadTokens();

      expect(fs.existsSync).toHaveBeenCalledWith('./config/tokens.json');
      expect(fs.readFileSync).toHaveBeenCalledWith('./config/tokens.json', 'utf8');
      expect(result).toEqual(mockTokens);
    });

    it('deve retornar null quando arquivo não existe', () => {
      fs.existsSync.mockReturnValue(false);

      const result = tokenManager.loadTokens();

      expect(result).toBeNull();
      expect(fs.readFileSync).not.toHaveBeenCalled();
    });

    it('deve retornar null quando há erro ao ler arquivo', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockImplementation(() => {
        throw new Error('Erro de leitura');
      });

      const result = tokenManager.loadTokens();

      expect(result).toBeNull();
    });

    it('deve retornar null quando JSON é inválido', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('json inválido');

      const result = tokenManager.loadTokens();

      expect(result).toBeNull();
    });
  });

  describe('saveTokens', () => {
    const mockTokens = {
      access_token: 'access_token_123',
      refresh_token: 'refresh_token_123',
      scope: 'https://www.googleapis.com/auth/calendar',
      token_type: 'Bearer',
      expiry_date: Date.now() + 3600000
    };

    it('deve salvar tokens com sucesso', () => {
      fs.existsSync.mockReturnValue(true);

      const result = tokenManager.saveTokens(mockTokens);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './config/tokens.json',
        expect.stringContaining('access_token_123')
      );
      expect(result).toBe(true);
    });

    it('deve criar diretório se não existir', () => {
      fs.existsSync.mockReturnValue(false);

      const result = tokenManager.saveTokens(mockTokens);

      expect(fs.mkdirSync).toHaveBeenCalledWith('./config', { recursive: true });
      expect(result).toBe(true);
    });

    it('deve retornar false quando há erro ao salvar', () => {
      fs.existsSync.mockReturnValue(true);
      fs.writeFileSync.mockImplementation(() => {
        throw new Error('Erro de escrita');
      });

      const result = tokenManager.saveTokens(mockTokens);

      expect(result).toBe(false);
    });

    it('deve incluir timestamp nos dados salvos', () => {
      fs.existsSync.mockReturnValue(true);
      const mockDate = new Date('2024-03-15T14:30:00.000Z');
      vi.spyOn(global, 'Date').mockImplementation(() => mockDate);

      tokenManager.saveTokens(mockTokens);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './config/tokens.json',
        expect.stringContaining('"timestamp": "2024-03-15T14:30:00.000Z"')
      );
    });
  });

  describe('tokensExist', () => {
    it('deve retornar true quando arquivo existe', () => {
      fs.existsSync.mockReturnValue(true);

      const result = tokenManager.tokensExist();

      expect(result).toBe(true);
      expect(fs.existsSync).toHaveBeenCalledWith('./config/tokens.json');
    });

    it('deve retornar false quando arquivo não existe', () => {
      fs.existsSync.mockReturnValue(false);

      const result = tokenManager.tokensExist();

      expect(result).toBe(false);
    });
  });

  describe('clearTokens', () => {
    it('deve remover arquivo quando existe', () => {
      fs.existsSync.mockReturnValue(true);

      const result = tokenManager.clearTokens();

      expect(fs.unlinkSync).toHaveBeenCalledWith('./config/tokens.json');
      expect(result).toBe(true);
    });

    it('deve retornar false quando arquivo não existe', () => {
      fs.existsSync.mockReturnValue(false);

      const result = tokenManager.clearTokens();

      expect(fs.unlinkSync).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('deve retornar false quando há erro ao remover', () => {
      fs.existsSync.mockReturnValue(true);
      fs.unlinkSync.mockImplementation(() => {
        throw new Error('Erro ao remover');
      });

      const result = tokenManager.clearTokens();

      expect(result).toBe(false);
    });
  });

  describe('isTokenExpired', () => {
    it('deve retornar false para tokens sem data de expiração', () => {
      const tokens = { access_token: 'token123' };
      const result = tokenManager.isTokenExpired(tokens);
      expect(result).toBe(false);
    });

    it('deve retornar false para tokens com data de expiração futura', () => {
      const futureTime = Date.now() + 3600000; // 1 hora no futuro
      const tokens = { expiry_date: futureTime };
      const result = tokenManager.isTokenExpired(tokens);
      expect(result).toBe(false);
    });

    it('deve retornar true para tokens expirados', () => {
      const pastTime = Date.now() - 3600000; // 1 hora no passado
      const tokens = { expiry_date: pastTime };
      const result = tokenManager.isTokenExpired(tokens);
      expect(result).toBe(true);
    });

    it('deve considerar buffer de 5 minutos', () => {
      const nearExpiryTime = Date.now() + 4 * 60 * 1000; // 4 minutos no futuro
      const tokens = { expiry_date: nearExpiryTime };
      const result = tokenManager.isTokenExpired(tokens);
      expect(result).toBe(true);
    });

    it('deve retornar false para tokens nulos', () => {
      const result = tokenManager.isTokenExpired(null);
      expect(result).toBe(false);
    });
  });

  describe('isTokenValid', () => {
    it('deve retornar true para tokens não expirados', () => {
      const futureTime = Date.now() + 3600000;
      const tokens = { expiry_date: futureTime };
      const result = tokenManager.isTokenValid(tokens);
      expect(result).toBe(true);
    });

    it('deve retornar false para tokens expirados', () => {
      const pastTime = Date.now() - 3600000;
      const tokens = { expiry_date: pastTime };
      const result = tokenManager.isTokenValid(tokens);
      expect(result).toBe(false);
    });
  });

  describe('setTokenFilePath', () => {
    it('deve definir novo caminho do arquivo', () => {
      const newPath = './new/path/tokens.json';
      tokenManager.setTokenFilePath(newPath);
      expect(tokenManager.tokenFilePath).toBe(newPath);
    });
  });

  describe('getTokenFilePath', () => {
    it('deve retornar caminho atual do arquivo', () => {
      const result = tokenManager.getTokenFilePath();
      expect(result).toBe('./config/tokens.json');
    });
  });
});
