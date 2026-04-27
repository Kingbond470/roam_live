"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  youtubeId: string;
  title: string;
  citySlug: string;
  startSeconds?: number;
}

export function YouTubeFacade({ youtubeId, title, citySlug }: Props) {
  const router = useRouter();
  const thumb = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

  return (
    <button
      onClick={() => router.push(`/?city=${citySlug}`)}
      className="absolute inset-0 w-full h-full group"
      aria-label={`Watch ${title} on Nearaway`}
    >
      {/* Thumbnail — LCP element */}
      <Image
        src={thumb}
        alt={title}
        fill
        priority
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 90vw"
      />

      {/* Dark vignette */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

      {/* Bottom-left city label */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />

      {/* Centred play button */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500 group-hover:bg-amber-400 flex items-center justify-center transition-all group-hover:scale-110 shadow-lg shadow-amber-500/30">
          <svg
            className="w-7 h-7 sm:w-9 sm:h-9 text-black fill-current ml-1"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span className="text-white/90 text-sm font-semibold tracking-wide group-hover:text-white transition-colors">
          Watch on Nearaway
        </span>
      </div>
    </button>
  );
}
