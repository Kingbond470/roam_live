"use client";

import { useViewerCount } from "@/hooks/useViewerCount";
import { formatViewerCount } from "@/lib/utils";
import { Users } from "lucide-react";

interface Props {
  citySlug: string;
}

export function ViewerCount({ citySlug }: Props) {
  const count = useViewerCount(citySlug);
  return (
    <div className="flex items-center gap-1.5 text-white/70">
      <Users className="w-3.5 h-3.5" />
      <span className="text-sm font-mono tabular-nums">
        {formatViewerCount(count)}
      </span>
    </div>
  );
}
