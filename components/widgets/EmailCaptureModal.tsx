"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useExitIntent } from "@/lib/hooks/useExitIntent";
import { readFlag, setFlag } from "@/lib/hooks/useLocalStorageFlag";

const SEEN_KEY = "purion_email_v1";

// O conteúdo pesado (Dialog + formulário + cliente Supabase, ~67 KB gzip) só
// é importado quando o gatilho (15s ou exit-intent) realmente dispara —
// até lá, nem o módulo do Supabase nem o JS do modal entram no bundle
// inicial. A detecção em si (timer, exit-intent) continua rodando aqui,
// sempre, sem depender desse import.
const EmailCaptureModalContent = dynamic(() => import("./EmailCaptureModalContent"));

export default function EmailCaptureModal() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  const show = () => {
    if (shown || readFlag(SEEN_KEY)) return;
    setShown(true);
    setFlag(SEEN_KEY);
    setOpen(true);
  };

  useEffect(() => {
    const t = setTimeout(show, 15000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useExitIntent(show, !shown);

  if (!shown) return null;
  return <EmailCaptureModalContent open={open} onClose={() => setOpen(false)} />;
}
