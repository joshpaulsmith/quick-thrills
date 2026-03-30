window.addEventListener('load', () => {
  const money = document.querySelector('.money-text');
  const honey = document.querySelector('.honey-text');

  if (money) {
    const len = money.getComputedTextLength();
    money.style.strokeDasharray = len;
    money.style.strokeDashoffset = len;
    money.classList.add('animate');
  }

  if (honey) {
    const len = honey.getComputedTextLength();
    honey.style.strokeDasharray = len;
    honey.style.strokeDashoffset = len;
    honey.classList.add('animate');
  }
});
