/**
 * Interface para serviços de autenticação
 * Define o contrato que todos os serviços de autenticação devem implementar
 * Princípio da Segregação de Interface (ISP)
 */
export class IAuthenticationService {
  /**
   * Inicializa o serviço de autenticação
   */
  initialize() {
    throw new Error('Método initialize deve ser implementado pela classe filha');
  }

  /**
   * Carrega tokens salvos e define nas credenciais
   * @returns {Object|null} Tokens carregados ou null
   */
  loadSavedTokens() {
    throw new Error('Método loadSavedTokens deve ser implementado pela classe filha');
  }

  /**
   * Salva tokens atuais
   * @param {Object} tokens - Tokens para salvar
   * @returns {boolean} True se salvou com sucesso
   */
  saveTokens(tokens) {
    throw new Error('Método saveTokens deve ser implementado pela classe filha');
  }

  /**
   * Verifica se está autenticado
   * @returns {boolean} True se autenticado
   */
  isAuthenticated() {
    throw new Error('Método isAuthenticated deve ser implementado pela classe filha');
  }

  /**
   * Renova o token de acesso
   * @returns {Promise<Object>} Novos tokens
   */
  async refreshToken() {
    throw new Error('Método refreshToken deve ser implementado pela classe filha');
  }

  /**
   * Garante que há um token válido
   * @returns {Promise<boolean>} True se tem token válido
   */
  async ensureValidToken() {
    throw new Error('Método ensureValidToken deve ser implementado pela classe filha');
  }

  /**
   * Inicia o processo de autenticação OAuth
   * @returns {Promise<Object>} Tokens de autenticação
   */
  async authenticate() {
    throw new Error('Método authenticate deve ser implementado pela classe filha');
  }

  /**
   * Retorna a instância de autenticação
   * @returns {Object} Instância de autenticação
   */
  getAuthInstance() {
    throw new Error('Método getAuthInstance deve ser implementado pela classe filha');
  }
}
