import legacyPlugin from '@vitejs/plugin-legacy';
import path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
import type { Plugin, PluginOption } from 'vite';
import bannerPlugin from 'vite-plugin-banner';
import { createHtmlPlugin } from 'vite-plugin-html';
import zipPack from "vite-plugin-zip-pack";
import { cwd } from '../utils';
import type { ViteOptions } from '../utils/interfaces';
import { imageminPlugin } from './lib/image-plugin';
import { manifestPlugin } from './lib/manifest-plugin';
import filenamify from 'filenamify';

// Build plugins
export function buildPlugins(
  options: ViteOptions,
): Array<Plugin | PluginOption> {
  // No build? no plugins..
  if (options.environment.command !== 'build') {
    return [];
  }

  const plugins: Array<Plugin | PluginOption | undefined> = [];

  if (options.config.build.legacy) {
    // Make sure the page works in older browsers
    plugins.push(
      ...legacyPlugin({
        targets: (options.config.build.browserslist as string[]) ?? 'defaults',
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
    bannerPlugin({
      outDir: '../public',
      content:`. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

         __                             ,      _            _
        /  )              |  o         /|   / | |          | |
        \\__ _|_         __|      __     |__/  | |  __   _  | |
           \\ |  |   |  /  |  |  /  \\_   | \\   |/  /  \\_|/  |/_)
       (___/ |_/ \\_/|_/\\_/|_/|_/\\__/    |  \\_/|__/\\__/ |__/| \\_/

        Concept, ontwerp & ontwikkeling
        https://studiokloek.nl

        Studio Kloek ❤ PixiJS, GSAP & howler.js

    . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .`}
    ),
  );

  // Create a manifest and minimal webworker for every game
  if (options.config.build.manifest) {
    plugins.push(manifestPlugin(options.settings.games));
  }

  // Do we need to analyse the build?
  if (options.config.build.analyzeBundle) {
    plugins.push(visualizer({
      template: "treemap", // or sunburst
      open: true,
      gzipSize: true,
      filename: "bundle-analyse.html", // will be saved in project's root
    }) as PluginOption);
  }

  // Do we need to create a zip file of the build?
  if (options.config.build.createZip) {
    const outFileName = filenamify(`${options.package.name}-${options.package.version}.zip`, {replacement: '-'});
    plugins.push(zipPack({
      inDir: path.resolve(cwd, 'public'),
      outDir: path.resolve(cwd, 'zips'),
      outFileName
    }));
  }

  return plugins.filter(plugin => plugin !== undefined);
}
