import os from 'node:os';
import path from 'node:path';
import hbs from 'handlebars';
import { type IndexHtmlTransformContext, normalizePath, type Plugin as VitePlugin } from 'vite';
import { getPageIdFromUrl } from '../../../utils/game.js';
import type { ViteOptions } from '../../../utils/interfaces.js';
import { resolveContext } from './context.js';
import { registerPartials } from './partials.js';

export function handlebarsPlugin(partialsDirectoryPaths: string | string[], options: ViteOptions): VitePlugin {
    // Keep track of what partials are registered
    const partialsSet = new Set<string>();

    hbs.registerHelper({
        json: (object: any, indent = 0) => JSON.stringify(object, undefined, indent),
        concat: (...arguments_: any[]) => arguments_.slice(0, -1).join(''),
        eq: (a: any, b: any) => a === b,
        neq: (a: any, b: any) => a !== b,
        isdefined: (value: undefined) => value !== undefined,
        'resolve-root'(p: string) {
            // Tijdelijke hack voor bug in handlebars plugin
            // zie ook https://github.com/alexlafroscia/vite-plugin-handlebars/pull/129
            const resolvedPath = path.resolve(options.root, p);
            return os.platform() === 'win32' ? `/${resolvedPath}` : resolvedPath;
        },
    });

    return {
        name: 'handlebars',

        async handleHotUpdate({ server, file }) {
            if (partialsSet.has(file)) {
                server.ws.send({
                    type: 'full-reload',
                });

                return [];
            }

            return;
        },

        transformIndexHtml: {
            // Ensure Handlebars runs _before_ any bundling
            order: 'pre',

            async handler(html: string, ctx: IndexHtmlTransformContext): Promise<string> {
                await registerPartials(partialsDirectoryPaths, partialsSet);

                const template = hbs.compile(html);

                const resolvedContext = await resolveContext((pagePath: string): Record<string, unknown> => {
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
                }, normalizePath(ctx.path));
                const result = template(resolvedContext);

                return result;
            },
        },
    };
}
