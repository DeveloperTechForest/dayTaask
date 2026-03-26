"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function QuoteResponseRedirect() {
  const { quoteId } = useParams();
  const router = useRouter();
  const resolvedQuoteId = Array.isArray(quoteId) ? quoteId[0] : quoteId;

  useEffect(() => {
    if (!resolvedQuoteId || resolvedQuoteId === "undefined") return;
    router.replace(`/user/quote/${resolvedQuoteId}`);
  }, [resolvedQuoteId, router]);

  return null;
}
