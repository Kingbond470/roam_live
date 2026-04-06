"use client";

import { useLocalTime } from "@/hooks/useLocalTime";
import { Clock } from "lucide-react";

interface Props {
  timezone: string;
}

export function LocalClock({ timezone }: Props) {
  const time = useLocalTime(timezone);
  if (!time) return null;
  return (
    <div className="flex items-center gap-1.5 text-white/70">
      <Clock className="w-3.5 h-3.5" />
      <span className="text-sm font-mono tabular-nums">{time}</span>
    </div>
  );
}
