import csv from 'csv-parser';
import fs from 'fs';
import { Event } from '../../models/Event.js';
import { ICSVParser } from '../../interfaces/ICSVParser.js';

/**
 * Serviço responsável apenas por fazer o parsing de arquivos CSV
 * Princípio da Responsabilidade Única (SRP)
 * Implementa ICSVParser
 */
export class CSVParser extends ICSVParser {
  constructor() {
    super();
    this.separator = ';';
  }

  /**
   * Faz o parsing de um arquivo CSV e retorna os dados brutos
   * @param {string} filePath - Caminho do arquivo CSV
   * @returns {Promise<Array>} Array de objetos com os dados do CSV
   */
  async parseFile(filePath) {
    console.log(`📁 Lendo arquivo: ${filePath}`);
    
    return new Promise((resolve, reject) => {
      const rows = [];
      
      fs.createReadStream(filePath)
        .pipe(csv({ separator: this.separator }))
        .on('data', (row) => {
          rows.push(row);
        })
        .on('end', () => {
          console.log(`📊 ${rows.length} linhas encontradas no CSV`);
          resolve(rows);
        })
        .on('error', (error) => {
          console.error('❌ Erro ao ler arquivo CSV:', error.message);
          reject(error);
        });
    });
  }

  /**
   * Converte uma linha do CSV em um objeto Event
   * @param {Object} row - Linha do CSV
   * @returns {Event} Instância de Event
   */
  parseRowToEvent(row) {
    return new Event({
      horario: row.horario,
      duracao: row.duracao,
      nomeevento: row.nomeevento,
      notificacao: row.notificacao
    });
  }

  /**
   * Faz o parsing de um arquivo CSV e retorna instâncias de Event
   * @param {string} filePath - Caminho do arquivo CSV
   * @returns {Promise<Array<Event>>} Array de instâncias de Event
   */
  async parseFileToEvents(filePath) {
    const rows = await this.parseFile(filePath);
    return rows.map(row => this.parseRowToEvent(row));
  }

}
