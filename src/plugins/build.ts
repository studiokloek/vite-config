import legacyPlugin from '@vitejs/plugin-legacy';
import { visualizer } from 'rollup-plugin-visualizer';
import type { Plugin, PluginOption } from 'vite';
import { default as bannerPlugin } from 'vite-plugin-banner';
import { createHtmlPlugin } from 'vite-plugin-html';
import type { ViteOptions } from '../utils/interfaces';
import { imageminPlugin } from './lib/image-plugin';
import { manifestPlugin } from './lib/manifest-plugin';

// Build plugins
export function buildPlugins(options: ViteOptions): Array<Plugin | PluginOption> {
    // No build? no plugins..
    if (options.environment.command !== 'build') {
        return [];
    }

    const plugins: Array<Plugin | PluginOption | undefined> = [];

    if (options.config.build.legacy) {
        // Make sure the page works in older browsers
        plugins.push(...legacyPlugin({ targets: (options.config.build.browserslist as string[]) ?? 'defaults' }));
    }

    const pages = Object.keys(options.settings.games).map((gameId) => {
        return { filename: `${gameId}.html`, template: `${gameId}.html` };
    });

    plugins.push(
        // Minify image assets
        imageminPlugin(options.environment, options.config.build.imageQuality),

        // Make the html output smaller
        ...(createHtmlPlugin({ minify: true, pages }) as Plugin[]),

        // Add a banner to generated js/css
        bannerPlugin({
            outDir: '../public',
            content: `. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

         __                             ,      _            _
        /  )              |  o         /|   / | |          | |
        \\__ _|_         __|      __     |__/  | |  __   _  | |
           \\ |  |   |  /  |  |  /  \\_   | \\   |/  /  \\_|/  |/_)
       (___/ |_/ \\_/|_/\\_/|_/|_/\\__/    |  \\_/|__/\\__/ |__/| \\_/

        Concept, ontwerp & ontwikkeling
        https://studiokloek.nl

        Studio Kloek ❤ PixiJS, GSAP & howler.js

    . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .`,
        }),
    );

    // Create a manifest and minimal webworker for every game
    if (options.config.build.manifest) {
        plugins.push(manifestPlugin(options.settings.games));
    }

    // Do we need to analyse the build?
    if (options.config.build.analyzeBundle) {
        plugins.push(
            visualizer({
                template: 'treemap', // or sunburst
                open: true,
                gzipSize: true,
                filename: 'bundle-analyse.html', // will be saved in project's root
            }) as PluginOption,
        );
    }

    return plugins.filter((plugin) => plugin !== undefined);
}
