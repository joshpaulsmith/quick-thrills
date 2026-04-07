document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const cover = document.querySelector(".cover-art");
  const buttons = document.querySelectorAll(".btn");
  const hero = document.querySelector(".hero");
  const headerLogo = document.querySelector(".header-logo");

  const isDesktopQuery = window.matchMedia("(min-width: 768px)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const isDesktop = isDesktopQuery.matches;
  const reducedMotion = reducedMotionQuery.matches;

  // Create spotlight
  const spotlight = document.createElement("div");
  spotlight.className = "spotlight";
  document.body.appendChild(spotlight);

  // Create cursor glow
  const cursorGlow = document.createElement("div");
  cursorGlow.className = "cursor-glow";
  document.body.appendChild(cursorGlow);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;
  let spotlightX = mouseX;
  let spotlightY = mouseY;

  let ticking = false;

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
    requestPointerUpdate();
  }

  function requestPointerUpdate() {
    if (!ticking && !reducedMotion && isDesktopQuery.matches) {
      ticking = true;
      requestAnimationFrame(animatePointerLayers);
    }
  }

  if (!reducedMotion && isDesktop) {
    body.classList.add("has-pointer");

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      requestPointerUpdate();

      // subtle hero parallax
      if (hero) {
        const xOffset = (e.clientX / window.innerWidth - 0.5) * 12;
        const yOffset = (e.clientY / window.innerHeight - 0.5) * 10;
        hero.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
      }

      // subtle logo drift
      if (headerLogo) {
        const xOffset = (e.clientX / window.innerWidth - 0.5) * 6;
        const yOffset = (e.clientY / window.innerHeight - 0.5) * 4;
        headerLogo.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
      }
    });

    window.addEventListener("mouseleave", () => {
      if (hero) hero.style.transform = "";
      if (headerLogo) headerLogo.style.transform = "";
    });

    if (cover) {
      let currentRotateX = 0;
      let currentRotateY = 0;
      let targetRotateX = 0;
      let targetRotateY = 0;
      let hoverActive = false;

      function animateCoverTilt() {
        currentRotateX += (targetRotateX - currentRotateX) * 0.12;
        currentRotateY += (targetRotateY - currentRotateY) * 0.12;

        if (hoverActive || Math.abs(currentRotateX) > 0.01 || Math.abs(currentRotateY) > 0.01) {
          cover.style.transform = `
            rotateX(${currentRotateX}deg)
            rotateY(${currentRotateY}deg)
            translateY(-4px)
            scale(1.015)
          `;
          requestAnimationFrame(animateCoverTilt);
        }
      }

      cover.addEventListener("mousemove", (e) => {
        const rect = cover.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        targetRotateY = ((x / rect.width) - 0.5) * 16;
        targetRotateX = ((y / rect.height) - 0.5) * -16;

        if (!hoverActive) {
          hoverActive = true;
          animateCoverTilt();
        }
      });

      cover.addEventListener("mouseenter", () => {
        hoverActive = true;
        cover.classList.add("is-hovered");
        animateCoverTilt();
      });

      cover.addEventListener("mouseleave", () => {
        hoverActive = false;
        targetRotateX = 0;
        targetRotateY = 0;
        cover.classList.remove("is-hovered");

        const reset = () => {
          currentRotateX += (0 - currentRotateX) * 0.12;
          currentRotateY += (0 - currentRotateY) * 0.12;

          cover.style.transform = `
            rotateX(${currentRotateX}deg)
            rotateY(${currentRotateY}deg)
            translateY(0px)
            scale(1)
          `;

          if (Math.abs(currentRotateX) > 0.05 || Math.abs(currentRotateY) > 0.05) {
            requestAnimationFrame(reset);
          } else {
            cover.style.transform = "";
          }
        };

        requestAnimationFrame(reset);
      });
    }
  }

  // Stagger button reveal
  buttons.forEach((btn, i) => {
    btn.style.animationDelay = `${0.7 + i * 0.08}s`;
  });

  // Button hover magnetic drift
  if (!reducedMotion && isDesktop) {
    buttons.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
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
    });
  }

  // Click pulse
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.add("is-pressed");
      setTimeout(() => {
        btn.classList.remove("is-pressed");
      }, 180);
    });

    // keyboard polish
    btn.addEventListener("focus", () => {
      btn.classList.add("is-focused");
    });

    btn.addEventListener("blur", () => {
      btn.classList.remove("is-focused");
    });
  });

  // Small entrance polish after full load
  window.addEventListener("load", () => {
    body.classList.add("is-loaded");
  });
});buttons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const ripple = document.createElement("span");
    ripple.className = "btn-ripple";

    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    btn.appendChild(ripple);

    btn.classList.add("is-pressed");

    setTimeout(() => {
      ripple.remove();
      btn.classList.remove("is-pressed");
    }, 500);
  });
});let lastMoveTime = Date.now();
let idleTick;

window.addEventListener("mousemove", () => {
  lastMoveTime = Date.now();
});

function animateIdle() {
  if (!reducedMotion && isDesktopQuery.matches) {
    const idleFor = Date.now() - lastMoveTime;

    if (idleFor > 1200) {
      const t = Date.now() * 0.001;

      if (hero) {
        hero.style.transform = `translate3d(${Math.sin(t) * 4}px, ${Math.cos(t * 0.8) * 4}px, 0)`;
      }

      if (headerLogo) {
        headerLogo.style.transform = `translate3d(${Math.sin(t * 0.9) * 2}px, ${Math.cos(t * 0.7) * 2}px, 0)`;
      }
    }

    idleTick = requestAnimationFrame(animateIdle);
  }
}

animateIdle();buttons.forEach((btn) => {
  btn.addEventListener("touchstart", () => {
    btn.classList.add("is-touched");
  }, { passive: true });

  btn.addEventListener("touchend", () => {
    setTimeout(() => btn.classList.remove("is-touched"), 120);
  }, { passive: true });
});
