"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Check, KeyRound, LogOut } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/content/whatsapp";
import { CONSENT_TEXTS, TRANSACTIONAL_NOTE } from "@/lib/private/consent-texts";
import { GiftButton } from "@/components/gift/GiftButton";
import { INELIGIBLE_REASON, brl, dateBR, postJson, usePrivateData, type Panel } from "./usePrivateData";

type Activation = { status: "idle" } | { status: "activating" } | { status: "error"; code: string; message: string };

// Extrai o token de um link colado (…/private-access#t=XXXX) ou do próprio código.
export function extractToken(input: string): string {
  const v = input.trim();
  const m = v.match(/[#?&]t=([A-Za-z0-9_-]{43})/);
  return m ? m[1] : v;
}

const card = "rounded-[var(--radius-lg)] border border-white/10 bg-ink-900 p-6 sm:p-8";

export default function PrivateAccessPanel() {
  const { data, reload, setData } = usePrivateData(false);
  const [activation, setActivation] = useState<Activation>({ status: "idle" });
  const [manual, setManual] = useState("");
  const started = useRef(false);
  const inputId = useId();

  async function activate(token: string) {
    setActivation({ status: "activating" });
    try {
      const r = await postJson("/api/private/activate", { token });
      if (r.status === 503) {
        setActivation({ status: "idle" });
        setData({ state: "unavailable" });
        return;
      }
      if (!r.ok) {
        setActivation({ status: "error", code: r.json.code ?? "erro", message: r.json.message ?? "Não foi possível ativar agora." });
        await reload();
        return;
      }
      setActivation({ status: "idle" });
      await reload();
    } catch {
      setActivation({ status: "error", code: "rede", message: "Sem conexão. Verifique sua internet e tente de novo." });
    }
  }

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    // O token chega no fragmento (#t=…), que não vai para o servidor nem para
    // logs. Removemos da barra de endereço antes de qualquer coisa.
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const t = hash.get("t");
    if (t) {
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
      // Ativação única a partir de dado externo (fragmento da URL → API).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void activate(t);
    } else {
      void reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onManual(e: FormEvent) {
    e.preventDefault();
    const t = extractToken(manual);
    if (t) void activate(t);
  }

  if (data.state === "loading" || activation.status === "activating") {
    return (
      <div className={card} role="status" aria-live="polite">
        <div className="flex flex-col gap-3" aria-hidden>
          <div className="h-5 w-48 animate-pulse rounded-full bg-white/10" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded-full bg-white/[0.07]" />
        </div>
        <span className="sr-only">{activation.status === "activating" ? "Validando seu acesso…" : "Carregando…"}</span>
      </div>
    );
  }

  if (data.state === "unavailable" || data.state === "error") {
    return (
      <div className={card} role="alert">
        <p className="m-0 flex items-center gap-2 font-display text-[20px] font-medium text-paper-0">
          <AlertCircle size={18} aria-hidden /> Private Access indisponível no momento.
        </p>
        <p className="m-0 mt-2 text-[15px] text-paper-0/60">Tente novamente mais tarde. Seu benefício não é afetado.</p>
        {data.state === "error" && (
          <GiftButton variant="ghost" className="mt-4" onClick={() => void reload()}>
            Tentar novamente
          </GiftButton>
        )}
      </div>
    );
  }

  if (data.state === "ready") return <Identified panel={data.panel} onChange={reload} />;

  // Anônimo: ativação por link/QR ou código colado.
  return (
    <div className={card}>
      <h2 className="m-0 flex items-center gap-2.5 font-display text-[22px] font-medium tracking-[-0.02em] text-paper-0">
        <KeyRound size={18} aria-hidden /> Ative seu acesso
      </h2>
      <p className="m-0 mt-2 text-[15px] leading-relaxed text-paper-0/60">
        Use o QR Code ou o link individual que você recebeu da PURION GT. Se preferir, cole o link aqui.
      </p>
      {activation.status === "error" && (
        <p role="alert" className="m-0 mt-5 rounded-[var(--radius-sm)] border border-red-300/30 bg-red-400/[0.06] p-4 text-[14px] text-paper-0/85" data-code={activation.code}>
          {activation.message}
        </p>
      )}
      <form onSubmit={onManual} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label htmlFor={inputId} className="sr-only">
          Link ou código de acesso
        </label>
        <input
          id={inputId}
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder="Cole o link ou o código de acesso"
          className="min-h-12 flex-1 rounded-[var(--radius-pill)] border border-white/12 bg-white/[0.04] px-5 text-[15px] text-paper-0 placeholder:text-paper-0/35 focus:border-[var(--gift-accent)]/70 focus:outline-none"
        />
        <GiftButton type="submit" variant="accent" disabled={!manual.trim()}>
          Ativar acesso
        </GiftButton>
      </form>
      <p className="m-0 mt-4 text-[13px] text-paper-0/45">
        Não recebeu ou perdeu o link?{" "}
        <a href={`${WHATSAPP_URL}?text=${encodeURIComponent("Olá! Quero receber meu acesso ao PURION Private Access.")}`} target="_blank" rel="noreferrer" className="underline underline-offset-4">
          Fale com a gente no WhatsApp
        </a>
        . O atendimento não depende de cadastro promocional.
      </p>
    </div>
  );
}

function Identified({ panel, onChange }: { panel: Panel; onChange: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const pol = panel.politicas[0];
  const v = pol ? panel.vouchers.find((x) => x.politica === pol.codigo) : undefined;
  const { estado, motivo } = panel.estado;

  async function issue() {
    if (!pol) return;
    setBusy(true);
    setMsg(null);
    const r = await postJson("/api/private/benefits/issue", { politica: pol.codigo }).catch(() => null);
    setBusy(false);
    if (!r || !r.ok) setMsg(r?.json?.message ?? "Não foi possível ativar agora.");
    await onChange();
  }

  async function logout() {
    await postJson("/api/private/logout", {}).catch(() => null);
    window.location.reload();
  }

  const status: Record<string, { title: string; text: string; tone: "on" | "off" }> = {
    pode_ativar: { title: "Seu benefício está pronto", text: pol ? `${pol.nome}. Ative para gerar seu código pessoal.` : "", tone: "on" },
    disponivel: { title: "Benefício disponível", text: v ? `${brl(v.valor)} · válido até ${dateBR(v.expira_em)}.` : "", tone: "on" },
    reservado: { title: "Checkout em andamento", text: "Seu benefício está reservado para um pedido em aberto.", tone: "on" },
    utilizado: { title: "Benefício já utilizado", text: "Obrigado por presentear com PURION GT.", tone: "off" },
    expirado: { title: "Benefício expirado", text: "O prazo deste benefício terminou.", tone: "off" },
    cancelado: { title: "Benefício cancelado", text: "Este benefício foi cancelado após estorno do pedido.", tone: "off" },
    nao_elegivel: { title: "Benefício não disponível para você", text: INELIGIBLE_REASON[motivo ?? ""] ?? "Este benefício não se aplica ao seu cadastro.", tone: "off" },
    sem_beneficio_ativo: { title: "Nenhum benefício ativo agora", text: "Avisaremos quando houver um novo benefício para você.", tone: "off" },
  };
  const st = status[estado];

  return (
    <div className="flex flex-col gap-4">
      <div className={card} data-state={estado}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[var(--ls-caps)] text-paper-0/50">Cliente identificado</span>
            <p className="m-0 font-display text-[24px] font-medium tracking-[-0.02em] text-paper-0">
              Olá{panel.cliente.primeiroNome ? `, ${panel.cliente.primeiroNome}` : ""}.
            </p>
          </div>
          <button type="button" onClick={() => void logout()} className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[13px] text-paper-0/60 hover:text-paper-0 focus-visible:outline-2 focus-visible:outline-[var(--gift-accent)]">
            <LogOut size={14} aria-hidden /> Sair
          </button>
        </div>

        <div className="mt-6 flex gap-3 border-t border-white/10 pt-6" aria-live="polite">
          <span aria-hidden className={`mt-2 h-2 w-2 flex-none rounded-full ${st.tone === "on" ? "bg-[var(--gift-accent)]" : "bg-white/30"}`} />
          <div className="flex flex-col gap-1">
            <h2 className="m-0 font-display text-[20px] font-medium text-paper-0">{st.title}</h2>
            <p className="m-0 text-[15px] text-paper-0/65">{st.text}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {estado === "pode_ativar" && (
            <GiftButton variant="accent" onClick={() => void issue()} disabled={busy}>
              {busy ? "Ativando…" : "Ativar meu benefício"}
            </GiftButton>
          )}
          {(estado === "disponivel" || estado === "reservado") && (
            <Link href="/beneficios" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--gift-accent)] px-7 text-sm font-medium text-ink-950">
              Ver meu benefício <ArrowRight size={15} aria-hidden />
            </Link>
          )}
          <Link href="/presentes" className="inline-flex min-h-12 items-center rounded-full border border-white/25 px-7 text-sm font-medium text-paper-0">
            Escolher um presente
          </Link>
        </div>
        {msg && (
          <p role="alert" className="m-0 mt-4 text-[14px] text-red-300">
            {msg}
          </p>
        )}
      </div>

      <ConsentCard consent={panel.consent} onChange={onChange} />
    </div>
  );
}

function ConsentCard({ consent, onChange }: { consent: Panel["consent"]; onChange: () => Promise<void> }) {
  const [saving, setSaving] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  // Estado otimista: a caixa responde ao clique na hora e volta se falhar.
  const [local, setLocal] = useState(consent);
  async function toggle(canal: "email" | "whatsapp", concedido: boolean) {
    setSaving(canal);
    setStatus("idle");
    setLocal((c) => ({ ...c, [canal]: concedido }));
    const r = await postJson("/api/private/consent", { canal, concedido }).catch(() => null);
    if (!r?.ok) setLocal((c) => ({ ...c, [canal]: !concedido }));
    setStatus(r?.ok ? "saved" : "error");
    setSaving(null);
    if (r?.ok) void onChange();
  }
  return (
    <fieldset className={`${card} m-0`}>
      <legend className="sr-only">Comunicações de marketing</legend>
      <h2 className="m-0 font-display text-[18px] font-medium text-paper-0">Novidades e benefícios <span className="text-[13px] font-normal text-paper-0/45">(opcional)</span></h2>
      <div className="mt-4 flex flex-col gap-3">
        {(["email", "whatsapp"] as const).map((canal) => (
          <label key={canal} className="flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-paper-0/75">
            <input
              type="checkbox"
              checked={local[canal]}
              disabled={saving !== null}
              onChange={(e) => void toggle(canal, e.target.checked)}
              className="mt-1 h-4 w-4 flex-none accent-[#D4FC3C]"
            />
            <span>{CONSENT_TEXTS[canal].texto}</span>
          </label>
        ))}
      </div>
      <p className="m-0 mt-4 text-[12px] text-paper-0/45">{TRANSACTIONAL_NOTE}</p>
      <p role="status" className="m-0 mt-2 min-h-[1.2em] text-[12px] text-paper-0/60">
        {status === "saved" && (
          <span className="inline-flex items-center gap-1.5">
            <Check size={12} aria-hidden /> Preferência salva.
          </span>
        )}
        {status === "error" && <span className="text-red-300">Não foi possível salvar agora. Tente novamente.</span>}
      </p>
    </fieldset>
  );
}
