import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ConfigEnv, UserConfig} from 'vite';
import {buildPlugins} from './plugins/build';
import {servePlugins} from './plugins/serve';
import {
  cwd,
  defineBuildConfig,
  getPageToServe,
  parsePackageGamesSettings,
  readJSON,
} from './utils';
import {
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
    environment,
    settings: parsePackageGamesSettings(pkg.settings as PackageGamesSettings),
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
    publicDir: 'static',
    define: {},

    // OptimizeDeps: {
    //   exclude: ['@studiokloek/ts-core-lib'],
    // },

    esbuild: {
      legalComments: 'none',
    },

    resolve: {
      alias: {
        lodash: 'lodash-es',
        '@meta': path.resolve(cwd, 'source', 'static', 'meta'),
        '@fonts': path.resolve(cwd, 'source', 'static', 'fonts'),
      },
    },

    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
          // AdditionalData: `@charset "UTF-8"`,
        },
      },
    },

    plugins: [...servePlugins(options)],
  };

  switch (environment.command) {
    case 'serve':
      config.server = {
        https: {
          key: readFileSync(path.resolve(cwd, 'cert', 'key.pem')),
          cert: readFileSync(path.resolve(cwd, 'cert', 'cert.pem')),
        },
        open: getPageToServe(options.config, options.settings.games),
      };

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
