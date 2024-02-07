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
      -l, --log-level LEVEL     sets the log level for vite (info | warn | error | silent)
      -e, --empty-out-dir       empty output dir before building
      -s, --sourcemaps          should we create source maps
      -i, --inline-sourcemaps   inline source maps
      -z, --create-zip          create zip file from build
`,
  {
    importMeta: import.meta,
    flags: {
      base: {
        type: 'string',
        shortFlag: 'b',
        default: '/',
      },
      mode: {
        type: 'string',
        shortFlag: 'm',
      },
      logLevel: {
        type: 'string',
        shortFlag: 'l',
        default: 'info',
      },
      emptyOutDir: {
        type: 'boolean',
        shortFlag: 'e',
        default: true,
      },
      sourcemaps: {
        type: 'boolean',
        shortFlag: 's',
        default: false,
      },
      inlineSourcemaps: {
        type: 'boolean',
        shortFlag: 'i',
        default: false,
      },
      createZip: {
        type: 'boolean',
        shortFlag: 'z',
        default: false,
      },
    },
  },
);

await kloekBuild(cli.flags);
