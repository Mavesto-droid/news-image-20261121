// news-image-20261121: "THE WORLD" front page for Saturday 21 November 2026.
//
// The front page is rendered at build time into entry.png (1024x1024, under
// 1 MiB). This program only copies that file to the grader's output
// directory, so both runs write byte-identical files and the program needs
// no network at all.
//
// Run it locally:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const source = new URL('./entry.png', import.meta.url);
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outDir, 'entry.png');

copyFileSync(source, target);

// The gate only accepts a whole image of at most 1 MiB: refuse to report
// success if the copy came out empty or over the limit.
const bytes = statSync(target).size;
if (bytes === 0 || bytes > 1048576) {
  throw new Error(`entry.png is ${bytes} bytes, outside the 1..1048576 range`);
}

console.log(`wrote ${target} (${bytes} bytes)`);
