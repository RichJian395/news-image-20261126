// news-image-20261126 entrypoint (Node 22, standard library only, no network).
//
// The front page itself lives in entry.png next to this file — it was rendered
// ahead of time by render.py, so this program does not draw anything. Its job
// is only to place that exact image where the grader looks for it:
//   $MAKEFUN_OUTPUT_DIR/entry.png, or /output/entry.png when the variable
//   is not set. The output is a byte-for-byte copy of entry.png, every run,
//   because the image is read and written as raw bytes with nothing added.
//
// Usage outside the grader's container:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// The eight bytes every PNG file starts with. Checked before anything is
// written, so a damaged or misplaced source fails loudly instead of
// silently producing an entry the gate would reject.
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = resolve(here, 'entry.png');
const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const targetPath = resolve(targetDir, 'entry.png');

if (!existsSync(sourcePath)) {
  throw new Error(`entry.png not found next to main.ts (looked in ${here})`);
}

const picture = readFileSync(sourcePath);

const headerOk = PNG_MAGIC.every((magicByte, index) => picture[index] === magicByte);
if (!headerOk) {
  throw new Error('entry.png does not start with the PNG signature; refusing to copy it');
}

mkdirSync(targetDir, { recursive: true });
writeFileSync(targetPath, picture);

console.log(`wrote ${picture.length} bytes to ${targetPath}`);
