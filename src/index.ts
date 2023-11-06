import {type TypedFlags} from 'meow';
import {build, createServer} from 'vite';
import {defineKloekViteConfig} from './config';
import { addBuildFolderToZip, getPackageConfig } from './utils';

export async function kloekDevelopment(
  flags: TypedFlags<{
    mode: {
      type: 'string';
      shortFlag: string;
      default?: string;
    };
  }>,
): Promise<void> {
  const config = await defineKloekViteConfig({
    command: 'serve',
    mode: 'development',
  });

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
    emptyOutDir: {
      type: 'boolean';
      shortFlag: string;
      default: true;
    };
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

  // Different base path
  if (typeof flags.base === 'string') {
    config.base = flags.base;
  }

  // Different mode
  if (typeof flags.mode === 'string') {
    config.mode = flags.mode;
  }

  await build({
    configFile: false,
    ...config,
  });


  // maken we een zip aan?
  if (getPackageConfig().vite.build.createZip) {
    await addBuildFolderToZip();
  }
}
