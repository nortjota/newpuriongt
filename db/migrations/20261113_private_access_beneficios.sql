-- ============================================================
-- PURION GT — PRIVATE ACCESS + BENEFÍCIOS (vouchers) + CONSENTIMENTO + OUTBOX
--
-- Aplicar no MESMO projeto Supabase do purion-os, pelo SQL Editor.
-- Aditiva e idempotente (IF NOT EXISTS / CREATE OR REPLACE). Não altera
-- tabelas existentes. ROLLBACK manual no fim do arquivo.
--
-- Princípios:
--  • Segredos (token de acesso, sessão, código de voucher) são gerados no
--    servidor do site com alta entropia. O banco guarda só o HMAC-SHA256
--    (com pepper fora do banco). O código do voucher também é guardado
--    CIFRADO (AES-256-GCM, chave fora do banco) para ser reexibido ao dono.
--  • Toda mudança de estado acontece em funções SECURITY DEFINER, com
--    bloqueio de linha (FOR UPDATE), índices únicos e chave de idempotência.
--  • Executáveis só pelo papel de serviço (o servidor do site). anon e
--    authenticated não acessam nada destas tabelas diretamente.
--  • Toda emissão, tentativa, resgate e cancelamento é auditado
--    (beneficio_auditoria, somente INSERT) e vai para crm_outbox na mesma
--    transação.
-- ============================================================

