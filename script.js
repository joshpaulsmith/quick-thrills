document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const buttons = document.querySelectorAll(".btn");

  // simple loaded state if you want to target it later
  window.addEventListener("load", () => {
    body.classList.add("is-loaded");
  });

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
