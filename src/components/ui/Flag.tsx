"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  countryCode: string;
  flagEmoji: string;
  size?: number;
  className?: string;
}

export function Flag({ countryCode, flagEmoji, size = 20, className = "" }: Props) {
  const [failed, setFailed] = useState(false);
  const code = countryCode.toLowerCase();

  if (failed || !code) {
    return <span className={`leading-none flex-shrink-0 ${className}`}>{flagEmoji}</span>;
  }

  return (
    <Image
      src={`https://flagcdn.com/w${size * 2}/${code}.png`}
      width={size}
      height={Math.round(size * 0.75)}
      alt={`${countryCode} flag`}
      className={`inline-block rounded-[2px] object-cover flex-shrink-0 ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
