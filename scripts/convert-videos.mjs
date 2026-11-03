import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
// NOTA: "public/Videos" (pasta original) e "public/videos" (pasta de saída)
// são o MESMO diretório físico no Windows (NTFS é case-insensitive) — por
// isso a fonte agora é assets-originais/videos (já copiada ali) e a limpeza
// remove arquivos por nome individual, nunca o diretório inteiro.
const SRC_DIR = path.join(ROOT, "assets-originais", "videos");
const ORIG_DIR = SRC_DIR;
const OUT_VIDEO_DIR = path.join(ROOT, "public", "videos");
const OUT_POSTER_DIR = path.join(ROOT, "public", "images", "videos");

fs.mkdirSync(ORIG_DIR, { recursive: true });
fs.mkdirSync(OUT_VIDEO_DIR, { recursive: true });
fs.mkdirSync(OUT_POSTER_DIR, { recursive: true });

// [srcFilename, slug, categoria]
const MAP = [
  ["Comercial.mp4", "comercial", "parceiro"],
  ["Depois de lavar o carro.mp4", "depois-de-lavar-o-carro", "cliente"],
  ["Feedback cliente.mp4", "feedback-cliente", "cliente"],
  ["Feedback.mp4", "feedback", "cliente"],
  ["feedback2.mp4", "feedback-2", "cliente"],
  ["Instagram.mp4", "instagram", "parceiro"],
  ["Purion - Dia dos Pais 4.mov", "dia-dos-pais", "parceiro"],
  ["UGC ASMR Homem.mp4", "ugc-asmr-homem", "parceiro"],
  ["UGC ASMR Mulher.mp4", "ugc-asmr-mulher", "parceiro"],
  ["UGC IA.mp4", "ugc-ia", "parceiro"],
  ["Video UGC jujubinha.mp4", "ugc-jujubinha", "parceiro"],
  ["unboxing.mov", "unboxing", "cliente"],
];

const results = [];

for (const [src, slug, categoria] of MAP) {
  const srcPath = path.join(SRC_DIR, src);
  if (!fs.existsSync(srcPath)) {
    results.push({ src, status: "MISSING" });
    continue;
  }

  const ext = path.extname(src).toLowerCase();
  const outVideoPath = path.join(OUT_VIDEO_DIR, `${slug}.mp4`);

  if (ext === ".mov") {
    execFileSync(ffmpegPath, [
      "-y", "-i", srcPath,
      "-c:v", "libx264", "-preset", "medium", "-crf", "23",
      "-c:a", "aac", "-b:a", "128k",
      "-movflags", "+faststart",
      outVideoPath,
    ], { stdio: "inherit" });
  } else {
    fs.copyFileSync(srcPath, outVideoPath);
  }

  const posterPngPath = path.join(OUT_POSTER_DIR, `${slug}-poster.png`);
  execFileSync(ffmpegPath, [
    "-y", "-i", outVideoPath,
    "-vframes", "1", "-ss", "00:00:00.5",
    posterPngPath,
  ], { stdio: "inherit" });

  const posterWebpPath = path.join(OUT_POSTER_DIR, `${slug}-poster.webp`);
  await sharp(posterPngPath).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80 }).toFile(posterWebpPath);
  fs.rmSync(posterPngPath);

  const outSize = fs.statSync(outVideoPath).size;
  results.push({
    src,
    video: `videos/${slug}.mp4`,
    videoMB: +(outSize / 1048576).toFixed(1),
    poster: `images/videos/${slug}-poster.webp`,
    categoria,
    status: "OK",
  });
}

fs.writeFileSync(path.join(ROOT, "scripts", "videos-manifest.json"), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
