/**
 * Constantes da aplicação
 * Centraliza valores que são usados em múltiplos lugares
 */

export const APP_CONSTANTS = {
  // CSV
  CSV_SEPARATOR: ';',
  
  // Calendário
  DEFAULT_CALENDAR_ID: 'primary',
  DEFAULT_TIMEZONE: 'America/Sao_Paulo',
  
  // Tokens
  TOKEN_BUFFER_MINUTES: 5,
  TOKEN_FILE_PATH: './config/tokens.json',
  
  // Servidor OAuth
  CALLBACK_PORT: 3000,
  CALLBACK_PATH: '/callback',
  
  // Arquivos
  DEFAULT_CSV_FILE: './data/eventos.csv',
  DEFAULT_OUTPUT_FILE: './output/results.json',
  
  // Scopes OAuth
  GOOGLE_CALENDAR_SCOPES: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ],
  
  // Formato de data
  DATE_TIME_FORMAT: 'DD/MM/YYYY HH:mm:ss',
  DATE_TIME_REGEX: /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/,
  // A REGEX é usada para validar o formato da data e hora no formato DD/MM/YYYY HH:mm:ss
  // A REGEX é composta por:
  // ^ - Início da string
  // (\d{2}) - Dia (2 dígitos)
  // / - Separador de dia e mês
  // (\d{2}) - Mês (2 dígitos)
  // / - Separador de mês e ano
  // (\d{4}) - Ano (4 dígitos)
  //  - Separador de ano e hora
  // (\d{2}) - Hora (2 dígitos)
  // : - Separador de hora e minuto
  // (\d{2}) - Minuto (2 dígitos)
  // : - Separador de minuto e segundo
  // (\d{2}) - Segundo (2 dígitos)
  
  // Mensagens
  MESSAGES: {
    APP_STARTING: '🚀 Iniciando aplicação refatorada...',
    MOCK_MODE_ACTIVATED: '🔧 Modo mock ativado',
    LOADING_CREDENTIALS: '📋 Carregando credenciais...',
    CHECKING_TOKENS: '🔑 Verificando tokens...',
    TOKENS_NOT_FOUND: '🔐 Tokens não encontrados, iniciando autenticação...',
    TOKEN_EXPIRED: '🔐 Token expirado, iniciando autenticação...',
    APP_INITIALIZED: '✅ Aplicação inicializada com sucesso!',
    PROCESSING_FILE: '📁 Processando arquivo:',
    EVENTS_FOUND: '📊 eventos encontrados',
    VALID_EVENTS: '✅ eventos válidos',
    INVALID_EVENTS: '❌ eventos inválidos',
    PROCESSED_SUCCESSFULLY: '🔄 eventos processados com sucesso',
    PROCESSING_FAILED: '⚠️ eventos falharam no processamento',
    RESULTS_SAVED: '💾 Resultados salvos em:',
    SUMMARY: '📊 Resumo:',
    EVENTS_CREATED: '✅ eventos criados com sucesso',
    EVENTS_ERROR: '❌ eventos com erro',
    TOTAL_MOCK_EVENTS: '🔧 Total de eventos mock:',
    APP_EXECUTED: '🎉 Aplicação executada com sucesso!'
  }
};
