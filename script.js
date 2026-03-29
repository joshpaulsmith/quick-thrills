window.addEventListener("load", () => {
  const elements = document.querySelectorAll(".fade-in");
  elements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add("visible");
    }, i * 180);
  });
});
