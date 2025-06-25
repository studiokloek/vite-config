import { existsSync, promises } from 'node:fs';
import path from 'node:path';
import type { ConfigEnv, Plugin, UserConfig, ViteDevServer } from 'vite';
import { cwd, getPageIdFromUrl } from '../../utils';
import type { GamesSettings } from '../../utils/interfaces';

const PAGE_TEMPLATE = '{{> game data=data}}';
const DEVELOPMENT_TEMPLATE = '{{> development data=data}}';

async function renderTemporaryFile(filePath: string): Promise<void> {
    // Bestaat die file nog niet?
    if (!existsSync(filePath)) {
        // Aanmaken
        await promises.writeFile(filePath, PAGE_TEMPLATE);
    }
}

export function htmlPlugin(games: GamesSettings): Plugin {
    return {
        name: 'vite-plugin-kloek-html',
        enforce: 'pre',

        async config(_config: UserConfig, environment: ConfigEnv) {
            // Bij een build maken we tijdelijk files aan
            if (environment.command === 'build') {
                const actions: Array<Promise<void>> = [];

                for (const pageId of Object.keys(games)) {
                    // Pad naar file
                    const filePath = path.resolve(cwd, 'source', `${pageId}.html`);
                    actions.push(renderTemporaryFile(filePath));
                }

                await Promise.all(actions);
            }
        },

        configureServer(server: ViteDevServer) {
            return () => {
                // Zorg er voor dat tijdens development de pagina ge-rendered terug gegeven wordt wordt
                server.middlewares.use('/', async (request, response, next) => {
                    const url = request?.url ?? '';
                    const pageId = getPageIdFromUrl(url);

                    if (!pageId) {
                        next();
                    }

                    if (pageId === 'development') {
                        // Development? geef terug...
                        response.end(await server.transformIndexHtml(url, DEVELOPMENT_TEMPLATE, request.originalUrl));
                    } else if (Object.keys(games).includes(pageId)) {
                        // Bestaande game? zorg er voor dat de template ge-rendered wordt
                        response.end(await server.transformIndexHtml(url, PAGE_TEMPLATE, request.originalUrl));
                    } else {
                        // Niks gevonden
                        response.end();
                    }
                });
            };
        },

        async closeBundle() {
            // Verwijder de aangemaakte files
            const actions: Array<Promise<void>> = [];
            for (const pageId of Object.keys(games)) {
                // Pad naar file
                const filePath = path.resolve(cwd, 'source', `${pageId}.html`);
                if (existsSync(filePath)) {
                    try {
                        actions.push(promises.rm(filePath));
                    } catch {
                        //
                    }
                }
            }

            await Promise.all(actions);
        },
    };
}
