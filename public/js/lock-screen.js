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

  const frame = document.getElementById("phone-frame");
  const phoneScreen = document.getElementById("phone-screen");
  const lockOverlay = document.getElementById("screen-lock");
  const unlockHint = document.getElementById("unlock-handle");
  const dateEl = document.getElementById("lock-date");
  const clockEl = document.getElementById("lock-clock");
  const statusTimeEl = document.getElementById("lock-status-time");
  const homeStatusTimeEl = document.getElementById("home-status-time");

  const SNAP_MS = 480;
  const UNLOCK_THRESHOLD = 0.35;
  const FLICK_VELOCITY = -0.6;

  let startY = 0;
  let lastY = 0;
  let lastT = 0;
  let velocityY = 0;
  let dragging = false;
  let unlocked = false;
  let offsetPx = 0;
  let dragOriginOffset = 0;
  let animFrame = null;

  function screenHeight() {
    return phoneScreen ? phoneScreen.clientHeight : 700;
  }

  function isInteractive(target) {
    return (
      target.closest("button, a, input, textarea, select, label") !== null
    );
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function applyOffset(px) {
    const h = screenHeight();
    offsetPx = Math.min(Math.max(px, -h), 0);
    lockOverlay.style.transform = `translate3d(0, ${offsetPx}px, 0)`;
    const progress = -offsetPx / h;
    frame.classList.toggle("phone-frame--unlocking", progress > 0.02 && !unlocked);
  }

  function setSnapping(active) {
    lockOverlay.classList.toggle("is-snapping", active);
  }

  function cancelAnimation() {
    if (animFrame !== null) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
  }

  function finishUnlock() {
    unlocked = true;
    lockOverlay.classList.add("is-unlocked");
    frame.classList.add("phone-frame--unlocked");
    frame.classList.remove("phone-frame--unlocking");
    document.title = "Neo-Mobile OS";
  }

  function animateTo(targetPx) {
    cancelAnimation();
    setSnapping(true);

    const from = offsetPx;
    const start = performance.now();

    function tick(now) {
      const t = Math.min((now - start) / SNAP_MS, 1);
      applyOffset(from + (targetPx - from) * easeOutCubic(t));

      if (t < 1) {
        animFrame = requestAnimationFrame(tick);
        return;
      }

      animFrame = null;
      setSnapping(false);

      if (targetPx <= -screenHeight() + 2) {
        finishUnlock();
      }
    }

    animFrame = requestAnimationFrame(tick);
  }

  function onDragStart(clientY, target) {
    if (unlocked || isInteractive(target)) return;
    cancelAnimation();
    setSnapping(false);
    dragging = true;
    dragOriginOffset = offsetPx;
    startY = clientY;
    lastY = clientY;
    lastT = performance.now();
    velocityY = 0;
  }

  function onDragMove(clientY) {
    if (!dragging || unlocked) return;

    const now = performance.now();
    const dt = now - lastT;
    if (dt > 0) velocityY = (clientY - lastY) / dt;
    lastY = clientY;
    lastT = now;

    const delta = clientY - startY;
    const h = screenHeight();
    if (delta >= 0) {
      applyOffset(Math.min(dragOriginOffset + delta * 0.12, 0));
    } else {
      applyOffset(Math.max(dragOriginOffset + delta, -h));
    }
  }

  function onDragEnd() {
    if (!dragging || unlocked) return;
    dragging = false;

    const h = screenHeight();
    const progress = -offsetPx / h;
    const shouldUnlock =
      progress >= UNLOCK_THRESHOLD || velocityY <= FLICK_VELOCITY;

    if (shouldUnlock) {
      animateTo(-h);
    } else {
      animateTo(0);
    }
  }

  if (lockOverlay && phoneScreen && frame) {
    lockOverlay.addEventListener(
      "touchstart",
      (e) => onDragStart(e.touches[0].clientY, e.target),
      { passive: true }
    );
    lockOverlay.addEventListener(
      "touchmove",
      (e) => {
        if (!dragging) return;
        onDragMove(e.touches[0].clientY);
        e.preventDefault();
      },
      { passive: false }
    );
    lockOverlay.addEventListener("touchend", () => onDragEnd());
    lockOverlay.addEventListener("touchcancel", () => onDragEnd());

    lockOverlay.addEventListener("mousedown", (e) => {
      if (isInteractive(e.target)) return;
      e.preventDefault();
      onDragStart(e.clientY, e.target);
      const onMouseMove = (ev) => onDragMove(ev.clientY);
      const onMouseUp = () => {
        onDragEnd();
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    });
  }

  if (unlockHint) {
    const goHome = () => {
      if (!unlocked) animateTo(-screenHeight());
    };
    unlockHint.addEventListener("click", goHome);
    unlockHint.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        goHome();
      }
    });
  }

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
    if (homeStatusTimeEl) homeStatusTimeEl.textContent = time;
  }

  updateLockScreen();
  setInterval(updateLockScreen, 1000);
})();
