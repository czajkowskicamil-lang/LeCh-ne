// Process source portrait photos: trim black bars, resize, optimize,
// produce JPEG + WebP for <picture> srcset.
//
// Run: node scripts/process-photo.mjs

import sharp from 'sharp';

const sources = [
  { src: 'assets/camil-hero-source.png', slug: 'camil' },
  { src: 'assets/camil-running-source.jpeg', slug: 'camil-running' },
];

const widths = [800, 1200, 1600];

for (const { src, slug } of sources) {
  const trimmed = await sharp(src)
    .trim({ background: { r: 0, g: 0, b: 0 }, threshold: 10 })
    .toBuffer();

  const meta = await sharp(trimmed).metadata();
  console.log(`${slug}: trimmed ${meta.width}×${meta.height}`);

  for (const w of widths) {
    await sharp(trimmed)
      .resize({ width: w, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(`public/${slug}-${w}.jpg`);
    await sharp(trimmed)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(`public/${slug}-${w}.webp`);
  }

  await sharp(trimmed)
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(`public/${slug}.jpg`);
}

console.log('✓ All photos written to public/');
