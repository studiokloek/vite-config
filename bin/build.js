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
      -s, --sourcemaps          should we create source maps
      -i, --inline-sourcemaps   inline source maps
      -z, --create-zip          create zip file from build
`,
  {
    importMeta: import.meta,
    flags: {
      emptyOutDir: {
        type: 'boolean',
        shortFlag: 'e',
        default: true,
      },
      createZip: {
        type: 'boolean',
        shortFlag: 'z',
        default: false,
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
      base: {
        type: 'string',
        shortFlag: 'b',
        default: '/',
      },
      mode: {
        type: 'string',
        shortFlag: 'm',
      },
    },
  },
);

await kloekBuild(cli.flags);
