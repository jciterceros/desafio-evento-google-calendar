import { App } from './app.js';

/**
 * Teste com mock (sem credenciais)
 */
async function testMock() {
  console.log('🧪 Testando com mock (sem credenciais)...\n');
  
  try {
    const app = new App(true); // useMock = true
    await app.run('./data/eventos.csv');
  } catch (error) {
    console.error('❌ Teste falhou:', error.message);
  }
}

// Executar teste
testMock();
