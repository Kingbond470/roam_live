"use client";

export function LiveBadge() {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/90 backdrop-blur-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-white animate-[pulse-slow_2s_ease-in-out_infinite]" />
      <span className="text-white text-xs font-bold tracking-widest uppercase">
        Live
      </span>
    </div>
  );
}
