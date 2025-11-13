# Prismasite

A simple, modern static landing page built with HTML, CSS, and JavaScript. Optimized for deployment to **Cloudflare Pages** or **GitHub Pages**.

## 🚀 Quick Start

### Local Development

1. Open `index.html` directly in your browser, or use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (npx http-server)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

2. Open http://localhost:8000 in your browser

### Configure Google Form

Edit `script.js` and replace the placeholder URL:

```javascript
const GOOGLE_FORM_URL = 'https://forms.gle/YOUR_ACTUAL_FORM_ID';
```

## 📦 Deploy to Cloudflare Pages

1. Push this folder to a GitHub repository
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Click "Create a project" → "Connect to Git"
4. Select your repository
5. Configure build settings:
   - **Build command:** (leave empty)
   - **Build output directory:** `/`
6. Click "Save and Deploy"

Your site will be live at `https://your-project.pages.dev` and automatically redeploy on every push to your main branch.

## 🌐 Deploy to GitHub Pages

1. Push this folder to a GitHub repository
2. Go to repository Settings → Pages
3. Under "Source", select your main branch and `/` (root) folder
4. Click "Save"

Your site will be live at `https://yourusername.github.io/your-repo-name/`

## 📁 Project Structure

```
prismasite/
├── index.html       # Main HTML file
├── styles.css       # Custom CSS styles
├── script.js        # JavaScript (Google Form link, mobile menu)
├── desktop.png      # Desktop mockup image
├── mobile.png       # Mobile mockup image
└── README.md        # This file
```

## 🎨 Customization

- **Content:** Edit `index.html` to change text, headings, and structure
- **Styling:** Modify `styles.css` or use Tailwind utility classes in HTML
- **Images:** Replace `desktop.png` and `mobile.png` with your own images
- **Colors:** Update Tailwind classes in HTML (e.g., `bg-blue-600` → `bg-purple-600`)

## 📝 Notes

- Uses Tailwind CSS via CDN (no build step required)
- Fully responsive design (mobile-first)
- Optimized for fast loading and SEO
- No dependencies or build tools needed

## 🔗 Custom Domain

### Cloudflare Pages
1. Go to your project in Cloudflare Pages
2. Click "Custom domains" → "Set up a custom domain"
3. Follow the DNS configuration steps

### GitHub Pages
1. Go to repository Settings → Pages
2. Under "Custom domain", enter your domain
3. Configure your DNS provider to point to GitHub Pages
