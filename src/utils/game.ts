import path from 'node:path';
import type {
    GameSettings,
    GameSettingsProperty,
    GamesSettings,
    GamesSettingsData,
    KloekViteConfig,
    PackageGamesSettings,
} from './interfaces';

function mergeGameSettings(generic: GameSettings, game: GameSettings, infoTypes: GameSettingsProperty[]): GameSettings {
    const settings: Record<string, unknown> = {};

    // Alle props op één level diep mergen
    for (const property of infoTypes) {
        settings[property] = {
            ...generic[property],
            ...game[property],
        };
    }

    return settings as unknown as GameSettings;
}

export function parsePackageGamesSettings(packageSettings: PackageGamesSettings, version: string): GamesSettingsData {
    // Merge settings
    const infoTypes = Object.keys(packageSettings.generic) as GameSettingsProperty[];
    const { generic } = packageSettings;
    const allSettings: GamesSettingsData = {
        development: generic,
        games: {},
    };

    for (const game of packageSettings.games ?? []) {
        const settings = mergeGameSettings(generic, game, infoTypes);

        // Zorg er voor dat page altijd gezet is
        const pageId = settings.info.page ?? settings.info.id ?? 'unknown';
        settings.info.page = pageId;

        // eigen versie nummer of de generieke uit de package
        settings.info.version = settings.info.version ?? version;

        // Sla settings op onder page id
        allSettings.games[pageId] = settings;
    }

    return allSettings;
}

export function pathToGameData(fullFilePath: string, settings: GamesSettings): GameSettings | undefined {
    // Determine filename without extension
    let filePath = path.basename(fullFilePath, path.extname(fullFilePath));

    // Determine dir & remove leading slash
    let fileDirectory = path.dirname(fullFilePath);
    fileDirectory = fileDirectory.replace(/^\/+/g, '');

    if (fileDirectory) {
        filePath = `${fileDirectory}/${filePath}`;
    }

    return settings[filePath];
}

export function getPageToServe(config: KloekViteConfig, settings: GamesSettings): string {
    // Hoeveel pages zijn er?
    const pageIds = Object.keys(settings);
    const page = pageIds.length === 1 ? pageIds[0] : 'development';

    return path.posix.join(config.build.basePath, `${page}.html${config.dev.serveParams ?? ''}`);
}

export function getPageIdFromUrl(url: string): string {
    if (!url) {
        return '';
    }

    let pathname: string;

    try {
        pathname = new URL(url, 'https://studiokloek.nl').pathname;
    } catch {
        return '';
    }

    // If request is not html , directly return next()
    if (!pathname.endsWith('.html') && pathname !== '/') {
        return '';
    }

    // Pagina id opvragen
    const index = pathname.lastIndexOf('/');
    const fileName = index === -1 ? pathname : pathname.slice(index + 1);

    return fileName.replace('.html', '');
}
