const WEBHOOK_URL = "https://pierre07.app.n8n.cloud/webhook/8f68d709-e3f9-4bd3-b6bb-929358163dcf";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const pageUrlInput = document.getElementById("page_url");
  const exampleUrlInput = document.getElementById("example_url");

  // Pré-remplir les champs verrouillés
  pageUrlInput.value = params.get("page_url") || "";
  exampleUrlInput.value = params.get("example_url") || "";

  const form = document.getElementById("extra-form");
  const statusEl = document.getElementById("status");
  const btn = document.getElementById("sendBtn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    btn.disabled = true;
    statusEl.textContent = "⏳ Envoi en cours…";

    const data = {
      page_url: pageUrlInput.value.trim(),
      example_url: exampleUrlInput.value.trim(),
      extra_bien: document.getElementById("extra_bien").value.trim(),
      photo1: document.getElementById("photo1").value.trim(),
      photo2: document.getElementById("photo2").value.trim(),
      logo: document.getElementById("logo").value.trim(),
    };

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      statusEl.style.color = "#7bd88f";
      statusEl.textContent = "✅ Données envoyées avec succès !";
    } catch (err) {
      statusEl.style.color = "#ff6b6b";
      statusEl.textContent = "❌ Erreur pendant l’envoi. Réessayez.";
      console.error(err);
    } finally {
      btn.disabled = false;
    }
  });
});
