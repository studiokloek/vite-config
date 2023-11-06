import process from 'node:process';
import {normalizePath} from 'vite';

export const cwd = normalizePath(process.cwd());
