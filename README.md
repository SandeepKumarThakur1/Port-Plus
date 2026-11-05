# Port Plus homepage starter

## Folder structure
- `index.html` — page structure and Tailwind CDN
- `styles/main.css` — responsive layout and custom styling
- `scripts/main.js` — GSAP reveals, Lenis smooth scroll, mobile menu and video scrubbing
- `assets/videos/portplus-reel.mp4` — add your scroll-scrub video here
- `assets/images/` — add your image assets and video poster here
- `assets/fonts/` — optional local fonts

## Run locally
Open the folder in VS Code and use the **Live Server** extension, then open `index.html`.

## Add your video
1. Export a short, high-quality MP4 (H.264), ideally 1920px wide.
2. Name it `portplus-reel.mp4` and place it in `assets/videos/`.
3. Keep the video muted and encoded for web playback. A scrub sequence works best when the file is reasonably compressed and has frequent keyframes.
4. Optionally add `assets/images/port-video-poster.jpg` as the poster image.

The navigation follows the requested Features / Pricing / PORT PLUS / Blog / Contact order. The Delivery Channel Focus section and footer have been removed. The How It Works section includes a looping SVG wave line with a moving highlight. If the MP4 is missing, a designed fallback visual is shown.

## Libraries
Tailwind CSS CDN, GSAP + ScrollTrigger CDN, and Lenis CDN. Internet access is needed for the CDN versions. For production, install and bundle these libraries locally.
