interface Props {
  countryCode: string;
  size?: number;
  className?: string;
}

export function Flag({ countryCode, size = 20, className = "" }: Props) {
  const code = countryCode.toLowerCase();
  // Using <img> directly — flagcdn.com is external, Next/Image doesn't support srcSet shorthand
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
    />
  );
}
