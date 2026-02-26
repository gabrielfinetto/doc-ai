// popup.js

const els = {
  btnCapture: document.getElementById("btnCapture"),
  userEmail: document.getElementById("userEmail"),

  webhookUrl: document.getElementById("webhookUrl"),
  saveWebhook: document.getElementById("saveWebhook"),

  statusText: document.getElementById("statusText"),
  statusIcon: document.getElementById("statusIcon"),
  mainContent: document.getElementById("main-content"),
  statusArea: document.getElementById("statusArea"),
};

// Helpers
function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

function setStatus(icon, text) {
  els.statusIcon.innerText = icon;
  els.statusText.innerText = text;
}

function showStatus() {
  els.mainContent.style.display = "none";
  els.statusArea.classList.add("active");
}

function showMain() {
  els.mainContent.style.display = "block";
  els.statusArea.classList.remove("active");
}

async function getStoredWebhookUrl() {
  const { webhookUrl } = await chrome.storage.local.get("webhookUrl");
  return webhookUrl || "";
}

async function setStoredWebhookUrl(url) {
  await chrome.storage.local.set({ webhookUrl: url });
}

// Prefill webhook input on load
(async () => {
  if (els.webhookUrl) {
    const saved = await getStoredWebhookUrl();
    if (saved) els.webhookUrl.value = saved;
  }
})();

// Save webhook button
if (els.saveWebhook) {
  els.saveWebhook.addEventListener("click", async () => {
    const url = (els.webhookUrl?.value || "").trim();

    if (!isValidUrl(url)) {
      alert("⚠️ Insira uma URL válida do webhook (http/https).");
      return;
    }

    await setStoredWebhookUrl(url);
    alert("✅ Webhook salvo!");
  });
}

// Capture flow
els.btnCapture.addEventListener("click", async () => {
  const userEmail = (els.userEmail.value || "").trim();
  const webhookUrl = (await getStoredWebhookUrl()).trim();

  if (!isValidEmail(userEmail)) {
    alert("⚠️ Insira um e-mail válido.");
    return;
  }

  if (!webhookUrl || !isValidUrl(webhookUrl)) {
    alert("⚠️ Configure e salve a URL do webhook do n8n antes de gerar.");
    return;
  }

  // UI state
  showStatus();
  setStatus("⚡", "Analisando página...");

  let tab;
  let debuggerAttached = false;

  try {
    [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error("Não foi possível identificar a aba ativa.");

    // Attach debugger for full page capture
    await chrome.debugger.attach({ tabId: tab.id }, "1.3");
    debuggerAttached = true;

    const metrics = await chrome.debugger.sendCommand({ tabId: tab.id }, "Page.getLayoutMetrics");
    const width = Math.ceil(metrics?.contentSize?.width || 0);
    const height = Math.ceil(metrics?.contentSize?.height || 0);

    if (!width || !height) throw new Error("Não foi possível obter as dimensões da página.");

    // Override viewport to full page size
    await chrome.debugger.sendCommand({ tabId: tab.id }, "Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false,
    });

    setStatus("📸", "Capturando imagem...");
    const screenshot = await chrome.debugger.sendCommand({ tabId: tab.id }, "Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
    });

    if (!screenshot?.data) throw new Error("Falha ao capturar screenshot.");

    // Always clear device metrics override
    await chrome.debugger.sendCommand({ tabId: tab.id }, "Emulation.clearDeviceMetricsOverride");

    setStatus("🚀", "Enviando para o n8n...");

    // Convert base64 PNG to Blob
    const blob = await (await fetch(`data:image/png;base64,${screenshot.data}`)).blob();

    // Send multipart form-data: image + email
    const formData = new FormData();
    formData.append("image", blob, "screenshot.png");
    formData.append("email", userEmail);

    const response = await fetch(webhookUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Erro no n8n (HTTP ${response.status}).`);
    }

    setStatus("✅", "Sucesso! Verifique seu Slack.");
    setTimeout(() => window.close(), 2500);
  } catch (err) {
    console.error(err);
    setStatus("❌", `Erro: ${err?.message || "desconhecido"}`);
    setTimeout(() => showMain(), 3500);
  } finally {
    // Ensure debugger detaches
    try {
      if (tab?.id && debuggerAttached) {
        await chrome.debugger.detach({ tabId: tab.id });
      }
    } catch (e) {
      // Avoid crashing on detach failure
      console.warn("Falha ao detach do debugger:", e);
    }
  }
});
