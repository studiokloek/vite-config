#!/usr/bin/env node
import meow from 'meow';
import {kloekDevelopment} from '../dist/index.js';

const cli = meow(
  `
	Usage
	  $ kloek-development 

    Options:
      -m, --mode MODE           set the mode in which vite should run
`,
  {
    importMeta: import.meta,
    flags: {
      mode: {
        type: 'string',
        alias: 'm',
      },
    },
  },
);

await kloekDevelopment(cli.flags);
