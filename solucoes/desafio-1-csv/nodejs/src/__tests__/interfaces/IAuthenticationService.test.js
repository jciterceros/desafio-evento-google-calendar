/**
 * Testes unitários para a interface IAuthenticationService
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { IAuthenticationService } from '../../interfaces/IAuthenticationService.js';

describe('IAuthenticationService', () => {
  let authService;

  beforeEach(() => {
    authService = new IAuthenticationService();
  });

  describe('initialize', () => {
    it('deve lançar erro quando método não é implementado', () => {
      expect(() => {
        authService.initialize();
      }).toThrow('Método initialize deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', () => {
      expect(() => {
        authService.initialize();
      }).toThrow(Error);
    });
  });

  describe('loadSavedTokens', () => {
    it('deve lançar erro quando método não é implementado', () => {
      expect(() => {
        authService.loadSavedTokens();
      }).toThrow('Método loadSavedTokens deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', () => {
      expect(() => {
        authService.loadSavedTokens();
      }).toThrow(Error);
    });
  });

  describe('saveTokens', () => {
    it('deve lançar erro quando método não é implementado', () => {
      const mockTokens = { access_token: 'token123', refresh_token: 'refresh123' };
      
      expect(() => {
        authService.saveTokens(mockTokens);
      }).toThrow('Método saveTokens deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', () => {
      const mockTokens = { access_token: 'token123', refresh_token: 'refresh123' };
      
      expect(() => {
        authService.saveTokens(mockTokens);
      }).toThrow(Error);
    });
  });

  describe('isAuthenticated', () => {
    it('deve lançar erro quando método não é implementado', () => {
      expect(() => {
        authService.isAuthenticated();
      }).toThrow('Método isAuthenticated deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', () => {
      expect(() => {
        authService.isAuthenticated();
      }).toThrow(Error);
    });
  });

  describe('refreshToken', () => {
    it('deve lançar erro quando método não é implementado', async () => {
      await expect(async () => {
        await authService.refreshToken();
      }).rejects.toThrow('Método refreshToken deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', async () => {
      await expect(async () => {
        await authService.refreshToken();
      }).rejects.toThrow(Error);
    });
  });

  describe('ensureValidToken', () => {
    it('deve lançar erro quando método não é implementado', async () => {
      await expect(async () => {
        await authService.ensureValidToken();
      }).rejects.toThrow('Método ensureValidToken deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', async () => {
      await expect(async () => {
        await authService.ensureValidToken();
      }).rejects.toThrow(Error);
    });
  });

  describe('authenticate', () => {
    it('deve lançar erro quando método não é implementado', async () => {
      await expect(async () => {
        await authService.authenticate();
      }).rejects.toThrow('Método authenticate deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', async () => {
      await expect(async () => {
        await authService.authenticate();
      }).rejects.toThrow(Error);
    });
  });

  describe('getAuthInstance', () => {
    it('deve lançar erro quando método não é implementado', () => {
      expect(() => {
        authService.getAuthInstance();
      }).toThrow('Método getAuthInstance deve ser implementado pela classe filha');
    });

    it('deve lançar erro do tipo Error', () => {
      expect(() => {
        authService.getAuthInstance();
      }).toThrow(Error);
    });
  });

  describe('herança e estrutura', () => {
    it('deve ser uma classe que pode ser instanciada', () => {
      expect(authService).toBeInstanceOf(IAuthenticationService);
    });

    it('deve ter todos os métodos definidos', () => {
      expect(typeof authService.initialize).toBe('function');
      expect(typeof authService.loadSavedTokens).toBe('function');
      expect(typeof authService.saveTokens).toBe('function');
      expect(typeof authService.isAuthenticated).toBe('function');
      expect(typeof authService.refreshToken).toBe('function');
      expect(typeof authService.ensureValidToken).toBe('function');
      expect(typeof authService.authenticate).toBe('function');
      expect(typeof authService.getAuthInstance).toBe('function');
    });
  });

  describe('implementação de interface', () => {
    it('deve permitir herança e implementação dos métodos', async () => {
      class MockAuthenticationService extends IAuthenticationService {
        initialize() {
          return true;
        }

        loadSavedTokens() {
          return { access_token: 'token123', refresh_token: 'refresh123' };
        }

        saveTokens(tokens) {
          return true;
        }

        isAuthenticated() {
          return true;
        }

        async refreshToken() {
          return { access_token: 'new_token123', refresh_token: 'new_refresh123' };
        }

        async ensureValidToken() {
          return true;
        }

        async authenticate() {
          return { access_token: 'auth_token123', refresh_token: 'auth_refresh123' };
        }

        getAuthInstance() {
          return { type: 'mock_auth' };
        }
      }

      const mockAuthService = new MockAuthenticationService();
      const mockTokens = { access_token: 'token123', refresh_token: 'refresh123' };

      expect(mockAuthService.initialize()).toBe(true);
      expect(mockAuthService.loadSavedTokens()).toEqual(mockTokens);
      expect(mockAuthService.saveTokens(mockTokens)).toBe(true);
      expect(mockAuthService.isAuthenticated()).toBe(true);
      
      const newTokens = await mockAuthService.refreshToken();
      expect(newTokens).toEqual({ access_token: 'new_token123', refresh_token: 'new_refresh123' });
      
      const isValid = await mockAuthService.ensureValidToken();
      expect(isValid).toBe(true);
      
      const authTokens = await mockAuthService.authenticate();
      expect(authTokens).toEqual({ access_token: 'auth_token123', refresh_token: 'auth_refresh123' });
      
      const authInstance = mockAuthService.getAuthInstance();
      expect(authInstance).toEqual({ type: 'mock_auth' });
    });
  });
});
