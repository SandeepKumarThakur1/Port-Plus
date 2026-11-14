# Zero Detention / Port Plus website

## Structure
```
index.html                         Home
features.html                      Features hub (links to the four pages)
feature-port-stringency-index.html Feature 1
feature-most-likely-findings.html  Feature 2
feature-ship-psc-scorecard.html    Feature 3
feature-operator-psc-scorecard.html Feature 4 
pricing.html                       Pricing
contact.html · blog.html           Static pages (no animation)
privacy.html · terms.html          Legal pages (text from the content doc)
styles/  fonts.css (TT Commons @font-face) · layout.css (header, mobile menu, footer – every page)
         main.css (home only) · features.css (shared by feature pages + pricing) · pages/*.css (per page)
scripts/ nav.js (mobile menu, every page) · main.js (home: GSAP/Lenis/video scrub)
         features.js (scroll reveal + follow-the-cursor wave)
assets/  fonts/ (TT Commons woff2, 400/500/600/700/800) · logo/ (on-light, on-dark) · images/ · videos/
```
Run with VS Code Live Server (open `index.html`). Pages use relative paths, so any static host works.

## Notes
- Placeholders to replace: prices ($X, $Y, $XX) and links `#software-page`, `#stripe-3-month-pass`, `#stripe-dashboard` in pricing.html; `#whatsapp-link` and the QR code box on contact.html and blog.html.
- Contact form opens the visitor's mail app (mailto) — swap for a form service when ready.
- Blog has no posts yet; a post-card template is commented in blog.html.
- Home page still loads Tailwind, GSAP and Lenis from CDNs.
