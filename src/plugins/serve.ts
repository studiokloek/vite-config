import path from 'node:path';
import basicSsl from '@vitejs/plugin-basic-ssl';
import type { Plugin, PluginOption } from 'vite';
import checker from 'vite-plugin-checker';
import {default as fullReload} from 'vite-plugin-full-reload';
import { cwd } from '../utils';

export type KloekConfigServeSettings = {
    fullReloadSvelte?: boolean;
};

export function servePlugins(settings?: KloekConfigServeSettings): Array<Plugin | PluginOption> {
    const fullReloadPaths = ['script/**/*.ts'];
    if (settings?.fullReloadSvelte) {
        fullReloadPaths.push('svelte/**/*.svelte');
    }

    return [
        fullReload(fullReloadPaths, {
            root: path.join(path.resolve(cwd), 'source'),
            always: true,
        }) as Plugin,

        basicSsl(),

        checker({
            typescript: true,
        }),
    ];
}
