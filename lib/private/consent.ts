// Registro do consentimento: versão + hash do texto exibido. Só servidor.
import { sha256Hex } from "./crypto";
import { CONSENT_TEXTS, type ConsentChannel } from "./consent-texts";

export { CONSENT_TEXTS, TRANSACTIONAL_NOTE, type ConsentChannel } from "./consent-texts";

export function consentRecord(canal: ConsentChannel) {
  const t = CONSENT_TEXTS[canal];
  return { versao: t.versao, hash: sha256Hex(t.texto) };
}