-- ── 1. Cliente do Private Access (identidade = e-mail normalizado) ─────────
CREATE TABLE IF NOT EXISTS public.pa_clientes (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email_norm      text        NOT NULL CHECK (email_norm = lower(btrim(email_norm)) AND position('@' in email_norm) > 1),
  documento_norm  text        CHECK (documento_norm ~ '^[0-9]{11}([0-9]{3})?$'),
  primeiro_nome   text        CHECK (char_length(primeiro_nome) <= 40),
  created_at      timestamptz NOT NULL DEFAULT now(),
  tenant_id       uuid        NOT NULL DEFAULT public.pa__tenant()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_pa_clientes_email ON public.pa_clientes (tenant_id, email_norm);

-- ── 2. Tokens de ativação (QR/link) e sessões ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.pa_tokens (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id   uuid        NOT NULL REFERENCES public.pa_clientes(id) ON DELETE CASCADE,
  token_hash   text        NOT NULL CHECK (token_hash ~ '^[0-9a-f]{64}$'),
  origem       text        NOT NULL CHECK (origem IN ('qr_embalagem','whatsapp','email','crm','teste')),
  expira_em    timestamptz NOT NULL,
  usado_em     timestamptz,
  revogado_em  timestamptz,
  emitido_por  text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  tenant_id    uuid        NOT NULL DEFAULT public.pa__tenant()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_pa_tokens_hash ON public.pa_tokens (token_hash);
CREATE INDEX IF NOT EXISTS idx_pa_tokens_cliente ON public.pa_tokens (cliente_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.pa_sessoes (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id   uuid        NOT NULL REFERENCES public.pa_clientes(id) ON DELETE CASCADE,
  sessao_hash  text        NOT NULL CHECK (sessao_hash ~ '^[0-9a-f]{64}$'),
  expira_em    timestamptz NOT NULL,
  revogada_em  timestamptz,
  ultimo_uso   timestamptz NOT NULL DEFAULT now(),
  created_at   timestamptz NOT NULL DEFAULT now(),
  tenant_id    uuid        NOT NULL DEFAULT public.pa__tenant()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_pa_sessoes_hash ON public.pa_sessoes (sessao_hash);

-- ── 3. Políticas de benefício (configuráveis) ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.beneficio_politicas (
  id                       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo                   text        NOT NULL,
  nome                     text        NOT NULL,
  descricao                text        NOT NULL,
  tipo                     text        NOT NULL DEFAULT 'valor_fixo' CHECK (tipo IN ('valor_fixo')),
  valor                    numeric(10,2) NOT NULL CHECK (valor > 0),
  compra_minima            numeric(10,2) NOT NULL DEFAULT 0 CHECK (compra_minima >= 0),
  -- Regra comercial: o desconto nunca passa deste % do pedido.
  desconto_max_percentual  numeric(5,2) NOT NULL DEFAULT 100 CHECK (desconto_max_percentual > 0 AND desconto_max_percentual <= 100),
  validade_dias            int         NOT NULL CHECK (validade_dias BETWEEN 1 AND 365),
  max_por_cliente          int         NOT NULL DEFAULT 1 CHECK (max_por_cliente = 1),
  cumulativo               boolean     NOT NULL DEFAULT false,
  somente_presente         boolean     NOT NULL DEFAULT false,
  somente_primeira_compra_presente boolean NOT NULL DEFAULT false,
  planos_permitidos        text[]      NOT NULL DEFAULT ARRAY['un','k2','k3'],
  liberar_em_falha         boolean     NOT NULL DEFAULT true,   -- pagamento falhou/cancelado → volta a disponível
  reativar_em_estorno      boolean     NOT NULL DEFAULT false,  -- estorno/chargeback após uso → não volta
  reserva_minutos          int         NOT NULL DEFAULT 45 CHECK (reserva_minutos BETWEEN 5 AND 1440),
  ativo                    boolean     NOT NULL DEFAULT false,
  vigencia_inicio          timestamptz NOT NULL DEFAULT now(),
  vigencia_fim             timestamptz,
  termos_versao            text        NOT NULL,
  termos_texto             text        NOT NULL,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now(),
  tenant_id                uuid        NOT NULL DEFAULT public.pa__tenant()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_beneficio_politicas_codigo ON public.beneficio_politicas (tenant_id, codigo);

-- ── 4. Vouchers (1 por cliente por política) e resgates ────────────────────
CREATE TABLE IF NOT EXISTS public.beneficio_vouchers (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  politica_id          uuid        NOT NULL REFERENCES public.beneficio_politicas(id),
  cliente_id           uuid        NOT NULL REFERENCES public.pa_clientes(id) ON DELETE CASCADE,
  codigo_hash          text        NOT NULL CHECK (codigo_hash ~ '^[0-9a-f]{64}$'),
  codigo_cifrado       text        NOT NULL,   -- AES-256-GCM (chave no servidor do site)
  codigo_final         text        NOT NULL CHECK (char_length(codigo_final) = 4),
  valor                numeric(10,2) NOT NULL,
  status               text        NOT NULL DEFAULT 'disponivel'
                                   CHECK (status IN ('disponivel','reservado','resgatado','expirado','cancelado')),
  emitido_em           timestamptz NOT NULL DEFAULT now(),
  expira_em            timestamptz NOT NULL,
  cancelado_em         timestamptz,
  motivo_cancelamento  text,
  updated_at           timestamptz NOT NULL DEFAULT now(),
  tenant_id            uuid        NOT NULL DEFAULT public.pa__tenant()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_beneficio_vouchers_codigo ON public.beneficio_vouchers (codigo_hash);
CREATE UNIQUE INDEX IF NOT EXISTS uq_beneficio_vouchers_cliente_politica ON public.beneficio_vouchers (politica_id, cliente_id);

CREATE TABLE IF NOT EXISTS public.beneficio_resgates (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_id         uuid        NOT NULL REFERENCES public.beneficio_vouchers(id) ON DELETE CASCADE,
  cliente_id         uuid        NOT NULL REFERENCES public.pa_clientes(id) ON DELETE CASCADE,
  idempotency_key    text        NOT NULL CHECK (char_length(idempotency_key) BETWEEN 16 AND 100),
  status             text        NOT NULL CHECK (status IN ('reservado','confirmado','liberado','expirado','estornado')),
  plano_id           text        NOT NULL,
  valor_pedido       numeric(10,2) NOT NULL,
  valor_desconto     numeric(10,2) NOT NULL CHECK (valor_desconto >= 0),
  pedido_ref         text,
  reservado_em       timestamptz NOT NULL DEFAULT now(),
  reserva_expira_em  timestamptz NOT NULL,
  confirmado_em      timestamptz,
  encerrado_em       timestamptz,
  motivo             text,
  tenant_id          uuid        NOT NULL DEFAULT public.pa__tenant()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_beneficio_resgates_idem ON public.beneficio_resgates (idempotency_key);
-- No máximo UM resgate ativo por voucher (proteção contra concorrência).
CREATE UNIQUE INDEX IF NOT EXISTS uq_beneficio_resgates_ativo ON public.beneficio_resgates (voucher_id) WHERE status IN ('reservado','confirmado');
CREATE UNIQUE INDEX IF NOT EXISTS uq_beneficio_resgates_pedido ON public.beneficio_resgates (pedido_ref) WHERE pedido_ref IS NOT NULL AND status = 'confirmado';

-- Eventos de pagamento já processados (idempotência do webhook).
CREATE TABLE IF NOT EXISTS public.beneficio_eventos_pagamento (
  event_id    text        PRIMARY KEY,
  tipo        text        NOT NULL,
  pedido_ref  text,
  resultado   jsonb       NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ── 5. Auditoria (somente INSERT) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.beneficio_auditoria (
  id          bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  evento      text        NOT NULL,
  sucesso     boolean     NOT NULL,
  motivo      text,
  cliente_id  uuid,
  voucher_id  uuid,
  resgate_id  uuid,
  ip_hash     text,
  detalhe     jsonb       NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now(),
  tenant_id   uuid        NOT NULL DEFAULT public.pa__tenant()
);
CREATE INDEX IF NOT EXISTS idx_beneficio_auditoria_ip ON public.beneficio_auditoria (ip_hash, evento, created_at DESC) WHERE NOT sucesso;
CREATE INDEX IF NOT EXISTS idx_beneficio_auditoria_cliente ON public.beneficio_auditoria (cliente_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.beneficio_auditoria_imutavel() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'beneficio_auditoria é somente inserção'; END $$;
DROP TRIGGER IF EXISTS trg_beneficio_auditoria_imutavel ON public.beneficio_auditoria;
CREATE TRIGGER trg_beneficio_auditoria_imutavel BEFORE UPDATE OR DELETE ON public.beneficio_auditoria
  FOR EACH ROW EXECUTE FUNCTION public.beneficio_auditoria_imutavel();

-- ── 6. Consentimento de marketing (separado do transacional) ───────────────
CREATE TABLE IF NOT EXISTS public.consentimentos (
  id            bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email_norm    text        NOT NULL,
  cliente_id    uuid        REFERENCES public.pa_clientes(id) ON DELETE SET NULL,
  canal         text        NOT NULL CHECK (canal IN ('email','whatsapp')),
  finalidade    text        NOT NULL DEFAULT 'marketing' CHECK (finalidade IN ('marketing')),
  concedido     boolean     NOT NULL,
  origem        text        NOT NULL,
  texto_versao  text        NOT NULL,
  texto_hash    text        NOT NULL CHECK (texto_hash ~ '^[0-9a-f]{64}$'),
  ip_hash       text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  tenant_id     uuid        NOT NULL DEFAULT public.pa__tenant()
);
CREATE INDEX IF NOT EXISTS idx_consentimentos_email ON public.consentimentos (tenant_id, email_norm, canal, created_at DESC);
DROP TRIGGER IF EXISTS trg_consentimentos_imutavel ON public.consentimentos;
CREATE TRIGGER trg_consentimentos_imutavel BEFORE UPDATE OR DELETE ON public.consentimentos
  FOR EACH ROW EXECUTE FUNCTION public.beneficio_auditoria_imutavel();

CREATE OR REPLACE VIEW public.consentimento_vigente AS
SELECT DISTINCT ON (tenant_id, email_norm, canal, finalidade)
       tenant_id, email_norm, canal, finalidade, concedido, origem, texto_versao, created_at
  FROM public.consentimentos
 ORDER BY tenant_id, email_norm, canal, finalidade, created_at DESC, id DESC;

-- Tokens de descadastro (link nos e-mails de marketing). Reutilizáveis
-- pelo próprio dono por design (descadastrar 2× é inofensivo).
CREATE TABLE IF NOT EXISTS public.pa_descadastro_tokens (
  token_hash  text        PRIMARY KEY CHECK (token_hash ~ '^[0-9a-f]{64}$'),
  email_norm  text        NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  tenant_id   uuid        NOT NULL DEFAULT public.pa__tenant()
);

-- ── 7. Outbox para o CRM ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_outbox (
  id                 bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tipo               text        NOT NULL,
  agregado_id        uuid,
  payload            jsonb       NOT NULL DEFAULT '{}'::jsonb,
  idempotency_key    text        NOT NULL,
  status             text        NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','enviado','erro')),
  tentativas         int         NOT NULL DEFAULT 0,
  proxima_tentativa  timestamptz NOT NULL DEFAULT now(),
  ultimo_erro        text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  enviado_em         timestamptz,
  tenant_id          uuid        NOT NULL DEFAULT public.pa__tenant()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_crm_outbox_idem ON public.crm_outbox (idempotency_key);
CREATE INDEX IF NOT EXISTS idx_crm_outbox_fila ON public.crm_outbox (status, proxima_tentativa) WHERE status <> 'enviado';

-- ── 8. RLS: nada é acessível a anon/authenticated diretamente ──────────────
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['pa_clientes','pa_tokens','pa_sessoes','beneficio_politicas','beneficio_vouchers','beneficio_resgates',
                           'beneficio_eventos_pagamento','beneficio_auditoria','consentimentos','pa_descadastro_tokens','crm_outbox']
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('REVOKE ALL ON public.%I FROM anon, authenticated', t);
  END LOOP;
END $$;
-- Equipe do CRM: leitura por tenant (sem segredos: só hashes/finais). Logística bloqueada.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['pa_clientes','beneficio_politicas','beneficio_vouchers','beneficio_resgates','beneficio_auditoria','consentimentos','crm_outbox']
  LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO authenticated', t);
    EXECUTE format('DROP POLICY IF EXISTS crm_leitura ON public.%I', t);
    -- sou_logistica() vem da migration de logística do CRM; sem ela, só filtra por tenant.
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'sou_logistica') THEN
      EXECUTE format('CREATE POLICY crm_leitura ON public.%I FOR SELECT TO authenticated USING (tenant_id = public.meu_tenant_id() AND NOT public.sou_logistica())', t);
    ELSE
      EXECUTE format('CREATE POLICY crm_leitura ON public.%I FOR SELECT TO authenticated USING (tenant_id = public.meu_tenant_id())', t);
    END IF;
  END LOOP;
END $$;
REVOKE UPDATE, DELETE, TRUNCATE ON public.beneficio_auditoria, public.consentimentos FROM service_role, authenticated, anon;

-- ── 9. Helpers internos ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.pa__auditar(p_evento text, p_sucesso boolean, p_motivo text, p_cliente uuid, p_voucher uuid,
                                              p_resgate uuid, p_ip text, p_detalhe jsonb DEFAULT '{}'::jsonb)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  INSERT INTO public.beneficio_auditoria (evento, sucesso, motivo, cliente_id, voucher_id, resgate_id, ip_hash, detalhe)
  VALUES (p_evento, p_sucesso, p_motivo, p_cliente, p_voucher, p_resgate, p_ip, COALESCE(p_detalhe, '{}'::jsonb));
$$;

CREATE OR REPLACE FUNCTION public.pa__outbox(p_tipo text, p_agregado uuid, p_payload jsonb, p_chave text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  INSERT INTO public.crm_outbox (tipo, agregado_id, payload, idempotency_key)
  VALUES (p_tipo, p_agregado, COALESCE(p_payload, '{}'::jsonb), p_chave)
  ON CONFLICT (idempotency_key) DO NOTHING;
$$;

-- Pedidos pagos e não estornados de um cliente (mesma regra do CRM: por e-mail ou CPF/CNPJ).
CREATE OR REPLACE FUNCTION public.pa__pedidos_pagos(p_cliente uuid)
RETURNS TABLE (venda_id uuid, compra_presente boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT v.id, v.compra_presente
    FROM public.pa_clientes c
    JOIN public.vendas v ON v.tenant_id = c.tenant_id
     AND v.deleted_at IS NULL
     AND (lower(btrim(v.cliente_email)) = c.email_norm
          OR (c.documento_norm IS NOT NULL AND regexp_replace(COALESCE(v.cliente_documento, ''), '\D', '', 'g') = c.documento_norm))
   WHERE c.id = p_cliente
     AND (v.status = 'aprovado' OR v.status_pagamento = 'pago')
     AND v.status NOT IN ('estornado','reembolsado','recusado')
     AND COALESCE(v.status_pagamento, '') NOT IN ('estornado','cancelado');
$$;

-- Elegibilidade do cliente para uma política. Retorna o motivo em texto.
CREATE OR REPLACE FUNCTION public.beneficio_elegibilidade(p_cliente uuid, p_politica uuid)
RETURNS text LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  pol public.beneficio_politicas;
  pagos int; presentes int;
BEGIN
  SELECT * INTO pol FROM public.beneficio_politicas WHERE id = p_politica;
  IF NOT FOUND OR NOT pol.ativo OR now() < pol.vigencia_inicio OR (pol.vigencia_fim IS NOT NULL AND now() > pol.vigencia_fim) THEN
    RETURN 'politica_inativa';
  END IF;
  SELECT count(*), count(*) FILTER (WHERE compra_presente) INTO pagos, presentes FROM public.pa__pedidos_pagos(p_cliente);
  IF pagos = 0 THEN RETURN 'sem_compra_paga'; END IF;
  IF pol.somente_primeira_compra_presente AND presentes > 0 THEN RETURN 'ja_comprou_presente'; END IF;
  RETURN 'elegivel';
END $$;

-- ── 10. Emissão e ativação de token de acesso ─────────────────────────────
CREATE OR REPLACE FUNCTION public.pa_emitir_token(p_email text, p_documento text, p_primeiro_nome text, p_token_hash text,
                                                  p_origem text, p_validade_dias int, p_emitido_por text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_email text := lower(btrim(p_email));
  v_doc   text := NULLIF(regexp_replace(COALESCE(p_documento, ''), '\D', '', 'g'), '');
  v_cli   uuid;
  v_tok   uuid;
BEGIN
  IF p_validade_dias NOT BETWEEN 1 AND 180 THEN RAISE EXCEPTION 'validade inválida'; END IF;
  INSERT INTO public.pa_clientes (email_norm, documento_norm, primeiro_nome)
  VALUES (v_email, v_doc, NULLIF(btrim(p_primeiro_nome), ''))
  ON CONFLICT (tenant_id, email_norm) DO UPDATE
     SET documento_norm = COALESCE(pa_clientes.documento_norm, EXCLUDED.documento_norm),
         primeiro_nome  = COALESCE(EXCLUDED.primeiro_nome, pa_clientes.primeiro_nome)
  RETURNING id INTO v_cli;

  -- Um token ativo por cliente: os anteriores não usados são revogados.
  UPDATE public.pa_tokens SET revogado_em = now()
   WHERE cliente_id = v_cli AND usado_em IS NULL AND revogado_em IS NULL;

  INSERT INTO public.pa_tokens (cliente_id, token_hash, origem, expira_em, emitido_por)
  VALUES (v_cli, p_token_hash, p_origem, now() + make_interval(days => p_validade_dias), p_emitido_por)
  RETURNING id INTO v_tok;

  PERFORM public.pa__auditar('token_emitido', true, NULL, v_cli, NULL, NULL, NULL, jsonb_build_object('origem', p_origem, 'token_id', v_tok));
  PERFORM public.pa__outbox('private_access.token_emitido', v_cli, jsonb_build_object('origem', p_origem), 'token:' || v_tok);
  RETURN jsonb_build_object('cliente_id', v_cli, 'token_id', v_tok);
END $$;

CREATE OR REPLACE FUNCTION public.pa_ativar_token(p_token_hash text, p_sessao_hash text, p_sessao_dias int, p_ip_hash text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  t public.pa_tokens;
  falhas int;
BEGIN
  -- Anti força bruta global (vale entre instâncias): 10 falhas/15 min por IP.
  SELECT count(*) INTO falhas FROM public.beneficio_auditoria
   WHERE ip_hash = p_ip_hash AND evento = 'token_ativacao' AND NOT sucesso AND created_at > now() - interval '15 minutes';
  IF p_ip_hash IS NOT NULL AND falhas >= 10 THEN
    PERFORM public.pa__auditar('token_ativacao', false, 'bloqueado', NULL, NULL, NULL, p_ip_hash);
    RETURN jsonb_build_object('resultado', 'bloqueado');
  END IF;

  SELECT * INTO t FROM public.pa_tokens WHERE token_hash = p_token_hash FOR UPDATE;
  IF NOT FOUND THEN
    PERFORM public.pa__auditar('token_ativacao', false, 'invalido', NULL, NULL, NULL, p_ip_hash);
    RETURN jsonb_build_object('resultado', 'invalido');
  END IF;
  IF t.revogado_em IS NOT NULL THEN
    PERFORM public.pa__auditar('token_ativacao', false, 'revogado', t.cliente_id, NULL, NULL, p_ip_hash);
    RETURN jsonb_build_object('resultado', 'revogado');
  END IF;
  IF t.usado_em IS NOT NULL THEN
    PERFORM public.pa__auditar('token_ativacao', false, 'utilizado', t.cliente_id, NULL, NULL, p_ip_hash);
    RETURN jsonb_build_object('resultado', 'utilizado');
  END IF;
  IF t.expira_em <= now() THEN
    PERFORM public.pa__auditar('token_ativacao', false, 'expirado', t.cliente_id, NULL, NULL, p_ip_hash);
    RETURN jsonb_build_object('resultado', 'expirado');
  END IF;

  UPDATE public.pa_tokens SET usado_em = now() WHERE id = t.id;
  INSERT INTO public.pa_sessoes (cliente_id, sessao_hash, expira_em)
  VALUES (t.cliente_id, p_sessao_hash, now() + make_interval(days => LEAST(GREATEST(p_sessao_dias, 1), 60)));
  PERFORM public.pa__auditar('token_ativacao', true, NULL, t.cliente_id, NULL, NULL, p_ip_hash);
  PERFORM public.pa__outbox('private_access.ativado', t.cliente_id, '{}'::jsonb, 'ativacao:' || t.id);
  RETURN jsonb_build_object('resultado', 'ok', 'cliente_id', t.cliente_id);
END $$;

CREATE OR REPLACE FUNCTION public.pa_sessao(p_sessao_hash text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE s public.pa_sessoes; c public.pa_clientes;
BEGIN
  SELECT * INTO s FROM public.pa_sessoes WHERE sessao_hash = p_sessao_hash;
  IF NOT FOUND OR s.revogada_em IS NOT NULL OR s.expira_em <= now() THEN RETURN NULL; END IF;
  UPDATE public.pa_sessoes SET ultimo_uso = now() WHERE id = s.id AND ultimo_uso < now() - interval '5 minutes';
  SELECT * INTO c FROM public.pa_clientes WHERE id = s.cliente_id;
  RETURN jsonb_build_object('cliente_id', c.id, 'primeiro_nome', c.primeiro_nome, 'email_norm', c.email_norm);
END $$;

CREATE OR REPLACE FUNCTION public.pa_encerrar_sessao(p_sessao_hash text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.pa_sessoes SET revogada_em = now() WHERE sessao_hash = p_sessao_hash AND revogada_em IS NULL;
$$;

-- ── 11. Expiração preguiçosa (chamada antes de ler/agir) ──────────────────
CREATE OR REPLACE FUNCTION public.beneficio__expirar_voucher(p_voucher uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r public.beneficio_resgates;
BEGIN
  -- Reserva vencida → expira e devolve o voucher.
  FOR r IN SELECT * FROM public.beneficio_resgates WHERE voucher_id = p_voucher AND status = 'reservado' AND reserva_expira_em <= now() FOR UPDATE
  LOOP
    UPDATE public.beneficio_resgates SET status = 'expirado', encerrado_em = now(), motivo = 'reserva_expirada' WHERE id = r.id;
    UPDATE public.beneficio_vouchers SET status = 'disponivel', updated_at = now() WHERE id = p_voucher AND status = 'reservado';
    PERFORM public.pa__auditar('reserva_expirada', true, NULL, r.cliente_id, p_voucher, r.id, NULL);
  END LOOP;
  UPDATE public.beneficio_vouchers SET status = 'expirado', updated_at = now()
   WHERE id = p_voucher AND status = 'disponivel' AND expira_em <= now();
END $$;

-- ── 12. Emissão de voucher (1 por cliente por política) ───────────────────
CREATE OR REPLACE FUNCTION public.beneficio_emitir_voucher(p_cliente uuid, p_politica_codigo text, p_codigo_hash text,
                                                           p_codigo_cifrado text, p_codigo_final text, p_ip_hash text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  pol public.beneficio_politicas;
  eleg text;
  v public.beneficio_vouchers;
BEGIN
  SELECT * INTO pol FROM public.beneficio_politicas WHERE codigo = p_politica_codigo AND tenant_id = public.pa__tenant();
  IF NOT FOUND THEN RETURN jsonb_build_object('resultado', 'politica_inexistente'); END IF;
  -- Serializa emissões do mesmo cliente nesta política.
  PERFORM pg_advisory_xact_lock(hashtextextended(pol.id::text || p_cliente::text, 0));

  SELECT * INTO v FROM public.beneficio_vouchers WHERE politica_id = pol.id AND cliente_id = p_cliente;
  IF FOUND THEN
    PERFORM public.pa__auditar('voucher_emissao', false, 'ja_emitido', p_cliente, v.id, NULL, p_ip_hash);
    RETURN jsonb_build_object('resultado', 'ja_emitido', 'voucher_id', v.id);
  END IF;

  eleg := public.beneficio_elegibilidade(p_cliente, pol.id);
  IF eleg <> 'elegivel' THEN
    PERFORM public.pa__auditar('voucher_emissao', false, eleg, p_cliente, NULL, NULL, p_ip_hash);
    RETURN jsonb_build_object('resultado', 'nao_elegivel', 'motivo', eleg);
  END IF;

  INSERT INTO public.beneficio_vouchers (politica_id, cliente_id, codigo_hash, codigo_cifrado, codigo_final, valor, expira_em)
  VALUES (pol.id, p_cliente, p_codigo_hash, p_codigo_cifrado, p_codigo_final, pol.valor, now() + make_interval(days => pol.validade_dias))
  RETURNING * INTO v;

  PERFORM public.pa__auditar('voucher_emissao', true, NULL, p_cliente, v.id, NULL, p_ip_hash, jsonb_build_object('politica', pol.codigo));
  PERFORM public.pa__outbox('beneficio.voucher_emitido', v.id,
    jsonb_build_object('politica', pol.codigo, 'valor', v.valor, 'expira_em', v.expira_em, 'final', v.codigo_final), 'voucher:' || v.id);
  RETURN jsonb_build_object('resultado', 'emitido', 'voucher_id', v.id);
END $$;

-- ── 13. Reserva para o checkout (transacional, idempotente) ───────────────
-- p_valor_pedido vem do CATÁLOGO DO SERVIDOR (nunca do navegador).
CREATE OR REPLACE FUNCTION public.beneficio_reservar(p_cliente uuid, p_voucher uuid, p_plano text, p_valor_pedido numeric,
                                                     p_presente boolean, p_idempotency_key text, p_ip_hash text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v   public.beneficio_vouchers;
  pol public.beneficio_politicas;
  r   public.beneficio_resgates;
  eleg text;
  desconto numeric(10,2);
  falhar text := NULL;
BEGIN
  -- Repetição da mesma requisição → mesma resposta (idempotência).
  SELECT * INTO r FROM public.beneficio_resgates WHERE idempotency_key = p_idempotency_key;
  IF FOUND THEN
    IF r.cliente_id <> p_cliente THEN RETURN jsonb_build_object('resultado', 'acesso_negado'); END IF;
    RETURN jsonb_build_object('resultado', CASE WHEN r.status = 'reservado' THEN 'reservado' ELSE r.status END,
                              'resgate_id', r.id, 'valor_desconto', r.valor_desconto, 'reserva_expira_em', r.reserva_expira_em, 'repetido', true);
  END IF;

  SELECT * INTO v FROM public.beneficio_vouchers WHERE id = p_voucher FOR UPDATE;
  IF NOT FOUND OR v.cliente_id <> p_cliente THEN
    PERFORM public.pa__auditar('resgate_tentativa', false, 'acesso_negado', p_cliente, p_voucher, NULL, p_ip_hash);
    RETURN jsonb_build_object('resultado', 'acesso_negado');
  END IF;
  -- Rechecagem sob o lock: uma requisição gêmea (mesma chave) pode ter
  -- acabado de criar a reserva enquanto esperávamos.
  SELECT * INTO r FROM public.beneficio_resgates WHERE idempotency_key = p_idempotency_key;
  IF FOUND THEN
    RETURN jsonb_build_object('resultado', CASE WHEN r.status = 'reservado' THEN 'reservado' ELSE r.status END,
                              'resgate_id', r.id, 'valor_desconto', r.valor_desconto, 'reserva_expira_em', r.reserva_expira_em, 'repetido', true);
  END IF;
  PERFORM public.beneficio__expirar_voucher(v.id);
  SELECT * INTO v FROM public.beneficio_vouchers WHERE id = p_voucher;
  SELECT * INTO pol FROM public.beneficio_politicas WHERE id = v.politica_id;

  IF v.status = 'expirado' THEN falhar := 'expirado';
  ELSIF v.status = 'resgatado' THEN falhar := 'utilizado';
  ELSIF v.status = 'cancelado' THEN falhar := 'cancelado';
  ELSIF v.status = 'reservado' THEN falhar := 'reserva_em_andamento';
  ELSIF NOT (p_plano = ANY (pol.planos_permitidos)) THEN falhar := 'plano_nao_permitido';
  ELSIF pol.somente_presente AND NOT p_presente THEN falhar := 'somente_presente';
  ELSIF p_valor_pedido IS NULL OR p_valor_pedido <= 0 THEN falhar := 'valor_invalido';
  ELSIF p_valor_pedido < pol.compra_minima THEN falhar := 'compra_minima';
  END IF;

  IF falhar IS NULL THEN
    eleg := public.beneficio_elegibilidade(p_cliente, pol.id);
    IF eleg <> 'elegivel' THEN falhar := eleg; END IF;
  END IF;

  -- Não cumulativo: nenhum outro benefício reservado/confirmado em aberto para o cliente.
  IF falhar IS NULL AND NOT pol.cumulativo AND EXISTS (
       SELECT 1 FROM public.beneficio_resgates WHERE cliente_id = p_cliente AND status = 'reservado' AND voucher_id <> v.id AND reserva_expira_em > now()) THEN
    falhar := 'nao_cumulativo';
  END IF;

  IF falhar IS NOT NULL THEN
    PERFORM public.pa__auditar('resgate_tentativa', false, falhar, p_cliente, v.id, NULL, p_ip_hash, jsonb_build_object('plano', p_plano));
    RETURN jsonb_build_object('resultado', falhar);
  END IF;

  -- Desconto nunca excede o valor do benefício, o teto % da regra comercial, nem o pedido.
  desconto := LEAST(v.valor, round(p_valor_pedido * pol.desconto_max_percentual / 100, 2), p_valor_pedido);

  INSERT INTO public.beneficio_resgates (voucher_id, cliente_id, idempotency_key, status, plano_id, valor_pedido, valor_desconto, reserva_expira_em)
  VALUES (v.id, p_cliente, p_idempotency_key, 'reservado', p_plano, p_valor_pedido, desconto, now() + make_interval(mins => pol.reserva_minutos))
  RETURNING * INTO r;
  UPDATE public.beneficio_vouchers SET status = 'reservado', updated_at = now() WHERE id = v.id;

  PERFORM public.pa__auditar('resgate_reserva', true, NULL, p_cliente, v.id, r.id, p_ip_hash, jsonb_build_object('plano', p_plano, 'desconto', desconto));
  PERFORM public.pa__outbox('beneficio.reservado', r.id, jsonb_build_object('voucher_id', v.id, 'plano', p_plano, 'desconto', desconto), 'reserva:' || r.id);
  RETURN jsonb_build_object('resultado', 'reservado', 'resgate_id', r.id, 'valor_desconto', desconto, 'reserva_expira_em', r.reserva_expira_em);
EXCEPTION WHEN unique_violation THEN
  -- Corrida perdida para outra reserva simultânea do mesmo voucher.
  PERFORM public.pa__auditar('resgate_tentativa', false, 'concorrencia', p_cliente, p_voucher, NULL, p_ip_hash);
  RETURN jsonb_build_object('resultado', 'reserva_em_andamento');
END $$;

-- O próprio cliente desiste antes de pagar.
CREATE OR REPLACE FUNCTION public.beneficio_cancelar_reserva(p_cliente uuid, p_resgate uuid, p_ip_hash text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r public.beneficio_resgates;
BEGIN
  SELECT * INTO r FROM public.beneficio_resgates WHERE id = p_resgate FOR UPDATE;
  IF NOT FOUND OR r.cliente_id <> p_cliente THEN RETURN jsonb_build_object('resultado', 'acesso_negado'); END IF;
  IF r.status <> 'reservado' THEN RETURN jsonb_build_object('resultado', r.status); END IF;
  UPDATE public.beneficio_resgates SET status = 'liberado', encerrado_em = now(), motivo = 'cancelado_pelo_cliente' WHERE id = r.id;
  UPDATE public.beneficio_vouchers SET status = 'disponivel', updated_at = now() WHERE id = r.voucher_id AND status = 'reservado';
  PERFORM public.beneficio__expirar_voucher(r.voucher_id);
  PERFORM public.pa__auditar('reserva_cancelada', true, 'cliente', p_cliente, r.voucher_id, r.id, p_ip_hash);
  PERFORM public.pa__outbox('beneficio.reserva_cancelada', r.id, '{}'::jsonb, 'cancelada:' || r.id);
  RETURN jsonb_build_object('resultado', 'liberado');
END $$;

-- ── 14. Eventos de pagamento (webhook encaminhado pelo CRM) ───────────────
-- p_tipo: pago | falhou | cancelado | estornado | chargeback
-- Localiza o resgate pela reserva (p_resgate) ou pelo código usado no checkout.
CREATE OR REPLACE FUNCTION public.beneficio_evento_pagamento(p_event_id text, p_tipo text, p_pedido_ref text,
                                                             p_resgate uuid, p_codigo_hash text, p_valor_pedido numeric)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  ja   public.beneficio_eventos_pagamento;
  v    public.beneficio_vouchers;
  pol  public.beneficio_politicas;
  r    public.beneficio_resgates;
  res  jsonb;
BEGIN
  IF p_tipo NOT IN ('pago','falhou','cancelado','estornado','chargeback') THEN RAISE EXCEPTION 'tipo de evento inválido'; END IF;

  -- Idempotência: mesmo evento → mesma resposta, sem efeito colateral.
  PERFORM pg_advisory_xact_lock(hashtextextended('evt:' || p_event_id, 0));
  SELECT * INTO ja FROM public.beneficio_eventos_pagamento WHERE event_id = p_event_id;
  IF FOUND THEN RETURN ja.resultado || jsonb_build_object('repetido', true); END IF;

  IF p_resgate IS NOT NULL THEN
    SELECT * INTO r FROM public.beneficio_resgates WHERE id = p_resgate;
    IF FOUND THEN SELECT * INTO v FROM public.beneficio_vouchers WHERE id = r.voucher_id FOR UPDATE; END IF;
  ELSIF p_codigo_hash IS NOT NULL THEN
    SELECT * INTO v FROM public.beneficio_vouchers WHERE codigo_hash = p_codigo_hash FOR UPDATE;
  END IF;

  IF v.id IS NULL THEN
    res := jsonb_build_object('resultado', 'ignorado', 'motivo', 'beneficio_nao_encontrado');
  ELSE
    SELECT * INTO pol FROM public.beneficio_politicas WHERE id = v.politica_id;
    -- Recarrega o resgate relevante (sob o lock do voucher).
    IF p_resgate IS NOT NULL THEN
      SELECT * INTO r FROM public.beneficio_resgates WHERE id = p_resgate FOR UPDATE;
    ELSE
      SELECT * INTO r FROM public.beneficio_resgates
       WHERE voucher_id = v.id AND (status IN ('reservado','confirmado') OR pedido_ref = p_pedido_ref)
       ORDER BY reservado_em DESC LIMIT 1 FOR UPDATE;
    END IF;

    IF p_tipo = 'pago' THEN
      IF r.id IS NOT NULL AND r.status = 'confirmado' AND r.pedido_ref IS DISTINCT FROM p_pedido_ref THEN
        -- Mesmo benefício aparecendo em outro pedido pago: alerta, não confirma de novo.
        res := jsonb_build_object('resultado', 'uso_duplicado', 'resgate_id', r.id);
        PERFORM public.pa__outbox('beneficio.alerta_uso_duplicado', v.id, jsonb_build_object('pedido', p_pedido_ref), 'dup:' || p_event_id);
      ELSIF r.id IS NOT NULL AND r.status = 'confirmado' THEN
        res := jsonb_build_object('resultado', 'confirmado', 'resgate_id', r.id);
      ELSIF r.id IS NOT NULL AND r.status IN ('reservado','expirado','liberado') AND v.status <> 'resgatado' THEN
        -- Pagou (mesmo com reserva vencida/liberada): consome o benefício, se ainda não usado.
        UPDATE public.beneficio_resgates SET status = 'confirmado', confirmado_em = now(), pedido_ref = p_pedido_ref, encerrado_em = NULL,
               motivo = CASE WHEN r.status <> 'reservado' THEN 'pago_apos_' || r.status ELSE NULL END
         WHERE id = r.id;
        UPDATE public.beneficio_vouchers SET status = 'resgatado', updated_at = now() WHERE id = v.id;
        res := jsonb_build_object('resultado', 'confirmado', 'resgate_id', r.id);
      ELSIF v.status = 'resgatado' THEN
        res := jsonb_build_object('resultado', 'uso_duplicado');
        PERFORM public.pa__outbox('beneficio.alerta_uso_duplicado', v.id, jsonb_build_object('pedido', p_pedido_ref), 'dup:' || p_event_id);
      ELSE
        -- Código digitado direto no checkout, sem reserva: registra o uso.
        INSERT INTO public.beneficio_resgates (voucher_id, cliente_id, idempotency_key, status, plano_id, valor_pedido, valor_desconto,
                                               reserva_expira_em, confirmado_em, pedido_ref, motivo)
        VALUES (v.id, v.cliente_id, 'evt:' || md5(p_event_id), 'confirmado', 'desconhecido', COALESCE(p_valor_pedido, 0),
                LEAST(v.valor, COALESCE(p_valor_pedido, v.valor)), now(), now(), p_pedido_ref, 'sem_reserva')
        RETURNING * INTO r;
        UPDATE public.beneficio_vouchers SET status = 'resgatado', updated_at = now() WHERE id = v.id;
        res := jsonb_build_object('resultado', 'confirmado', 'resgate_id', r.id, 'sem_reserva', true);
      END IF;
      IF res->>'resultado' = 'confirmado' THEN
        PERFORM public.pa__auditar('resgate_confirmado', true, NULL, v.cliente_id, v.id, r.id, NULL, jsonb_build_object('pedido', p_pedido_ref));
        PERFORM public.pa__outbox('beneficio.resgatado', r.id, jsonb_build_object('pedido', p_pedido_ref, 'desconto', r.valor_desconto), 'resgatado:' || r.id);
      END IF;

    ELSIF p_tipo IN ('falhou','cancelado') THEN
      IF r.id IS NOT NULL AND r.status = 'reservado' THEN
        UPDATE public.beneficio_resgates SET status = 'liberado', encerrado_em = now(), motivo = 'pagamento_' || p_tipo, pedido_ref = p_pedido_ref WHERE id = r.id;
        IF pol.liberar_em_falha THEN
          UPDATE public.beneficio_vouchers SET status = 'disponivel', updated_at = now() WHERE id = v.id;
          PERFORM public.beneficio__expirar_voucher(v.id);
        ELSE
          UPDATE public.beneficio_vouchers SET status = 'cancelado', cancelado_em = now(), motivo_cancelamento = 'pagamento_' || p_tipo, updated_at = now() WHERE id = v.id;
        END IF;
        res := jsonb_build_object('resultado', 'liberado', 'resgate_id', r.id);
        PERFORM public.pa__auditar('resgate_liberado', true, 'pagamento_' || p_tipo, v.cliente_id, v.id, r.id, NULL);
        PERFORM public.pa__outbox('beneficio.liberado', r.id, jsonb_build_object('motivo', p_tipo), 'liberado:' || r.id);
      ELSE
        res := jsonb_build_object('resultado', 'sem_efeito');
      END IF;

    ELSE -- estornado | chargeback
      IF r.id IS NOT NULL AND r.status = 'confirmado' THEN
        UPDATE public.beneficio_resgates SET status = 'estornado', encerrado_em = now(), motivo = p_tipo WHERE id = r.id;
        IF pol.reativar_em_estorno AND v.expira_em > now() THEN
          UPDATE public.beneficio_vouchers SET status = 'disponivel', updated_at = now() WHERE id = v.id;
        ELSE
          UPDATE public.beneficio_vouchers SET status = 'cancelado', cancelado_em = now(), motivo_cancelamento = p_tipo, updated_at = now() WHERE id = v.id;
        END IF;
        res := jsonb_build_object('resultado', 'estornado', 'resgate_id', r.id);
        PERFORM public.pa__auditar('resgate_estornado', true, p_tipo, v.cliente_id, v.id, r.id, NULL);
        PERFORM public.pa__outbox('beneficio.estornado', r.id, jsonb_build_object('motivo', p_tipo, 'pedido', p_pedido_ref), 'estornado:' || r.id);
      ELSE
        res := jsonb_build_object('resultado', 'sem_efeito');
      END IF;
    END IF;
  END IF;

  INSERT INTO public.beneficio_eventos_pagamento (event_id, tipo, pedido_ref, resultado) VALUES (p_event_id, p_tipo, p_pedido_ref, res);
  RETURN res;
END $$;

-- ── 15. Leitura para o cliente autenticado ────────────────────────────────
CREATE OR REPLACE FUNCTION public.beneficio_painel(p_cliente uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE vv record;
BEGIN
  FOR vv IN SELECT id FROM public.beneficio_vouchers WHERE cliente_id = p_cliente LOOP
    PERFORM public.beneficio__expirar_voucher(vv.id);
  END LOOP;
  RETURN jsonb_build_object(
    'politicas', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'codigo', p.codigo, 'nome', p.nome, 'descricao', p.descricao, 'valor', p.valor, 'compra_minima', p.compra_minima,
        'desconto_max_percentual', p.desconto_max_percentual, 'validade_dias', p.validade_dias, 'cumulativo', p.cumulativo,
        'somente_presente', p.somente_presente, 'planos_permitidos', p.planos_permitidos, 'termos_versao', p.termos_versao,
        'termos_texto', p.termos_texto, 'elegibilidade', public.beneficio_elegibilidade(p_cliente, p.id)) ORDER BY p.created_at)
      FROM public.beneficio_politicas p
      WHERE p.tenant_id = public.pa__tenant() AND p.ativo AND now() >= p.vigencia_inicio AND (p.vigencia_fim IS NULL OR now() <= p.vigencia_fim)), '[]'::jsonb),
    'vouchers', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', v.id, 'politica', p.codigo, 'status', v.status, 'valor', v.valor, 'codigo_cifrado', v.codigo_cifrado,
        'codigo_final', v.codigo_final, 'emitido_em', v.emitido_em, 'expira_em', v.expira_em,
        'reserva', (SELECT jsonb_build_object('id', r.id, 'plano', r.plano_id, 'valor_desconto', r.valor_desconto, 'expira_em', r.reserva_expira_em)
                      FROM public.beneficio_resgates r WHERE r.voucher_id = v.id AND r.status = 'reservado' LIMIT 1)) ORDER BY v.emitido_em DESC)
      FROM public.beneficio_vouchers v JOIN public.beneficio_politicas p ON p.id = v.politica_id
      WHERE v.cliente_id = p_cliente), '[]'::jsonb),
    'historico', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('id', r.id, 'status', r.status, 'plano', r.plano_id, 'valor_desconto', r.valor_desconto,
               'valor_pedido', r.valor_pedido, 'reservado_em', r.reservado_em, 'confirmado_em', r.confirmado_em, 'encerrado_em', r.encerrado_em,
               'motivo', r.motivo) ORDER BY r.reservado_em DESC)
      FROM public.beneficio_resgates r WHERE r.cliente_id = p_cliente), '[]'::jsonb));
END $$;

-- Políticas ativas (informação pública, sem dados pessoais).
CREATE OR REPLACE FUNCTION public.beneficio_politicas_publicas()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'codigo', p.codigo, 'nome', p.nome, 'descricao', p.descricao, 'valor', p.valor, 'compra_minima', p.compra_minima,
    'desconto_max_percentual', p.desconto_max_percentual, 'validade_dias', p.validade_dias, 'cumulativo', p.cumulativo,
    'somente_presente', p.somente_presente, 'somente_primeira_compra_presente', p.somente_primeira_compra_presente,
    'planos_permitidos', p.planos_permitidos, 'termos_versao', p.termos_versao, 'termos_texto', p.termos_texto) ORDER BY p.created_at), '[]'::jsonb)
  FROM public.beneficio_politicas p
  WHERE p.tenant_id = public.pa__tenant() AND p.ativo AND now() >= p.vigencia_inicio AND (p.vigencia_fim IS NULL OR now() <= p.vigencia_fim);
$$;

-- ── 16. Consentimento ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.consentimento_registrar(p_email text, p_cliente uuid, p_canal text, p_concedido boolean,
                                                          p_origem text, p_texto_versao text, p_texto_hash text, p_ip_hash text,
                                                          p_descadastro_hash text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_email text := lower(btrim(p_email));
BEGIN
  INSERT INTO public.consentimentos (email_norm, cliente_id, canal, concedido, origem, texto_versao, texto_hash, ip_hash)
  VALUES (v_email, p_cliente, p_canal, p_concedido, p_origem, p_texto_versao, p_texto_hash, p_ip_hash);
  IF p_concedido AND p_descadastro_hash IS NOT NULL THEN
    INSERT INTO public.pa_descadastro_tokens (token_hash, email_norm) VALUES (p_descadastro_hash, v_email) ON CONFLICT DO NOTHING;
  END IF;
  PERFORM public.pa__outbox('consentimento.' || CASE WHEN p_concedido THEN 'concedido' ELSE 'revogado' END, p_cliente,
    jsonb_build_object('canal', p_canal, 'origem', p_origem, 'versao', p_texto_versao), 'consent:' || currval(pg_get_serial_sequence('public.consentimentos','id')));
  RETURN jsonb_build_object('resultado', 'ok');
END $$;

CREATE OR REPLACE FUNCTION public.consentimento_vigente_cliente(p_email text)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(jsonb_object_agg(canal, concedido), '{}'::jsonb)
    FROM public.consentimento_vigente WHERE tenant_id = public.pa__tenant() AND email_norm = lower(btrim(p_email)) AND finalidade = 'marketing';
$$;

-- Descadastro por link (todos os canais de marketing). Não exige login.
CREATE OR REPLACE FUNCTION public.consentimento_descadastrar(p_token_hash text, p_ip_hash text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE t public.pa_descadastro_tokens; c text;
BEGIN
  SELECT * INTO t FROM public.pa_descadastro_tokens WHERE token_hash = p_token_hash;
  IF NOT FOUND THEN RETURN jsonb_build_object('resultado', 'invalido'); END IF;
  FOREACH c IN ARRAY ARRAY['email','whatsapp'] LOOP
    INSERT INTO public.consentimentos (email_norm, canal, concedido, origem, texto_versao, texto_hash, ip_hash)
    VALUES (t.email_norm, c, false, 'link_descadastro', 'descadastro', repeat('0', 64), p_ip_hash);
  END LOOP;
  PERFORM public.pa__outbox('consentimento.descadastro', NULL, jsonb_build_object('origem', 'link'), 'descad:' || p_token_hash || ':' || extract(epoch from now())::bigint);
  RETURN jsonb_build_object('resultado', 'ok');
END $$;

-- ── 17. Despacho da outbox para o CRM (notificacoes) ──────────────────────
-- Transacional por evento, com retentativa exponencial. Consumidores externos
-- também podem ler crm_outbox diretamente (FOR UPDATE SKIP LOCKED).
CREATE OR REPLACE FUNCTION public.crm_outbox_processar(p_limite int DEFAULT 50)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE e public.crm_outbox; ok int := 0; erro int := 0;
BEGIN
  FOR e IN SELECT * FROM public.crm_outbox
            WHERE status IN ('pendente','erro') AND proxima_tentativa <= now() AND tentativas < 10
            ORDER BY id LIMIT p_limite FOR UPDATE SKIP LOCKED
  LOOP
    BEGIN
      IF e.tipo IN ('beneficio.resgatado','beneficio.estornado','beneficio.alerta_uso_duplicado') THEN
        INSERT INTO public.notificacoes (tenant_id, papel, tipo, titulo, mensagem, canal, link)
        VALUES (e.tenant_id, 'matheus', e.tipo,
                CASE e.tipo WHEN 'beneficio.resgatado' THEN 'Benefício Private Access resgatado'
                            WHEN 'beneficio.estornado' THEN 'Benefício Private Access estornado'
                            ELSE 'Alerta: benefício usado em mais de um pedido' END,
                COALESCE(e.payload::text, ''), ARRAY['sistema'], '/vendas');
      END IF;
      UPDATE public.crm_outbox SET status = 'enviado', enviado_em = now(), tentativas = tentativas + 1, ultimo_erro = NULL WHERE id = e.id;
      ok := ok + 1;
    EXCEPTION WHEN OTHERS THEN
      UPDATE public.crm_outbox SET status = 'erro', tentativas = tentativas + 1, ultimo_erro = SQLERRM,
             proxima_tentativa = now() + make_interval(mins => power(2, LEAST(tentativas, 8))::int) WHERE id = e.id;
      erro := erro + 1;
    END;
  END LOOP;
  RETURN jsonb_build_object('enviados', ok, 'erros', erro);
END $$;

-- Rotina diária: expira reservas/vouchers vencidos.
CREATE OR REPLACE FUNCTION public.beneficio_manutencao()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE vv record; n int := 0;
BEGIN
  FOR vv IN SELECT id FROM public.beneficio_vouchers WHERE status IN ('disponivel','reservado') LOOP
    PERFORM public.beneficio__expirar_voucher(vv.id); n := n + 1;
  END LOOP;
  RETURN jsonb_build_object('vouchers_verificados', n);
END $$;

-- ── 18. Permissões das funções: só o papel de serviço executa ─────────────
DO $$
DECLARE f text;
BEGIN
  FOR f IN SELECT p.oid::regprocedure::text FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
            WHERE n.nspname = 'public' AND (p.proname LIKE 'pa\_%' OR p.proname LIKE 'beneficio\_%' OR p.proname LIKE 'consentimento\_%' OR p.proname = 'crm_outbox_processar')
              AND p.proname <> 'beneficio_auditoria_imutavel'
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM public, anon, authenticated', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', f);
  END LOOP;
END $$;

-- ── 19. Política piloto (criada INATIVA — ativar só após validação) ────────
INSERT INTO public.beneficio_politicas (codigo, nome, descricao, tipo, valor, compra_minima, desconto_max_percentual, validade_dias,
                                        max_por_cliente, cumulativo, somente_presente, somente_primeira_compra_presente, planos_permitidos,
                                        liberar_em_falha, reativar_em_estorno, reserva_minutos, ativo, termos_versao, termos_texto, tenant_id)
SELECT 'PILOTO_PRESENTE_15', 'R$ 15 na sua primeira compra de presente',
       'Para quem já comprou PURION GT: R$ 15 de desconto na primeira compra de presente.',
       'valor_fixo', 15.00, 97.90, 20, 60, 1, false, true, true, ARRAY['un','k2','k3'], true, false, 45, false,
       'piloto-2026-11',
       'Benefício pessoal e intransferível, válido por 60 dias a partir da emissão, para uma única compra de presente. Desconto de R$ 15,00 limitado a 20% do valor do pedido, em pedidos a partir de R$ 97,90. Não cumulativo com outros benefícios ou cupons. Não é convertido em dinheiro nem em crédito. Se o pagamento não for aprovado, o benefício volta a ficar disponível dentro da validade; em caso de estorno ou chargeback de um pedido que usou o benefício, ele é cancelado.',
       'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid
WHERE NOT EXISTS (SELECT 1 FROM public.beneficio_politicas WHERE codigo = 'PILOTO_PRESENTE_15');

-- Default de tenant válido também para gravações do servidor (chave de serviço).
ALTER TABLE public.pa_clientes ALTER COLUMN tenant_id SET DEFAULT public.pa__tenant();
ALTER TABLE public.pa_tokens ALTER COLUMN tenant_id SET DEFAULT public.pa__tenant();
ALTER TABLE public.pa_sessoes ALTER COLUMN tenant_id SET DEFAULT public.pa__tenant();
ALTER TABLE public.beneficio_politicas ALTER COLUMN tenant_id SET DEFAULT public.pa__tenant();
ALTER TABLE public.beneficio_vouchers ALTER COLUMN tenant_id SET DEFAULT public.pa__tenant();
ALTER TABLE public.beneficio_resgates ALTER COLUMN tenant_id SET DEFAULT public.pa__tenant();
ALTER TABLE public.beneficio_auditoria ALTER COLUMN tenant_id SET DEFAULT public.pa__tenant();
ALTER TABLE public.consentimentos ALTER COLUMN tenant_id SET DEFAULT public.pa__tenant();
ALTER TABLE public.pa_descadastro_tokens ALTER COLUMN tenant_id SET DEFAULT public.pa__tenant();
ALTER TABLE public.crm_outbox ALTER COLUMN tenant_id SET DEFAULT public.pa__tenant();

-- ── ROLLBACK (manual) ──────────────────────────────────────────────────────
-- DROP FUNCTION IF EXISTS public.beneficio_manutencao(), public.crm_outbox_processar(int), public.consentimento_descadastrar(text,text),
--   public.consentimento_vigente_cliente(text), public.consentimento_registrar(text,uuid,text,boolean,text,text,text,text,text),
--   public.beneficio_politicas_publicas(), public.beneficio_painel(uuid), public.beneficio_evento_pagamento(text,text,text,uuid,text,numeric),
--   public.beneficio_cancelar_reserva(uuid,uuid,text), public.beneficio_reservar(uuid,uuid,text,numeric,boolean,text,text),
--   public.beneficio_emitir_voucher(uuid,text,text,text,text,text), public.beneficio__expirar_voucher(uuid), public.pa_encerrar_sessao(text),
--   public.pa_sessao(text), public.pa_ativar_token(text,text,int,text), public.pa_emitir_token(text,text,text,text,text,int,text),
--   public.beneficio_elegibilidade(uuid,uuid), public.pa__pedidos_pagos(uuid), public.pa__outbox(text,uuid,jsonb,text),
--   public.pa__auditar(text,boolean,text,uuid,uuid,uuid,text,jsonb);
-- DROP VIEW IF EXISTS public.consentimento_vigente;
-- DROP TABLE IF EXISTS public.crm_outbox, public.pa_descadastro_tokens, public.consentimentos, public.beneficio_auditoria,
--   public.beneficio_eventos_pagamento, public.beneficio_resgates, public.beneficio_vouchers, public.beneficio_politicas,
--   public.pa_sessoes, public.pa_tokens, public.pa_clientes;
-- DROP FUNCTION IF EXISTS public.beneficio_auditoria_imutavel();
