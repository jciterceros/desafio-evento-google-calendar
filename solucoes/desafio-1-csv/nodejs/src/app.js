import { CSVParser } from './services/csv/CSVParser.js';
import { EventValidator } from './services/csv/EventValidator.js';
import { EventProcessor } from './services/csv/EventProcessor.js';
import { AuthenticationService } from './services/auth/AuthenticationService.js';
import { TokenManager } from './services/auth/TokenManager.js';
import { CalendarProviderFactory } from './factories/CalendarProviderFactory.js';
import { APP_CONSTANTS } from './constants/AppConstants.js';
import { ConfigurationError, FileProcessingError } from './errors/AppErrors.js';
import fs from 'fs';
import path from 'path';

/**
 * Classe principal seguindo princípios SOLID
 * - Single Responsibility: Orquestra a aplicação
 * - Open/Closed: Aberta para extensão, fechada para modificação
 * - Liskov Substitution: Usa abstrações (CalendarProvider)
 * - Interface Segregation: Usa interfaces específicas
 * - Dependency Inversion: Depende de abstrações, não implementações
 */
export class App {
  constructor(useMock = false) {
    this.useMock = useMock;
    
    // Injeção de dependências
    this.csvParser = new CSVParser();
    this.eventValidator = new EventValidator();
    this.eventProcessor = new EventProcessor();
    this.tokenManager = new TokenManager();
    
    // Provedor de calendário (abstração)
    this.calendarProvider = null;
    this.authService = null;
  }

  /**
   * Inicializar aplicação
   */
  async initialize() {
    try {
      console.log('🚀 Iniciando aplicação...');
      
      if (this.useMock) {
        console.log(APP_CONSTANTS.MESSAGES.MOCK_MODE_ACTIVATED);
        this.calendarProvider = CalendarProviderFactory.createMock();
        await this.calendarProvider.initialize();
        return;
      }

      // Carregar credenciais
      console.log('📋 Carregando credenciais...');
      const credentials = this.loadCredentials();
      
      // Inicializar serviços
      this.authService = new AuthenticationService(credentials, this.tokenManager);
      this.authService.initialize();
      
      this.calendarProvider = CalendarProviderFactory.createGoogle(credentials);
      await this.calendarProvider.initialize();

      // Verificar tokens
      console.log('🔑 Verificando tokens...');
      const tokens = this.authService.loadSavedTokens();
      
      if (!tokens) {
        console.log('🔐 Tokens não encontrados, iniciando autenticação...');
        await this.authService.authenticate();
      } else if (!await this.authService.ensureValidToken()) {
        console.log('🔐 Token expirado, iniciando autenticação...');
        await this.authService.authenticate();
      }

      // Definir credenciais no provedor
      this.calendarProvider.setCredentials(this.authService.getAuthInstance().credentials);

      console.log('✅ Aplicação inicializada com sucesso!');
    } catch (error) {
      console.error('❌ Erro na inicialização:', error.message);
      throw error;
    }
  }

  /**
   * Carregar credenciais
   */
  loadCredentials() {
    try {
      const credentialsPath = './config/credentials.json';
      const rawCredentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
      
      // Normalizar formato Google Cloud
      if (rawCredentials.web) {
        return {
          client_id: rawCredentials.web.client_id,
          client_secret: rawCredentials.web.client_secret,
          redirect_uri: rawCredentials.web.redirect_uris ? 
            rawCredentials.web.redirect_uris[0] : 
            `http://localhost:${APP_CONSTANTS.CALLBACK_PORT}${APP_CONSTANTS.CALLBACK_PATH}`
        };
      }
      
      return rawCredentials;
    } catch (error) {
      throw new ConfigurationError(
        `Erro ao carregar credenciais: ${error.message}`,
        'credentials.json'
      );
    }
  }

  /**
   * Processar arquivo CSV
   */
  async processCSV(filePath) {
    try {
      console.log(`📁 Processando arquivo: ${filePath}`);
      
      // 1. Parsear CSV
      const events = await this.csvParser.parseFileToEvents(filePath);
      console.log(`📊 ${events.length} eventos encontrados`);
      
      // 2. Validar eventos
      const validation = this.eventValidator.validateEvents(events);
      console.log(`✅ ${validation.totalValid} eventos válidos`);
      console.log(`❌ ${validation.totalInvalid} eventos inválidos`);
      
      // 3. Processar eventos válidos
      const processedEvents = this.eventProcessor.processEvents(validation.validEvents);
      console.log(`🔄 ${processedEvents.totalSuccessful} eventos processados com sucesso`);
      console.log(`⚠️ ${processedEvents.totalFailed} eventos falharam no processamento`);
      
      // 4. Criar eventos no calendário
      const results = [];
      
      // Processar eventos bem-sucedidos
      for (const processedEvent of processedEvents.successfulEvents) {
        try {
          const createdEvent = await this.calendarProvider.createEvent(processedEvent.data);
          results.push({
            success: true,
            event: createdEvent,
            originalData: processedEvent.originalData
          });
        } catch (error) {
          results.push({
            success: false,
            error: error.message,
            originalData: processedEvent.originalData
          });
        }
      }
      
      // Adicionar eventos que falharam no processamento
      results.push(...processedEvents.failedEvents);
      
      // Adicionar eventos inválidos
      for (const invalidEvent of validation.invalidEvents) {
        results.push({
          success: false,
          error: `Evento inválido: ${invalidEvent.errors.join(', ')}`,
          originalData: invalidEvent.event.toObject()
        });
      }
      
      return results;
    } catch (error) {
      console.error('❌ Erro ao processar CSV:', error.message);
      throw error;
    }
  }

  /**
   * Salvar resultados
   */
  saveResults(results, outputPath = APP_CONSTANTS.DEFAULT_OUTPUT_FILE) {
    try {
      // Criar diretório se não existir
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Salvar resultados
      fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
      console.log(`💾 Resultados salvos em: ${outputPath}`);
      
      // Estatísticas
      const successCount = results.filter(r => r.success).length;
      const errorCount = results.filter(r => !r.success).length;
      
      console.log(`\n📊 Resumo:`);
      console.log(`✅ ${successCount} eventos criados com sucesso`);
      console.log(`❌ ${errorCount} eventos com erro`);
      
      if (this.useMock && this.calendarProvider) {
        console.log(`🔧 Total de eventos mock: ${this.calendarProvider.getEventsCount()}`);
      }
      
    } catch (error) {
      console.error('❌ Erro ao salvar resultados:', error.message);
    }
  }

  /**
   * Executar aplicação principal
   */
  async run(csvFilePath = APP_CONSTANTS.DEFAULT_CSV_FILE) {
    try {
      await this.initialize();
      const results = await this.processCSV(csvFilePath);
      this.saveResults(results);
      console.log('\n🎉 Aplicação executada com sucesso!');
    } catch (error) {
      console.error('❌ Erro na execução:', error.message);
      process.exit(1);
    }
  }

}

/**
 * Função principal para execução direta
 */
async function main() {
  const useMock = process.argv.includes('--mock');
  const app = new App(useMock);
  await app.run();
}

// Executar se for o arquivo principal
if (process.argv[1] && process.argv[1].endsWith('app.js')) {
  main();
}