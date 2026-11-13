"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveReferral } from "@/lib/referral";
import { capturarOrigem } from "@/lib/tracking";
import { registrarCliqueAfiliado } from "@/lib/crm";

export default function AffiliateRedirect({ slug, nome }: { slug: string; nome?: string }) {
  const router = useRouter();

  useEffect(() => {
    capturarOrigem();
    saveReferral(slug, nome);
    // registra o clique no CRM (aparece em Afiliados > cliques e conversão) sem segurar a navegação
    void registrarCliqueAfiliado(slug);
    router.replace("/");
  }, [slug, nome, router]);

  return null;
}
