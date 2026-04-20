document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const root = document.documentElement;
  const hero = document.querySelector(".hero");
  const buttons = document.querySelectorAll(".btn");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let pointerActive = false;
  let idleStart = performance.now();

  // simple loaded state if you want to target it later
  window.addEventListener("load", () => {
    body.classList.add("is-loaded");
  });

  const resetMotion = () => {
    root.style.setProperty("--bg-shift-x", "0px");
    root.style.setProperty("--bg-shift-y", "0px");
    root.style.setProperty("--hero-shift-x", "0px");
    root.style.setProperty("--hero-shift-y", "0px");
    root.style.setProperty("--hero-tilt-x", "0deg");
    root.style.setProperty("--hero-tilt-y", "0deg");
  };

  const updateFromPointer = (event) => {
    if (prefersReducedMotion.matches || !hero) {
      return;
    }

    const rect = hero.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (event.clientX - centerX) / rect.width;
    const offsetY = (event.clientY - centerY) / rect.height;

    pointerActive = true;
    idleStart = performance.now();

    root.style.setProperty("--bg-shift-x", `${offsetX * 12}px`);
    root.style.setProperty("--bg-shift-y", `${offsetY * 12}px`);
    root.style.setProperty("--hero-shift-x", `${offsetX * -7}px`);
    root.style.setProperty("--hero-shift-y", `${offsetY * -5}px`);
    root.style.setProperty("--hero-tilt-x", `${offsetY * -3}deg`);
    root.style.setProperty("--hero-tilt-y", `${offsetX * 4}deg`);
  };

  window.addEventListener("pointermove", updateFromPointer, { passive: true });
  window.addEventListener("pointerleave", () => {
    pointerActive = false;
    idleStart = performance.now();
    resetMotion();
  });

  window.addEventListener("blur", () => {
    pointerActive = false;
    resetMotion();
  });

  const idleMotion = (now) => {
    if (!prefersReducedMotion.matches && !pointerActive && hero) {
      const t = (now - idleStart) / 1000;
      root.style.setProperty("--bg-shift-x", `${Math.sin(t * 0.45) * 6}px`);
      root.style.setProperty("--bg-shift-y", `${Math.cos(t * 0.3) * 4}px`);
      root.style.setProperty("--hero-shift-x", `${Math.sin(t * 0.55) * -3}px`);
      root.style.setProperty("--hero-shift-y", `${Math.cos(t * 0.45) * -2}px`);
      root.style.setProperty("--hero-tilt-x", `${Math.cos(t * 0.4) * -1.2}deg`);
      root.style.setProperty("--hero-tilt-y", `${Math.sin(t * 0.5) * 1.6}deg`);
      root.style.setProperty("--spiral-rotation", `${t * 8}deg`);
    } else if (!prefersReducedMotion.matches) {
      const t = now / 1000;
      root.style.setProperty("--spiral-rotation", `${t * 8}deg`);
    }

    window.requestAnimationFrame(idleMotion);
  };

  window.requestAnimationFrame(idleMotion);

  // lightweight button press feedback only
  buttons.forEach((btn) => {
    btn.addEventListener("touchstart", () => {
      btn.style.transform = "scale(0.98)";
    }, { passive: true });

    btn.addEventListener("touchend", () => {
      btn.style.transform = "";
    }, { passive: true });

    btn.addEventListener("touchcancel", () => {
      btn.style.transform = "";
    }, { passive: true });

    btn.addEventListener("blur", () => {
      btn.style.transform = "";
    });
  });
});
