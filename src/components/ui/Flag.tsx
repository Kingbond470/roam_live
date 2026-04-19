"use client";

import { useState } from "react";

interface Props {
  countryCode: string;
  flagEmoji: string;
  size?: number;
  className?: string;
}

export function Flag({ countryCode, flagEmoji, size = 20, className = "" }: Props) {
  const [failed, setFailed] = useState(false);
  const code = countryCode.toLowerCase();

  if (failed) {
    return <span className={`leading-none flex-shrink-0 ${className}`}>{flagEmoji}</span>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w${size}/${code}.png`}
      srcSet={`https://flagcdn.com/w${size * 2}/${code}.png 2x`}
      width={size}
      height={Math.round(size * 0.75)}
      alt={countryCode}
      className={`inline-block rounded-[2px] object-cover flex-shrink-0 ${className}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
