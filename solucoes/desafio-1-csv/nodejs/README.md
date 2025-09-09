# Google Calendar CSV Importer - Arquitetura SOLID

Importador de eventos CSV para Google Calendar implementado seguindo **princípios SOLID** com arquitetura modular e extensível.

## 🎯 Arquitetura Implementada

### Princípios SOLID Aplicados:
- **Single Responsibility** - Cada classe tem uma responsabilidade específica
- **Open/Closed** - Aberto para extensão, fechado para modificação
- **Liskov Substitution** - Implementações são intercambiáveis via interfaces
- **Interface Segregation** - Interfaces específicas e focadas
- **Dependency Inversion** - Depende de abstrações, não implementações

### Classes Principais:

1. **App** - Classe principal que orquestra toda a aplicação
2. **CSVParser** - Responsável pelo parsing de arquivos CSV
3. **EventValidator** - Valida dados dos eventos
4. **EventProcessor** - Processa e converte eventos
5. **CalendarProvider** - Interface para provedores de calendário
6. **AuthenticationService** - Gerencia autenticação OAuth
7. **TokenManager** - Gerencia tokens de acesso

## 📁 Estrutura do Projeto

```
nodejs_01/
├── src/
│   ├── app.js                           # Classe principal da aplicação
│   ├── interfaces/                      # Interfaces explícitas
│   │   ├── ICalendarProvider.js         # Interface para provedores de calendário
│   │   ├── ICSVParser.js                # Interface para parsers CSV
│   │   ├── IEventValidator.js           # Interface para validadores
│   │   ├── IEventProcessor.js           # Interface para processadores
│   │   ├── IAuthenticationService.js    # Interface para autenticação
│   │   └── ITokenManager.js             # Interface para gerenciamento de tokens
│   ├── services/                        # Implementações dos serviços
│   │   ├── csv/                         # Serviços de CSV
│   │   │   ├── CSVParser.js             # Parser de arquivos CSV
│   │   │   ├── EventValidator.js        # Validador de eventos
│   │   │   └── EventProcessor.js        # Processador de eventos
│   │   ├── calendar/                    # Provedores de calendário
│   │   │   ├── CalendarProvider.js      # Classe base abstrata
│   │   │   ├── GoogleCalendarProvider.js # Implementação Google Calendar
│   │   │   └── MockCalendarProvider.js  # Implementação mock para testes
│   │   └── auth/                        # Serviços de autenticação
│   │       ├── AuthenticationService.js # Serviço de autenticação OAuth
│   │       └── TokenManager.js          # Gerenciador de tokens
│   ├── models/                          # Modelos de domínio
│   │   ├── Event.js                     # Modelo de evento
│   │   └── CalendarEvent.js             # Modelo de evento de calendário
│   ├── utils/                           # Utilitários
│   │   ├── DateUtils.js                 # Utilitários de data
│   │   └── ValidationUtils.js           # Utilitários de validação
│   ├── constants/                       # Constantes da aplicação
│   │   └── AppConstants.js              # Constantes centralizadas
│   ├── errors/                          # Erros customizados
│   │   └── AppErrors.js                 # Classes de erro personalizadas
│   ├── factories/                       # Factories para criação de objetos
│   │   └── CalendarProviderFactory.js   # Factory para provedores de calendário
│   ├── test.js                          # Teste com Google Calendar real
│   └── test-mock.js                     # Teste com mock
├── data/
│   └── eventos.csv                      # Arquivo CSV de exemplo
├── config/
│   ├── credentials-example.json         # Exemplo de credenciais
│   └── tokens.json                      # Tokens salvos (gerado automaticamente)
├── output/
│   └── results.json                     # Resultados da execução
├── package.json
└── README.md
```

## 🚀 Instalação e Uso

### 1. Instalar dependências
```bash
cd nodejs_01
npm install
```

