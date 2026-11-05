# The Hidden Realms

A mobile-first, installable hidden-object fantasy game, built with **Vite + vanilla JavaScript modules + CSS**, deployable as a static PWA. No backend, accounts, paid APIs or database required.

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed in the terminal. To build a static deployment:

```bash
npm run check
npm run build
```

Upload `dist/` to any static hosting service, or use the included GitHub Actions deployment.

## GitHub Pages

1. Create a repository and upload **the contents of this folder** (not the ZIP as a single file).
2. In repository **Settings → Pages → Build and deployment**, select **GitHub Actions**.
3. Push to `main`, then open the URL shown in the Actions deployment.
4. On your iPhone, open the URL in Safari, tap **Share → Add to Home Screen**.

The service worker caches the game for offline play once the site has loaded over HTTPS. The PWA also supports safe-area insets and standalone full-screen mode.

## Code structure

- `src/main.js` → object discovery, fairy-dust effects, level UI, hints, local save data
- `src/camera.js` → pinch zoom, pan, desktop wheel, direct hit testing
- `src/levels.js` → authored level objects/locations and the 100-level season plan
- `src/style.css` → adaptive portrait/landscape/desktop UI and visual effects
- `public/assets/` → artwork and app icons
- `public/sw.js` + `public/manifest.webmanifest` → installation and offline support
- `.github/workflows/deploy.yml` → automated GitHub Pages build/deployment

## Honest content status

**Only Level 1 is illustrated and playable.** The remaining 99 levels are represented as a content roadmap, not procedurally faked scenes. New levels should have individually authored artwork and object coordinates. The source illustration for Level 1 is a generated concept, and hit coordinates should be refined through playtesting.

The app uses a base-relative build to support GitHub Pages under a repository path.
