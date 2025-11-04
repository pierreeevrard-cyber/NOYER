// === CONFIG ===
const N8N_WEBHOOK_URL = "https://pierre07.app.n8n.cloud/webhook/recieve_url";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("eligibility-form");
  const urlInput = document.getElementById("url");
  const exampleInput = document.getElementById("exampleUrl");
  const statusEl = document.getElementById("status");
  const btn = document.getElementById("verifyBtn");

  if (!form || !urlInput || !exampleInput) {
    console.warn("IDs manquants dans le DOM (eligibility-form, url, exampleUrl)");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    btn.disabled = true;

    // Créer un élément temporaire d'état si non présent
    let status = statusEl;
    if (!status) {
      status = document.createElement("p");
      status.id = "status";
      status.className = "status";
      form.insertAdjacentElement("afterend", status);
    }

    status.style.color = "#ccc";
    status.textContent = "⏳ Vérification en cours…";

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_url: urlInput.value.trim(),
          example_url: exampleInput.value.trim(),
        }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { eligible: false, reason: text || "Réponse invalide" };
      }

      if (!res.ok) {
        throw new Error(data?.reason || `HTTP ${res.status}`);
      }

      if (data.eligible) {
        status.style.color = "#7bd88f";
        status.textContent = "✅ Éligible ! Votre site semble compatible.";
      } else {
        status.style.color = "#ff6b6b";
        status.textContent = `❌ Non éligible. ${data.reason || ""}`.trim();
      }
    } catch (err) {
      console.error(err);
      status.style.color = "#ff6b6b";
      status.textContent = "⚠️ Erreur pendant la vérification. Réessayez.";
    } finally {
      btn.disabled = false;
    }
  });
});
