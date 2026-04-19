"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  youtubeId: string;
  title: string;
  startSeconds?: number;
}

export function YouTubeFacade({ youtubeId, title, startSeconds = 90 }: Props) {
  const [activated, setActivated] = useState(false);

  const src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&start=${startSeconds}`;
  const thumb = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

  if (activated) {
    return (
      <iframe
        className="absolute inset-0 w-full h-full"
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      onClick={() => setActivated(true)}
      className="absolute inset-0 w-full h-full group"
      aria-label={`Play ${title}`}
    >
      {/* Thumbnail — loads instantly, is the LCP element */}
      <Image
        src={thumb}
        alt={title}
        fill
        priority
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 90vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/60 group-hover:bg-black/80 flex items-center justify-center transition-all group-hover:scale-110">
          <svg
            className="w-7 h-7 sm:w-9 sm:h-9 text-white fill-current ml-1"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </button>
  );
}
