import path from 'node:path';
import type { KloekViteConfig, PackageConfig, PackageGamesSettings } from './interfaces';
import { cwd, readJSON } from '.';

const package_ = readJSON(path.resolve(cwd, 'package.json')) as Record<string, unknown>;

const config: PackageConfig = {
  vite: package_.vite as KloekViteConfig,
  browserslist: package_.browserslist as string | string[],
  settings: package_.settings as PackageGamesSettings,
  version: package_.version as string,
  name: package_.name as string,
  description: package_.description as string,
};

export function getPackageConfig(): PackageConfig {
  return config;
}
