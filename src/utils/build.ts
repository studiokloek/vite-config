import path from 'node:path';
import type { BuildOptions } from 'vite';
import type { ViteOptions } from './interfaces';

export function defineBuildConfig(options: ViteOptions): BuildOptions {
  const input: Record<string, string> = {};

  for (const gameId of Object.keys(options.settings.games)) {
    input[gameId] = path.resolve(options.root, `${gameId}.html`);
  }

  // Libs die aparte js krijgen:
  // const vendorChunks = ['pixi', 'firebase', 'lodash', 'gsap', 'studiokloek'];

  return {
    reportCompressedSize: true,
    chunkSizeWarningLimit: 2000,
    outDir: '../public',
    assetsDir: 'generated',
    minify: 'terser',
    sourcemap: options.config.build.sourceMaps ?? false,
    rollupOptions: {
      input,
    },
  };
}
