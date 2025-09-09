/**
 * Interface para parsers de CSV
 * Define o contrato que todos os parsers de CSV devem implementar
 * Princípio da Segregação de Interface (ISP)
 */
export class ICSVParser {
  /**
   * Faz o parsing de um arquivo CSV e retorna os dados brutos
   * @param {string} filePath - Caminho do arquivo CSV
   * @returns {Promise<Array>} Array de objetos com os dados do CSV
   */
  async parseFile(filePath) {
    throw new Error('Método parseFile deve ser implementado pela classe filha');
  }

  /**
   * Converte uma linha do CSV em um objeto Event
   * @param {Object} row - Linha do CSV
   * @returns {Event} Instância de Event
   */
  parseRowToEvent(row) {
    throw new Error('Método parseRowToEvent deve ser implementado pela classe filha');
  }

  /**
   * Faz o parsing de um arquivo CSV e retorna instâncias de Event
   * @param {string} filePath - Caminho do arquivo CSV
   * @returns {Promise<Array<Event>>} Array de instâncias de Event
   */
  async parseFileToEvents(filePath) {
    throw new Error('Método parseFileToEvents deve ser implementado pela classe filha');
  }

}
