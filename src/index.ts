import {type TypedFlags} from 'meow';
import {build, createServer, type LogLevel} from 'vite';
import {defineKloekViteConfig} from './config';
import {addBuildFolderToZip, getPackageConfig} from './utils';

export async function kloekDevelopment(
  flags: TypedFlags<{
    mode: {
      type: 'string';
      shortFlag: string;
      default?: string;
    };
    fullReloadSvelte: {
      type: 'boolean';
      shortFlag: string;
      default: true;
    };
  }>,
): Promise<void> {
  const config = await defineKloekViteConfig(
    {
      command: 'serve',
      mode: 'development',
    },
    {
      fullReloadSvelte: flags.fullReloadSvelte,
    },
  );

  // Different mode
  if (typeof flags.mode === 'string') {
    config.mode = flags.mode;
  }

  const server = await createServer({
    configFile: false,
    ...config,
  });

  await server.listen();
  server.printUrls();
}

export async function kloekBuild(
  flags: TypedFlags<{
    base: {
      type: 'string';
      shortFlag: string;
      default: string;
    };
    mode: {
      type: 'string';
      shortFlag: string;
      default?: string;
    };
    logLevel: {
      type: 'string';
      shortFlag: string;
      default?: string;
    };
    emptyOutDir: {
      type: 'boolean';
      shortFlag: string;
      default: true;
    };
    sourcemaps: {
      type: 'boolean';
      shortFlag: string;
      default: false;
    };
    inlineSourcemaps: {
      type: 'boolean';
      shortFlag: string;
      default: false;
    };
    createZip: {
      type: 'boolean';
      shortFlag: string;
      default: false;
    };
  }>,
): Promise<void> {
  const config = await defineKloekViteConfig({
    command: 'build',
    mode: 'production',
  });

  // Empty out the Output dir before building?
  if (flags.emptyOutDir !== undefined) {
    config.build = {
      ...config.build,
      emptyOutDir: flags.emptyOutDir,
    };
  }

  // Create sourcemaps?
  if (flags.sourcemaps !== undefined) {
    config.build = {
      ...config.build,
      sourcemap: flags.sourcemaps ? (flags.inlineSourcemaps ? 'inline' : true) : false,
    };
  }

  // Different base path
  if (typeof flags.base === 'string') {
    config.base = flags.base;
  }

  // Different mode
  if (typeof flags.mode === 'string') {
    config.mode = flags.mode;
  }

  // Different mode
  config.logLevel = flags.logLevel as LogLevel | undefined;

  await build({
    configFile: false,
    ...config,
  });

  // Maken we een zip aan?
  if (flags.createZip || getPackageConfig().vite.build.createZip) {
    await addBuildFolderToZip();
  }
}
