export function GlobeLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#050508]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" />
        <p className="text-white/40 text-sm font-mono tracking-widest uppercase">
          Loading world...
        </p>
      </div>
    </div>
  );
}
