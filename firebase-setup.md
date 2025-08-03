# 🔥 Configuração do Firebase

## 1. **Criar Projeto no Firebase**

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar um projeto"
3. Nomeie seu projeto (ex: "plano-de-viagem")
4. Configure Google Analytics (opcional)
5. Clique em "Criar projeto"

## 2. **Configurar Firestore Database**

1. No painel do Firebase, vá em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (para desenvolvimento)
4. Selecione uma localização próxima (ex: southamerica-east1)

## 3. **Obter Configuração do Firebase**

1. Vá em "Configurações do projeto" (ícone de engrenagem)
2. Na aba "Geral", role até "Seus aplicativos"
3. Clique no ícone "</>" para adicionar um app web
4. Registre o app com um nome (ex: "plano-de-viagem-web")
5. Copie a configuração do Firebase

## 4. **Atualizar Arquivos de Environment**

Substitua as configurações nos arquivos:

### `src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "sua-api-key-aqui",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-project-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "seu-app-id"
  }
};
```

### `src/environments/environment.prod.ts`
```typescript
export const environment = {
  production: true,
  firebase: {
    // Mesma configuração do environment.ts
  }
};
```

## 5. **Configurar Regras do Firestore**

No Firebase Console, vá em "Firestore Database" > "Regras" e configure:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita para viagens
    match /viagens/{document} {
      allow read, write: if true; // Para desenvolvimento
    }
    
    // Permitir leitura e escrita para dias-viagem
    match /dias-viagem/{document} {
      allow read, write: if true; // Para desenvolvimento
    }
  }
}
```

**⚠️ IMPORTANTE:** Essas regras são para desenvolvimento. Em produção, implemente autenticação e regras mais restritivas.

## 6. **Estrutura das Coleções**

### Coleção: `viagens`
```json
{
  "titulo": "Férias em Paris",
  "destino": "Paris, França",
  "dataInicio": "2025-06-15T00:00:00.000Z",
  "dataFim": "2025-06-25T00:00:00.000Z",
  "orcamento": 3500,
  "descricao": "Viagem romântica para conhecer a cidade luz",
  "status": "planejada",
  "criadaEm": "2025-03-08T10:00:00.000Z",
  "atualizadaEm": "2025-03-08T10:00:00.000Z"
}
```

### Coleção: `dias-viagem`
```json
{
  "viagemId": "id-da-viagem",
  "data": "2025-06-15T00:00:00.000Z",
  "diaSemana": "Segunda-feira",
  "cidade": "Paris",
  "transporte": "aviao",
  "nomeHospedagem": "Hotel Le Marais",
  "enderecoHospedagem": "Rue des Rosiers, 75004 Paris",
  "deslocamentoLocal": "Metrô e caminhada",
  "observacoes": "Chegada no aeroporto Charles de Gaulle às 14h",
  "criadoEm": "2025-03-08T10:00:00.000Z",
  "atualizadoEm": "2025-03-08T10:00:00.000Z"
}
```

## 7. **Testar a Conexão**

1. Execute o app: `npm start`
2. Tente criar uma nova viagem
3. Verifique no Firebase Console se os dados aparecem
4. Teste adicionar detalhes de dias

## 8. **Comandos Úteis**

```bash
# Instalar dependências (já feito)
npm install firebase @angular/fire

# Executar em desenvolvimento
npm start

# Build para produção
npm run build
```

## 9. **Próximos Passos (Opcional)**

- **Autenticação:** Implementar login com Firebase Auth
- **Regras de Segurança:** Configurar regras baseadas em usuário
- **Offline Support:** Configurar cache offline do Firestore
- **Deploy:** Hospedar no Firebase Hosting

## 🔧 **Troubleshooting**

### Erro de CORS
Se encontrar erros de CORS, verifique se o domínio está autorizado no Firebase Console.

### Erro de Permissão
Verifique as regras do Firestore e certifique-se de que estão configuradas corretamente.

### Dados não aparecem
Verifique o console do navegador para erros e confirme se a configuração do Firebase está correta.