-- ============================================================
-- PURION GT — Personalização de presentes (/presentes/kits)
--
-- Aplicar no MESMO projeto Supabase do purion-os, pelo SQL Editor (mesmo
-- processo das migrations do CRM). Aditiva e idempotente: não altera nem
-- apaga nada existente. Reversão: ver bloco ROLLBACK no fim (comentado).
--
-- Modelo:
--   gift_personalizations = intenção de presente "pendente_checkout", criada
--   pelo site ANTES do checkout. Não é pedido e não tem valor fiscal. O
--   vínculo com o pedido real (public.vendas) é feito no CRM:
--     • automático, se o Appmax repassar ?gift_ref= no webhook (a confirmar);
--     • manual, no Despacho, pela referência PG-XXXXXXXX.
--   Ao vincular, a dedicatória vai para vendas.observacoes (o campo que o
--   Despacho já exibe) e vendas.compra_presente = true (que adapta o pós-venda).
-- ============================================================

CREATE TABLE IF NOT EXISTS public.gift_personalizations (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  reference             text        NOT NULL,
  offer_id              text        NOT NULL CHECK (offer_id IN ('individual','duo','trio')),
  plan_id               text        NOT NULL CHECK (plan_id IN ('un','k2','k3')),
  quantity              int         NOT NULL CHECK (quantity BETWEEN 1 AND 99),
  units_per_kit         int         NOT NULL CHECK (units_per_kit BETWEEN 1 AND 3),
  -- Valores calculados pelo SERVIDOR do site no momento da escolha (auditoria).
  -- O valor cobrado é sempre o do Appmax/vendas.
  kit_price             numeric(10,2) NOT NULL,
  list_price            numeric(10,2) NOT NULL,
  discount              numeric(10,2) NOT NULL DEFAULT 0,
  occasion              text        CHECK (occasion IN ('aniversario','namoro','pai','conquista-veiculo','natal','outra')),
  delivery_mode         text        NOT NULL DEFAULT 'comprador' CHECK (delivery_mode IN ('comprador','presenteado')),
  dedication            text        CHECK (char_length(dedication) <= 180),
  recipient_first_name  text        CHECK (char_length(recipient_first_name) <= 40),
  desired_date          date,       -- preferência do cliente, NÃO é prazo prometido
  tracking              jsonb       NOT NULL DEFAULT '{}'::jsonb,
  status                text        NOT NULL DEFAULT 'pendente_checkout'
                                    CHECK (status IN ('pendente_checkout','vinculado','expirado','cancelado')),
  venda_id              uuid        REFERENCES public.vendas(id) ON DELETE SET NULL,
  vinculado_em          timestamptz,
  expires_at            timestamptz NOT NULL,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  tenant_id             uuid        NOT NULL DEFAULT public.meu_tenant_id()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_gift_personalizations_reference ON public.gift_personalizations (reference);
CREATE UNIQUE INDEX IF NOT EXISTS uq_gift_personalizations_venda     ON public.gift_personalizations (venda_id) WHERE venda_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_gift_personalizations_status          ON public.gift_personalizations (tenant_id, status, created_at DESC);

-- RLS: o site grava só com a chave de serviço (route handler). Usuários do
-- CRM leem/atualizam pelo tenant. Sem política para anon → anon não acessa.
ALTER TABLE public.gift_personalizations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_gift_personalizations" ON public.gift_personalizations;
CREATE POLICY "tenant_gift_personalizations" ON public.gift_personalizations
  FOR ALL TO authenticated
  USING (tenant_id = public.meu_tenant_id())
  WITH CHECK (tenant_id = public.meu_tenant_id());

-- Perfil 'logistica' não lê a tabela (vê só o que for copiado para o pedido
-- no vínculo, pelo Despacho) — mesmo padrão do pós-venda.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'sou_logistica') THEN
    DROP POLICY IF EXISTS "logistica_bloqueio" ON public.gift_personalizations;
    CREATE POLICY "logistica_bloqueio" ON public.gift_personalizations AS RESTRICTIVE FOR ALL TO authenticated
      USING (NOT public.sou_logistica()) WITH CHECK (NOT public.sou_logistica());
  END IF;
END $$;

-- Vínculo personalização → pedido (chamado pelo CRM: webhook ou Despacho).
-- Idempotente: vincular de novo a mesma venda não duplica a observação.
CREATE OR REPLACE FUNCTION public.vincular_personalizacao_presente(p_reference text, p_venda_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  g    public.gift_personalizations;
  nota text;
BEGIN
  SELECT * INTO g FROM public.gift_personalizations
   WHERE reference = upper(trim(p_reference)) AND tenant_id = public.meu_tenant_id()
   FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Referência de presente não encontrada'; END IF;
  IF g.venda_id IS NOT NULL AND g.venda_id <> p_venda_id THEN
    RAISE EXCEPTION 'Referência já vinculada a outro pedido';
  END IF;

  UPDATE public.gift_personalizations
     SET venda_id = p_venda_id, status = 'vinculado', vinculado_em = COALESCE(vinculado_em, now()), updated_at = now()
   WHERE id = g.id;

  nota := format('[PRESENTE %s] Entregar %s', g.reference,
                 CASE WHEN g.delivery_mode = 'presenteado' THEN 'ao presenteado' ELSE 'ao comprador' END)
          || COALESCE(' · Para: ' || g.recipient_first_name, '')
          || COALESCE(' · Data desejada (preferência): ' || to_char(g.desired_date, 'DD/MM/YYYY'), '')
          || COALESCE(' · Dedicatória: "' || g.dedication || '"', '');

  UPDATE public.vendas
     SET compra_presente = true,
         observacoes = CASE
           WHEN COALESCE(observacoes, '') LIKE '%[PRESENTE ' || g.reference || ']%' THEN observacoes
           WHEN COALESCE(observacoes, '') = '' THEN nota
           ELSE observacoes || E'\n' || nota END,
         updated_at = now()
   WHERE id = p_venda_id AND tenant_id = public.meu_tenant_id();
END $$;

REVOKE ALL ON FUNCTION public.vincular_personalizacao_presente(text, uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.vincular_personalizacao_presente(text, uuid) TO authenticated;

-- Retenção (LGPD): personalizações não vinculadas expiram e têm o texto
-- pessoal apagado. Rodar diariamente (ex.: cron do CRM).
CREATE OR REPLACE FUNCTION public.expirar_personalizacoes_presente()
RETURNS int
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  WITH upd AS (
    UPDATE public.gift_personalizations
       SET status = 'expirado', dedication = NULL, recipient_first_name = NULL, updated_at = now()
     WHERE status = 'pendente_checkout' AND expires_at < now()
    RETURNING 1)
  SELECT count(*)::int FROM upd;
$$;
REVOKE ALL ON FUNCTION public.expirar_personalizacoes_presente() FROM public, anon, authenticated;

-- ── ROLLBACK (manual) ──────────────────────────────────────────
-- DROP FUNCTION IF EXISTS public.expirar_personalizacoes_presente();
-- DROP FUNCTION IF EXISTS public.vincular_personalizacao_presente(text, uuid);
-- DROP TABLE IF EXISTS public.gift_personalizations;
