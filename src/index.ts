import {build, createServer} from 'vite';
import {defineKloekViteConfig} from './config';

export async function kloekDevelopment(): Promise<void> {
  const config = await defineKloekViteConfig({
    command: 'serve',
    mode: 'development',
  });

  const server = await createServer({
    configFile: false,
    envFile: false,
    ...config,
  });

  await server.listen();
  server.printUrls();
}

export async function kloekBuild(): Promise<void> {
  const config = await defineKloekViteConfig({
    command: 'build',
    mode: 'production',
  });

  await build({
    configFile: false,
    envFile: false,
    ...config,
  });
}
