import path from 'node:path';
import {type Plugin, type PluginOption} from 'vite';
import checker from 'vite-plugin-checker';
import fullReload from 'vite-plugin-full-reload';
import mkcert from 'vite-plugin-mkcert';
import {type KloekConfigServeSettings} from '../config';
import {cwd} from '../utils';

export function servePlugins(settings?: KloekConfigServeSettings): Array<Plugin | PluginOption> {
  const fullReloadPaths = ['script/**/*.ts'];
  if (settings?.fullReloadSvelte) {
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
