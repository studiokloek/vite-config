import path from 'node:path';
import { cwd, readJSON } from '.';
import { KloekViteConfig, PackageConfig, PackageGamesSettings } from './interfaces';

const pkg = readJSON(path.resolve(cwd, 'package.json')) as Record<string,unknown>;

const config:PackageConfig = {
  vite: pkg.vite as KloekViteConfig,
  browserslist: pkg.browserslist as string | string[],
  settings: pkg.settings as PackageGamesSettings,
  version: pkg.version as string,
  name: pkg.name as string,
  description: pkg.description as string,
};

export function getPackageConfig(): PackageConfig {
  return config;
}
