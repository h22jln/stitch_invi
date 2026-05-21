(function () {
  const home = document.getElementById("screen-home");
  if (!home) return;

  home.querySelectorAll(".home-app-tile:not(.home-app-tile--calendar)").forEach((item) => {
    item.addEventListener("click", () => {
      const icon = item.querySelector(".home-app-icon");
      if (!icon) return;
      icon.classList.add("translate-x-1", "translate-y-1");
      icon.style.boxShadow = "0px 0px 0px 0px #89986D";
      setTimeout(() => {
        icon.classList.remove("translate-x-1", "translate-y-1");
        icon.style.boxShadow = "6px 6px 0px 0px #89986D";
      }, 150);
    });
  });

  const calendarTile = home.querySelector(".home-app-tile--calendar");
  if (calendarTile) {
    calendarTile.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.StitchInvi?.openCalendar) {
        window.StitchInvi.openCalendar();
      }
    });
    calendarTile.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        window.StitchInvi?.openCalendar?.();
      }
    });
  }
})();
