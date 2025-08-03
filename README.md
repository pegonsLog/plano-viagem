# 🌍 Gerenciador de Viagens

Um aplicativo web moderno para gerenciar e organizar suas viagens, desenvolvido com Angular 20.

## ✨ Funcionalidades

- **📝 Cadastro de Viagens**: Adicione novas viagens com título, destino, datas e orçamento
- **📋 Lista de Viagens**: Visualize todas suas viagens em cards organizados
- **🏷️ Status de Viagens**: Acompanhe o status (Planejada, Em Andamento, Concluída, Cancelada)
- **💰 Controle de Orçamento**: Gerencie o orçamento de cada viagem
- **📱 Interface Responsiva**: Design adaptável para desktop e mobile
- **🎨 Design Moderno**: Interface limpa e intuitiva

## 🚀 Como executar

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação
1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd plano-de-viagem
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm start
```

4. Abra o navegador em `http://localhost:4200`

## 🛠️ Tecnologias Utilizadas

- **Angular 20**: Framework principal
- **TypeScript**: Linguagem de programação
- **SCSS**: Pré-processador CSS
- **Angular Signals**: Gerenciamento de estado reativo
- **Angular Forms**: Formulários reativos
- **Standalone Components**: Arquitetura moderna do Angular

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── formulario-viagem/     # Componente de formulário
│   │   └── lista-viagens/         # Componente de listagem
│   ├── models/
│   │   └── viagem.model.ts        # Modelo de dados
│   ├── services/
│   │   └── viagem.service.ts      # Serviço de gerenciamento
│   ├── app.ts                     # Componente principal
│   ├── app.html                   # Template principal
│   └── app.scss                   # Estilos principais
├── styles.scss                    # Estilos globais
└── index.html                     # Página principal
```

## 🎯 Funcionalidades Implementadas

### ✅ Concluídas
- [x] Modelo de dados para viagens
- [x] Serviço de gerenciamento com Angular Signals
- [x] Componente de listagem de viagens
- [x] Componente de formulário para nova viagem
- [x] Interface responsiva
- [x] Validação de formulários
- [x] Formatação de datas e valores monetários
- [x] Sistema de status de viagens

### 🔄 Próximas Funcionalidades
- [ ] Edição de viagens existentes
- [ ] Filtros e busca
- [ ] Persistência de dados (localStorage/API)
- [ ] Upload de imagens
- [ ] Relatórios e estatísticas
- [ ] Exportação de dados
- [ ] Notificações e lembretes

## 🎨 Design

O aplicativo utiliza um design moderno com:
- Gradiente azul/roxo no cabeçalho
- Cards com sombras e hover effects
- Cores diferenciadas por status
- Tipografia limpa e legível
- Layout responsivo com CSS Grid

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🚀 Deploy

Para fazer o build de produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/` e podem ser servidos por qualquer servidor web estático.# plano-viagem
