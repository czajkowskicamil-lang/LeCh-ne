// One-off script: remove navy background from the logo JPEG,
// trim the whitespace, and produce a clean transparent PNG.
//
// Run: node scripts/extract-logo.mjs

import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

const input = 'public/logo-source.jpg';
const output = 'public/logo.png';

// Load image
const img = sharp(input);
const meta = await img.metadata();
const raw = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { data, info } = raw;
const { width, height, channels } = info;

// We treat any pixel close to the navy (#0A1F4F) as background.
// Also catch any dark pixel (low luminosity) which is the border/frame.
// Keep gold, white, and mid-tones.
const out = Buffer.from(data);

function isBackground(r, g, b) {
  // Luminosity check — navy is dark overall
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  if (lum < 60 && b > r && b > g) return true; // dark blue
  // Tight match on navy with tolerance
  const dr = r - 10, dg = g - 31, db = b - 79;
  const dist = Math.sqrt(dr * dr + dg * dg + db * db);
  if (dist < 50) return true;
  return false;
}

for (let i = 0; i < data.length; i += channels) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  if (isBackground(r, g, b)) {
    out[i + 3] = 0; // alpha to 0
  }
}

// Save
await sharp(out, { raw: { width, height, channels } })
  .png({ compressionLevel: 9 })
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 0 })
  .toFile(output);

console.log(`✓ Wrote ${output} (${width}×${height} → trimmed)`);
