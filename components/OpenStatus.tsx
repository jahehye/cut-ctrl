"use client";

import { useEffect, useState } from "react";
import { getStudioStatus } from "@/lib/hours";

type OpenStatusProps = {
  compact?: boolean;
  className?: string;
  inverse?: boolean;
};

export default function OpenStatus({ compact = false, className = "", inverse = false }: OpenStatusProps) {
  const [status, setStatus] = useState(() => getStudioStatus());

  useEffect(() => {
    const timer = window.setInterval(() => setStatus(getStudioStatus()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span
      className={`inline-flex items-center gap-2 ${className}`}
      suppressHydrationWarning
      aria-label={`${status.label}. ${status.detail}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${status.isOpen ? "bg-blue" : "bg-black/35"}`}
        aria-hidden="true"
      />
      <span>{status.label}</span>
      {!compact && <span className={inverse ? "text-white/60" : "text-black/50"}>/ {status.detail}</span>}
    </span>
  );
}
