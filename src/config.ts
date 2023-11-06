import path from 'node:path';
import {fileURLToPath} from 'node:url';
import type {ConfigEnv, UserConfig} from 'vite';
import {basePlugins} from './plugins/base';
import {buildPlugins} from './plugins/build';
import {servePlugins} from './plugins/serve';
import {
  cwd,
  defineBuildConfig,
  getPageToServe,
  parsePackageGamesSettings,
  readJSON,
} from './utils';
import type {
  KloekViteConfig,
  PackageGamesSettings,
  ViteOptions,
} from './utils/interfaces';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function defineKloekViteConfig(
  environment: ConfigEnv,
): Promise<UserConfig> {
  const pkg = readJSON(path.resolve(cwd, 'package.json')) as Record<
    string,
    unknown
  >;
  const kloekConfig = pkg.vite as KloekViteConfig;
  const browserslist = pkg.browserslist as string | string[];
  const options: ViteOptions = {
    root: path.resolve(cwd, 'source'),
    package: {
      version: pkg.version as string,
      name: pkg.name as string,
      description: pkg.description as string,
    },
    environment,
    settings: parsePackageGamesSettings(pkg.settings as PackageGamesSettings, pkg.version as string),
    config: {
      ...kloekConfig,
      build: {...kloekConfig.build, browserslist},
      serve: {
        partials: [
          path.resolve(__dirname, 'partials'),
          path.resolve(cwd, 'source', 'partials'),
        ],
      },
    },
  };

  const config: UserConfig = {
    logLevel: 'info',
    base: kloekConfig.build.basePath,
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
        lodash: 'lodash-es',
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
        'lodash-decorators-esm',
        'lodash-es',
        'overmind',
        'pixi-spine',
        'pixi.js',
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
          // AdditionalData: `@charset "UTF-8"`,
        },
      },
    },

    plugins: [...basePlugins(options)],
  };

  switch (environment.command) {
    case 'serve':
      config.server = {
        host: true,
        cors: options.config.dev.cors ?? true,
        https: options.config.dev.https ?? true,
        open: getPageToServe(options.config, options.settings.games),
      };
      config.plugins = [
        ...(config.plugins ? config.plugins : []),
        ...servePlugins(),
      ];

      break;

    case 'build':
      config.build = defineBuildConfig(options);
      config.plugins = [
        ...(config.plugins ? config.plugins : []),
        ...buildPlugins(options),
      ];
      break;

    default:
  }

  return config;
}
