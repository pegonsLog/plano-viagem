# 🧹 Como Limpar Cache da PWA

## 🚨 Problema:
O erro `bear-family-144x144.png (Resource size is not correct)` está aparecendo porque o navegador ainda tem o manifest antigo em cache.

## ✅ Soluções Aplicadas:

### 1. **Manifest Simplificado**
- Removidos todos os ícones com tamanhos específicos
- Mantido apenas `bear-family.png` com `sizes: "any"`
- Isso permite que o navegador use a imagem original (100x100) para qualquer tamanho

### 2. **Service Worker Atualizado**
- Cache name alterado de `v1` para `v2`
- Isso força a limpeza do cache antigo

### 3. **Deploy Realizado**
- Nova versão no Firebase: https://plano-viagem.web.app

## 🔧 Para Resolver o Erro:

### **Opção 1: Limpar Cache do Navegador**
1. Abra DevTools (F12)
2. Vá para **Application** > **Storage**
3. Clique em **Clear storage**
4. Marque todas as opções
5. Clique **Clear site data**
6. Recarregue a página (Ctrl+F5)

### **Opção 2: Modo Incógnito**
1. Abra uma aba incógnita
2. Acesse https://plano-viagem.web.app
3. Teste a PWA sem cache

### **Opção 3: Desinstalar e Reinstalar PWA**
1. Se já instalou a PWA, desinstale-a
2. Limpe o cache do navegador
3. Acesse o site novamente
4. Reinstale a PWA

### **Opção 4: Forçar Atualização do Service Worker**
1. DevTools > Application > Service Workers
2. Clique em **Unregister** no service worker atual
3. Recarregue a página
4. O novo service worker será registrado

## 🎯 Resultado Esperado:

Após limpar o cache, você deve ver:
- ✅ Sem erros de ícone no console
- ✅ PWA funcionando corretamente
- ✅ Ícone bear-family aparecendo na instalação
- ✅ Service Worker v2 registrado

## 📱 Teste Final:

1. Acesse https://plano-viagem.web.app
2. Abra DevTools > Console
3. Não deve haver erros de ícone
4. Teste a instalação da PWA
5. Verifique se o ícone bear-family aparece

---

**💡 Dica**: O erro pode persistir por alguns minutos devido ao cache do CDN do Firebase. Se ainda aparecer, aguarde alguns minutos e tente novamente.