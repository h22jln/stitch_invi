(function () {
  const overlay = document.getElementById("app-overlay");

  function openOverlay() {
    if (!overlay) return;
    overlay.classList.add("app-overlay--open");
    document.title = "KitschOS Calendar";
  }

  function closeOverlay() {
    if (!overlay) return;
    overlay.classList.remove("app-overlay--open");
    overlay.innerHTML = "";
    if (document.getElementById("phone-frame")?.classList.contains("phone-frame--unlocked")) {
      document.title = "Neo-Mobile OS";
    }
  }

  function bindCalendar(root) {
    root.querySelector(".calendar-back")?.addEventListener("click", closeOverlay);

    root.querySelectorAll(".calendar-day").forEach((cell) => {
      cell.addEventListener("click", () => {
        root.querySelectorAll(".calendar-day").forEach((c) => {
          c.classList.remove("bg-[#89986D]", "is-selected");
          c.classList.add("bg-[#f6f0d7]");
          const num = c.querySelector(".calendar-day-num");
          const dot = c.querySelector(".calendar-day-dot");
          if (num) {
            num.classList.remove("text-white");
            num.classList.add("text-[#706d59]");
          }
          if (dot) {
            dot.classList.remove("text-white");
            dot.classList.add("text-[#546434]");
          }
        });
        cell.classList.add("bg-[#89986D]", "is-selected");
        cell.classList.remove("bg-[#f6f0d7]");
        const num = cell.querySelector(".calendar-day-num");
        const dot = cell.querySelector(".calendar-day-dot");
        if (num) {
          num.classList.add("text-white");
          num.classList.remove("text-[#706d59]");
        }
        if (dot) {
          dot.classList.add("text-white");
          dot.classList.remove("text-[#546434]");
        }
      });
    });
  }

  async function openCalendar() {
    if (!overlay) return;
    if (!document.getElementById("phone-frame")?.classList.contains("phone-frame--unlocked")) {
      return;
    }

    try {
      const res = await fetch("/api/calendar");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      overlay.innerHTML = await res.text();
      openOverlay();
      bindCalendar(overlay);
    } catch (err) {
      console.error("Calendar load failed:", err);
    }
  }

  window.StitchInvi = window.StitchInvi || {};
  window.StitchInvi.openCalendar = openCalendar;
  window.StitchInvi.closeAppOverlay = closeOverlay;

  document.body.addEventListener("htmx:afterSwap", function (e) {
    if (!overlay || e.detail.target !== overlay) return;
    openOverlay();
    bindCalendar(overlay);
  });

  overlay?.addEventListener("click", function (e) {
    if (e.target.closest(".calendar-back")) {
      e.preventDefault();
      closeOverlay();
    }
  });
})();
