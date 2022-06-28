import {ConfigEnv} from 'vite';

export interface ImageQualityConfig {
  jpeg: number;
  png: [number, number];
}

export interface KloekViteDevConfig {
  serveParams: string;
}

export interface KloekViteServeConfig {
  partials: string | string[];
}

export interface KloekViteBuildConfig {
  basePath: string;
  legacy?: boolean;
  browserslist?: string | string[];
  imageQuality: ImageQualityConfig;
  azureSWA?: boolean;
  manifest?: boolean;
}

export interface KloekViteConfig {
  dev: KloekViteDevConfig;
  serve: KloekViteServeConfig;
  build: KloekViteBuildConfig;
}
export type GameSettingsProperty = 'info' | 'meta' | 'options';

export interface GameSettings {
  info: {
    id: string;
    page: string;
    version: number;
    client: string;
    year: number;
  };

  meta: {
    title: string;
    description: string;
    apptitle: string;
  };

  options: {
    backgroundColor: string;
    orientation: string;
    fullscreen: string;
  };
}

export type GamesSettings = Record<string, GameSettings>;

export type GamesSettingsData = {
  development: GameSettings;
  games: GamesSettings;
};

export type PackageGamesSettings = {
  generic: GameSettings;
  games: GameSettings[];
};

export interface ViteOptions {
  root: string;
  environment: ConfigEnv;
  settings: GamesSettingsData;
  config: KloekViteConfig;
}
