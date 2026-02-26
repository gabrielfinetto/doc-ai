# DocIA – Captura Inteligente de Requisitos

Extensão Chrome + workflow n8n para capturar páginas web, gerar requisitos automaticamente com IA e enviar para Slack.

## 🚀 Arquitetura

1. A extensão Chrome:
   - Captura HTML da página
   - Captura screenshot full page
   - Envia para um webhook n8n

2. O n8n:
   - Recebe os dados
   - Processa com OpenAI
   - Estrutura requisitos
   - Envia mensagem via Slack

---

# 🧩 Estrutura do Projeto
  /extension → Código da extensão Chrome
  /n8n → Workflow template para importar no n8n
  LICENSE
  README.md

  
---

# 🛠 Instalação da Extensão (Modo Desenvolvedor)

1. Abra o Chrome
2. Acesse: `chrome://extensions`
3. Ative "Developer Mode"
4. Clique em "Load unpacked"
5. Selecione a pasta `/extension`

---

# 🔧 Configuração do n8n

1. Suba seu ambiente n8n (cloud ou self-hosted)
2. Vá em Workflows → Import
3. Importe `workflow.template.json`
4. Configure as credenciais:
   - OpenAI
   - Slack
5. Copie a URL do webhook gerado

---

# ⚙ Configuração do Webhook na Extensão

Após importar o workflow:

1. Clique na extensão
2. Cole a URL do seu webhook
3. Clique em salvar

---

# 🔐 Segurança

Nunca publique:
- Tokens Slack
- OpenAI API keys
- URLs internas de webhook

Use variáveis de ambiente no n8n.

---

# 📜 Licença

MIT
