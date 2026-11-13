// Postgres REAL para os testes E2E do Private Access (mesmo script da
// integração, chamado como processo). A política piloto é ativada só neste
// banco de teste.
import { execFileSync } from "node:child_process";
import { Client } from "pg";

const script = "scripts/test-db.mjs";

export default async function globalSetup() {
  const url = execFileSync(process.execPath, [script, "start"], { encoding: "utf8" }).trim().split("\n").pop()!;
  const c = new Client({ connectionString: url });
  await c.connect();
  await c.query(`UPDATE beneficio_politicas SET ativo = true WHERE codigo = 'PILOTO_PRESENTE_15'`);
  await c.query(`UPDATE indicacao_programas SET ativo = true, max_convites_por_ip_dia = 100 WHERE codigo = 'PILOTO_INDICACAO_10'`);
  await c.end();
  return () => {
    execFileSync(process.execPath, [script, "stop"]);
  };
}
