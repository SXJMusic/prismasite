document.addEventListener("DOMContentLoaded", () => {

  const track = document.querySelector(".carousel-track");
  const items = document.querySelectorAll(".carousel-item");
  const tabs = document.querySelector(".carousel-tabs");

  let index = 0;
  const total = items.length;
  const mobileBreakpoint = 900;

  // Build dots
  function initTabs() {
    tabs.innerHTML = "";
    for (let i = 0; i < total; i++) {
      const dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.dataset.index = i;

      dot.addEventListener("click", () => {
        index = i;
        update();
      });

      tabs.appendChild(dot);
    }
  }

  function update() {
    if (window.innerWidth > mobileBreakpoint) {
      track.style.transform = "none";
      return;
    }

    // Mobile: calculate offset based on item width + margins
    const item = items[0];
    const computedStyle = window.getComputedStyle(item);
    const itemWidth = item.offsetWidth;
    const marginLeft = parseInt(computedStyle.marginLeft) || 0;
    const marginRight = parseInt(computedStyle.marginRight) || 0;
    const slideWidth = itemWidth + marginLeft + marginRight;
    
    track.style.transform = `translateX(-${index * slideWidth}px)`;

    [...tabs.children].forEach((dot, i) =>
      dot.classList.toggle("active", i === index)
    );
  }

  // Swipe handling
  let startX = 0;
  let dragging = false;

  track.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    dragging = true;
  });

  track.addEventListener("touchend", e => {
    if (!dragging) return;
    dragging = false;

    const endX = e.changedTouches[0].clientX;
    const delta = endX - startX;

    if (Math.abs(delta) < 40) return;

    if (delta < 0) index = (index + 1) % total;
    else index = (index - 1 + total) % total;

    update();
  });

  window.addEventListener("resize", update);

  initTabs();
  update();
});
