import path from 'node:path';
import {type Plugin, type PluginOption} from 'vite';
import fullReload from 'vite-plugin-full-reload';
import mkcert from 'vite-plugin-mkcert';
import checker from 'vite-plugin-checker';
import {cwd} from '../utils';
export function servePlugins(): Array<Plugin | PluginOption> {
  return [
    fullReload(['script/**/*.ts', 'svelte/**/*.svelte'], {
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
