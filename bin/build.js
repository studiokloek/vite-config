#!/usr/bin/env node
import meow from 'meow';
import {kloekBuild} from '../dist/index.js';

const cli = meow(
  `
	Usage
	  $ kloek-build 

    Options:
      -b, --base PATH           set the base path
      
      Other options:
      -m, --mode MODE           set the mode in which vite should run
      -e, --empty-out-dir       empty output dir before building
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
      mode: {
        type: 'string',
        alias: 'm',
      },
    },
  },
);

await kloekBuild(cli.flags);
