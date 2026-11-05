import {defineConfig} from 'vite';
// Relative paths allow both repo-name GitHub Pages URLs and custom domains.
export default defineConfig({base:'./',build:{target:'es2020',outDir:'dist'}});
