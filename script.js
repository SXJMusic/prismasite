document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");

  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    root.setAttribute("data-theme", "dark");
    icon.textContent = "☀";
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
});
