-- ============================================================
-- PURION GT — PROGRAMA DE INDICAÇÃO
--
-- Depende de 20261113_private_access_beneficios.sql (pa_clientes, sessões,
-- pa__auditar, pa__outbox, crm_outbox). Aditiva e idempotente.
-- Aplicar no Supabase do purion-os pelo SQL Editor. ROLLBACK no fim.
--
-- REGRA DE ATRIBUIÇÃO (explícita):
--  1. Um clique em /i/<código> grava um visitante anônimo (cookie aleatório,
--     só o HMAC vai ao banco) por até `janela_atribuicao_dias`.
--  2. O visitante só é ATRIBUÍDO quando ativa o convite (gera seu cupom
--     pessoal de uso único). PRIMEIRO CONVITE VÁLIDO VENCE: enquanto houver
--     convite ativo para o visitante, novos links não trocam a atribuição.
--  3. A compra só QUALIFICA se usar esse cupom, for a primeira compra paga
--     do comprador (e-mail/CPF), não for autoindicação (e-mail, CPF,
--     telefone ou endereço do indicador), não duplicar outra indicação
--     qualificada do mesmo comprador e atingir a compra mínima.
--  4. Recompensa do indicador: fica PENDENTE por `janela_validacao_dias`
--     (arrependimento de 7 dias + margem para estorno) e só então é
--     APROVADA, se o pedido continuar pago e não devolvido. Estorno ou
--     chargeback revertem a recompensa (pendente ou aprovada) no ledger.
--  5. Limite de recompensas por indicador (`max_recompensas_por_indicador`).
-- ============================================================

