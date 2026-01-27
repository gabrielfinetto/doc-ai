🤖 Doc IA

Doc IA é uma extensão para Google Chrome que captura a página inteira (full page) do site atual e utiliza Inteligência Artificial para gerar automaticamente um documento técnico de requisitos, entregue diretamente no Slack do usuário.

Desenvolvido pelo Lab de IA – H2, o foco da ferramenta é acelerar a documentação de sistemas, produtos e fluxos digitais a partir de qualquer interface web.


✨ Funcionalidades

  - 📸 Captura Full Page da aba ativa (scroll completo da página)

  - 🤖 Envio automático da captura para processamento com IA

  - 📄 Geração de documento técnico de requisitos

  - 📬 Entrega do resultado via Slack

  - 🔐 Uso do Chrome Debugger API para captura precisa

  - 🎨 Interface moderna e intuitiva


🧩 Como funciona

  1.O usuário abre a extensão Doc IA no Chrome

  2.Informa seu e-mail

  3.Clica em “Gerar Requisitos”

  4.A extensão:

    - Analisa o layout da página

    - Ajusta o viewport para o tamanho total

    - Captura a página inteira em imagem

    - Envia a imagem + e-mail para um webhook (n8n)

  5.A IA processa a imagem e gera o documento

  6.O resultado chega no Slack do usuário


🖥️ Interface

  - Popup em HTML + CSS

  - Feedback visual de status:

    - Analisando página

    - Capturando imagem

    - Enviando para IA

    - Sucesso ou erro

  -  Design com identidade visual roxa + verde neon

🔐 Permissões Utilizadas

A extensão utiliza as seguintes permissões:
  "permissions": [
    "activeTab",
    "scripting",
    "debugger"
  ]

Essas permissões são necessárias para:

  - Acessar a aba ativa

  - Executar scripts

  - Capturar a página inteira via Debugger Protocol

🌐 Integrações

- Webhook n8n

    - Endpoint responsável por receber a imagem e o e-mail

    - Processa os dados com IA

    - Envia o documento final para o Slack

📁 Estrutura do Projeto
doc-ia/
├── manifest.json
├── popup.html
├── popup.js
├── icon-16.png
├── icon-48.png
├── icon-128.png
└── README.md

🧪 Tecnologias Utilizadas

  - JavaScript (Vanilla)

  - HTML5 / CSS3

  - Chrome Extension API (Manifest V3)

  - Chrome Debugger Protocol

  - Webhook n8n

  - Slack API (via automação)
  

🚀 Como instalar localmente

1.Clone o repositório:

git clone https://github.com/seu-usuario/doc-ia.git

2.Acesse chrome://extensions

3.Ative o Modo do desenvolvedor

4.Clique em “Carregar sem compactação”

5.Selecione a pasta do projeto


🏷️ Versão

v1.5.1


👨‍💻 Autor

Lab de IA – H2
Extensão desenvolvida para acelerar documentação técnica com Inteligência Artificial.
