import type { ConfigEnv } from 'vite';

export type ImageQualityConfig = {
  jpeg: number;
  png: [number, number];
};

export type KloekViteDevConfig = {
  serveParams: string;
  fullReloadSvelte?: boolean;
  cors?: boolean;
  https?: boolean;
};

export type KloekViteServeConfig = {
  partials: string | string[];
};

export type KloekViteBuildConfig = {
  basePath: string;
  legacy?: boolean;
  browserslist?: string | string[];
  imageQuality: ImageQualityConfig;
  manifest?: boolean;
  analyzeBundle?: boolean;
  sourceMaps?: boolean | 'inline' | 'hidden';
  createZip?: boolean;
};

export type KloekViteConfig = {
  dev: KloekViteDevConfig;
  serve: KloekViteServeConfig;
  build: KloekViteBuildConfig;
};
export type GameSettingsProperty = 'info' | 'meta' | 'options';

export type GameSettings = {
  info: {
    id: string;
    page: string;
    version: string;
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
};

export type GamesSettings = Record<string, GameSettings>;

export type GamesSettingsData = {
  development: GameSettings;
  games: GamesSettings;
};

export type PackageGamesSettings = {
  generic: GameSettings;
  games: GameSettings[];
};

export type ViteOptions = {
  root: string;
  package: {
    version: string;
    name: string;
    description: string;
  };
  environment: ConfigEnv;
  settings: GamesSettingsData;
  config: KloekViteConfig;
};

export type PackageConfig = {
  vite: KloekViteConfig;
  settings: PackageGamesSettings;
  browserslist: string | string[];
  version: string;
  name: string;
  description: string;
};