-- ── 1. Programa (configurável pelo admin) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.indicacao_programas (
  id                              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo                          text        NOT NULL,
  ativo                           boolean     NOT NULL DEFAULT false,
  desconto_indicado               numeric(10,2) NOT NULL CHECK (desconto_indicado > 0 AND desconto_indicado <= 100),
  credito_indicador               numeric(10,2) NOT NULL CHECK (credito_indicador > 0 AND credito_indicador <= 100),
  compra_minima                   numeric(10,2) NOT NULL DEFAULT 0 CHECK (compra_minima >= 0),
  desconto_max_percentual         numeric(5,2) NOT NULL DEFAULT 20 CHECK (desconto_max_percentual > 0 AND desconto_max_percentual <= 100),
  janela_atribuicao_dias          int         NOT NULL DEFAULT 30 CHECK (janela_atribuicao_dias BETWEEN 1 AND 90),
  janela_validacao_dias           int         NOT NULL DEFAULT 14 CHECK (janela_validacao_dias BETWEEN 7 AND 120),
  max_recompensas_por_indicador   int         NOT NULL DEFAULT 10 CHECK (max_recompensas_por_indicador BETWEEN 1 AND 1000),
  validade_credito_dias           int         NOT NULL DEFAULT 90 CHECK (validade_credito_dias BETWEEN 7 AND 365),
  max_convites_por_ip_dia         int         NOT NULL DEFAULT 5 CHECK (max_convites_por_ip_dia BETWEEN 1 AND 100),
  custo_industrial_por_frasco     numeric(10,2) NOT NULL DEFAULT 30,
  termos_versao                   text        NOT NULL,
  termos_texto                    text        NOT NULL,
  updated_at                      timestamptz NOT NULL DEFAULT now(),
  atualizado_por                  text,
  created_at                      timestamptz NOT NULL DEFAULT now(),
  tenant_id                       uuid        NOT NULL DEFAULT public.meu_tenant_id()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_indicacao_programas_codigo ON public.indicacao_programas (tenant_id, codigo);

-- ── 2. Código/link do indicador ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.indicacao_codigos (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  programa_id  uuid        NOT NULL REFERENCES public.indicacao_programas(id),
  cliente_id   uuid        NOT NULL REFERENCES public.pa_clientes(id) ON DELETE CASCADE,
  codigo       text        NOT NULL CHECK (codigo ~ '^[2-9A-HJ-NP-Z]{8}$'),  -- público, aleatório, sem dado pessoal
  ativo        boolean     NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  tenant_id    uuid        NOT NULL DEFAULT public.meu_tenant_id()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_indicacao_codigos_codigo ON public.indicacao_codigos (codigo);
CREATE UNIQUE INDEX IF NOT EXISTS uq_indicacao_codigos_cliente ON public.indicacao_codigos (programa_id, cliente_id);

-- ── 3. Cliques (anônimos: só hashes) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.indicacao_cliques (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_id        uuid        NOT NULL REFERENCES public.indicacao_codigos(id) ON DELETE CASCADE,
  visitante_hash   text        NOT NULL CHECK (visitante_hash ~ '^[0-9a-f]{64}$'),
  ip_hash          text,
  contabilizado    boolean     NOT NULL DEFAULT true,   -- false = repetido/abuso (não entra em métricas)
  created_at       timestamptz NOT NULL DEFAULT now(),
  tenant_id        uuid        NOT NULL DEFAULT public.meu_tenant_id()
);
CREATE INDEX IF NOT EXISTS idx_indicacao_cliques_codigo ON public.indicacao_cliques (codigo_id, visitante_hash, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_indicacao_cliques_ip ON public.indicacao_cliques (ip_hash, created_at DESC);

-- ── 4. Atribuições (convite do indicado + ciclo de vida da recompensa) ─────
CREATE TABLE IF NOT EXISTS public.indicacao_atribuicoes (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  programa_id     uuid        NOT NULL REFERENCES public.indicacao_programas(id),
  codigo_id       uuid        NOT NULL REFERENCES public.indicacao_codigos(id) ON DELETE CASCADE,
  indicador_id    uuid        NOT NULL REFERENCES public.pa_clientes(id) ON DELETE CASCADE,
  clique_id       uuid        REFERENCES public.indicacao_cliques(id) ON DELETE SET NULL,
  visitante_hash  text        NOT NULL,
  ip_hash         text,
  cupom_hash      text        NOT NULL CHECK (cupom_hash ~ '^[0-9a-f]{64}$'),
  cupom_cifrado   text        NOT NULL,
  cupom_final     text        NOT NULL CHECK (char_length(cupom_final) = 4),
  status          text        NOT NULL DEFAULT 'convite' CHECK (status IN
                    ('convite','aguardando_pedido','qualificada','aprovada','nao_qualificada','revertida','expirado')),
  motivo          text,       -- interno (operação/CRM). NUNCA exibido ao indicador.
  pedido_ref      text,
  venda_id        uuid,
  valor_pedido    numeric(10,2),
  desconto        numeric(10,2) NOT NULL,
  credito         numeric(10,2) NOT NULL,
  expira_em       timestamptz NOT NULL,
  compra_em       timestamptz,
  qualificada_em  timestamptz,
  validar_apos    timestamptz,
  aprovada_em     timestamptz,
  revertida_em    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  tenant_id       uuid        NOT NULL DEFAULT public.meu_tenant_id()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_indicacao_atrib_cupom ON public.indicacao_atribuicoes (cupom_hash);
-- Primeiro convite vence: no máximo 1 convite ativo por visitante.
CREATE UNIQUE INDEX IF NOT EXISTS uq_indicacao_atrib_visitante_ativo ON public.indicacao_atribuicoes (programa_id, visitante_hash)
  WHERE status IN ('convite','aguardando_pedido');
-- Um pedido gera no máximo uma atribuição.
CREATE UNIQUE INDEX IF NOT EXISTS uq_indicacao_atrib_pedido ON public.indicacao_atribuicoes (pedido_ref) WHERE pedido_ref IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_indicacao_atrib_indicador ON public.indicacao_atribuicoes (indicador_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_indicacao_atrib_status ON public.indicacao_atribuicoes (status, validar_apos);
CREATE INDEX IF NOT EXISTS idx_indicacao_atrib_ip ON public.indicacao_atribuicoes (ip_hash, created_at DESC);

-- ── 5. Códigos de crédito do indicador (uso único) ─────────────────────────
CREATE TABLE IF NOT EXISTS public.indicacao_creditos (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  programa_id   uuid        NOT NULL REFERENCES public.indicacao_programas(id),
  indicador_id  uuid        NOT NULL REFERENCES public.pa_clientes(id) ON DELETE CASCADE,
  codigo_hash   text        NOT NULL CHECK (codigo_hash ~ '^[0-9a-f]{64}$'),
  codigo_cifrado text       NOT NULL,
  codigo_final  text        NOT NULL,
  valor         numeric(10,2) NOT NULL CHECK (valor > 0),
  status        text        NOT NULL DEFAULT 'disponivel' CHECK (status IN ('disponivel','utilizado','expirado')),
  pedido_ref    text,
  expira_em     timestamptz NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  tenant_id     uuid        NOT NULL DEFAULT public.meu_tenant_id()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_indicacao_creditos_codigo ON public.indicacao_creditos (codigo_hash);
CREATE UNIQUE INDEX IF NOT EXISTS uq_indicacao_creditos_ativo ON public.indicacao_creditos (indicador_id) WHERE status = 'disponivel';

-- ── 6. LEDGER de recompensas (somente INSERT; saldo = soma) ────────────────
-- bucket 'pendente' (em validação) e 'disponivel' (pode virar código).
CREATE TABLE IF NOT EXISTS public.indicacao_ledger (
  id              bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  indicador_id    uuid        NOT NULL REFERENCES public.pa_clientes(id) ON DELETE CASCADE,
  atribuicao_id   uuid        REFERENCES public.indicacao_atribuicoes(id) ON DELETE SET NULL,
  credito_id      uuid        REFERENCES public.indicacao_creditos(id) ON DELETE SET NULL,
  tipo            text        NOT NULL CHECK (tipo IN ('pendente','aprovacao_saida','aprovacao_entrada','reversao_pendente',
                                                       'reversao_aprovada','conversao_codigo','codigo_expirado')),
  bucket          text        NOT NULL CHECK (bucket IN ('pendente','disponivel')),
  valor           numeric(10,2) NOT NULL CHECK (valor <> 0),
  created_at      timestamptz NOT NULL DEFAULT now(),
  tenant_id       uuid        NOT NULL DEFAULT public.meu_tenant_id()
);
-- Idempotência: cada transição contábil acontece uma única vez.
CREATE UNIQUE INDEX IF NOT EXISTS uq_indicacao_ledger_atrib ON public.indicacao_ledger (atribuicao_id, tipo) WHERE atribuicao_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_indicacao_ledger_credito ON public.indicacao_ledger (credito_id, tipo) WHERE credito_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_indicacao_ledger_indicador ON public.indicacao_ledger (indicador_id, created_at DESC);
DROP TRIGGER IF EXISTS trg_indicacao_ledger_imutavel ON public.indicacao_ledger;
CREATE TRIGGER trg_indicacao_ledger_imutavel BEFORE UPDATE OR DELETE ON public.indicacao_ledger
  FOR EACH ROW EXECUTE FUNCTION public.beneficio_auditoria_imutavel();

CREATE OR REPLACE VIEW public.indicacao_saldos AS
SELECT indicador_id,
       COALESCE(sum(valor) FILTER (WHERE bucket = 'pendente'), 0)::numeric(10,2)   AS pendente,
       COALESCE(sum(valor) FILTER (WHERE bucket = 'disponivel'), 0)::numeric(10,2) AS disponivel
  FROM public.indicacao_ledger GROUP BY indicador_id;

-- Eventos de pagamento já processados pelo programa (idempotência).
CREATE TABLE IF NOT EXISTS public.indicacao_eventos_pagamento (
  event_id    text        PRIMARY KEY,
  tipo        text        NOT NULL,
  pedido_ref  text,
  resultado   jsonb       NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ── 7. RLS / permissões ────────────────────────────────────────────────────
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['indicacao_programas','indicacao_codigos','indicacao_cliques','indicacao_atribuicoes',
                           'indicacao_creditos','indicacao_ledger','indicacao_eventos_pagamento']
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('REVOKE ALL ON public.%I FROM anon, authenticated', t);
  END LOOP;
  FOREACH t IN ARRAY ARRAY['indicacao_programas','indicacao_codigos','indicacao_atribuicoes','indicacao_ledger']
  LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO authenticated', t);
    EXECUTE format('DROP POLICY IF EXISTS crm_leitura ON public.%I', t);
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'sou_logistica') THEN
      EXECUTE format('CREATE POLICY crm_leitura ON public.%I FOR SELECT TO authenticated USING (tenant_id = public.meu_tenant_id() AND NOT public.sou_logistica())', t);
    ELSE
      EXECUTE format('CREATE POLICY crm_leitura ON public.%I FOR SELECT TO authenticated USING (tenant_id = public.meu_tenant_id())', t);
    END IF;
  END LOOP;
END $$;
REVOKE UPDATE, DELETE, TRUNCATE ON public.indicacao_ledger FROM service_role, authenticated, anon;

-- ── 8. Helpers ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.indicacao__programa(p_codigo text)
RETURNS public.indicacao_programas LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT * FROM public.indicacao_programas WHERE codigo = p_codigo AND tenant_id = public.meu_tenant_id();
$$;

CREATE OR REPLACE FUNCTION public.indicacao__norm_tel(p text) RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE WHEN length(regexp_replace(COALESCE(p, ''), '\D', '', 'g')) >= 8
              THEN right(regexp_replace(p, '\D', '', 'g'), 8) END;
$$;
CREATE OR REPLACE FUNCTION public.indicacao__norm_end(p_cep text, p_numero text) RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE WHEN length(regexp_replace(COALESCE(p_cep, ''), '\D', '', 'g')) = 8 AND btrim(COALESCE(p_numero, '')) <> ''
              THEN regexp_replace(p_cep, '\D', '', 'g') || ':' || lower(regexp_replace(p_numero, '\s', '', 'g')) END;
$$;

-- Pedido pago e não cancelado/devolvido (mesma regra do Private Access).
CREATE OR REPLACE FUNCTION public.indicacao__venda_paga(v public.vendas) RETURNS boolean LANGUAGE sql IMMUTABLE AS $$
  SELECT v.deleted_at IS NULL
     AND (v.status = 'aprovado' OR v.status_pagamento = 'pago')
     AND v.status NOT IN ('estornado','reembolsado','recusado')
     AND COALESCE(v.status_pagamento, '') NOT IN ('estornado','cancelado');
$$;

-- Autoindicação: comprador compartilha e-mail, CPF, telefone ou endereço com
-- o indicador (cadastro do Private Access ou qualquer pedido dele).
CREATE OR REPLACE FUNCTION public.indicacao__autoindicacao(p_indicador uuid, v public.vendas)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH ind AS (SELECT * FROM public.pa_clientes WHERE id = p_indicador),
  vendas_ind AS (
    SELECT x.* FROM public.vendas x, ind
     WHERE x.tenant_id = ind.tenant_id AND x.id <> v.id
       AND (lower(btrim(x.cliente_email)) = ind.email_norm
            OR (ind.documento_norm IS NOT NULL AND regexp_replace(COALESCE(x.cliente_documento, ''), '\D', '', 'g') = ind.documento_norm)))
  SELECT EXISTS (SELECT 1 FROM ind WHERE ind.email_norm = lower(btrim(v.cliente_email))
                    OR (ind.documento_norm IS NOT NULL AND ind.documento_norm = regexp_replace(COALESCE(v.cliente_documento, ''), '\D', '', 'g')))
      OR EXISTS (SELECT 1 FROM vendas_ind x WHERE
                   lower(btrim(x.cliente_email)) = lower(btrim(v.cliente_email))
                OR (length(regexp_replace(COALESCE(v.cliente_documento, ''), '\D', '', 'g')) >= 11
                    AND regexp_replace(COALESCE(x.cliente_documento, ''), '\D', '', 'g') = regexp_replace(v.cliente_documento, '\D', '', 'g'))
                OR (public.indicacao__norm_tel(v.cliente_telefone) IS NOT NULL AND public.indicacao__norm_tel(x.cliente_telefone) = public.indicacao__norm_tel(v.cliente_telefone))
                OR (public.indicacao__norm_end(v.cep, v.numero) IS NOT NULL AND public.indicacao__norm_end(x.cep, x.numero) = public.indicacao__norm_end(v.cep, v.numero)));
$$;

-- Outra compra paga do mesmo comprador (e-mail ou CPF) → não é primeira compra.
CREATE OR REPLACE FUNCTION public.indicacao__tem_outra_compra(v public.vendas)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.vendas x
     WHERE x.tenant_id = v.tenant_id AND x.id <> v.id AND public.indicacao__venda_paga(x)
       AND ((COALESCE(v.cliente_email, '') <> '' AND lower(btrim(x.cliente_email)) = lower(btrim(v.cliente_email)))
         OR (length(regexp_replace(COALESCE(v.cliente_documento, ''), '\D', '', 'g')) >= 11
             AND regexp_replace(COALESCE(x.cliente_documento, ''), '\D', '', 'g') = regexp_replace(v.cliente_documento, '\D', '', 'g'))));
$$;

-- Mesmo comprador já gerou outra indicação qualificada/aprovada.
CREATE OR REPLACE FUNCTION public.indicacao__comprador_duplicado(p_atrib uuid, v public.vendas)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.indicacao_atribuicoes a JOIN public.vendas x ON x.id = a.venda_id
     WHERE a.id <> p_atrib AND a.status IN ('qualificada','aprovada')
       AND ((COALESCE(v.cliente_email, '') <> '' AND lower(btrim(x.cliente_email)) = lower(btrim(v.cliente_email)))
         OR (length(regexp_replace(COALESCE(v.cliente_documento, ''), '\D', '', 'g')) >= 11
             AND regexp_replace(COALESCE(x.cliente_documento, ''), '\D', '', 'g') = regexp_replace(v.cliente_documento, '\D', '', 'g'))));
$$;

CREATE OR REPLACE FUNCTION public.indicacao__ledger(p_indicador uuid, p_atrib uuid, p_credito uuid, p_tipo text, p_bucket text, p_valor numeric)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.indicacao_ledger (indicador_id, atribuicao_id, credito_id, tipo, bucket, valor)
  VALUES (p_indicador, p_atrib, p_credito, p_tipo, p_bucket, p_valor);
  RETURN true;
EXCEPTION WHEN unique_violation THEN
  RETURN false; -- transição já lançada (idempotente)
END $$;

-- ── 9. Link do indicador ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.indicacao_meu_codigo(p_cliente uuid, p_programa text, p_codigo_novo text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE prog public.indicacao_programas; c public.indicacao_codigos;
BEGIN
  prog := public.indicacao__programa(p_programa);
  IF prog.id IS NULL OR NOT prog.ativo THEN RETURN jsonb_build_object('resultado', 'programa_inativo'); END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended('ind-codigo:' || p_cliente, 0));
  SELECT * INTO c FROM public.indicacao_codigos WHERE programa_id = prog.id AND cliente_id = p_cliente;
  IF FOUND THEN
    RETURN jsonb_build_object('resultado', CASE WHEN c.ativo THEN 'existente' ELSE 'bloqueado' END, 'codigo', CASE WHEN c.ativo THEN c.codigo END);
  END IF;
  -- Só quem já comprou (pedido pago e não estornado) indica.
  IF NOT EXISTS (SELECT 1 FROM public.pa__pedidos_pagos(p_cliente)) THEN
    PERFORM public.pa__auditar('indicacao_link', false, 'sem_compra_paga', p_cliente, NULL, NULL, NULL);
    RETURN jsonb_build_object('resultado', 'nao_elegivel');
  END IF;
  INSERT INTO public.indicacao_codigos (programa_id, cliente_id, codigo) VALUES (prog.id, p_cliente, p_codigo_novo) RETURNING * INTO c;
  PERFORM public.pa__auditar('indicacao_link', true, NULL, p_cliente, NULL, NULL, NULL, jsonb_build_object('codigo_id', c.id));
  PERFORM public.pa__outbox('referral_link_created', c.id, jsonb_build_object('indicador_id', p_cliente), 'referral_link_created:' || c.id);
  RETURN jsonb_build_object('resultado', 'criado', 'codigo', c.codigo);
END $$;

-- ── 10. Clique (anônimo) ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.indicacao_registrar_clique(p_codigo text, p_visitante_hash text, p_ip_hash text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE c public.indicacao_codigos; prog public.indicacao_programas; existente uuid; novo uuid; recentes int;
BEGIN
  SELECT * INTO c FROM public.indicacao_codigos WHERE codigo = upper(p_codigo);
  IF NOT FOUND THEN RETURN jsonb_build_object('resultado', 'invalido'); END IF;
  SELECT * INTO prog FROM public.indicacao_programas WHERE id = c.programa_id;
  IF NOT c.ativo OR NOT prog.ativo THEN RETURN jsonb_build_object('resultado', 'inativo'); END IF;

  -- Múltiplos cliques do mesmo visitante no mesmo link em 24 h contam uma vez.
  SELECT id INTO existente FROM public.indicacao_cliques
   WHERE codigo_id = c.id AND visitante_hash = p_visitante_hash AND created_at > now() - interval '24 hours' AND contabilizado
   ORDER BY created_at DESC LIMIT 1;
  IF existente IS NOT NULL THEN RETURN jsonb_build_object('resultado', 'repetido', 'clique_id', existente); END IF;

  -- Abuso: muitos cliques do mesmo IP em 1 h não são contabilizados.
  SELECT count(*) INTO recentes FROM public.indicacao_cliques WHERE ip_hash = p_ip_hash AND created_at > now() - interval '1 hour';
  INSERT INTO public.indicacao_cliques (codigo_id, visitante_hash, ip_hash, contabilizado)
  VALUES (c.id, p_visitante_hash, p_ip_hash, recentes < 30) RETURNING id INTO novo;
  IF recentes < 30 THEN
    PERFORM public.pa__outbox('referral_clicked', novo, jsonb_build_object('codigo_id', c.id), 'referral_clicked:' || novo);
  END IF;
  RETURN jsonb_build_object('resultado', CASE WHEN recentes < 30 THEN 'registrado' ELSE 'limitado' END, 'clique_id', novo);
END $$;

-- ── 11. Convite do indicado (atribuição + cupom pessoal de uso único) ─────
CREATE OR REPLACE FUNCTION public.indicacao_gerar_convite(p_codigo text, p_visitante_hash text, p_ip_hash text,
                                                          p_cupom_hash text, p_cupom_cifrado text, p_cupom_final text,
                                                          p_cliente_sessao uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE c public.indicacao_codigos; prog public.indicacao_programas; a public.indicacao_atribuicoes; clique uuid; convites_ip int;
BEGIN
  SELECT * INTO c FROM public.indicacao_codigos WHERE codigo = upper(p_codigo);
  IF NOT FOUND THEN RETURN jsonb_build_object('resultado', 'invalido'); END IF;
  SELECT * INTO prog FROM public.indicacao_programas WHERE id = c.programa_id;
  IF NOT c.ativo OR NOT prog.ativo THEN RETURN jsonb_build_object('resultado', 'inativo'); END IF;

  -- Serializa por visitante (cliques/abas simultâneos).
  PERFORM pg_advisory_xact_lock(hashtextextended('ind-visit:' || p_visitante_hash, 0));

  -- Expira convite vencido deste visitante antes de decidir.
  UPDATE public.indicacao_atribuicoes SET status = 'expirado', updated_at = now()
   WHERE programa_id = prog.id AND visitante_hash = p_visitante_hash AND status = 'convite' AND expira_em <= now();

  -- Primeiro convite válido vence (mesmo que o link agora seja outro).
  SELECT * INTO a FROM public.indicacao_atribuicoes
   WHERE programa_id = prog.id AND visitante_hash = p_visitante_hash AND status IN ('convite','aguardando_pedido');
  IF FOUND THEN
    RETURN jsonb_build_object('resultado', 'existente', 'atribuicao_id', a.id, 'mesmo_link', a.codigo_id = c.id);
  END IF;

  -- Autoindicação óbvia: o próprio indicador logado no Private Access.
  IF p_cliente_sessao IS NOT NULL AND p_cliente_sessao = c.cliente_id THEN
    PERFORM public.pa__auditar('indicacao_convite', false, 'autoindicacao', c.cliente_id, NULL, NULL, p_ip_hash);
    RETURN jsonb_build_object('resultado', 'autoindicacao');
  END IF;

  SELECT count(*) INTO convites_ip FROM public.indicacao_atribuicoes WHERE ip_hash = p_ip_hash AND created_at > now() - interval '24 hours';
  IF p_ip_hash IS NOT NULL AND convites_ip >= prog.max_convites_por_ip_dia THEN
    PERFORM public.pa__auditar('indicacao_convite', false, 'limite_ip', c.cliente_id, NULL, NULL, p_ip_hash);
    RETURN jsonb_build_object('resultado', 'limite');
  END IF;

  SELECT id INTO clique FROM public.indicacao_cliques WHERE codigo_id = c.id AND visitante_hash = p_visitante_hash ORDER BY created_at DESC LIMIT 1;
  INSERT INTO public.indicacao_atribuicoes (programa_id, codigo_id, indicador_id, clique_id, visitante_hash, ip_hash,
                                            cupom_hash, cupom_cifrado, cupom_final, desconto, credito, expira_em)
  VALUES (prog.id, c.id, c.cliente_id, clique, p_visitante_hash, p_ip_hash, p_cupom_hash, p_cupom_cifrado, p_cupom_final,
          prog.desconto_indicado, prog.credito_indicador, now() + make_interval(days => prog.janela_atribuicao_dias))
  RETURNING * INTO a;
  PERFORM public.pa__auditar('indicacao_convite', true, NULL, c.cliente_id, NULL, NULL, p_ip_hash, jsonb_build_object('atribuicao_id', a.id));
  PERFORM public.pa__outbox('referral_attributed', a.id, jsonb_build_object('codigo_id', c.id, 'indicador_id', c.cliente_id), 'referral_attributed:' || a.id);
  RETURN jsonb_build_object('resultado', 'criado', 'atribuicao_id', a.id);
END $$;

-- Convite do visitante (para exibir o cupom ao próprio indicado).
CREATE OR REPLACE FUNCTION public.indicacao_convite_visitante(p_programa text, p_visitante_hash text)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object('atribuicao_id', a.id, 'status', a.status, 'cupom_cifrado', a.cupom_cifrado, 'cupom_final', a.cupom_final,
                            'desconto', a.desconto, 'expira_em', a.expira_em)
    FROM public.indicacao_atribuicoes a JOIN public.indicacao_programas p ON p.id = a.programa_id
   WHERE p.codigo = p_programa AND a.visitante_hash = p_visitante_hash AND a.status IN ('convite','aguardando_pedido') AND a.expira_em > now()
   ORDER BY a.created_at DESC LIMIT 1;
$$;

-- ── 12. Avaliação da compra (regras de qualificação) ──────────────────────
CREATE OR REPLACE FUNCTION public.indicacao__avaliar(p_atrib uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE a public.indicacao_atribuicoes; prog public.indicacao_programas; v public.vendas; v_motivo text := NULL; recompensas int;
BEGIN
  SELECT * INTO a FROM public.indicacao_atribuicoes WHERE id = p_atrib FOR UPDATE;
  IF a.status NOT IN ('convite','aguardando_pedido') THEN RETURN a.status; END IF;
  SELECT * INTO prog FROM public.indicacao_programas WHERE id = a.programa_id;

  -- O pedido chega ao banco pelo webhook Appmax do CRM; pode chegar depois do evento.
  SELECT * INTO v FROM public.vendas WHERE pedido_appmax = a.pedido_ref AND tenant_id = a.tenant_id ORDER BY data_venda DESC LIMIT 1;
  IF v.id IS NULL OR NOT public.indicacao__venda_paga(v) THEN
    UPDATE public.indicacao_atribuicoes SET status = 'aguardando_pedido', updated_at = now() WHERE id = a.id;
    RETURN 'aguardando_pedido';
  END IF;

  -- Limite por indicador: serializa a contagem do mesmo indicador.
  PERFORM pg_advisory_xact_lock(hashtextextended('ind-indicador:' || a.indicador_id, 0));

  IF COALESCE(a.valor_pedido, v.valor_total, v.valor_bruto, 0) < prog.compra_minima THEN v_motivo := 'compra_minima';
  ELSIF public.indicacao__autoindicacao(a.indicador_id, v) THEN v_motivo := 'autoindicacao';
  ELSIF public.indicacao__tem_outra_compra(v) THEN v_motivo := 'nao_primeira_compra';
  ELSIF public.indicacao__comprador_duplicado(a.id, v) THEN v_motivo := 'comprador_duplicado';
  ELSE
    SELECT count(*) INTO recompensas FROM public.indicacao_atribuicoes
     WHERE indicador_id = a.indicador_id AND programa_id = a.programa_id AND status IN ('qualificada','aprovada') AND id <> a.id;
    IF recompensas >= prog.max_recompensas_por_indicador THEN v_motivo := 'limite_indicador'; END IF;
  END IF;

  IF v_motivo IS NOT NULL THEN
    UPDATE public.indicacao_atribuicoes SET status = 'nao_qualificada', motivo = v_motivo, venda_id = v.id, updated_at = now() WHERE id = a.id;
    PERFORM public.pa__auditar('indicacao_qualificacao', false, v_motivo, a.indicador_id, NULL, NULL, NULL, jsonb_build_object('atribuicao_id', a.id));
    IF v_motivo = 'autoindicacao' THEN
      PERFORM public.pa__outbox('referral_fraud_suspected', a.id, jsonb_build_object('motivo', v_motivo, 'pedido', a.pedido_ref), 'referral_fraud:' || a.id);
    END IF;
    RETURN 'nao_qualificada';
  END IF;

  UPDATE public.indicacao_atribuicoes
     SET status = 'qualificada', venda_id = v.id, valor_pedido = COALESCE(a.valor_pedido, v.valor_total, v.valor_bruto),
         qualificada_em = now(), validar_apos = now() + make_interval(days => prog.janela_validacao_dias), updated_at = now()
   WHERE id = a.id;
  PERFORM public.indicacao__ledger(a.indicador_id, a.id, NULL, 'pendente', 'pendente', a.credito);
  PERFORM public.pa__auditar('indicacao_qualificacao', true, NULL, a.indicador_id, NULL, NULL, NULL, jsonb_build_object('atribuicao_id', a.id));
  PERFORM public.pa__outbox('referral_purchase_qualified', a.id, jsonb_build_object('pedido', a.pedido_ref), 'referral_purchase_qualified:' || a.id);
  PERFORM public.pa__outbox('referral_reward_pending', a.id,
    jsonb_build_object('indicador_id', a.indicador_id, 'valor', a.credito, 'validar_apos', now() + make_interval(days => prog.janela_validacao_dias)),
    'referral_reward_pending:' || a.id);
  RETURN 'qualificada';
END $$;

CREATE OR REPLACE FUNCTION public.indicacao__reverter(p_atrib uuid, p_motivo text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE a public.indicacao_atribuicoes;
BEGIN
  SELECT * INTO a FROM public.indicacao_atribuicoes WHERE id = p_atrib FOR UPDATE;
  IF a.status = 'qualificada' THEN
    PERFORM public.indicacao__ledger(a.indicador_id, a.id, NULL, 'reversao_pendente', 'pendente', -a.credito);
  ELSIF a.status = 'aprovada' THEN
    -- Após aprovação, o saldo disponível pode ficar negativo: compensa futuras recompensas.
    PERFORM public.indicacao__ledger(a.indicador_id, a.id, NULL, 'reversao_aprovada', 'disponivel', -a.credito);
  ELSE
    IF a.status IN ('convite','aguardando_pedido') THEN
      UPDATE public.indicacao_atribuicoes SET status = 'revertida', motivo = p_motivo, revertida_em = now(), updated_at = now() WHERE id = a.id;
    END IF;
    RETURN a.status;
  END IF;
  UPDATE public.indicacao_atribuicoes SET status = 'revertida', motivo = p_motivo, revertida_em = now(), updated_at = now() WHERE id = a.id;
  PERFORM public.pa__auditar('indicacao_reversao', true, p_motivo, a.indicador_id, NULL, NULL, NULL, jsonb_build_object('atribuicao_id', a.id));
  PERFORM public.pa__outbox('referral_reward_reversed', a.id, jsonb_build_object('motivo', p_motivo, 'valor', a.credito, 'estava', a.status),
                            'referral_reward_reversed:' || a.id);
  RETURN 'revertida';
END $$;

-- ── 13. Eventos de pagamento (cupom do indicado ou crédito do indicador) ──
CREATE OR REPLACE FUNCTION public.indicacao_evento_pagamento(p_event_id text, p_tipo text, p_pedido_ref text, p_codigo_hash text, p_valor_pedido numeric)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE ja public.indicacao_eventos_pagamento; a public.indicacao_atribuicoes; cr public.indicacao_creditos; res jsonb; st text;
BEGIN
  IF p_tipo NOT IN ('pago','falhou','cancelado','estornado','chargeback') THEN RAISE EXCEPTION 'tipo de evento inválido'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended('ind-evt:' || p_event_id, 0));
  SELECT * INTO ja FROM public.indicacao_eventos_pagamento WHERE event_id = p_event_id;
  IF FOUND THEN RETURN ja.resultado || jsonb_build_object('repetido', true); END IF;

  SELECT * INTO a FROM public.indicacao_atribuicoes WHERE cupom_hash = p_codigo_hash FOR UPDATE;
  IF a.id IS NOT NULL THEN
    IF p_tipo = 'pago' THEN
      IF a.pedido_ref IS NOT NULL AND a.pedido_ref <> p_pedido_ref THEN
        res := jsonb_build_object('resultado', 'uso_duplicado');
        PERFORM public.pa__outbox('referral_fraud_suspected', a.id, jsonb_build_object('motivo', 'cupom_reutilizado', 'pedido', p_pedido_ref),
                                  'referral_dup:' || p_event_id);
      ELSIF a.status IN ('convite','aguardando_pedido','expirado') THEN
        UPDATE public.indicacao_atribuicoes SET pedido_ref = p_pedido_ref, valor_pedido = COALESCE(p_valor_pedido, valor_pedido),
               compra_em = COALESCE(compra_em, now()), status = CASE WHEN status = 'expirado' THEN 'convite' ELSE status END, updated_at = now()
         WHERE id = a.id;
        st := public.indicacao__avaliar(a.id);
        res := jsonb_build_object('resultado', st, 'atribuicao_id', a.id);
      ELSE
        res := jsonb_build_object('resultado', a.status, 'atribuicao_id', a.id);
      END IF;
    ELSIF p_tipo IN ('falhou','cancelado') THEN
      IF a.status IN ('convite','aguardando_pedido') AND (a.pedido_ref IS NULL OR a.pedido_ref = p_pedido_ref) THEN
        -- Pedido não concluído: o convite volta a valer (dentro da validade).
        UPDATE public.indicacao_atribuicoes SET status = 'convite', pedido_ref = NULL, valor_pedido = NULL, compra_em = NULL, updated_at = now() WHERE id = a.id;
        res := jsonb_build_object('resultado', 'convite_liberado');
      ELSIF a.status IN ('qualificada','aprovada') AND a.pedido_ref = p_pedido_ref THEN
        res := jsonb_build_object('resultado', public.indicacao__reverter(a.id, 'pedido_' || p_tipo));
      ELSE
        res := jsonb_build_object('resultado', 'sem_efeito');
      END IF;
    ELSE
      IF a.pedido_ref = p_pedido_ref THEN
        res := jsonb_build_object('resultado', public.indicacao__reverter(a.id, p_tipo));
      ELSE
        res := jsonb_build_object('resultado', 'sem_efeito');
      END IF;
    END IF;
  ELSE
    SELECT * INTO cr FROM public.indicacao_creditos WHERE codigo_hash = p_codigo_hash FOR UPDATE;
    IF cr.id IS NULL THEN
      res := jsonb_build_object('resultado', 'ignorado');
    ELSIF p_tipo = 'pago' THEN
      IF cr.status = 'disponivel' THEN
        UPDATE public.indicacao_creditos SET status = 'utilizado', pedido_ref = p_pedido_ref, updated_at = now() WHERE id = cr.id;
        PERFORM public.pa__auditar('indicacao_credito_usado', true, NULL, cr.indicador_id, NULL, NULL, NULL, jsonb_build_object('credito_id', cr.id));
        res := jsonb_build_object('resultado', 'credito_utilizado');
      ELSIF cr.pedido_ref = p_pedido_ref THEN
        res := jsonb_build_object('resultado', 'credito_utilizado');
      ELSE
        res := jsonb_build_object('resultado', 'uso_duplicado');
        PERFORM public.pa__outbox('referral_fraud_suspected', cr.id, jsonb_build_object('motivo', 'credito_reutilizado', 'pedido', p_pedido_ref), 'referral_cdup:' || p_event_id);
      END IF;
    ELSE
      -- Crédito não vira dinheiro: estorno de pedido pago com crédito não devolve saldo.
      res := jsonb_build_object('resultado', 'sem_efeito');
    END IF;
  END IF;

  INSERT INTO public.indicacao_eventos_pagamento (event_id, tipo, pedido_ref, resultado) VALUES (p_event_id, p_tipo, p_pedido_ref, res);
  RETURN res;
END $$;

-- ── 14. Rotina: aprova após a janela, reprocessa pendências, expira ───────
CREATE OR REPLACE FUNCTION public.indicacao_processar()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r record; v public.vendas; aprovadas int := 0; revertidas int := 0; reavaliadas int := 0; expirados int := 0;
BEGIN
  FOR r IN SELECT id FROM public.indicacao_atribuicoes WHERE status = 'aguardando_pedido' AND compra_em > now() - interval '15 days'
            ORDER BY created_at FOR UPDATE SKIP LOCKED LOOP
    PERFORM public.indicacao__avaliar(r.id); reavaliadas := reavaliadas + 1;
  END LOOP;

  FOR r IN SELECT * FROM public.indicacao_atribuicoes WHERE status = 'qualificada' AND validar_apos <= now()
            ORDER BY validar_apos FOR UPDATE SKIP LOCKED LOOP
    SELECT * INTO v FROM public.vendas WHERE id = r.venda_id;
    IF v.id IS NULL OR NOT public.indicacao__venda_paga(v) THEN
      PERFORM public.indicacao__reverter(r.id, 'pedido_nao_pago_na_validacao'); revertidas := revertidas + 1;
    ELSE
      PERFORM public.indicacao__ledger(r.indicador_id, r.id, NULL, 'aprovacao_saida', 'pendente', -r.credito);
      PERFORM public.indicacao__ledger(r.indicador_id, r.id, NULL, 'aprovacao_entrada', 'disponivel', r.credito);
      UPDATE public.indicacao_atribuicoes SET status = 'aprovada', aprovada_em = now(), updated_at = now() WHERE id = r.id;
      PERFORM public.pa__auditar('indicacao_aprovacao', true, NULL, r.indicador_id, NULL, NULL, NULL, jsonb_build_object('atribuicao_id', r.id));
      PERFORM public.pa__outbox('referral_reward_approved', r.id, jsonb_build_object('indicador_id', r.indicador_id, 'valor', r.credito),
                                'referral_reward_approved:' || r.id);
      aprovadas := aprovadas + 1;
    END IF;
  END LOOP;

  UPDATE public.indicacao_atribuicoes SET status = 'expirado', updated_at = now() WHERE status = 'convite' AND expira_em <= now();
  GET DIAGNOSTICS expirados = ROW_COUNT;

  -- Código de crédito vencido sem uso devolve o saldo ao indicador.
  FOR r IN SELECT * FROM public.indicacao_creditos WHERE status = 'disponivel' AND expira_em <= now() FOR UPDATE SKIP LOCKED LOOP
    UPDATE public.indicacao_creditos SET status = 'expirado', updated_at = now() WHERE id = r.id;
    PERFORM public.indicacao__ledger(r.indicador_id, NULL, r.id, 'codigo_expirado', 'disponivel', r.valor);
  END LOOP;

  RETURN jsonb_build_object('aprovadas', aprovadas, 'revertidas', revertidas, 'reavaliadas', reavaliadas, 'convites_expirados', expirados);
END $$;

-- ── 15. Crédito do indicador → código de uso único ────────────────────────
CREATE OR REPLACE FUNCTION public.indicacao_gerar_credito(p_cliente uuid, p_programa text, p_codigo_hash text, p_codigo_cifrado text, p_codigo_final text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE prog public.indicacao_programas; saldo numeric; cr public.indicacao_creditos;
BEGIN
  prog := public.indicacao__programa(p_programa);
  IF prog.id IS NULL THEN RETURN jsonb_build_object('resultado', 'programa_inexistente'); END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended('ind-credito:' || p_cliente, 0));
  SELECT * INTO cr FROM public.indicacao_creditos WHERE indicador_id = p_cliente AND status = 'disponivel';
  IF FOUND THEN RETURN jsonb_build_object('resultado', 'ja_existe', 'credito_id', cr.id); END IF;
  SELECT disponivel INTO saldo FROM public.indicacao_saldos WHERE indicador_id = p_cliente;
  IF COALESCE(saldo, 0) <= 0 THEN RETURN jsonb_build_object('resultado', 'sem_saldo'); END IF;
  INSERT INTO public.indicacao_creditos (programa_id, indicador_id, codigo_hash, codigo_cifrado, codigo_final, valor, expira_em)
  VALUES (prog.id, p_cliente, p_codigo_hash, p_codigo_cifrado, p_codigo_final, saldo, now() + make_interval(days => prog.validade_credito_dias))
  RETURNING * INTO cr;
  PERFORM public.indicacao__ledger(p_cliente, NULL, cr.id, 'conversao_codigo', 'disponivel', -saldo);
  PERFORM public.pa__auditar('indicacao_credito_codigo', true, NULL, p_cliente, NULL, NULL, NULL, jsonb_build_object('credito_id', cr.id, 'valor', saldo));
  RETURN jsonb_build_object('resultado', 'criado', 'credito_id', cr.id, 'valor', saldo);
END $$;

-- ── 16. Painel do indicador (SEM dados do indicado) ───────────────────────
CREATE OR REPLACE FUNCTION public.indicacao_painel(p_cliente uuid, p_programa text)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE prog public.indicacao_programas; c public.indicacao_codigos; s record;
BEGIN
  prog := public.indicacao__programa(p_programa);
  SELECT * INTO c FROM public.indicacao_codigos WHERE programa_id = prog.id AND cliente_id = p_cliente;
  SELECT * INTO s FROM public.indicacao_saldos WHERE indicador_id = p_cliente;
  RETURN jsonb_build_object(
    'pode_indicar', EXISTS (SELECT 1 FROM public.pa__pedidos_pagos(p_cliente)),
    'codigo', CASE WHEN c.ativo THEN c.codigo END,
    'saldo', jsonb_build_object('pendente', COALESCE(s.pendente, 0), 'disponivel', COALESCE(s.disponivel, 0)),
    'resumo', jsonb_build_object(
      'visitantes', (SELECT count(DISTINCT visitante_hash) FROM public.indicacao_cliques WHERE codigo_id = c.id AND contabilizado),
      'convites', (SELECT count(*) FROM public.indicacao_atribuicoes WHERE codigo_id = c.id),
      'em_validacao', (SELECT count(*) FROM public.indicacao_atribuicoes WHERE codigo_id = c.id AND status = 'qualificada'),
      'aprovadas', (SELECT count(*) FROM public.indicacao_atribuicoes WHERE codigo_id = c.id AND status = 'aprovada')),
    -- Só status agregado, data (dia) e valor da recompensa. Nada do indicado:
    -- nem nome, nem e-mail, nem valor do pedido, nem o motivo de recusa.
    'indicacoes', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
               'status', CASE a.status WHEN 'convite' THEN 'convite_ativo' WHEN 'aguardando_pedido' THEN 'compra_em_analise'
                                       WHEN 'qualificada' THEN 'em_validacao' WHEN 'aprovada' THEN 'aprovada'
                                       WHEN 'nao_qualificada' THEN 'nao_elegivel' WHEN 'revertida' THEN 'revertida' ELSE 'expirado' END,
               'data', (COALESCE(a.qualificada_em, a.created_at))::date,
               'recompensa', CASE WHEN a.status IN ('qualificada','aprovada','revertida') THEN a.credito END,
               'liberacao_prevista', CASE WHEN a.status = 'qualificada' THEN a.validar_apos::date END)
             ORDER BY a.created_at DESC)
        FROM public.indicacao_atribuicoes a WHERE a.codigo_id = c.id), '[]'::jsonb),
    'extrato', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('tipo', l.tipo, 'bucket', l.bucket, 'valor', l.valor, 'data', l.created_at::date) ORDER BY l.id DESC)
        FROM public.indicacao_ledger l WHERE l.indicador_id = p_cliente), '[]'::jsonb),
    'creditos', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('id', x.id, 'valor', x.valor, 'status', x.status, 'codigo_cifrado', x.codigo_cifrado,
                                          'codigo_final', x.codigo_final, 'expira_em', x.expira_em) ORDER BY x.created_at DESC)
        FROM public.indicacao_creditos x WHERE x.indicador_id = p_cliente), '[]'::jsonb));
