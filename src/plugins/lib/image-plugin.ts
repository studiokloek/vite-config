import {ConfigEnv, Plugin} from 'vite';
import imageminPlugin2 from 'vite-plugin-imagemin';
import {ImageQualityConfig} from '../../utils/interfaces';

export function imageminPlugin(
  environment: ConfigEnv,
  options: ImageQualityConfig,
): Plugin {
  return imageminPlugin2({
    disable: environment.mode !== 'production',
    mozjpeg: {
      quality: options?.jpeg ?? 80,
    },
    pngquant: {
      strip: true,
      speed: 2,
      dithering: 0.25,
      quality: options?.png ?? [0.5, 0.7],
    },
  }) as Plugin;
}
