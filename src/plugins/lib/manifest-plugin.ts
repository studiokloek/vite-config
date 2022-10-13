import type {Plugin, ResolvedConfig} from 'vite';
import type {GameSettings, GamesSettings} from '../../utils/interfaces';

function renderGameManifest(
  pageId: string,
  settings: GameSettings,
  config: ResolvedConfig,
): string {
  const manifest = {
    short_name: `${settings.meta.apptitle}`,
    name: `${settings.meta.title}`,
    description: `${settings.meta.description}`,
    scope: `${config.base}${pageId}.html`,
    start_url: `${config.base}${pageId}.html`,
    display: 'fullscreen',
    orientation: `${settings.options.orientation ?? 'landscape'}`,
    icons: [
      {
        src: `${config.base}meta/${settings.info.id}/icons/chrome-touch-icon-192x192.png`,
        type: 'image/png',
        sizes: '192x192',
      },
      {
        src: `${config.base}meta/${settings.info.id}/icons/icon.png`,
        type: 'image/png',
        sizes: '1024x1024',
      },
    ],
    background_color: `${settings.options.backgroundColor}`,
    theme_color: `${settings.options.backgroundColor}`,
  };

  return `${JSON.stringify(manifest, null, 2)}\n`;
}

export function manifestPlugin(games: GamesSettings): Plugin {
  let config: ResolvedConfig;

  return {
    name: 'vite-plugin-kloek-manifest',
    enforce: 'post',
    apply: 'build',
    async configResolved(resolvedConfig: ResolvedConfig) {
      config = resolvedConfig;
    },
    generateBundle(_, bundle) {
      // Voor iedere app een manifest maken:
      for (const [pageId, settings] of Object.entries(games)) {
        bundle[`${pageId}.webmanifest`] = {
          isAsset: true,
          type: 'asset',
          name: undefined,
          source: renderGameManifest(pageId, settings, config),
          fileName: `${pageId}.webmanifest`,
        };

        bundle[`${pageId}-serviceworker.js`] = {
          isAsset: true,
          type: 'asset',
          name: undefined,
          source: "self.addEventListener('fetch', function() { return; });",
          fileName: `${pageId}-serviceworker.js`,
        };
      }
    },
  };
}