### 2. Configurar credenciais (opcional)
```bash
# Copiar exemplo
cp config/credentials-example.json config/credentials.json
# Editar com suas credenciais do Google Cloud
```

### 3. Executar aplicação

#### Com Google Calendar real:
```bash
npm start
# ou
node src/app.js
```

#### Com mock (sem credenciais):
```bash
npm run test:mock
# ou
node src/app.js --mock
```

#### Testes específicos:
```bash
npm run test:real   # Teste com Google Calendar real
npm run test:mock   # Teste com mock
```

### 4. Verificar resultados
Os resultados são salvos automaticamente em `./output/results.json` com informações detalhadas sobre cada evento processado.

## 📋 Formato do CSV

```csv
horario;duracao;nomeevento;notificacao
14/07/2025 14:00:00;120;Agenda Deploy;5
15/07/2025 09:00:00;60;Reunião de Planejamento;10
16/07/2025 16:00:00;30;Daily Standup;15
```

### Campos:
- **horario**: Data e hora no formato `DD/MM/YYYY HH:mm:ss`
- **duracao**: Duração em minutos (número inteiro positivo)
- **nomeevento**: Nome do evento/agenda
- **notificacao**: Tempo de notificação em minutos (número inteiro não-negativo)

## 🔧 Funcionalidades Implementadas

### Core Features:
- ✅ **Parser CSV** com separador `;` e validação de formato
- ✅ **Validação robusta** de dados dos eventos com mensagens detalhadas
- ✅ **Conversão automática** de datas para formato Google Calendar
- ✅ **Integração completa** com Google Calendar API v3
- ✅ **Autenticação OAuth 2.0** automática com renovação de tokens
- ✅ **Modo mock** para testes sem credenciais do Google
- ✅ **Tratamento de erros** com classes customizadas
- ✅ **Logs detalhados** com emojis para melhor UX
- ✅ **Salvamento automático** de resultados em JSON

### Arquitetura Avançada:
- ✅ **Interfaces explícitas** para todos os serviços
- ✅ **Factory Pattern** para criação de provedores
- ✅ **Injeção de dependências** na classe App
- ✅ **Constantes centralizadas** para configuração
- ✅ **Modelos de domínio** bem definidos
- ✅ **Utilitários reutilizáveis** para validação e datas

## 🎯 Vantagens da Arquitetura SOLID

### Princípios SOLID Implementados:

#### Single Responsibility Principle (SRP)
- **App**: Orquestra a aplicação
- **CSVParser**: Apenas parsing de CSV
- **EventValidator**: Apenas validação de eventos
- **EventProcessor**: Apenas processamento de eventos
- **AuthenticationService**: Apenas autenticação OAuth
- **TokenManager**: Apenas gerenciamento de tokens

#### Open/Closed Principle (OCP)
- **Interfaces** permitem extensão sem modificação
- **Factory Pattern** facilita adição de novos provedores
- **Classes base abstratas** para extensão

#### Liskov Substitution Principle (LSP)
- **MockCalendarProvider** e **GoogleCalendarProvider** são intercambiáveis
- **Implementações** podem ser substituídas sem quebrar o código

#### Interface Segregation Principle (ISP)
- **Interfaces específicas** para cada responsabilidade
- **Contratos claros** sem métodos desnecessários

#### Dependency Inversion Principle (DIP)
- **App** depende de abstrações (interfaces)
- **Injeção de dependências** via construtor
- **Factory** cria implementações concretas

### Benefícios da Arquitetura:

#### Manutenibilidade:
- **Código modular** e bem organizado
- **Responsabilidades claras** para cada classe
- **Fácil localização** de bugs e funcionalidades

#### Extensibilidade:
- **Novos provedores** de calendário fáceis de adicionar
- **Validações customizadas** sem modificar código existente
- **Formatos de CSV** diferentes podem ser suportados

#### Testabilidade:
- **Mock providers** para testes unitários
- **Interfaces** permitem mocking fácil
- **Dependências injetadas** facilitam testes

