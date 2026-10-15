"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import Dialog from "@/components/ui/Dialog";

// Grava só no localStorage do navegador (igual ao protótipo) — não é um
// backend real, então o depoimento não aparece para outros visitantes.
// Ver PLACEHOLDERS.md.
const STORAGE_KEY = "purion_reviews";

export default function ReviewSubmitModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [stars, setStars] = useState(5);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [text, setText] = useState("");

  function submit() {
    if (!name.trim() || !text.trim()) return;
    try {
      const mine = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      mine.unshift({ n: name.trim(), c: city.trim() || "Brasil", q: text.trim(), s: stars, tag: "Novo" });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mine));
    } catch {
      // localStorage indisponível — segue sem persistir.
    }
    setName("");
    setCity("");
    setText("");
    setStars(5);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} width={520}>
      <div className="flex flex-col gap-4">
        <h3 className="m-0 text-lg font-semibold">Seu depoimento</h3>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setStars(n)} aria-label={`Nota ${n}`}>
              <Star size={26} fill={n <= stars ? "currentColor" : "none"} className={n <= stars ? "text-ink-950" : "text-steel-300"} />
            </button>
          ))}
        </div>
        <label className="flex flex-col gap-1.5 text-sm">
          Nome
          <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-[var(--radius-md)] border border-[var(--border-strong)] px-3.5 py-3" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Cidade/UF
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="São Paulo/SP"
            className="rounded-[var(--radius-md)] border border-[var(--border-strong)] px-3.5 py-3"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Comentário
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Como o Purion GT mudou o seu carro?"
            className="resize-vertical rounded-[var(--radius-md)] border border-[var(--border-strong)] px-3.5 py-3"
          />
        </label>
        <button onClick={submit} className="w-full rounded-[var(--radius-pill)] bg-ink-950 py-4 text-sm font-medium text-paper-0">
          Publicar depoimento
        </button>
      </div>
    </Dialog>
  );
}
