// news-image-20261121: "THE WORLD" front page for Saturday 21 November 2026.
//
// The front page is rendered at build time into entry.png (1024x1024, under
// 1 MiB). This program only copies that file to the grader's output
// directory, so both runs write byte-identical files and the program needs
// no network at all.
//
// Run it locally:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const source = new URL('./entry.png', import.meta.url);
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outDir, 'entry.png');

// Validate the source is really a PNG before copying: its first 8 bytes
// must equal the PNG magic bytes 89 50 4E 47 0D 0A 1A 0A.
const header = readFileSync(source).subarray(0, 8);
const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!header.equals(pngMagic)) {
  throw new Error('entry.png is not a valid PNG file (bad PNG signature)');
}

// Create the output directory if it is missing, so the copy works even
// when the grader hands us a fresh path.
mkdirSync(outDir, { recursive: true });

copyFileSync(source, target);

// Verify the copy is complete: its size must equal the source file's size.
const bytes = statSync(target).size;
const sourceBytes = statSync(source).size;
if (bytes !== sourceBytes) {
  throw new Error(`copied entry.png is ${bytes} bytes, expected ${sourceBytes} bytes`);
}

// The gate only accepts a whole image of at most 1 MiB: refuse to report
// success if the copy came out empty or over the limit.
if (bytes === 0 || bytes > 1048576) {
  throw new Error(`entry.png is ${bytes} bytes, outside the 1..1048576 range`);
}

console.log(`wrote ${target} (${bytes} bytes)`);
