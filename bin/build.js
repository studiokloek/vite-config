#!/usr/bin/env node
import meow from 'meow';
import {kloekBuild} from '../dist/index.js';

const cli = meow(
  `
	Usage
	  $ kloek-build 

    Options:
      --path PATH           set the base path

    Other options:
      -e, --empty-out-dir   empty output dir before building
`,
  {
    importMeta: import.meta,
    flags: {
      emptyOutDir: {
        type: 'boolean',
        alias: 'e',
        default: true,
      },
      base: {
        type: 'string',
        alias: 'b',
        default: '/',
      },
    },
  },
);

await kloekBuild(cli.flags);
