import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFileSync} from 'node:fs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import type {RollupOptions} from 'rollup';
import {defineConfig} from 'rollup';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const pkg = JSON.parse(
  readFileSync(new URL('package.json', import.meta.url)).toString(),
);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = (commandLineArgs: RollupOptions): RollupOptions => {
  const isDev = commandLineArgs.watch !== undefined;
  const isProduction = !isDev;

  return defineConfig({
    treeshake: {
      moduleSideEffects: 'no-external',
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false,
    },
    onwarn(warning, warn) {
      // Node-resolve complains a lot about this but seems to still work?
      if (warning.message.includes('Package subpath')) {
        return;
      }

      // We use the eval('require') trick to deal with optional deps
      if (warning.message.includes('Use of eval')) {
        return;
      }

      if (warning.message.includes('Circular dependency')) {
        return;
      }

      warn(warning);
    },
    input: path.resolve(__dirname, 'src/index.ts'),
    output: {
      file: path.resolve(__dirname, 'dist/index.js'),
      // Exports: 'named',
      // format: 'esm',
      // externalLiveBindings: false,
      // // Freeze: false,
      sourcemap: 'inline',
    },
    external: [
      ...Object.keys(pkg.dependencies),
      ...(isProduction ? [] : Object.keys(pkg.devDependencies)),
    ],
    plugins: [
      nodeResolve({preferBuiltins: true}),
      typescript({
        tsconfig: 'tsconfig.build.json',
        inlineSourceMap: true,
        inlineSources: true,
      }),
    ],
  });
};

export default config;
