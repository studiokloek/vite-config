import legacyPlugin from '@vitejs/plugin-legacy';
import {Plugin} from 'vite';
import bannerPlugin from 'vite-plugin-banner';
import {createHtmlPlugin} from 'vite-plugin-html';
import {ViteOptions} from "../utils/interfaces";
import {imageminPlugin} from './lib/image-plugin';
import {manifestPlugin} from './lib/manifest-plugin';

// Build plugins
export function buildPlugins(options: ViteOptions): Plugin[] {
  // No build? no plugins..
  if (options.environment.command !== 'build') {
    return [];
  }

  const plugins: Plugin[] = [];

  if (options.config.build.legacy === true) {
    // Make sure the page works in older browsers
    plugins.push(
      legacyPlugin({
        targets: (options.config.build.browserslist as string[]) ?? [],
      }),
    );
  }

  const pages = Object.keys(options.settings.games).map((gameId) => {
    return {
      filename: `${gameId}.html`,
      template: `${gameId}.html`,
    };
  });

  plugins.push(
    // Minify image assets
    imageminPlugin(options.environment, options.config.build.imageQuality),

    // Make the html output smaller
    ...(createHtmlPlugin({minify: true, pages}) as Plugin[]),

    // Add a banner to generated js/css
    bannerPlugin(
      `
    . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

         __                             ,      _            _
        /  )              |  o         /|   / | |          | |
        \\__ _|_         __|      __     |__/  | |  __   _  | |
           \\ |  |   |  /  |  |  /  \\_   | \\   |/  /  \\_|/  |/_)
       (___/ |_/ \\_/|_/\\_/|_/|_/\\__/    |  \\_/|__/\\__/ |__/| \\_/

        Concept, ontwerp & ontwikkeling
        https://studiokloek.nl

        Studio Kloek ❤ PixiJS, GSAP & howler.js

    . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

    `,
    ),

    manifestPlugin(options.settings.games),
  );

  return plugins;
}
