import {TypedFlags} from 'meow';
import {build, createServer} from 'vite';
import {defineKloekViteConfig} from './config';

export async function kloekDevelopment(): Promise<void> {
  const config = await defineKloekViteConfig({
    command: 'serve',
    mode: 'development',
  });

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
      alias: string;
      default: true;
    };
    base: {
      type: 'string';
      alias: string;
      default: string;
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

  await build({
    configFile: false,
    ...config,
  });
}
