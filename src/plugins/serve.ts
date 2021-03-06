import path from 'node:path';
import {svelte} from '@sveltejs/vite-plugin-svelte';
import {Plugin} from 'vite';
import fullReload from 'vite-plugin-full-reload';
import tsconfigPathsPlugin from 'vite-tsconfig-paths';
import {ViteOptions} from '../utils/interfaces';
import {cwd} from '../utils';
import {handlebarsPlugin} from './lib/handlebars-plugin';
import {htmlPlugin} from './lib/html-plugin';

export function servePlugins(options: ViteOptions): Plugin[] {
  return [
    htmlPlugin(options.settings.games),

    ...svelte({
      // Hot: false,
      experimental: {
        prebundleSvelteLibraries: true,
        useVitePreprocess: true,
      },
    }),

    tsconfigPathsPlugin({
      root: path.resolve(cwd),
      extensions: ['.ts', '.json'],
      loose: true,
    }),

    fullReload(['script/**/*.ts', 'svelte/**/*.svelte'], {
      root: path.join(path.resolve(cwd), 'source'),
      log: true,
      always: true,
    }) as Plugin,

    handlebarsPlugin(options.config.serve.partials, options),
  ];
}
