(function () {
  document.body.addEventListener("htmx:beforeSwap", function (e) {
    if (
      e.detail.xhr.status >= 400 &&
      e.detail.target &&
      e.detail.target.id === "lock-notifications"
    ) {
      e.detail.shouldSwap = false;
    }
  });

  const dateEl = document.getElementById("lock-date");
  const clockEl = document.getElementById("lock-clock");
  const statusTimeEl = document.getElementById("lock-status-time");
  if (!dateEl || !clockEl) return;

  function updateLockScreen() {
    const now = new Date();
    dateEl.textContent = now
      .toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
      .toUpperCase();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const time = `${hours}:${minutes}`;
    clockEl.textContent = time;
    if (statusTimeEl) statusTimeEl.textContent = time;
  }

  updateLockScreen();
  setInterval(updateLockScreen, 1000);
})();
