const webhookInput = document.getElementById("webhookUrl");
const saveButton = document.getElementById("saveWebhook");
const sendButton = document.getElementById("sendData");

saveButton.addEventListener("click", () => {
  const url = webhookInput.value;
  chrome.storage.local.set({ webhookUrl: url }, () => {
    alert("Webhook salvo!");
  });
});

sendButton.addEventListener("click", async () => {
  const { webhookUrl } = await chrome.storage.local.get("webhookUrl");

  if (!webhookUrl) {
    alert("Configure o webhook primeiro.");
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const html = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => document.documentElement.outerHTML
  });

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      html: html[0].result
    })
  });

  alert("Dados enviados!");
});
