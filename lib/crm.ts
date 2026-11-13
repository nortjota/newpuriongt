// Integração com o PURION OS (CRM).
// O site é público e não fala direto com o banco para gravar: manda os eventos
// para a API do CRM, que valida e grava com o tenant da PURION.
// Se o CRM estiver fora do ar, nada quebra no site — os eventos só deixam de ser registrados.

import { getTracking } from "./tracking";

export const CRM_URL = (process.env.NEXT_PUBLIC_CRM_URL || "https://purion-os.vercel.app").replace(/\/$/, "");
const ENDPOINT = `${CRM_URL}/api/site/evento`;

async function enviar(corpo: Record<string, unknown>): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
      keepalive: true, // conclui mesmo se a pessoa sair da página logo depois
    });
    return res.ok ? ((await res.json()) as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Lead da lista (modal de e-mail): vai para Leads do Site no CRM com a origem da visita. */
export async function enviarLead(email: string, pagina = "home"): Promise<boolean> {
  const t = getTracking();
  const r = await enviar({ tipo: "lead", email, pagina, utm: t.utm, ref: t.ref ?? undefined });
  return !!r?.ok;
}

/** Clique num link de afiliado: registra no CRM e diz se o código existe. */
export async function registrarCliqueAfiliado(codigo: string): Promise<{ valido: boolean; nome?: string }> {
  const t = getTracking();
  const r = await enviar({ tipo: "clique_afiliado", codigo, utm: t.utm, pagina: typeof location !== "undefined" ? location.href : undefined });
  return { valido: !!r?.valido, nome: typeof r?.nome === "string" ? r.nome : undefined };
}

/** Validação no servidor (rota /[afiliado]): o código existe e está ativo no CRM? */
export async function afiliadoValidoNoCrm(codigo: string): Promise<{ valido: boolean; nome?: string }> {
  try {
    const res = await fetch(`${ENDPOINT}?afiliado=${encodeURIComponent(codigo)}`, { next: { revalidate: 300 } });
    if (!res.ok) return { valido: false };
    const j = (await res.json()) as { valido?: boolean; nome?: string };
    return { valido: !!j.valido, nome: j.nome };
  } catch {
    return { valido: false };
  }
}
