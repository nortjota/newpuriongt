import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC_DIR = path.join(ROOT, "public", "Feedbacks");
const ORIG_DIR = path.join(ROOT, "assets-originais", "feedbacks");
const OUT_DIR = path.join(ROOT, "public", "images", "feedbacks");

fs.mkdirSync(ORIG_DIR, { recursive: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const files = fs.readdirSync(SRC_DIR).sort();
const results = [];
let n = 1;

for (const file of files) {
  const srcPath = path.join(SRC_DIR, file);
  if (fs.statSync(srcPath).isDirectory()) continue;

  fs.copyFileSync(srcPath, path.join(ORIG_DIR, file));

  const slug = `feedback-${String(n).padStart(2, "0")}`;
  const outPath = path.join(OUT_DIR, `${slug}.webp`);

  const img = sharp(srcPath).rotate();
  const meta = await img.metadata();
  const width = meta.width && meta.width > 1200 ? 1200 : undefined;

  await img.resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(outPath);

  const outSize = fs.statSync(outPath).size;
  results.push({ src: file, out: `images/feedbacks/${slug}.webp`, outKB: Math.round(outSize / 1024) });
  n++;
}

fs.rmSync(SRC_DIR, { recursive: true, force: true });

console.log(JSON.stringify(results, null, 2));
