window.addEventListener("load", () => {
  const elements = document.querySelectorAll(".fade-in");
  elements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add("visible");
    }, i * 180);
  });

  const scribbles = document.querySelectorAll(".scribble-divider path");
  scribbles.forEach((path) => {
    const yOffset = (Math.random() * 2 - 1).toFixed(2);
    path.style.transform = `translateY(${yOffset}px)`;
  });
});
