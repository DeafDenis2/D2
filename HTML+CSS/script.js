const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;

    tabButtons.forEach((b) => b.classList.remove("active"));
    tabPanels.forEach((p) => p.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(target).classList.add("active");
  });
});

// --- Статус стрима Twitch (через публичный decapi.me, без токенов) ---
async function updateTwitchStatus() {
  const el = document.getElementById("twitchStatus");
  if (!el) return;

  const channel = el.dataset.channel;

  try {
    const res = await fetch(`https://decapi.me/twitch/uptime/${channel}`);
    const text = (await res.text()).trim();

    // Если канал оффлайн, decapi возвращает "<channel> is offline"
    const isLive = !/offline/i.test(text);

    if (isLive) {
      el.textContent = "● LIVE";
      el.classList.add("live");
      el.classList.remove("offline");
      el.title = `В эфире: ${text}`;
    } else {
      el.textContent = "● Оффлайн";
      el.classList.add("offline");
      el.classList.remove("live");
      el.title = "Стрим не идёт";
    }
  } catch (e) {
    el.textContent = "● статус недоступен";
    el.classList.add("offline");
  }
}

updateTwitchStatus();
// Обновлять статус каждые 5 секунд
setInterval(updateTwitchStatus, 5000);

// --- Копирование ника в буфер обмена ---
document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const text = btn.dataset.copy;
    const original = btn.innerHTML;

    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      // Запасной вариант для старых браузеров / file://
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }

    btn.classList.add("copied");
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Скопировано!';

    setTimeout(() => {
      btn.classList.remove("copied");
      btn.innerHTML = original;
    }, 1500);
  });
});

