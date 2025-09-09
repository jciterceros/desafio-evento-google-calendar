/**
 * Interface para gerenciadores de tokens
 * Define o contrato que todos os gerenciadores de tokens devem implementar
 * Princípio da Segregação de Interface (ISP)
 */
export class ITokenManager {
  /**
   * Carrega tokens do arquivo
   * @returns {Object|null} Tokens carregados ou null se não existir
   */
  loadTokens() {
    throw new Error('Método loadTokens deve ser implementado pela classe filha');
  }

  /**
   * Salva tokens no arquivo
   * @param {Object} tokens - Tokens para salvar
   * @returns {boolean} True se salvou com sucesso
   */
  saveTokens(tokens) {
    throw new Error('Método saveTokens deve ser implementado pela classe filha');
  }

  /**
   * Verifica se os tokens existem
   * @returns {boolean} True se os tokens existem
   */
  tokensExist() {
    throw new Error('Método tokensExist deve ser implementado pela classe filha');
  }

  /**
   * Remove o arquivo de tokens
   * @returns {boolean} True se removeu com sucesso
   */
  clearTokens() {
    throw new Error('Método clearTokens deve ser implementado pela classe filha');
  }

  /**
   * Verifica se um token está expirado
   * @param {Object} tokens - Tokens para verificar
   * @returns {boolean} True se expirado
   */
  isTokenExpired(tokens) {
    throw new Error('Método isTokenExpired deve ser implementado pela classe filha');
  }

  /**
   * Verifica se um token é válido (não expirado)
   * @param {Object} tokens - Tokens para verificar
   * @returns {boolean} True se válido
   */
  isTokenValid(tokens) {
    throw new Error('Método isTokenValid deve ser implementado pela classe filha');
  }

  /**
   * Define o caminho do arquivo de tokens
   * @param {string} filePath - Caminho do arquivo
   */
  setTokenFilePath(filePath) {
    throw new Error('Método setTokenFilePath deve ser implementado pela classe filha');
  }

  /**
   * Retorna o caminho atual do arquivo de tokens
   * @returns {string} Caminho do arquivo
   */
  getTokenFilePath() {
    throw new Error('Método getTokenFilePath deve ser implementado pela classe filha');
  }
}
