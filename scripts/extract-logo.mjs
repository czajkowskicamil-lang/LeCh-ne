// Extract the gold oak logo from the navy-background source with SOFT alpha
// (anti-aliased edges) so it stays crisp at any zoom level.
//
// Previous version used a hard binary threshold → jagged edges = visible
// pixelation when the browser upscales on zoom / retina.
//
// Run: node scripts/extract-logo.mjs

import sharp from 'sharp';

const input = 'assets/logo-source.jpg';
const output = 'public/logo.png';

// Navy reference color (background to remove)
const NAVY = { r: 10, g: 31, b: 79 };

// Distance thresholds (in color space)
// Distance < TH_LOW  → fully transparent (pure background)
// Distance > TH_HIGH → fully opaque (pure foreground)
// Between            → linearly interpolated alpha (anti-aliased edge)
const TH_LOW = 40;
const TH_HIGH = 95;

const raw = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { data, info } = raw;
const { width, height, channels } = info;

const out = Buffer.from(data);

for (let i = 0; i < data.length; i += channels) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];

  // Distance in RGB space from navy
  const dr = r - NAVY.r;
  const dg = g - NAVY.g;
  const db = b - NAVY.b;
  const dist = Math.sqrt(dr * dr + dg * dg + db * db);

  // Also weight by luminosity: very dark pixels are almost certainly background
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const isDarkAndBlue = lum < 55 && b > r && b > g;

  let alpha;
  if (isDarkAndBlue && dist < TH_HIGH) {
    alpha = 0;
  } else if (dist < TH_LOW) {
    alpha = 0;
  } else if (dist > TH_HIGH) {
    alpha = 255;
  } else {
    // Linear ramp for smooth anti-aliased edge
    const t = (dist - TH_LOW) / (TH_HIGH - TH_LOW);
    alpha = Math.round(t * 255);
  }

  out[i + 3] = alpha;

  // Bonus: for semi-transparent pixels at the edge, nudge the color toward the
  // foreground to prevent a navy halo when displayed over light backgrounds.
  if (alpha > 0 && alpha < 255) {
    // Subtract a weighted amount of navy so edges blend cleanly with any bg.
    const pull = (255 - alpha) / 255;
    out[i]     = Math.min(255, Math.max(0, r + (r - NAVY.r) * pull * 0.4));
    out[i + 1] = Math.min(255, Math.max(0, g + (g - NAVY.g) * pull * 0.4));
    out[i + 2] = Math.min(255, Math.max(0, b + (b - NAVY.b) * pull * 0.4));
  }
}

// Save with max PNG compression + trim transparent borders tight.
await sharp(out, { raw: { width, height, channels } })
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 0 })
  .png({ compressionLevel: 9, palette: false })
  .toFile(output);

const outMeta = await sharp(output).metadata();
console.log(`✓ ${output} — ${outMeta.width}×${outMeta.height} (soft-alpha edges)`);
