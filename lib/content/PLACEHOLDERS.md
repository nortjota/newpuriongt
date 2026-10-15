# Checklist pré-lançamento — o que ainda é placeholder

Itens herdados do protótipo de design (`project/Purion GT.dc.html`) que não devem ser tratados como dados reais sem confirmação.

- [x] **WhatsApp**: confirmado pelo usuário em 2026-10-14 → `61 99694-9688` (`lib/content/whatsapp.ts`).
- [x] **Checkout**: confirmado pelo usuário em 2026-10-14 → checkout real Appmax/Nuvemshop (`lib/content/checkout.ts`). Único produto/variante por ora — todos os planos levam ao mesmo link.
- [x] **Preços**: confirmados pelo usuário em 2026-10-14 → Unidade R$97,90 / Kit2 R$176,22 / Kit3 R$249,65 / Assinatura R$83,22 (base riscada R$149,90). Ficam como estão.
- [ ] **Reviews**: as 5 reviews do protótipo são rascunho da ferramenta de design, que se recusou a inventar mais citando CDC/CONAR. Não adicionar novas sem reviews reais fornecidas pelo usuário.
- [ ] **Vídeos**: galeria mantém o estado vazio "Espaço para o vídeo" do protótipo — sem URLs de vídeo reais ainda.
- [x] **Páginas legais**: `/privacy` e `/terms` têm texto real agora (LGPD + CDC, inspirado na estrutura das páginas da Guday, mas escrito do zero para a PURION GT). Contato: `puriongt@gmail.com` (confirmado pelo usuário em 2026-10-14). **Falta**: razão social/CNPJ — a empresa ainda não tem CNPJ registrado (está como MEI, conversão para LTDA pendente segundo as notas internas do `purion-os`); as páginas por ora não citam CNPJ. Atualizar assim que a LTDA for registrada.
- [x] **Logo**: trocado o mark-only (`logo-mark.png`) pelo wordmark completo fornecido pelo usuário em 2026-10-15 — `public/logo-black.png` (fundo claro) e `public/logo-white.png` (fundo escuro), usados em Header/Footer/CTA final.
- [ ] **E-mail capture → Supabase**: código já grava direto na tabela `leads_site` do mesmo projeto Supabase do `purion-os` (`lib/supabase/client.ts` + `EmailCaptureModal`). Falta só configurar `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` como env vars no projeto Vercel — sem elas o insert é pulado silenciosamente (`supabase` fica `null`).
