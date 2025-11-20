document.addEventListener("DOMContentLoaded", () => {

  const track = document.querySelector(".carousel-track");
  const items = document.querySelectorAll(".carousel-item");
  const tabs = document.querySelector(".carousel-tabs");

  let index = 0;
  const total = items.length;
  const mobileBreakpoint = 900;
  const autoInterval = 3000; // ms between slides
  let isPlaying = true;
  let autoTimer = null;
  let pauseByHover = false;
  let pauseByInteraction = false; // user tap/click

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
    // Calculate translation for single centered slide (works for desktop and mobile)
    const item = items[0];
    const computedStyle = window.getComputedStyle(item);
    const itemWidth = item.offsetWidth;
    const marginLeft = parseInt(computedStyle.marginLeft) || 0;
    const marginRight = parseInt(computedStyle.marginRight) || 0;
    const slideWidth = itemWidth + marginLeft + marginRight;
    track.style.transform = `translateX(-${index * slideWidth}px)`;

  // (no separate mobile calc — same transform logic applies to all viewports)

    [...tabs.children].forEach((dot, i) =>
      dot.classList.toggle("active", i === index)
    );

    // Caption: hide if playing, show if paused
    if (isPlaying) {
      hideCaption();
    } else {
      showCaption();
    }
  }

  function showCaption() {
    if (!caption) return;
    const text = items[index].dataset.caption || "";
    if (!text) return;
    caption.textContent = text;
    caption.classList.add("visible");
    caption.setAttribute("aria-hidden", "false");
  }

  function hideCaption() {
    if (!caption) return;
    caption.textContent = "";
    caption.classList.remove("visible");
    caption.setAttribute("aria-hidden", "true");
  }

  function play() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      index = (index + 1) % total;
      update();
    }, autoInterval);
    isPlaying = true;
    pauseByInteraction = false;
    hideCaption();
  }

  function pause() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
    isPlaying = false;
  }

  // Build caption node reference
  const caption = document.querySelector(".carousel-caption");

  // Start autoplay
  play();

  // Swipe handling
  let startX = 0;
  let dragging = false;
  let isSwiping = false;

  track.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    dragging = true;
    isSwiping = false;
  });

  track.addEventListener("touchmove", e => {
    if (!dragging) return;
    const moveX = e.touches[0].clientX;
    const deltaX = moveX - startX;
    if (Math.abs(deltaX) > 12) isSwiping = true; // threshold for swipe
  });

  track.addEventListener("touchend", e => {
    if (!dragging) return;
    dragging = false;

    const endX = e.changedTouches[0].clientX;
    const delta = endX - startX;

    if (isSwiping && Math.abs(delta) >= 40) {
      if (delta < 0) index = (index + 1) % total;
      else index = (index - 1 + total) % total;
      update();
      return;
    }

    // Not a swipe -> treat as tap: toggle pause/resume
    if (isPlaying) {
      pause();
      pauseByInteraction = true;
      showCaption();
    } else {
      play();
      pauseByInteraction = false;
      hideCaption();
    }
  });

  window.addEventListener("resize", update);

  initTabs();
  update();

  // Desktop hover to pause & show caption
  track.addEventListener("mouseenter", () => {
    if (isPlaying) {
      pause();
      pauseByHover = true;
      showCaption();
    }
  });

  track.addEventListener("mouseleave", () => {
    if (pauseByHover) {
      play();
      pauseByHover = false;
    }
  });

  // Click/tap for desktop mouse users: toggle pause and caption
  items.forEach((item, i) => {
    item.addEventListener("click", (e) => {
      // prevent interfering with drag
      if (isSwiping) return;
      if (isPlaying) {
        pause();
        pauseByInteraction = true;
        index = i; // jump to clicked
        update();
        showCaption();
      } else {
        // resume
        index = i;
        update();
        play();
      }
    });
  });
});
