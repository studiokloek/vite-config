import path from 'node:path';
import {type Plugin, type PluginOption} from 'vite';
import fullReload from 'vite-plugin-full-reload';
import mkcert from 'vite-plugin-mkcert';
import checker from 'vite-plugin-checker';
import {cwd} from '../utils';
import {type KloekConfigSettings} from '../config';

export function servePlugins(settings: KloekConfigSettings): Array<Plugin | PluginOption> {
  const fullReloadPaths = ['script/**/*.ts'];
  if (settings.fullReloadSvelte) {
    fullReloadPaths.push('svelte/**/*.svelte');
  }

  return [
    fullReload(fullReloadPaths, {
      root: path.join(path.resolve(cwd), 'source'),
      log: true,
      always: true,
    }) as Plugin,

    mkcert(),

    checker({
      typescript: true,
    }),
  ];
}
