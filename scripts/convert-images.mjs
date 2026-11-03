import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const ORIGINALS = path.join(ROOT, "assets-originais");

// [srcRelativeToPublic, category, slug, maxWidth]
const BANNER_WIDTH = 2400;
const DEFAULT_WIDTH = 1200;

const MAP = [
  // produto
  ["2A — FRENTE.png", "produto", "produto-frente", DEFAULT_WIDTH],
  ["2C — DETALHE.png", "produto", "produto-detalhe", DEFAULT_WIDTH],
  ["2D — FRASCO + CAIXA.png", "produto", "produto-frasco-caixa", DEFAULT_WIDTH],
  ["2E — CAIXA ABERTA.png", "produto", "produto-caixa-aberta", DEFAULT_WIDTH],
  // kits
  ["3A — KIT 2.png", "kits", "kit-2", DEFAULT_WIDTH],
  ["3B — KIT 3.png", "kits", "kit-3", DEFAULT_WIDTH],
  // piramide
  ["4A — SAÍDA.png", "piramide", "piramide-saida", DEFAULT_WIDTH],
  ["4B — CORPO.png", "piramide", "piramide-corpo", DEFAULT_WIDTH],
  ["4C — FUNDO.png", "piramide", "piramide-fundo", DEFAULT_WIDTH],
  // cenas
  ["Cena interior carro.png", "cenas", "cena-interior-carro", DEFAULT_WIDTH],
  ["Cena laboratorio.png", "cenas", "cena-laboratorio", DEFAULT_WIDTH],
  ["CENA mesa escura de expedição.png", "cenas", "cena-mesa-expedicao", DEFAULT_WIDTH],
  ["CENA estrada vazia à noite.png", "cenas", "cena-estrada-noite", BANNER_WIDTH],
  ["CENA estrada vazia à noite mobile.png", "cenas", "cena-estrada-noite-mobile", DEFAULT_WIDTH],
  // slideshow
  ["slideshow 1.png", "slideshow", "slideshow-1", BANNER_WIDTH],
  ["slideshow 1 mobile.png", "slideshow", "slideshow-1-mobile", DEFAULT_WIDTH],
  ["slideshow 2.png", "slideshow", "slideshow-2", BANNER_WIDTH],
  ["slideshow 2 mobile.png", "slideshow", "slideshow-2-mobile", DEFAULT_WIDTH],
  // comparativo
  ["cheirinho comum.png", "comparativo", "cheirinho-comum", DEFAULT_WIDTH],
  ["purion certo.png", "comparativo", "purion-certo", DEFAULT_WIDTH],
  // reserva (não usar ainda, mas ainda assim organizar/otimizar)
  ["Foto somente de um carro.png", "reserva", "foto-somente-carro", DEFAULT_WIDTH],
  ["Frasco realista, carro atrás.png", "reserva", "frasco-realista-carro-atras", DEFAULT_WIDTH],
  ["2A - FRENTE.png", "reserva", "produto-frente-alt-nao-usar", DEFAULT_WIDTH],
];

const results = [];

for (const [src, category, slug, maxWidth] of MAP) {
  const srcPath = path.join(PUBLIC, src);
  if (!fs.existsSync(srcPath)) {
    results.push({ src, status: "MISSING" });
    continue;
  }
  const origDir = path.join(ORIGINALS, category);
  fs.mkdirSync(origDir, { recursive: true });
  fs.copyFileSync(srcPath, path.join(origDir, src));

  const outDir = path.join(PUBLIC, "images", category);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${slug}.webp`);

  const img = sharp(srcPath).rotate();
  const meta = await img.metadata();
  const width = meta.width && meta.width > maxWidth ? maxWidth : undefined;

  await img
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outPath);

  const outSize = fs.statSync(outPath).size;
  fs.rmSync(srcPath);
  results.push({ src, out: `images/${category}/${slug}.webp`, outKB: Math.round(outSize / 1024), status: "OK" });
}

console.log(JSON.stringify(results, null, 2));
