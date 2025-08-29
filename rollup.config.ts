import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFileSync} from 'node:fs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import type {RollupOptions} from 'rollup';
import {defineConfig} from 'rollup';
import copy from 'rollup-plugin-copy'

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
      warn(warning);
    },
    input: path.resolve(__dirname, 'src/index.ts'),
    output: {
      file: path.resolve(__dirname, 'dist/index.js'),
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
      copy({
        targets: [
          { src: 'src/partials/*', dest: 'dist/partials' },
        ]
    })
    ],
  });
};

export default config;
