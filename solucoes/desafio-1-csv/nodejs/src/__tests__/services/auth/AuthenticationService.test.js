import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { google } from 'googleapis';
import http from 'http';
import url from 'url';
import { AuthenticationService } from '../../../services/auth/AuthenticationService.js';
import { TokenManager } from '../../../services/auth/TokenManager.js';

// Mock das dependências
vi.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: vi.fn()
    }
  }
}));

vi.mock('http', () => ({
  default: {
    createServer: vi.fn()
  }
}));

vi.mock('url', () => ({
  default: {
    parse: vi.fn()
  }
}));

vi.mock('../../../services/auth/TokenManager.js', () => ({
  TokenManager: vi.fn()
}));

describe('AuthenticationService', () => {
  let authService;
  let mockCredentials;
  let mockTokenManager;
  let mockOAuth2;
  let mockServer;

  beforeEach(() => {
    mockCredentials = {
      client_id: 'test_client_id',
      client_secret: 'test_client_secret',
      redirect_uri: 'http://localhost:3000/callback'
    };

    mockTokenManager = {
      loadTokens: vi.fn(),
      saveTokens: vi.fn(),
      isTokenValid: vi.fn()
    };

    mockOAuth2 = {
      setCredentials: vi.fn(),
      generateAuthUrl: vi.fn(),
      getToken: vi.fn(),
      refreshAccessToken: vi.fn(),
      credentials: {}
    };

    mockServer = {
      listen: vi.fn(),
      close: vi.fn(),
      on: vi.fn()
    };

    google.auth.OAuth2.mockImplementation(() => mockOAuth2);
    http.createServer.mockReturnValue(mockServer);
    TokenManager.mockImplementation(() => mockTokenManager);

    authService = new AuthenticationService(mockCredentials, mockTokenManager);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('deve inicializar com credenciais e token manager', () => {
      expect(authService.credentials).toBe(mockCredentials);
      expect(authService.tokenManager).toBe(mockTokenManager);
      expect(authService.auth).toBeNull();
    });

    it('deve criar TokenManager padrão quando não fornecido', () => {
      const service = new AuthenticationService(mockCredentials);
      expect(TokenManager).toHaveBeenCalled();
    });
  });

  describe('initialize', () => {
    it('deve inicializar OAuth2 com credenciais corretas', () => {
      authService.initialize();

      expect(google.auth.OAuth2).toHaveBeenCalledWith(
        'test_client_id',
        'test_client_secret',
        'http://localhost:3000/callback'
      );
      expect(authService.auth).toBe(mockOAuth2);
    });

    it('deve lançar erro quando credenciais não são fornecidas', () => {
      const service = new AuthenticationService(null);
      
      expect(() => service.initialize()).toThrow('Credenciais não fornecidas para AuthenticationService');
    });
  });

  describe('loadSavedTokens', () => {
    it('deve carregar e definir tokens quando existem', () => {
      const mockTokens = { access_token: 'token123' };
      mockTokenManager.loadTokens.mockReturnValue(mockTokens);
      authService.auth = mockOAuth2;

      const result = authService.loadSavedTokens();

      expect(mockTokenManager.loadTokens).toHaveBeenCalled();
      expect(mockOAuth2.setCredentials).toHaveBeenCalledWith(mockTokens);
      expect(result).toBe(mockTokens);
    });

    it('deve retornar null quando não há tokens', () => {
      mockTokenManager.loadTokens.mockReturnValue(null);
      authService.auth = mockOAuth2;

      const result = authService.loadSavedTokens();

      expect(result).toBeNull();
      expect(mockOAuth2.setCredentials).not.toHaveBeenCalled();
    });

    it('deve retornar null quando auth não está inicializado', () => {
      const result = authService.loadSavedTokens();
      expect(result).toBeUndefined();
    });
  });

  describe('saveTokens', () => {
    it('deve salvar tokens através do token manager', () => {
      const tokens = { access_token: 'token123' };
      mockTokenManager.saveTokens.mockReturnValue(true);

      const result = authService.saveTokens(tokens);

      expect(mockTokenManager.saveTokens).toHaveBeenCalledWith(tokens);
      expect(result).toBe(true);
    });
  });

  describe('isAuthenticated', () => {
    it('deve retornar false quando auth não está inicializado', () => {
      const result = authService.isAuthenticated();
      expect(result).toBe(false);
    });

    it('deve retornar false quando não há credenciais', () => {
      authService.auth = mockOAuth2;
      mockOAuth2.credentials = null;

      const result = authService.isAuthenticated();
      expect(result).toBe(false);
    });

    it('deve retornar false quando não há access_token', () => {
      authService.auth = mockOAuth2;
      mockOAuth2.credentials = { refresh_token: 'refresh123' };

      const result = authService.isAuthenticated();
      expect(result).toBe(false);
    });

    it('deve retornar false quando token é inválido', () => {
      authService.auth = mockOAuth2;
      mockOAuth2.credentials = { access_token: 'token123' };
      mockTokenManager.isTokenValid.mockReturnValue(false);

      const result = authService.isAuthenticated();
      expect(result).toBe(false);
    });

    it('deve retornar true quando token é válido', () => {
      authService.auth = mockOAuth2;
      mockOAuth2.credentials = { access_token: 'token123' };
      mockTokenManager.isTokenValid.mockReturnValue(true);

      const result = authService.isAuthenticated();
      expect(result).toBe(true);
    });
  });

  describe('refreshToken', () => {
    it('deve renovar token com sucesso', async () => {
      authService.auth = mockOAuth2;
      mockOAuth2.credentials = { refresh_token: 'refresh123' };
      const newTokens = { access_token: 'new_token123' };
      mockOAuth2.refreshAccessToken.mockResolvedValue({ credentials: newTokens });
      mockTokenManager.saveTokens.mockReturnValue(true);

      const result = await authService.refreshToken();

      expect(mockOAuth2.refreshAccessToken).toHaveBeenCalled();
      expect(mockOAuth2.setCredentials).toHaveBeenCalledWith(newTokens);
      expect(mockTokenManager.saveTokens).toHaveBeenCalledWith(newTokens);
      expect(result).toBe(newTokens);
    });

    it('deve lançar erro quando auth não está inicializado', async () => {
      await expect(authService.refreshToken()).rejects.toThrow('AuthenticationService não inicializado');
    });

    it('deve lançar erro quando não há refresh_token', async () => {
      authService.auth = mockOAuth2;
      mockOAuth2.credentials = {};

      await expect(authService.refreshToken()).rejects.toThrow('Refresh token não disponível');
    });

    it('deve propagar erro do refreshAccessToken', async () => {
      authService.auth = mockOAuth2;
      mockOAuth2.credentials = { refresh_token: 'refresh123' };
      const error = new Error('Erro de renovação');
      mockOAuth2.refreshAccessToken.mockRejectedValue(error);

      await expect(authService.refreshToken()).rejects.toThrow('Erro de renovação');
    });
  });

  describe('ensureValidToken', () => {
    it('deve retornar true quando já está autenticado', async () => {
      vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);

      const result = await authService.ensureValidToken();

      expect(result).toBe(true);
    });

    it('deve renovar token quando não está autenticado', async () => {
      vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);
      vi.spyOn(authService, 'refreshToken').mockResolvedValue({ access_token: 'new_token' });

      const result = await authService.ensureValidToken();

      expect(authService.refreshToken).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('deve retornar false quando renovação falha', async () => {
      vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);
      vi.spyOn(authService, 'refreshToken').mockRejectedValue(new Error('Erro de renovação'));

      const result = await authService.ensureValidToken();

      expect(result).toBe(false);
    });
  });

  describe('authenticate', () => {
    it('deve lançar erro quando auth não está inicializado', async () => {
      await expect(authService.authenticate()).rejects.toThrow('AuthenticationService não inicializado');
    });

    it('deve iniciar processo de autenticação completo', async () => {
      authService.auth = mockOAuth2;
      const mockAuthUrl = 'https://accounts.google.com/oauth/authorize?client_id=test';
      const mockAuthCode = 'auth_code_123';
      const mockTokens = { access_token: 'token123' };

      mockOAuth2.generateAuthUrl.mockReturnValue(mockAuthUrl);
      mockOAuth2.getToken.mockResolvedValue({ tokens: mockTokens });
      mockTokenManager.saveTokens.mockReturnValue(true);

      // Mock do servidor de callback
      let resolveCallback;
      const callbackPromise = new Promise(resolve => { resolveCallback = resolve; });
      
      mockServer.listen.mockImplementation((port, callback) => {
        if (callback) callback();
        // Simular recebimento do código
        setTimeout(() => {
          resolveCallback(mockAuthCode);
        }, 100);
      });

      // Mock do startCallbackServer
      vi.spyOn(authService, 'startCallbackServer').mockResolvedValue(mockAuthCode);

      const result = await authService.authenticate();

      expect(mockOAuth2.generateAuthUrl).toHaveBeenCalledWith({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/calendar.events'
        ],
        prompt: 'consent'
      });
      expect(mockOAuth2.getToken).toHaveBeenCalledWith(mockAuthCode);
      expect(mockOAuth2.setCredentials).toHaveBeenCalledWith(mockTokens);
      expect(mockTokenManager.saveTokens).toHaveBeenCalledWith(mockTokens);
      expect(result).toBe(mockTokens);
    });
  });

  describe('startCallbackServer', () => {
    it('deve iniciar servidor e retornar código de autorização', async () => {
      authService.auth = mockOAuth2;
      const mockAuthCode = 'auth_code_123';
      
      let serverCallback;
      mockServer.listen.mockImplementation((port, callback) => {
        if (callback) callback();
        // Simular requisição com código
        setTimeout(() => {
          const mockReq = { url: `/callback?code=${mockAuthCode}` };
          const mockRes = {
            writeHead: vi.fn(),
            end: vi.fn()
          };
          serverCallback(mockReq, mockRes);
        }, 100);
      });

      http.createServer.mockImplementation((callback) => {
        serverCallback = callback;
        return mockServer;
      });

      url.parse.mockImplementation((urlString, parseQueryString) => {
        if (urlString.includes('callback')) {
          return {
            pathname: '/callback',
            query: { code: mockAuthCode }
          };
        }
        return { pathname: '/other' };
      });

      const result = await authService.startCallbackServer();

      expect(mockServer.listen).toHaveBeenCalled();
      expect(result).toBe(mockAuthCode);
    });

    it('deve rejeitar quando código não é recebido', async () => {
      let serverCallback;
      mockServer.listen.mockImplementation((port, callback) => {
        if (callback) callback();
        setTimeout(() => {
          const mockReq = { url: '/callback' }; // sem código
          const mockRes = {
            writeHead: vi.fn(),
            end: vi.fn()
          };
          serverCallback(mockReq, mockRes);
        }, 100);
      });

      http.createServer.mockImplementation((callback) => {
        serverCallback = callback;
        return mockServer;
      });

      url.parse.mockReturnValue({
        pathname: '/callback',
        query: {} // sem código
      });

      await expect(authService.startCallbackServer()).rejects.toThrow('Código não recebido');
    });
  });

  describe('getAuthInstance', () => {
    it('deve retornar instância de autenticação', () => {
      authService.auth = mockOAuth2;
      const result = authService.getAuthInstance();
      expect(result).toBe(mockOAuth2);
    });
  });
});
