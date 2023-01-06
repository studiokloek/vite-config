import path from 'node:path';
import {svelte, vitePreprocess} from '@sveltejs/vite-plugin-svelte';
import {type Plugin, type PluginOption} from 'vite';
import tsconfigPathsPlugin from 'vite-tsconfig-paths';
import {type ViteOptions} from '../utils/interfaces';
import {cwd} from '../utils';
import {handlebarsPlugin} from './lib/handlebars-plugin';
import {htmlPlugin} from './lib/html-plugin';

export function basePlugins(
  options: ViteOptions,
): Array<Plugin | PluginOption> {
  return [
    htmlPlugin(options.settings.games),

    ...svelte({
      preprocess:vitePreprocess(),

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
      extensions: ['.ts', '.json'],
      loose: true,
    }),
  
    handlebarsPlugin(options.config.serve.partials, options),
  ];
}
