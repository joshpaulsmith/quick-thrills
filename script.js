document.addEventListener("DOMContentLoaded", () => {
  const revealItems = document.querySelectorAll(".reveal");

  const revealOnScroll = () => {
    revealItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        item.classList.add("visible");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();
});
