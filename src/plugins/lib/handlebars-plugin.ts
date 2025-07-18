import os from 'node:os';
import path from 'node:path';
import type { Plugin } from 'vite';
import viteHandlebarsPlugin from 'vite-plugin-handlebars';
import type { ViteOptions } from '../../utils/interfaces';
import { getPageIdFromUrl } from '../../utils';

// Helpers voor handlebars
export function handlebarsPlugin(partialDirectory: string | string[], options: ViteOptions): Plugin {
  return viteHandlebarsPlugin({
    partialDirectory,

    helpers: {
      json: (object: unknown, indent = 0) => JSON.stringify(object, undefined, indent),
      concat: (...arguments_: unknown[]) => arguments_.slice(0, -1).join(''),
      eq: (a: unknown, b: unknown) => a === b,
      neq: (a: unknown, b: unknown) => a !== b,
      isdefined: (value: undefined) => value !== undefined,
      'resolve-root'(p: string) {
        // Tijdelijke hack voor bug in handlebars plugin
        // zie ook https://github.com/alexlafroscia/vite-plugin-handlebars/pull/129
        const resolvedPath = path.resolve(options.root, p);
        return os.platform() === 'win32' ? `/${resolvedPath}` : resolvedPath;
      },
    },

    context(pagePath: string): Record<string, unknown> {
      const gameId = getPageIdFromUrl(pagePath);

      if (!gameId) {
        return {};
      }

      if (gameId === 'development') {
        // Pagina settings teruggeven
        return {
          env: options.environment,
          data: options.settings.development,
          games: options.settings.games,
        };
      }

      // Op basis van pad data bepalen
      const settings = options.settings.games[gameId];

      // Pagina settings teruggeven
      return {
        env: options.environment,
        data: settings ?? {},
      };
    },
  });
}
