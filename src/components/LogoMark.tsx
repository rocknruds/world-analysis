interface LogoMarkProps {
  size?: number;
  className?: string;
}

export default function LogoMark({ size = 20, className = "" }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={Math.round(size * (14 / 28))}
      viewBox="0 0 28 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect x="0" y="0" width="20" height="5" rx="1.5" fill="#60A5FA" opacity="1"/>
      <rect x="4" y="9" width="16" height="5" rx="1.5" fill="#ffffff" opacity="0.25"/>
    </svg>
  );
}