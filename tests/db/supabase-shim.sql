-- Shim MÍNIMO do ambiente Supabase/CRM para rodar as migrations do site num
-- Postgres local de teste. Reproduz só o que as migrations referenciam:
-- papéis do Supabase, auth.uid(), meu_tenant_id(), sou_logistica() e as
-- colunas de vendas/notificacoes usadas (mesmos nomes do purion-os).
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN CREATE ROLE anon NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN CREATE ROLE service_role NOLOGIN BYPASSRLS; END IF;
END $$;

CREATE SCHEMA IF NOT EXISTS auth;
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT NULL::uuid $$;

-- Igual à produção: o tenant vem do perfil do usuário logado. Chamadas com a
-- chave de serviço (o servidor do site) não têm auth.uid() → NULL.
CREATE TABLE IF NOT EXISTS public.perfis (id uuid PRIMARY KEY, role text, tenant_id uuid);
CREATE OR REPLACE FUNCTION public.meu_tenant_id() RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT tenant_id FROM public.perfis WHERE id = auth.uid() $$;
CREATE OR REPLACE FUNCTION public.sou_logistica() RETURNS boolean LANGUAGE sql STABLE
AS $$ SELECT EXISTS (SELECT 1 FROM public.perfis WHERE id = auth.uid() AND role = 'logistica') $$;

CREATE TABLE IF NOT EXISTS public.vendas (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_appmax     text,
  cliente_nome      text DEFAULT '',
  cliente_email     text DEFAULT '',
  cliente_documento text,
  status            text NOT NULL DEFAULT 'pendente',
  status_pagamento  text DEFAULT 'pendente',
  compra_presente   boolean NOT NULL DEFAULT false,
  observacoes       text,
  cliente_telefone  text DEFAULT '',
  cep               text,
  numero            text,
  quantidade        integer DEFAULT 1,
  frascos_por_unidade int NOT NULL DEFAULT 1,
  valor_bruto       numeric DEFAULT 0,
  valor_total       numeric,
  data_venda        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now(),
  deleted_at        timestamptz,
  tenant_id         uuid DEFAULT 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid
);

CREATE TABLE IF NOT EXISTS public.notificacoes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid,
  papel      text,
  tipo       text,
  titulo     text,
  mensagem   text,
  canal      text[],
  link       text,
  created_at timestamptz DEFAULT now()
);

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
