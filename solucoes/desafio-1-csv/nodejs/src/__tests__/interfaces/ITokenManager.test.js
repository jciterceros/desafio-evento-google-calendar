/**
 * Testes unitários para a interface ITokenManager
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ITokenManager } from '../../interfaces/ITokenManager.js';

describe('ITokenManager', () => {
  let tokenManager;

  beforeEach(() => {
    tokenManager = new ITokenManager();
  });

  describe('loadTokens', () => {
    it('deve lançar erro quando método não é implementado', () => {
      expect(() => {
        tokenManager.loadTokens();
      }).toThrow('Método loadTokens deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', () => {
      expect(() => {
        tokenManager.loadTokens();
      }).toThrow(Error);
    });
  });

  describe('saveTokens', () => {
    it('deve lançar erro quando método não é implementado', () => {
      const mockTokens = { access_token: 'token123', refresh_token: 'refresh123' };
      
      expect(() => {
        tokenManager.saveTokens(mockTokens);
      }).toThrow('Método saveTokens deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', () => {
      const mockTokens = { access_token: 'token123', refresh_token: 'refresh123' };
      
      expect(() => {
        tokenManager.saveTokens(mockTokens);
      }).toThrow(Error);
    });
  });

  describe('tokensExist', () => {
    it('deve lançar erro quando método não é implementado', () => {
      expect(() => {
        tokenManager.tokensExist();
      }).toThrow('Método tokensExist deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', () => {
      expect(() => {
        tokenManager.tokensExist();
      }).toThrow(Error);
    });
  });

  describe('clearTokens', () => {
    it('deve lançar erro quando método não é implementado', () => {
      expect(() => {
        tokenManager.clearTokens();
      }).toThrow('Método clearTokens deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', () => {
      expect(() => {
        tokenManager.clearTokens();
      }).toThrow(Error);
    });
  });

  describe('isTokenExpired', () => {
    it('deve lançar erro quando método não é implementado', () => {
      const mockTokens = { access_token: 'token123', refresh_token: 'refresh123' };
      
      expect(() => {
        tokenManager.isTokenExpired(mockTokens);
      }).toThrow('Método isTokenExpired deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', () => {
      const mockTokens = { access_token: 'token123', refresh_token: 'refresh123' };
      
      expect(() => {
        tokenManager.isTokenExpired(mockTokens);
      }).toThrow(Error);
    });
  });

  describe('isTokenValid', () => {
    it('deve lançar erro quando método não é implementado', () => {
      const mockTokens = { access_token: 'token123', refresh_token: 'refresh123' };
      
      expect(() => {
        tokenManager.isTokenValid(mockTokens);
      }).toThrow('Método isTokenValid deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', () => {
      const mockTokens = { access_token: 'token123', refresh_token: 'refresh123' };
      
      expect(() => {
        tokenManager.isTokenValid(mockTokens);
      }).toThrow(Error);
    });
  });

  describe('setTokenFilePath', () => {
    it('deve lançar erro quando método não é implementado', () => {
      const filePath = '/path/to/tokens.json';
      
      expect(() => {
        tokenManager.setTokenFilePath(filePath);
      }).toThrow('Método setTokenFilePath deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', () => {
      const filePath = '/path/to/tokens.json';
      
      expect(() => {
        tokenManager.setTokenFilePath(filePath);
      }).toThrow(Error);
    });
  });

  describe('getTokenFilePath', () => {
    it('deve lançar erro quando método não é implementado', () => {
      expect(() => {
        tokenManager.getTokenFilePath();
      }).toThrow('Método getTokenFilePath deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', () => {
      expect(() => {
        tokenManager.getTokenFilePath();
      }).toThrow(Error);
    });
  });

  describe('herança e estrutura', () => {
    it('deve ser uma classe que pode ser instanciada', () => {
      expect(tokenManager).toBeInstanceOf(ITokenManager);
    });

    it('deve ter todos os métodos definidos', () => {
      expect(typeof tokenManager.loadTokens).toBe('function');
      expect(typeof tokenManager.saveTokens).toBe('function');
      expect(typeof tokenManager.tokensExist).toBe('function');
      expect(typeof tokenManager.clearTokens).toBe('function');
      expect(typeof tokenManager.isTokenExpired).toBe('function');
      expect(typeof tokenManager.isTokenValid).toBe('function');
      expect(typeof tokenManager.setTokenFilePath).toBe('function');
      expect(typeof tokenManager.getTokenFilePath).toBe('function');
    });
  });

  describe('implementação de interface', () => {
    it('deve permitir herança e implementação dos métodos', () => {
      class MockTokenManager extends ITokenManager {
        loadTokens() {
          return { access_token: 'token123', refresh_token: 'refresh123' };
        }

        saveTokens(tokens) {
          return true;
        }

        tokensExist() {
          return true;
        }

        clearTokens() {
          return true;
        }

        isTokenExpired(tokens) {
          return false;
        }

        isTokenValid(tokens) {
          return true;
        }

        setTokenFilePath(filePath) {
          this.filePath = filePath;
        }

        getTokenFilePath() {
          return this.filePath || '/default/path.json';
        }
      }

      const mockTokenManager = new MockTokenManager();
      const mockTokens = { access_token: 'token123', refresh_token: 'refresh123' };

      expect(mockTokenManager.loadTokens()).toEqual(mockTokens);
      expect(mockTokenManager.saveTokens(mockTokens)).toBe(true);
      expect(mockTokenManager.tokensExist()).toBe(true);
      expect(mockTokenManager.clearTokens()).toBe(true);
      expect(mockTokenManager.isTokenExpired(mockTokens)).toBe(false);
      expect(mockTokenManager.isTokenValid(mockTokens)).toBe(true);
      
      mockTokenManager.setTokenFilePath('/custom/path.json');
      expect(mockTokenManager.getTokenFilePath()).toBe('/custom/path.json');
    });
  });
});
