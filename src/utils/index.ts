import {readFileSync} from 'node:fs';
import process from 'node:process';
import {normalizePath} from 'vite';

export function readJSON(path: string): unknown {
  try {
    const data = readFileSync(path);
    return JSON.parse(data.toString());
  } catch {
    //
  }

  return false;
}

export const cwd = normalizePath(process.cwd());

export * from './game';
export * from './build';
