import viteHandlebarsPlugin, { type HandlebarsContext } from '@yoichiro/vite-plugin-handlebars';
import type { Plugin } from 'vite';
import { getPageIdFromUrl } from '../../utils';
import type { ViteOptions } from '../../utils/interfaces';

// Helpers voor handlebars
export function handlebarsPlugin(partialsDirectoryPaths: string | string[], options: ViteOptions): Plugin[] {
    const dirs = Array.isArray(partialsDirectoryPaths) ? partialsDirectoryPaths : [partialsDirectoryPaths];

    return dirs.map((partialsDirectoryPath) => {
        return viteHandlebarsPlugin({
            partialsDirectoryPath,

            transformIndexHtmlOptions: {
                helpers: {
                    json: (object: any, indent = 0) => JSON.stringify(object, undefined, indent),
                    concat: (...arguments_: any[]) => arguments_.slice(0, -1).join(''),
                    eq: (a: any, b: any) => a === b,
                    neq: (a: any, b: any) => a !== b,
                    isdefined: (value: undefined) => value !== undefined,
                    // 'resolve-root'(p: string) {
                    //     // Tijdelijke hack voor bug in handlebars plugin
                    //     // zie ook https://github.com/alexlafroscia/vite-plugin-handlebars/pull/129
                    //     const resolvedPath = path.resolve(options.root, p);
                    //     return os.platform() === 'win32' ? `/${resolvedPath}` : resolvedPath;
                    // },
                },

                context: ((pagePath: string): Record<string, unknown> => {
                    const gameId = getPageIdFromUrl(pagePath);

                    if (!gameId) {
                        return {};
                    }

                    if (gameId === 'development') {
                        // Pagina settings teruggeven
                        return {
                            env: options.environment,
                            data: options.settings.development,
                            games: options.settings.games,
                        };
                    }

                    // Op basis van pad data bepalen
                    const settings = options.settings.games[gameId];

                    // Pagina settings teruggeven
                    return {
                        env: options.environment,
                        data: settings ?? {},
                    };
                }) as HandlebarsContext,
            },
        });
    });
}
