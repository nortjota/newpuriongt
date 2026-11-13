// Sobe um PostgreSQL real e aplica shim + migrations antes da suíte.
import { start, stop } from "../../scripts/test-db.mjs";

export default function setup() {
  start();
  return () => stop();
}
