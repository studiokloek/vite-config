import path from 'node:path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import type { Plugin, PluginOption } from 'vite';
import tsconfigPathsPlugin from 'vite-tsconfig-paths';
import sveltePreprocess from 'svelte-preprocess';
import type { ViteOptions } from '../utils/interfaces';
import { cwd } from '../utils';
import { handlebarsPlugin } from './lib/handlebars-plugin';
import { htmlPlugin } from './lib/html-plugin';

export function basePlugins(options: ViteOptions): Array<Plugin | PluginOption> {
  return [
    htmlPlugin(options.settings.games),

    ...svelte({
      preprocess: sveltePreprocess(),

      onwarn(warning, warn) {
        if (!warn) {
          return;
        }

        // No a11y warnings...
        if (warning.code.startsWith('a11y-')) {
          return;
        }

        warn(warning);
      },
    }),

    tsconfigPathsPlugin({
      root: path.resolve(cwd),
      // Extensions: ['.ts', '.json'],
      loose: true,
    }),

    handlebarsPlugin(options.config.serve.partials, options),
  ];
}
