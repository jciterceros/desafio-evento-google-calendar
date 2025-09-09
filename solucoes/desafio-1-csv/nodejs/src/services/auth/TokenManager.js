import fs from 'fs';
import { ITokenManager } from '../../interfaces/ITokenManager.js';

/**
 * Serviço responsável pelo gerenciamento de tokens
 * Princípio da Responsabilidade Única (SRP)
 * Implementa ITokenManager
 */
export class TokenManager extends ITokenManager {
  constructor(tokenFilePath = './config/tokens.json') {
    super();
    this.tokenFilePath = tokenFilePath;
  }

  /**
   * Carrega tokens do arquivo
   * @returns {Object|null} Tokens carregados ou null se não existir
   */
  loadTokens() {
    try {
      if (fs.existsSync(this.tokenFilePath)) {
        const tokenData = JSON.parse(fs.readFileSync(this.tokenFilePath, 'utf8'));
        console.log('✅ Tokens carregados do arquivo');
        return tokenData;
      }
      console.log('⚠️ Arquivo de tokens não encontrado');
      return null;
    } catch (error) {
      console.error('❌ Erro ao carregar tokens:', error.message);
      return null;
    }
  }

  /**
   * Salva tokens no arquivo
   * @param {Object} tokens - Tokens para salvar
   * @returns {boolean} True se salvou com sucesso
   */
  saveTokens(tokens) {
    try {
      // Criar diretório se não existir
      const tokenDir = this.tokenFilePath.substring(0, this.tokenFilePath.lastIndexOf('/'));
      if (!fs.existsSync(tokenDir)) {
        fs.mkdirSync(tokenDir, { recursive: true });
      }

      const tokenData = {
        timestamp: new Date().toISOString(),
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        scope: tokens.scope,
        token_type: tokens.token_type,
        expiry_date: tokens.expiry_date
      };
      
      fs.writeFileSync(this.tokenFilePath, JSON.stringify(tokenData, null, 2));
      console.log('💾 Tokens salvos com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar tokens:', error.message);
      return false;
    }
  }

  /**
   * Verifica se os tokens existem
   * @returns {boolean} True se os tokens existem
   */
  tokensExist() {
    return fs.existsSync(this.tokenFilePath);
  }

  /**
   * Remove o arquivo de tokens
   * @returns {boolean} True se removeu com sucesso
   */
  clearTokens() {
    try {
      if (fs.existsSync(this.tokenFilePath)) {
        fs.unlinkSync(this.tokenFilePath);
        console.log('🗑️ Tokens removidos');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erro ao remover tokens:', error.message);
      return false;
    }
  }

  /**
   * Verifica se um token está expirado
   * @param {Object} tokens - Tokens para verificar
   * @returns {boolean} True se expirado
   */
  isTokenExpired(tokens) {
    if (!tokens || !tokens.expiry_date) {
      return false; // Se não tem data de expiração, assume que não expira
    }
    
    const now = new Date().getTime();
    const buffer = 5 * 60 * 1000; // 5 minutos de buffer
    return now >= (tokens.expiry_date - buffer);
  }

  /**
   * Verifica se um token é válido (não expirado)
   * @param {Object} tokens - Tokens para verificar
   * @returns {boolean} True se válido
   */
  isTokenValid(tokens) {
    return !this.isTokenExpired(tokens);
  }

  /**
   * Define o caminho do arquivo de tokens
   * @param {string} filePath - Caminho do arquivo
   */
  setTokenFilePath(filePath) {
    this.tokenFilePath = filePath;
  }

  /**
   * Retorna o caminho atual do arquivo de tokens
   * @returns {string} Caminho do arquivo
   */
  getTokenFilePath() {
    return this.tokenFilePath;
  }
}
