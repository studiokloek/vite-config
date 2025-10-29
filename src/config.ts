import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ConfigEnv, UserConfig } from 'vite';
import { basePlugins } from './plugins/base';
import { buildPlugins } from './plugins/build';
import { servePlugins } from './plugins/serve';
import { cwd, defineBuildConfig, getPackageConfig, getPageToServe, parsePackageGamesSettings } from './utils';
import type { ViteOptions } from './utils/interfaces';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function defineKloekViteConfig(environment: ConfigEnv): Promise<UserConfig> {
    const package_ = getPackageConfig();

    const options: ViteOptions = {
        root: path.resolve(cwd, 'source'),
        package: package_,
        environment,
        settings: parsePackageGamesSettings(package_.settings, package_.version),
        config: {
            ...package_.vite,
            build: { ...package_.vite.build, browserslist: package_.browserslist },
            serve: {
                partials: [path.resolve(__dirname, 'partials'), path.resolve(cwd, 'source', 'partials')],
            },
        },
    };

    const config: UserConfig = {
        logLevel: 'info',
        base: package_.vite.build.basePath,
        root: options.root,
        envDir: path.resolve(cwd, 'env'),
        envPrefix: ['KLOEK_', 'VITE_'],
        publicDir: 'static',
        define: {},

        esbuild: {
            legalComments: 'none',
        },

        resolve: {
            alias: {
                '@meta': path.resolve(cwd, 'source', 'static', 'meta'),
                '@fonts': path.resolve(cwd, 'source', 'static', 'fonts'),
            },
            dedupe: [
                '@studiokloek/ts-core-lib',
                '@capacitor/app',
                '@capacitor/core',
                '@capacitor/device',
                '@capacitor/network',
                '@capacitor/preferences',
                '@capacitor/splash-screen',
                '@capacitor/status-bar',
                'bowser',
                'date-fns-tz',
                'date-fns',
                'error-stack-parser-es',
                'firebase',
                'fontfaceobserver',
                'gsap',
                'howler',
                'lodash-decorators',
                'lodash',
                'overmind',
                'pixi-spine',
                'pixi',
                'pubsub-js',
                'random-js',
                'ress',
                'slugify',
                'superagent',
                'ts-events',
                'ts-mixer',
                'tslib',
            ],
        },

        css: {
            preprocessorOptions: {
                scss: {
                    charset: false,
                    silenceDeprecations: ['legacy-js-api'],
                    // AdditionalData: `@charset "UTF-8"`,
                },
            },
        },

        plugins: [...basePlugins(options)],
    };

    switch (environment.command) {
        case 'serve': {
            config.server = {
                host: true,
                cors: options.config.dev.cors ?? true,
                open: getPageToServe(options.config, options.settings.games),
            };
            config.plugins = [
                ...(config.plugins ? config.plugins : []),
                ...servePlugins({
                    fullReloadSvelte: package_.vite.dev.fullReloadSvelte ?? true,
                }),
            ];

            break;
        }

        case 'build': {
            config.build = defineBuildConfig(options);
            config.plugins = [...(config.plugins ? config.plugins : []), ...buildPlugins(options)];
            break;
        }

        default:
    }

    return config;
}
