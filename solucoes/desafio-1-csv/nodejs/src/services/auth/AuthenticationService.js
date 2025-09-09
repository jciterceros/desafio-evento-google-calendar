import { google } from 'googleapis';
import http from 'http';
import url from 'url';
import { TokenManager } from './TokenManager.js';
import { IAuthenticationService } from '../../interfaces/IAuthenticationService.js';

/**
 * Serviço responsável pela autenticação OAuth
 * Princípio da Responsabilidade Única (SRP)
 * Implementa IAuthenticationService
 */
export class AuthenticationService extends IAuthenticationService {
  constructor(credentials, tokenManager = null) {
    super();
    this.credentials = credentials;
    this.tokenManager = tokenManager || new TokenManager();
    this.auth = null;
  }

  /**
   * Inicializa o serviço de autenticação
   */
  initialize() {
    if (!this.credentials) {
      throw new Error('Credenciais não fornecidas para AuthenticationService');
    }

    this.auth = new google.auth.OAuth2(
      this.credentials.client_id,
      this.credentials.client_secret,
      this.credentials.redirect_uri
    );

    console.log('✅ AuthenticationService inicializado');
  }

  /**
   * Carrega tokens salvos e define nas credenciais
   * @returns {Object|null} Tokens carregados ou null
   */
  loadSavedTokens() {
    const tokens = this.tokenManager.loadTokens();
    if (tokens && this.auth) {
      this.auth.setCredentials(tokens);
    }
    return tokens;
  }

  /**
   * Salva tokens atuais
   * @param {Object} tokens - Tokens para salvar
   * @returns {boolean} True se salvou com sucesso
   */
  saveTokens(tokens) {
    return this.tokenManager.saveTokens(tokens);
  }

  /**
   * Verifica se está autenticado
   * @returns {boolean} True se autenticado
   */
  isAuthenticated() {
    if (!this.auth) return false;
    
    const tokens = this.auth.credentials;
    if (!tokens || !tokens.access_token) return false;
    
    return this.tokenManager.isTokenValid(tokens);
  }

  /**
   * Renova o token de acesso
   * @returns {Promise<Object>} Novos tokens
   */
  async refreshToken() {
    if (!this.auth) {
      throw new Error('AuthenticationService não inicializado');
    }

    try {
      const tokens = this.auth.credentials;
      if (!tokens.refresh_token) {
        throw new Error('Refresh token não disponível');
      }

      console.log('🔄 Renovando token...');
      const { credentials: newTokens } = await this.auth.refreshAccessToken();
      this.auth.setCredentials(newTokens);
      this.saveTokens(newTokens);
      console.log('✅ Token renovado!');
      return newTokens;
    } catch (error) {
      console.error('❌ Erro ao renovar token:', error.message);
      throw error;
    }
  }

  /**
   * Garante que há um token válido
   * @returns {Promise<boolean>} True se tem token válido
   */
  async ensureValidToken() {
    if (!this.isAuthenticated()) {
      try {
        console.log('⚠️ Token expirado, renovando...');
        await this.refreshToken();
        return true;
      } catch (error) {
        console.error('❌ Não foi possível renovar token');
        return false;
      }
    }
    
    console.log('✅ Token válido');
    return true;
  }

  /**
   * Inicia o processo de autenticação OAuth
   * @returns {Promise<Object>} Tokens de autenticação
   */
  async authenticate() {
    if (!this.auth) {
      throw new Error('AuthenticationService não inicializado');
    }

    try {
      console.log('🔐 Iniciando autenticação OAuth...');
      
      // Gerar URL de autorização
      const scopes = [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
      ];

      const authUrl = this.auth.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
      });

      console.log('📋 Abra esta URL no navegador:');
      console.log(authUrl);
      console.log('\n⏳ Aguardando autorização...');

      // Iniciar servidor para callback
      const authCode = await this.startCallbackServer();
      
      // Trocar código por token
      const { tokens } = await this.auth.getToken(authCode);
      this.auth.setCredentials(tokens);
      this.saveTokens(tokens);
      
      console.log('✅ Autenticação concluída!');
      return tokens;
    } catch (error) {
      console.error('❌ Erro na autenticação:', error.message);
      throw error;
    }
  }

  /**
   * Inicia servidor HTTP para receber callback OAuth
   * @returns {Promise<string>} Código de autorização
   */
  startCallbackServer() {
    return new Promise((resolve, reject) => {
      const port = new URL(this.credentials.redirect_uri).port || 3000;
      
      const server = http.createServer((req, res) => {
        const parsedUrl = url.parse(req.url, true);
        
        if (parsedUrl.pathname === '/callback') {
          const { code } = parsedUrl.query;
          
          if (code) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
              <html><body>
                <h1>✅ Autenticação Concluída!</h1>
                <p>Você pode fechar esta janela.</p>
                <script>setTimeout(() => window.close(), 2000);</script>
              </body></html>
            `);
            
            setTimeout(() => {
              server.close();
              resolve(code);
            }, 1000);
          } else {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end('<h1>❌ Erro: Código não recebido</h1>');
            reject(new Error('Código não recebido'));
          }
        } else {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<h1>❌ Página não encontrada</h1>');
        }
      });

      server.listen(port, () => {
        console.log(`🌐 Servidor iniciado na porta ${port}`);
      });

      server.on('error', reject);
    });
  }

  /**
   * Retorna a instância de autenticação do Google
   * @returns {Object} Instância de autenticação
   */
  getAuthInstance() {
    return this.auth;
  }
}
