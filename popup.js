document.getElementById('btnCapture').addEventListener('click', async () => {
  const btn = document.getElementById('btnCapture');
  const userEmail = document.getElementById('userEmail').value;
  const statusText = document.getElementById('statusText');
  const statusIcon = document.getElementById('statusIcon');
  const mainContent = document.getElementById('main-content');
  const statusArea = document.getElementById('statusArea');
  
  if (!userEmail.includes('@')) {
    alert("⚠️ Insira um e-mail válido.");
    return;
  }

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    mainContent.style.display = 'none';
    statusArea.classList.add('active');

    // Anexa o debugger para permitir captura full page
    await chrome.debugger.attach({ tabId: tab.id }, "1.3");

    statusText.innerText = "Analisando página...";
    const metrics = await chrome.debugger.sendCommand({ tabId: tab.id }, "Page.getLayoutMetrics");

    const width = Math.ceil(metrics.contentSize.width);
    const height = Math.ceil(metrics.contentSize.height);

    // Força o viewport para o tamanho total da página
    await chrome.debugger.sendCommand({ tabId: tab.id }, "Emulation.setDeviceMetricsOverride", {
      width: width,
      height: height,
      deviceScaleFactor: 1,
      mobile: false
    });

    statusText.innerText = "Capturando imagem...";
    const screenshot = await chrome.debugger.sendCommand({ tabId: tab.id }, "Page.captureScreenshot", {
      format: "png",
      fromSurface: true
    });

    // Limpa o debugger
    await chrome.debugger.sendCommand({ tabId: tab.id }, "Emulation.clearDeviceMetricsOverride");
    await chrome.debugger.detach({ tabId: tab.id });

    statusText.innerText = "Enviando para o Lab de IA...";
    
    const blob = await (await fetch(`data:image/png;base64,${screenshot.data}`)).blob();
    const formData = new FormData();
    formData.append('image', blob, 'screenshot.png');
    formData.append('email', userEmail);

    const response = await fetch('https://n8n-n8n.h1zjpg.easypanel.host/webhook/capturar-requisito', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      statusIcon.innerText = "✅";
      statusText.innerText = "Sucesso! Verifique seu Slack.";
      setTimeout(() => window.close(), 3000);
    } else {
      throw new Error("Erro no servidor n8n");
    }

  } catch (err) {
    statusIcon.innerText = "❌";
    statusText.innerText = "Erro: " + err.message;
    console.error(err);
    setTimeout(() => {
      mainContent.style.display = 'block';
      statusArea.classList.remove('active');
    }, 4000);
  }
});