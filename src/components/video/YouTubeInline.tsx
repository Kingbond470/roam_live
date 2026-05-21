"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  youtubeId: string;
  title: string;
}

/** Thumbnail → iframe on click. LCP-friendly alternative to a bare <iframe>. */
export function YouTubeInline({ youtubeId, title }: Props) {
  const [active, setActive] = useState(false);
  const thumb = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

  if (active) {
    return (
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&start=90`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      onClick={() => setActive(true)}
      className="absolute inset-0 w-full h-full group"
      aria-label={`Play ${title}`}
    >
      <Image
        src={thumb}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-amber-500 group-hover:bg-amber-400 flex items-center justify-center transition-all group-hover:scale-110 shadow-lg shadow-amber-500/30">
          <svg className="w-6 h-6 text-black fill-current ml-0.5" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </button>
  );
}
