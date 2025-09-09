import { App } from './app.js';

/**
 * Teste com Google Calendar real
 */
async function testReal() {
  console.log('🧪 Testando com Google Calendar real...\n');
  
  try {
    const app = new App(false); // useMock = false
    await app.run('./data/eventos.csv');
  } catch (error) {
    console.error('❌ Teste falhou:', error.message);
  }
}

// Executar teste
testReal();
