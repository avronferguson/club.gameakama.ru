(function () {
  const toast = document.getElementById("toast");

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("toast--show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("toast--show"), 1400);
  }

  // Подставляем рандомные числа (как на скрине)
  document.querySelectorAll(".js-rand").forEach((el) => {
    const min = Number(el.dataset.min || 300);
    const max = Number(el.dataset.max || 400);
    const v = Math.floor(min + Math.random() * (max - min + 1));
    el.textContent = String(v);
  });

  // Подставляем "выигрыш" в ₽
  document.querySelectorAll(".js-money").forEach((el) => {
    const min = Number(el.dataset.min || 250000);
    const max = Number(el.dataset.max || 500000);
    const v = Math.floor(min + Math.random() * (max - min + 1));
    el.textContent = v.toLocaleString("ru-RU") + " ₽";
  });

  // Кнопки "Начать играть": берём data-link (чтобы в HTML было удобно менять)
  document.querySelectorAll('a.btn[data-link]').forEach((a) => {
    const link = a.getAttribute("data-link");
    if (link) a.setAttribute("href", link);
  });

  // Copy промокода
  document.querySelectorAll(".js-copy").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy") || btn.textContent.trim();
      try {
        await navigator.clipboard.writeText(value);
        showToast("Промокод скопирован");
      } catch {
        // fallback
        const ta = document.createElement("textarea");
        ta.value = value;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        showToast("Промокод скопирован");
      }
    });
  });
})();