#### Robustez:
- **Tratamento de erros** com classes customizadas
- **Validações** em múltiplas camadas
- **Logs detalhados** para debugging

## 🔐 Configuração OAuth (Opcional)

Para usar com Google Calendar real:

1. **Google Cloud Console**
   - Acesse: https://console.cloud.google.com
   - Crie projeto ou selecione existente
   - Ative Google Calendar API

2. **Credenciais OAuth 2.0**
   - Vá para "APIs & Services" > "Credentials"
   - Clique em "Create Credentials" > "OAuth 2.0 Client IDs"
   - Configure tipo de aplicação (Desktop app)
   - Configure URIs de redirecionamento: `http://localhost:3000/callback`

3. **Baixar Credenciais**
   - Após criar, clique em "Download JSON"
   - Salve como `config/credentials.json`

## 🧪 Testes

### Teste com Mock (Recomendado para começar):
```bash
npm run test:mock
```

### Teste com Google Calendar Real:
```bash
npm run test:real
```

### Saída Esperada (Mock):
```
🧪 Testando com mock (sem credenciais)...

🚀 Iniciando aplicação refatorada...
🔧 Modo mock ativado
📁 Processando arquivo: ./data/eventos.csv
📁 Lendo arquivo: ./data/eventos.csv
📊 3 linhas encontradas no CSV
📊 3 eventos encontrados
✅ 3 eventos válidos
❌ 0 eventos inválidos
🔄 3 eventos processados com sucesso
⚠️ 0 eventos falharam no processamento
📅 [MOCK] Evento criado: Agenda Deploy (mock-event-1)
📅 [MOCK] Evento criado: Reunião de Planejamento (mock-event-2)
📅 [MOCK] Evento criado: Daily Standup (mock-event-3)
💾 Resultados salvos em: ./output/results.json

📊 Resumo:
✅ 3 eventos criados com sucesso
❌ 0 eventos com erro
🔧 Total de eventos mock: 3

🎉 Aplicação executada com sucesso!
```

### Saída Esperada (Google Calendar Real):
```
🧪 Testando com Google Calendar real...

🚀 Iniciando aplicação refatorada...
📋 Carregando credenciais...
🔑 Verificando tokens...
🔐 Tokens não encontrados, iniciando autenticação...
🌐 Abra este link no seu navegador: [URL de autenticação]
✅ Aplicação inicializada com sucesso!
📁 Processando arquivo: ./data/eventos.csv
📁 Lendo arquivo: ./data/eventos.csv
📊 3 linhas encontradas no CSV
📊 3 eventos encontrados
✅ 3 eventos válidos
❌ 0 eventos inválidos
🔄 3 eventos processados com sucesso
⚠️ 0 eventos falharam no processamento
📅 Evento criado no Google Calendar: Agenda Deploy
📅 Evento criado no Google Calendar: Reunião de Planejamento
📅 Evento criado no Google Calendar: Daily Standup
💾 Resultados salvos em: ./output/results.json

📊 Resumo:
✅ 3 eventos criados com sucesso
❌ 0 eventos com erro

🎉 Aplicação executada com sucesso!
```

## 🎯 Próximos Passos

### Implementado:
- [x] Arquitetura SOLID completa
- [x] Interfaces explícitas para todos os serviços
- [x] Factory Pattern para provedores
- [x] Modo mock para testes
- [x] Tratamento robusto de erros
- [x] Validação completa de dados
- [x] Autenticação OAuth 2.0
- [x] Logs detalhados e informativos
- [x] Testes unitários com Jest/Vitest

### Futuras Melhorias:
- [ ] Suporte a múltiplos calendários
- [ ] Suporte a diferentes formatos de CSV
- [ ] Cache de eventos para evitar duplicatas
- [ ] Sincronização bidirecional
- [ ] Dashboard de monitoramento
- [ ] API REST para integração

## 📄 Licença

Este projeto está sob a licença MIT.
