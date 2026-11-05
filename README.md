# The Hidden Realms: Blossom Village Deluxe

A mobile-first illustrated hidden-object web game, implemented with standalone HTML, CSS and JavaScript. No build tools, dependencies or API keys.

## Run locally

From this directory: `python3 -m http.server 8080` and open `http://localhost:8080`.

## Deploy

Publish **all files and the `assets` folder** at the root of any static HTTPS host, including GitHub Pages. The site opens at `/index.html`. On iPhone: open the published URL in Safari, Share → Add to Home Screen. Offline caching works after first visit via HTTPS.

## Current content

**One fully interactive illustrated level**, 10 discoveries. The complete 100-level seasonal campaign remains a content roadmap, not included in this build.

## Art quality limitation

The provided illustration is 1672 × 678 pixels. The current app uses a high-quality WebP from that source, avoids resampling artifacts, and caps the zoom. Genuine crispness at extreme zoom requires higher-resolution original artwork or a tiled multiresolution source. Artificial upscaling alone cannot restore missing visual detail.

## Discoveries

Click/tap directly on the owl, sword, mushroom, lute, cat, dog, shield, fox, deer, and lantern. Finding one creates magical particles, awakens a persistent enchanted version, and updates the treasure ribbon. Magnifier: double tap/click the scene to enable, then single tap/click to dismiss. The LOUPE button can also toggle it. Single taps collect objects when the lens is off.

## Image resolution

The existing spring scene is **1672 × 678**, not 8K. Do not confuse interpolation with genuine detail. A future asset replacement requires a purpose-made high-resolution scene, with targets retested after the replacement.
