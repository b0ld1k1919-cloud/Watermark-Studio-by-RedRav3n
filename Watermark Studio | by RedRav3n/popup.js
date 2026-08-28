const openButton = document.getElementById("openAppBtn");
const integrationsButton = document.getElementById("integrationsBtn");
const preview = document.getElementById("integrationPreview");
const previewClose = document.getElementById("previewClose");
const previewCancel = document.getElementById("previewCancel");
const previewGo = document.getElementById("previewGo");
const integrationUrl = "https://t.me/LinkHub_RedRav3n";

openButton.addEventListener("click", () => {
  openButton.disabled = true;
  openButton.textContent = "Открываю...";

  chrome.runtime.sendMessage({ action: "openApp" }, (response) => {
    if (chrome.runtime.lastError || !response?.ok) {
      openButton.disabled = false;
      openButton.textContent = "Открыть студию";
      return;
    }

    window.close();
  });
});

function closePreview() {
  preview.close();
}

integrationsButton.addEventListener("click", () => preview.showModal());
previewClose.addEventListener("click", closePreview);
previewCancel.addEventListener("click", closePreview);
preview.addEventListener("click", (event) => {
  if (event.target === preview) closePreview();
});
previewGo.addEventListener("click", () => {
  chrome.tabs.create({ url: integrationUrl });
  closePreview();
});
