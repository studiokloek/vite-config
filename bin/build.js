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
