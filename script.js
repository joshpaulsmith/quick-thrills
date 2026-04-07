document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const cover = document.querySelector(".cover-art");
  const buttons = document.querySelectorAll(".btn");

  // Create spotlight
  const spotlight = document.createElement("div");
  spotlight.className = "spotlight";
  document.body.appendChild(spotlight);

  const isDesktop = window.matchMedia("(min-width: 768px)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reducedMotion && isDesktop) {
    body.classList.add("has-pointer");

    window.addEventListener("mousemove", (e) => {
      spotlight.style.left = `${e.clientX}px`;
      spotlight.style.top = `${e.clientY}px`;
    });

    if (cover) {
      cover.addEventListener("mousemove", (e) => {
        const rect = cover.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateY = ((x / rect.width) - 0.5) * 14;
        const rotateX = ((y / rect.height) - 0.5) * -14;

        cover.style.transform = `
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          translateY(-4px)
          scale(1.015)
        `;
      });

      cover.addEventListener("mouseleave", () => {
        cover.style.transform = "";
      });
    }
  }

  // Slight stagger for buttons
  buttons.forEach((btn, i) => {
    btn.style.animationDelay = `${0.7 + i * 0.08}s`;
  });

  // Tiny click burst feel
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.style.transform = "translateY(0) scale(0.97)";
      setTimeout(() => {
        btn.style.transform = "";
      }, 140);
    });
  });
});
