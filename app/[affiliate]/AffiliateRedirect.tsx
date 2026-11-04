"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveReferral } from "@/lib/referral";

export default function AffiliateRedirect({ slug }: { slug: string }) {
  const router = useRouter();

  useEffect(() => {
    saveReferral(slug);
    router.replace("/");
  }, [slug, router]);

  return null;
}