END $$;

CREATE OR REPLACE FUNCTION public.indicacao_programa_publico(p_programa text)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE WHEN p.id IS NULL THEN NULL ELSE jsonb_build_object(
    'ativo', p.ativo, 'desconto_indicado', p.desconto_indicado, 'credito_indicador', p.credito_indicador, 'compra_minima', p.compra_minima,
    'desconto_max_percentual', p.desconto_max_percentual, 'janela_atribuicao_dias', p.janela_atribuicao_dias,
    'janela_validacao_dias', p.janela_validacao_dias, 'max_recompensas_por_indicador', p.max_recompensas_por_indicador,
    'validade_credito_dias', p.validade_credito_dias, 'termos_versao', p.termos_versao, 'termos_texto', p.termos_texto) END
  FROM (SELECT * FROM public.indicacao_programas WHERE codigo = p_programa AND tenant_id = public.meu_tenant_id()) p
  RIGHT JOIN (SELECT 1) one ON true;
$$;

-- ── 17. Admin: ajuste de valores, limites e validade ──────────────────────
CREATE OR REPLACE FUNCTION public.indicacao_programa_atualizar(p_programa text, p_campos jsonb, p_por text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE prog public.indicacao_programas; k text; permitidos text[] := ARRAY['ativo','desconto_indicado','credito_indicador','compra_minima',
  'desconto_max_percentual','janela_atribuicao_dias','janela_validacao_dias','max_recompensas_por_indicador','validade_credito_dias',
  'max_convites_por_ip_dia','custo_industrial_por_frasco','termos_versao','termos_texto'];
BEGIN
  FOR k IN SELECT jsonb_object_keys(p_campos) LOOP
    IF NOT (k = ANY (permitidos)) THEN RETURN jsonb_build_object('resultado', 'campo_invalido', 'campo', k); END IF;
  END LOOP;
  -- Mudança de valores/termos exige nova versão dos termos (registro do que o cliente viu).
  IF (p_campos ?| ARRAY['desconto_indicado','credito_indicador','compra_minima','janela_validacao_dias','termos_texto']) AND NOT (p_campos ? 'termos_versao') THEN
    RETURN jsonb_build_object('resultado', 'termos_versao_obrigatoria');
  END IF;
  UPDATE public.indicacao_programas p SET
    ativo = COALESCE((p_campos->>'ativo')::boolean, p.ativo),
    desconto_indicado = COALESCE((p_campos->>'desconto_indicado')::numeric, p.desconto_indicado),
    credito_indicador = COALESCE((p_campos->>'credito_indicador')::numeric, p.credito_indicador),
    compra_minima = COALESCE((p_campos->>'compra_minima')::numeric, p.compra_minima),
    desconto_max_percentual = COALESCE((p_campos->>'desconto_max_percentual')::numeric, p.desconto_max_percentual),
    janela_atribuicao_dias = COALESCE((p_campos->>'janela_atribuicao_dias')::int, p.janela_atribuicao_dias),
    janela_validacao_dias = COALESCE((p_campos->>'janela_validacao_dias')::int, p.janela_validacao_dias),
    max_recompensas_por_indicador = COALESCE((p_campos->>'max_recompensas_por_indicador')::int, p.max_recompensas_por_indicador),
    validade_credito_dias = COALESCE((p_campos->>'validade_credito_dias')::int, p.validade_credito_dias),
    max_convites_por_ip_dia = COALESCE((p_campos->>'max_convites_por_ip_dia')::int, p.max_convites_por_ip_dia),
    custo_industrial_por_frasco = COALESCE((p_campos->>'custo_industrial_por_frasco')::numeric, p.custo_industrial_por_frasco),
    termos_versao = COALESCE(p_campos->>'termos_versao', p.termos_versao),
    termos_texto = COALESCE(p_campos->>'termos_texto', p.termos_texto),
    updated_at = now(), atualizado_por = p_por
  WHERE p.codigo = p_programa AND p.tenant_id = public.meu_tenant_id()
  RETURNING * INTO prog;
  IF prog.id IS NULL THEN RETURN jsonb_build_object('resultado', 'programa_inexistente'); END IF;
  PERFORM public.pa__auditar('indicacao_programa_atualizado', true, NULL, NULL, NULL, NULL, NULL, jsonb_build_object('campos', p_campos, 'por', p_por));
  PERFORM public.pa__outbox('referral_program_updated', prog.id, p_campos, 'referral_program_updated:' || prog.id || ':' || extract(epoch from clock_timestamp()));
  RETURN jsonb_build_object('resultado', 'ok', 'programa', public.indicacao_programa_publico(p_programa));
EXCEPTION WHEN check_violation OR invalid_text_representation THEN
  RETURN jsonb_build_object('resultado', 'valor_invalido', 'erro', SQLERRM);
END $$;

-- ── 18. Mensuração ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.indicacao_metricas(p_programa text, p_desde timestamptz DEFAULT now() - interval '90 days')
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH prog AS (SELECT * FROM public.indicacao_programas WHERE codigo = p_programa AND tenant_id = public.meu_tenant_id()),
  cods AS (SELECT c.id FROM public.indicacao_codigos c, prog WHERE c.programa_id = prog.id),
  cli AS (SELECT * FROM public.indicacao_cliques WHERE codigo_id IN (SELECT id FROM cods) AND contabilizado AND created_at >= p_desde),
  atr AS (SELECT a.*, v.quantidade, v.frascos_por_unidade FROM public.indicacao_atribuicoes a LEFT JOIN public.vendas v ON v.id = a.venda_id, prog
           WHERE a.programa_id = prog.id AND a.created_at >= p_desde),
  ok AS (SELECT * FROM atr WHERE status IN ('qualificada','aprovada')),
  usados AS (SELECT * FROM atr WHERE pedido_ref IS NOT NULL AND status IN ('qualificada','aprovada','nao_qualificada','revertida')),
  led AS (SELECT l.* FROM public.indicacao_ledger l JOIN atr ON atr.id = l.atribuicao_id),
  n AS (SELECT
    (SELECT count(DISTINCT visitante_hash) FROM cli) AS visitantes,
    (SELECT count(*) FROM cli) AS cliques,
    (SELECT count(*) FROM atr) AS convites,
    (SELECT count(*) FROM ok) AS compradores_novos,
    (SELECT COALESCE(sum(valor_pedido), 0) FROM ok) AS receita_atribuida,
    (SELECT COALESCE(sum(desconto), 0) FROM usados) AS descontos_concedidos,
    (SELECT COALESCE(sum(valor), 0) FROM led WHERE tipo = 'aprovacao_entrada') - (SELECT COALESCE(sum(-valor), 0) FROM led WHERE tipo = 'reversao_aprovada') AS creditos_aprovados,
    (SELECT COALESCE(sum(valor), 0) FROM led WHERE bucket = 'pendente') AS creditos_pendentes,
    (SELECT COALESCE(sum(COALESCE(quantidade, 1) * COALESCE(frascos_por_unidade, 1)), 0) FROM ok) AS frascos,
    (SELECT custo_industrial_por_frasco FROM prog) AS custo_frasco,
    (SELECT count(*) FROM atr WHERE status = 'nao_qualificada') AS nao_qualificadas,
    (SELECT count(*) FROM atr WHERE status = 'revertida') AS revertidas)
  SELECT jsonb_build_object(
    'visitantes', visitantes, 'cliques', cliques, 'convites', convites, 'compradores_novos', compradores_novos,
    'receita_atribuida', receita_atribuida, 'descontos_concedidos', descontos_concedidos,
    'creditos_aprovados', creditos_aprovados, 'creditos_pendentes', creditos_pendentes,
    'custo_produto_estimado', frascos * custo_frasco,
    -- Margem de contribuição (antes de frete, gateway, impostos e mídia):
    -- receita (já líquida do desconto do indicado) − custo industrial − créditos.
    'margem_contribuicao', receita_atribuida - frascos * custo_frasco - creditos_aprovados - creditos_pendentes,
    'custo_aquisicao_por_cliente', CASE WHEN compradores_novos > 0 THEN round((descontos_concedidos + creditos_aprovados + creditos_pendentes) / compradores_novos, 2) END,
    'conversao_visitante_comprador', CASE WHEN visitantes > 0 THEN round(compradores_novos::numeric / visitantes, 4) END,
    'nao_qualificadas', nao_qualificadas, 'revertidas', revertidas, 'desde', p_desde)
  FROM n;
$$;

-- ── 19. Outbox: notificações do programa no CRM ───────────────────────────
-- Estende o despacho da outbox (mesma lógica, mais tipos notificados).
CREATE OR REPLACE FUNCTION public.crm_outbox_processar(p_limite int DEFAULT 50)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE e public.crm_outbox; ok int := 0; erro int := 0;
BEGIN
  FOR e IN SELECT * FROM public.crm_outbox
            WHERE status IN ('pendente','erro') AND proxima_tentativa <= now() AND tentativas < 10
            ORDER BY id LIMIT p_limite FOR UPDATE SKIP LOCKED
  LOOP
    BEGIN
      IF e.tipo IN ('beneficio.resgatado','beneficio.estornado','beneficio.alerta_uso_duplicado',
                    'referral_purchase_qualified','referral_reward_approved','referral_reward_reversed','referral_fraud_suspected') THEN
        INSERT INTO public.notificacoes (tenant_id, papel, tipo, titulo, mensagem, canal, link)
        VALUES (e.tenant_id, 'matheus', e.tipo,
                CASE e.tipo WHEN 'beneficio.resgatado' THEN 'Benefício Private Access resgatado'
                            WHEN 'beneficio.estornado' THEN 'Benefício Private Access estornado'
                            WHEN 'beneficio.alerta_uso_duplicado' THEN 'Alerta: benefício usado em mais de um pedido'
                            WHEN 'referral_purchase_qualified' THEN 'Indicação: compra qualificada'
                            WHEN 'referral_reward_approved' THEN 'Indicação: recompensa aprovada'
                            WHEN 'referral_reward_reversed' THEN 'Indicação: recompensa revertida'
                            ELSE 'Indicação: suspeita de fraude' END,
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

-- ── 20. Permissões: só o papel de serviço executa ─────────────────────────
DO $$
DECLARE f text;
BEGIN
  FOR f IN SELECT p.oid::regprocedure::text FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
            WHERE n.nspname = 'public' AND (p.proname LIKE 'indicacao\_%' OR p.proname = 'crm_outbox_processar')
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM public, anon, authenticated', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', f);
  END LOOP;
END $$;

-- ── 21. Programa piloto (INATIVO até validação comercial) ─────────────────
INSERT INTO public.indicacao_programas (codigo, ativo, desconto_indicado, credito_indicador, compra_minima, desconto_max_percentual,
                                       janela_atribuicao_dias, janela_validacao_dias, max_recompensas_por_indicador, validade_credito_dias,
                                       termos_versao, termos_texto, tenant_id)
SELECT 'PILOTO_INDICACAO_10', false, 10, 10, 97.90, 20, 30, 14, 10, 90, 'indicacao-piloto-2026-11',
       'Quem é indicado ganha R$ 10,00 de desconto na primeira compra, em pedidos a partir de R$ 97,90, com cupom pessoal de uso único válido por 30 dias. '
    || 'Quem indica ganha R$ 10,00 de crédito quando a compra do indicado for paga e permanecer válida por 14 dias após a confirmação (prazo de arrependimento e de estorno). '
    || 'Vale apenas a primeira compra do indicado; não vale autoindicação (mesmo e-mail, CPF, telefone ou endereço). Limite de 10 recompensas por pessoa. '
    || 'O crédito vira um código de uso único válido por 90 dias, não é convertido em dinheiro e não é cumulativo com outros cupons. '
    || 'Estorno, cancelamento ou chargeback revertem a recompensa. A PURION GT pode suspender indicações com indício de abuso.',
       'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid
WHERE NOT EXISTS (SELECT 1 FROM public.indicacao_programas WHERE codigo = 'PILOTO_INDICACAO_10');

-- ── ROLLBACK (manual) ──────────────────────────────────────────────────────
-- Restaurar crm_outbox_processar da migration 20261113 e então:
-- DROP FUNCTION IF EXISTS public.indicacao_metricas(text,timestamptz), public.indicacao_programa_atualizar(text,jsonb,text),
--   public.indicacao_programa_publico(text), public.indicacao_painel(uuid,text), public.indicacao_gerar_credito(uuid,text,text,text,text),
--   public.indicacao_processar(), public.indicacao_evento_pagamento(text,text,text,text,numeric), public.indicacao__reverter(uuid,text),
--   public.indicacao__avaliar(uuid), public.indicacao_convite_visitante(text,text),
--   public.indicacao_gerar_convite(text,text,text,text,text,text,uuid), public.indicacao_registrar_clique(text,text,text),
--   public.indicacao_meu_codigo(uuid,text,text), public.indicacao__ledger(uuid,uuid,uuid,text,text,numeric),
--   public.indicacao__comprador_duplicado(uuid,public.vendas), public.indicacao__tem_outra_compra(public.vendas),
--   public.indicacao__autoindicacao(uuid,public.vendas), public.indicacao__venda_paga(public.vendas),
--   public.indicacao__norm_end(text,text), public.indicacao__norm_tel(text), public.indicacao__programa(text);
-- DROP VIEW IF EXISTS public.indicacao_saldos;
-- DROP TABLE IF EXISTS public.indicacao_eventos_pagamento, public.indicacao_ledger, public.indicacao_creditos,
--   public.indicacao_atribuicoes, public.indicacao_cliques, public.indicacao_codigos, public.indicacao_programas;
