import path from 'node:path';
import type {BuildOptions} from 'vite';
import type {ViteOptions} from './interfaces';

export function defineBuildConfig(options: ViteOptions): BuildOptions {
  const input: Record<string, string> = {};

  for (const gameId of Object.keys(options.settings.games)) {
    input[gameId] = path.resolve(options.root, `${gameId}.html`);
  }

  // Libs die aparte js krijgen:
  const vendorChunks = ['pixi', 'firebase', 'lodash', 'gsap', 'studiokloek'];

  return {
    reportCompressedSize: true,
    chunkSizeWarningLimit: 2000,
    outDir: '../public',
    assetsDir: 'generated',
    minify: 'terser',
    sourcemap: options.config.build.sourceMaps ?? false,
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

            return 'vendor';
          }

          return undefined;
        },
      },
    },
  };
}
