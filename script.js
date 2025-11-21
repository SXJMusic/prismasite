document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");

  // Default to light mode
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    root.setAttribute("data-theme", "dark");
    icon.textContent = "☀";
  } else {
    // Explicitly set light mode as default
    root.removeAttribute("data-theme");
    icon.textContent = "🌙";
  }

  toggle.addEventListener("click", () => {
    const dark = root.getAttribute("data-theme") === "dark";
    if (dark) {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      icon.textContent = "🌙";
    } else {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      icon.textContent = "☀";
    }
  });

  // ABOUT PANEL TOGGLE
  const aboutLink = document.getElementById("about-link");
  const aboutPanel = document.getElementById("about-panel");
  if (aboutLink && aboutPanel) {
    aboutLink.addEventListener("click", (e) => {
      e.preventDefault();
      const visible = aboutPanel.classList.toggle("visible");
      aboutPanel.setAttribute("aria-hidden", visible ? "false" : "true");
      aboutLink.setAttribute("aria-expanded", visible ? "true" : "false");
    });
    // Optional close on outside click (desktop)
    document.addEventListener("click", (e) => {
      if (!aboutPanel.classList.contains("visible")) return;
      if (e.target === aboutPanel || e.target === aboutLink || aboutPanel.contains(e.target)) return;
      aboutPanel.classList.remove("visible");
      aboutPanel.setAttribute("aria-hidden", "true");
      aboutLink.setAttribute("aria-expanded", "false");
    });
  }
});
