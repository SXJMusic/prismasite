document.addEventListener("DOMContentLoaded", () => {

  const track = document.querySelector(".carousel-track");
  const items = document.querySelectorAll(".carousel-item");
  const btnLeft = document.querySelector(".carousel-left");
  const btnRight = document.querySelector(".carousel-right");

  let index = 0;
  let total = items.length;

  function updateCarousel() {
    if (window.innerWidth >= 769) {
      track.style.transform = "none";
      return;
    }
    const width = items[0].clientWidth;
    track.style.transform = `translateX(-${index * width}px)`;
  }

  // Arrow controls
  btnRight.addEventListener("click", () => {
    index = (index + 1) % total;
    updateCarousel();
  });

  btnLeft.addEventListener("click", () => {
    index = (index - 1 + total) % total;
    updateCarousel();
  });

  // Touch controls
  let startX = 0;

  track.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  track.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;
    let delta = endX - startX;

    if (Math.abs(delta) < 50) return; // ignore tiny swipes

    if (delta < 0) {
      index = (index + 1) % total;
    } else {
      index = (index - 1 + total) % total;
    }

    updateCarousel();
  });

  // Recalc on resize
  window.addEventListener("resize", updateCarousel);

  updateCarousel();
});
