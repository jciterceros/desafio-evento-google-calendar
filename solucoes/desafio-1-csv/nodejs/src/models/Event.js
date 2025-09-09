/**
 * Modelo de domínio para Evento
 * Representa um evento extraído do CSV
 */
export class Event {
  constructor(data) {
    this.horario = data.horario;
    this.duracao = parseInt(data.duracao);
    this.nomeevento = data.nomeevento;
    this.notificacao = parseInt(data.notificacao);
  }

  /**
   * Valida se o evento tem todos os campos obrigatórios
   */
  isValid() {
    return !!(
      this.horario &&
      this.duracao > 0 &&
      this.nomeevento &&
      this.notificacao >= 0
    );
  }

  /**
   * Retorna uma representação string do evento
   */
  toString() {
    return `Evento: ${this.nomeevento} - ${this.horario} (${this.duracao}min)`;
  }

  /**
   * Converte para objeto simples
   */
  toObject() {
    return {
      horario: this.horario,
      duracao: this.duracao,
      nomeevento: this.nomeevento,
      notificacao: this.notificacao
    };
  }
}
