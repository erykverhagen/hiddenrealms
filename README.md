# Hidden Realms · fixed static web build

The prior build was broken when opened directly because its Vite HTML still had `%BASE_URL%` placeholders and the ready-to-host package omitted the stylesheet link.

This folder contains a fully static website. Serve the folder from an HTTPS host (including GitHub Pages). Keep `index.html`, `app.js`, `style.css`, `assets/`, `sw.js`, and `manifest.webmanifest` together. No build command or dependencies are required.

- Tap discoveries directly in the illustrated scene.
- Pinch/drag to move around.
- Found objects animate with fairy dust and check off in the treasure tray.
- First illustrated level only.

For direct local preview use the separate `hidden-realms-play-now.html` file, which contains everything inline and does not need hosting.
