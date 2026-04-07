document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const cover = document.querySelector(".cover-art");
  const buttons = document.querySelectorAll(".btn");
  const hero = document.querySelector(".hero");
  const headerLogo = document.querySelector(".header-logo");
  const revealItems = document.querySelectorAll(".reveal-on-scroll");

  const isDesktopQuery = window.matchMedia("(min-width: 768px)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const reducedMotion = reducedMotionQuery.matches;

  const spotlight = document.createElement("div");
  spotlight.className = "spotlight";
  body.appendChild(spotlight);

  const cursorGlow = document.createElement("div");
  cursorGlow.className = "cursor-glow";
  body.appendChild(cursorGlow);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;
  let spotlightX = mouseX;
  let spotlightY = mouseY;
  let ticking = false;
  let lastMoveTime = Date.now();

  function setInteractiveState() {
    if (!reducedMotion && isDesktopQuery.matches) {
      body.classList.add("has-pointer");
    } else {
      body.classList.remove("has-pointer");
      if (hero) hero.style.transform = "";
      if (headerLogo) headerLogo.style.transform = "";
      if (cover) cover.style.transform = "";
    }
  }

  setInteractiveState();

  if (typeof isDesktopQuery.addEventListener === "function") {
    isDesktopQuery.addEventListener("change", setInteractiveState);
    reducedMotionQuery.addEventListener("change", () => window.location.reload());
  }

  function animatePointerLayers() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    spotlightX += (mouseX - spotlightX) * 0.08;
    spotlightY += (mouseY - spotlightY) * 0.08;

    spotlight.style.left = `${spotlightX}px`;
    spotlight.style.top = `${spotlightY}px`;
    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;

    ticking = false;

    if (!reducedMotion && isDesktopQuery.matches) {
      requestPointerUpdate();
    }
  }

  function requestPointerUpdate() {
    if (!ticking && !reducedMotion && isDesktopQuery.matches) {
      ticking = true;
      requestAnimationFrame(animatePointerLayers);
    }
  }

  function updateSceneFromPointer(clientX, clientY) {
    if (reducedMotion || !isDesktopQuery.matches) return;

    mouseX = clientX;
    mouseY = clientY;
    lastMoveTime = Date.now();
    requestPointerUpdate();

    if (hero) {
      const xOffset = (clientX / window.innerWidth - 0.5) * 12;
      const yOffset = (clientY / window.innerHeight - 0.5) * 10;
      hero.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
    }

    if (headerLogo) {
      const xOffset = (clientX / window.innerWidth - 0.5) * 6;
      const yOffset = (clientY / window.innerHeight - 0.5) * 4;
      headerLogo.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
    }
  }

  window.addEventListener("mousemove", (e) => {
    updateSceneFromPointer(e.clientX, e.clientY);
  });

  window.addEventListener("mouseleave", () => {
    if (hero) hero.style.transform = "";
    if (headerLogo) headerLogo.style.transform = "";
  });

  if (cover && !reducedMotion) {
    let currentRotateX = 0;
    let currentRotateY = 0;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let hoverActive = false;
    let coverAnimating = false;

    function renderCoverTilt() {
      currentRotateX += (targetRotateX - currentRotateX) * 0.12;
      currentRotateY += (targetRotateY - currentRotateY) * 0.12;

      cover.style.transform = `
        rotateX(${currentRotateX}deg)
        rotateY(${currentRotateY}deg)
        translateY(${hoverActive ? -4 : 0}px)
        scale(${hoverActive ? 1.015 : 1})
      `;

      const stillMoving =
        Math.abs(currentRotateX - targetRotateX) > 0.05 ||
        Math.abs(currentRotateY - targetRotateY) > 0.05;

      if (hoverActive || stillMoving) {
        requestAnimationFrame(renderCoverTilt);
      } else {
        coverAnimating = false;
        cover.style.transform = "";
      }
    }

    function startCoverAnimation() {
      if (!coverAnimating) {
        coverAnimating = true;
        requestAnimationFrame(renderCoverTilt);
      }
    }

    cover.addEventListener("mouseenter", () => {
      if (!isDesktopQuery.matches) return;
      hoverActive = true;
      cover.classList.add("is-hovered");
      startCoverAnimation();
    });

    cover.addEventListener("mousemove", (e) => {
      if (!isDesktopQuery.matches) return;

      const rect = cover.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      targetRotateY = ((x / rect.width) - 0.5) * 16;
      targetRotateX = ((y / rect.height) - 0.5) * -16;

      startCoverAnimation();
    });

    cover.addEventListener("mouseleave", () => {
      hoverActive = false;
      targetRotateX = 0;
      targetRotateY = 0;
      cover.classList.remove("is-hovered");
      startCoverAnimation();
    });
  }

  function animateIdle() {
    if (!reducedMotion && isDesktopQuery.matches) {
      const idleFor = Date.now() - lastMoveTime;

      if (idleFor > 1400) {
        const t = Date.now() * 0.001;

        if (hero) {
          hero.style.transform = `translate3d(${Math.sin(t) * 4}px, ${Math.cos(t * 0.8) * 4}px, 0)`;
        }

        if (headerLogo) {
          headerLogo.style.transform = `translate3d(${Math.sin(t * 0.9) * 2}px, ${Math.cos(t * 0.7) * 2}px, 0)`;
        }
      }
    }

    requestAnimationFrame(animateIdle);
  }

  if (!reducedMotion) {
    requestAnimationFrame(animateIdle);
  }

  buttons.forEach((btn, i) => {
    btn.style.animationDelay = `${0.7 + i * 0.08}s`;

    if (!reducedMotion) {
      btn.addEventListener("mousemove", (e) => {
        if (!isDesktopQuery.matches) return;

        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const moveX = ((x / rect.width) - 0.5) * 10;
        const moveY = ((y / rect.height) - 0.5) * 8;

        btn.style.transform = `translate(${moveX}px, ${moveY - 2}px) scale(1.02)`;
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    }

    btn.addEventListener("click", (e) => {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement("span");
      ripple.className = "btn-ripple";

      const hasMouseCoords = typeof e.clientX === "number" && typeof e.clientY === "number" && e.clientX !== 0 && e.clientY !== 0;
      const centerX = hasMouseCoords ? e.clientX - rect.left : rect.width / 2;
      const centerY = hasMouseCoords ? e.clientY - rect.top : rect.height / 2;

      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${centerX - size / 2}px`;
      ripple.style.top = `${centerY - size / 2}px`;

      btn.appendChild(ripple);
      btn.classList.add("is-pressed");

      setTimeout(() => {
        ripple.remove();
        btn.classList.remove("is-pressed");
      }, 500);
    });

    btn.addEventListener("focus", () => {
      btn.classList.add("is-focused");
    });

    btn.addEventListener("blur", () => {
      btn.classList.remove("is-focused");
    });

    btn.addEventListener("touchstart", () => {
      btn.classList.add("is-touched");
    }, { passive: true });

    btn.addEventListener("touchend", () => {
      setTimeout(() => btn.classList.remove("is-touched"), 120);
    }, { passive: true });
  });

  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15
    });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  window.addEventListener("load", () => {
    body.classList.add("is-loaded");
  });
});
