// All site JS moved here to reduce inline scripts and simplify CSP tightening later.
(function () {
  // 1) Copy promo code
  document.addEventListener("click", async (e) => {
    const b = e.target.closest(".copy");
    if (!b) return;

    const t = b.getAttribute("data-copy") || "";
    try {
      await navigator.clipboard.writeText(t);
      b.textContent = "✓";
    } catch {
      b.textContent = "…";
    }
    setTimeout(() => (b.textContent = "⧉"), 900);
  });

  // 2) Daily stats (deterministic per day via localStorage)
  const WIN_MIN = 300000;
  const WIN_MAX = 950000;

  const REG_MIN = 200;
  const REG_MAX = 700;

  function formatRub(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
  }

  function hashToFloat(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0) / 4294967295;
  }

  function todayKey() {
    const d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  function dailyStats() {
    const day = todayKey();

    document.querySelectorAll('[data-win="1"]').forEach((el, i) => {
      const card = el.closest(".card");
      const name = card?.querySelector(".brand__name")?.textContent || "card";
      const key = `win_${day}_${name}_${i}`;

      let val = localStorage.getItem(key);
      if (!val) {
        const r = hashToFloat(key);
        val = Math.round(WIN_MIN + r * (WIN_MAX - WIN_MIN));
        localStorage.setItem(key, val);
      }
      el.textContent = formatRub(+val);
    });

    document.querySelectorAll('[data-reg="1"]').forEach((el, i) => {
      const card = el.closest(".card");
      const name = card?.querySelector(".brand__name")?.textContent || "card";
      const key = `reg_${day}_${name}_${i}`;

      let val = localStorage.getItem(key);
      if (!val) {
        const r = hashToFloat(key);
        val = Math.round(REG_MIN + r * (REG_MAX - REG_MIN));
        localStorage.setItem(key, val);
      }
      el.textContent = val;
    });
  }

  // 3) Harden external links (in case some are missed in HTML)
  function hardenLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach((a) => {
      const rel = new Set((a.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
      rel.add("noopener");
      rel.add("noreferrer");
      rel.add("nofollow");
      a.setAttribute("rel", Array.from(rel).join(" "));
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    dailyStats();
    hardenLinks();
  });
})();
