
// Configuration
const GOOGLE_FORM_URL = 'https://forms.gle/YOUR_GOOGLE_FORM_ID'; // Replace with your actual Google Form URL
// Optional: If you want the site to post directly to a Google Form endpoint,
// set GOOGLE_FORM_ENDPOINT to the form's `formResponse` POST URL and
// provide a mapping object where keys are our field names (message,email)
// and values are the Google Forms `entry.xxxxx` names.
// Example:
// const GOOGLE_FORM_ENDPOINT = 'https://docs.google.com/forms/d/e/<FORM_ID>/formResponse';
// const GOOGLE_FORM_MAP = { message: 'entry.1234567890', email: 'entry.0987654321' };
const GOOGLE_FORM_ENDPOINT = '';
const GOOGLE_FORM_MAP = null;

// --- Theme (dark / light) ---
const THEME_KEY = 'prismasite-theme-v2';

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    const icon = document.getElementById('theme-toggle-icon');
    if (icon) icon.textContent = '☀️';
  } else {
    document.documentElement.removeAttribute('data-theme');
    const icon = document.getElementById('theme-toggle-icon');
    if (icon) icon.textContent = '🌙';
  }
}

function initTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'dark' || stored === 'light') {
    applyTheme(stored);
    return;
  }
  // Default to light (brighter) unless user explicitly toggles
  applyTheme('light');
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();

  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }
});

// --- Ask Away form submission ---
const askForm = document.getElementById('askaway-form');
if (askForm) {
  askForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('askaway-submit');
    const message = document.getElementById('askaway-message')?.value?.trim() || '';
    const email = document.getElementById('askaway-email')?.value?.trim() || '';

    if (!message && !email) {
      alert('Please enter a message or your email so we can follow up.');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    try {
      // If user configured a direct Google Forms endpoint and mapping, POST to it
      if (GOOGLE_FORM_ENDPOINT && GOOGLE_FORM_MAP && typeof GOOGLE_FORM_MAP === 'object') {
        const formData = new FormData();
        if (GOOGLE_FORM_MAP.message) formData.append(GOOGLE_FORM_MAP.message, message);
        if (GOOGLE_FORM_MAP.email) formData.append(GOOGLE_FORM_MAP.email, email);

        // Google Forms endpoints require no-cors for client-side POSTs
        await fetch(GOOGLE_FORM_ENDPOINT, { method: 'POST', body: formData, mode: 'no-cors' });
        alert('Thanks — your message was submitted. We will follow up.');
      } else {
        // Fallback: open mail client populated and open the Google Form in new tab
        const subject = encodeURIComponent('Prismasite inquiry');
        const body = encodeURIComponent(`Message:\n${message}\n\nEmail:\n${email}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;

        // Also open the Google Form for full submissions (if user provided the URL)
        if (GOOGLE_FORM_URL && GOOGLE_FORM_URL.includes('forms')) {
          window.open(GOOGLE_FORM_URL, '_blank', 'noopener');
        }
      }
    } catch (err) {
      console.error('Form submit error', err);
      alert('Sorry, there was a problem submitting your message. Please try again or email us directly.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
      }
      // Optionally clear the form
      // askForm.reset();
    }
  });
}

// Set current year in footer (guarded)
const yearEl = document.getElementById('current-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Set Google Form URLs on all links
const formLinks = [
  document.getElementById('form-link'),
  document.getElementById('form-link-mobile'),
  document.getElementById('cta-form-link')
];

formLinks.forEach(link => {
  if (link) {
    link.href = GOOGLE_FORM_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (mobileMenu && !mobileMenu.contains(e.target) && mobileMenuBtn && !mobileMenuBtn.contains(e.target)) {
    mobileMenu.classList.add('hidden');
  }
});

// Optional: Add smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// Log successful initialization
console.log('Prismasite initialized successfully!');
