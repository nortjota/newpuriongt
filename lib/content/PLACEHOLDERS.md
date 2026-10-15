# Checklist pré-lançamento — o que ainda é placeholder

Itens herdados do protótipo de design (`project/Purion GT.dc.html`) que não devem ser tratados como dados reais sem confirmação.

- [x] **WhatsApp**: confirmado pelo usuário em 2026-10-14 → `61 99694-9688` (`lib/content/whatsapp.ts`).
- [x] **Checkout**: confirmado pelo usuário em 2026-10-14 → checkout real Appmax/Nuvemshop (`lib/content/checkout.ts`). Único produto/variante por ora — todos os planos levam ao mesmo link.
- [ ] **Preços**: Unidade R$97,90 / Kit2 R$176,22 / Kit3 R$249,65 / Assinatura R$83,22 (base riscada R$149,90) são valores que a própria ferramenta de design inventou e marcou como não confirmados no chat de handoff. Confirmar com o usuário antes de divulgar o link para clientes reais.
- [ ] **Reviews**: as 5 reviews do protótipo são rascunho da ferramenta de design, que se recusou a inventar mais citando CDC/CONAR. Não adicionar novas sem reviews reais fornecidas pelo usuário.
- [ ] **Vídeos**: galeria mantém o estado vazio "Espaço para o vídeo" do protótipo — sem URLs de vídeo reais ainda.
- [ ] **Páginas legais**: `/privacy` e `/terms` são stubs "em elaboração" — precisam de texto jurídico real antes do lançamento.
- [ ] **E-mail capture → Supabase**: usuário confirmou integrar com a tabela `leads_site` do Supabase do `purion-os`; falta configurar as env vars `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` no projeto Vercel (marco 4 do build).
