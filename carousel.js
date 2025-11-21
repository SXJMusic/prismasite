document.addEventListener("DOMContentLoaded", async () => {

  const container = document.querySelector(".carousel-container");
  const captionEl = document.querySelector(".carousel-caption");
  
  // Load cover images from manifest file
  // TO ADD MORE IMAGES: 
  // 1. Add image to covers/ folder
  // 2. Add entry to covers-manifest.json with filename and caption
  let coverImages = [];
  
  try {
    const response = await fetch('covers-manifest.json');
    const manifest = await response.json();
    coverImages = manifest.map(item => ({
      src: `covers/${item.filename}`,
      caption: item.caption
    }));
  } catch (error) {
    console.error('Failed to load covers manifest:', error);
    // Fallback: show error message
    container.innerHTML = '<p style="color: var(--ink-soft); text-align: center;">Unable to load cover artwork</p>';
    return;
  }

  // Generate carousel items dynamically
  container.innerHTML = "";
  coverImages.forEach((img, i) => {
    const item = document.createElement("div");
    item.className = "carousel-item" + (i === 0 ? " active" : "");
    item.dataset.caption = img.caption;
    
    const cover = document.createElement("div");
    cover.className = "cover";
    cover.setAttribute('role', 'img');
    cover.setAttribute('aria-label', `${img.caption} cover art`);
    
    const imgEl = document.createElement("img");
    imgEl.src = img.src;
    imgEl.alt = img.caption;
    imgEl.loading = "lazy";
    
    cover.appendChild(imgEl);
    item.appendChild(cover);
    container.appendChild(item);
  });

  const items = document.querySelectorAll(".carousel-item");
  let index = 0;
  const total = items.length;
  
  if (total === 0) {
    console.error('No carousel items generated');
    return;
  }
  // Autoplay speed configuration
  // Increase or decrease AUTO_INTERVAL_MS to control how quickly slides advance.
  // Keep SLIDE_FADE_MS lower than interval for a crisp, fast feel.
  const AUTO_INTERVAL_MS = 900; // was 1200ms – slightly faster now
  const SLIDE_FADE_MS = 250; // matches CSS opacity transition (styles.css)
  const autoInterval = AUTO_INTERVAL_MS; // legacy variable for existing code paths
  let isPlaying = true;
  let autoTimer = null;
  let pauseByHover = false;
  let pauseByInteraction = false; // user tap/click

  function update() {
    // Remove active from all items, then add to current
    items.forEach((item, i) => {
      item.classList.toggle("active", i === index);
    });

    // Caption: hide if playing, show if paused
    if (isPlaying) {
      hideCaption();
    } else {
      showCaption();
    }
  }

  function showCaption() {
    if (!captionEl) return;
    const text = items[index].dataset.caption || "";
    if (!text) return;
    captionEl.textContent = text;
    captionEl.classList.add("visible");
    captionEl.setAttribute("aria-hidden", "false");
  }

  function hideCaption() {
    if (!captionEl) return;
    captionEl.textContent = "";
    captionEl.classList.remove("visible");
    captionEl.setAttribute("aria-hidden", "true");
  }

  function play() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      index = (index + 1) % total;
      update();
    }, AUTO_INTERVAL_MS);
    isPlaying = true;
    pauseByInteraction = false;
    hideCaption();
  }

  function pause() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
    isPlaying = false;
  }

  // Start autoplay
  play();

  // Swipe handling
  let startX = 0;
  let dragging = false;
  let isSwiping = false;

  container.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    dragging = true;
    isSwiping = false;
  });

  container.addEventListener("touchmove", e => {
    if (!dragging) return;
    const moveX = e.touches[0].clientX;
    const deltaX = moveX - startX;
    if (Math.abs(deltaX) > 12) isSwiping = true; // threshold for swipe
  });

  container.addEventListener("touchend", e => {
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

  update();

  // Desktop hover to pause & show caption on the container
  container.addEventListener("mouseenter", () => {
    pause();
    pauseByHover = true;
    showCaption();
  });

  container.addEventListener("mouseleave", () => {
    if (pauseByHover && !pauseByInteraction) {
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
        pauseByInteraction = false;
        play();
      }
    });
  });
});
