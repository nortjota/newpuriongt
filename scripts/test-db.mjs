// Postgres REAL e efêmero para testes de integração (não é mock): initdb em
// diretório temporário, aplica o shim do ambiente Supabase + as migrations
// de db/migrations. Uso: node scripts/test-db.mjs start|stop
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, chmodSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const PORT = Number(process.env.TEST_PG_PORT || 54329);
export const DATABASE_URL = `postgres://postgres@127.0.0.1:${PORT}/purion_test`;
const DIR = join(tmpdir(), `purion-test-pg-${PORT}`);
const DATA = join(DIR, "data");

function findBin(name) {
  if (process.env.PG_BIN) return join(process.env.PG_BIN, name);
  for (const v of ["17", "16", "15", "14"]) {
    const p = `/usr/lib/postgresql/${v}/bin/${name}`;
    if (existsSync(p)) return p;
  }
  return name;
}

const asRoot = typeof process.getuid === "function" && process.getuid() === 0;
function run(bin, args, opts = {}) {
  const cmd = asRoot ? "runuser" : bin;
  const full = asRoot ? ["-u", "postgres", "--", bin, ...args] : args;
  return execFileSync(cmd, full, { stdio: "pipe", ...opts }).toString();
}

function psql(sql, db = "purion_test") {
  const r = spawnSync(findBin("psql"), ["-v", "ON_ERROR_STOP=1", "-q", "-h", "127.0.0.1", "-p", String(PORT), "-U", "postgres", "-d", db], {
    input: sql,
    encoding: "utf8",
  });
  if (r.status !== 0) throw new Error(r.stderr || r.stdout);
}

export function stop() {
  if (existsSync(join(DATA, "postmaster.pid"))) {
    try {
      run(findBin("pg_ctl"), ["-D", DATA, "-m", "immediate", "stop"]);
    } catch {
      /* já parado */
    }
  }
  rmSync(DIR, { recursive: true, force: true });
}

export function start() {
  stop();
  mkdirSync(DIR, { recursive: true });
  chmodSync(DIR, 0o777);
  run(findBin("initdb"), ["-D", DATA, "-U", "postgres", "--auth=trust", "-E", "UTF8", "--locale=C"]);
  writeFileSync(join(DIR, "log.txt"), "");
  chmodSync(join(DIR, "log.txt"), 0o666);
  run(findBin("pg_ctl"), ["-D", DATA, "-l", join(DIR, "log.txt"), "-o", `-p ${PORT} -k ${DIR} -c listen_addresses=127.0.0.1 -c max_connections=100`, "-w", "start"]);
  psql("CREATE DATABASE purion_test;", "postgres");
  psql(readFileSync(join(ROOT, "tests/db/supabase-shim.sql"), "utf8"));
  for (const f of readdirSync(join(ROOT, "db/migrations")).filter((f) => f.endsWith(".sql")).sort()) {
    psql(readFileSync(join(ROOT, "db/migrations", f), "utf8"));
  }
  return DATABASE_URL;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const cmd = process.argv[2];
  if (cmd === "start") console.log(start());
  else if (cmd === "stop") stop();
  else console.log("uso: node scripts/test-db.mjs start|stop");
}
