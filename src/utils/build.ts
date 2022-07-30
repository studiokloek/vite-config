import path from 'node:path';
import {BuildOptions} from 'vite';
import {ViteOptions} from './interfaces';

export function defineBuildConfig(options: ViteOptions): BuildOptions {
  const input: Record<string, string> = {};

  for (const gameId of Object.keys(options.settings.games)) {
    input[gameId] = path.resolve(options.root, `${gameId}.html`);
  }

  // Libs die aparte js krijgen:
  const vendorChunks = ['firebase', 'pixi', 'lodash', 'capacitor', 'gsap'];

  return {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    outDir: '../public',
    assetsDir: 'generated',
    rollupOptions: {
      input,
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const name = id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString();

            for (const value of vendorChunks) {
              if (name.includes(value)) {
                return value;
              }
            }
          }

          return undefined;
        },
      },
    },
  };
}
