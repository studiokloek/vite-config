import path from 'node:path';
import type {ConfigEnv, Plugin} from 'vite';
import viteImagemin from '@vheemstra/vite-plugin-imagemin';

// The minifiers you want to use:
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngQuant from 'imagemin-pngquant';
import imageminOptiPng from 'imagemin-optipng';
import type {ImageQualityConfig} from '../../utils/interfaces';
import {cwd} from '../../utils';

export function imageminPlugin(
  environment: ConfigEnv,
  options: ImageQualityConfig,
): Plugin | undefined {
  if (environment.mode !== 'production') {
    return;
  }

  return viteImagemin({
    skipIfLarger: true,
    verbose: true,
    cache: false,
    root: path.join(path.resolve(cwd), 'public'),
    plugins: {
      jpg: [
        imageminMozjpeg({
          quality: options?.jpeg ?? 80,
        }),
      ],
      png: [
        imageminPngQuant({
          strip: true,
          speed: 2,
          dithering: 0.25,
          quality: options?.png ?? [0.5, 0.7],
        }),
        imageminOptiPng(),
      ],
    },
  }) as Plugin;
}
