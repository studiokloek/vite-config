import {ConfigEnv} from 'vite';

export interface ImageQualityConfig {
  jpeg: number;
  png: [number, number];
}

export interface KloekViteConfig {
  dev: {
    serveParams: string;
  };
  serve: {
    partials: string | string[];
  };
  build: {
    basePath: string;
    legacy?: boolean;
    browserslist?: string | string[];
    imageQuality: ImageQualityConfig;
  };
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
