interface LogoMarkProps {
  size?: number;
  dark?: boolean;
  className?: string;
}

export default function LogoMark({ size = 24, dark = false, className = "" }: LogoMarkProps) {
  const blue  = dark ? "#60a5fa" : "#378ADD";
  const muted = dark ? "#ffffff" : "#e8eaf0";

  return (
    <svg
      width={size}
      height={Math.round(size * 1.08)}
      viewBox="0 0 32 28"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect x="0" y="1"  width="26" height="6" rx="1.5" fill={muted} opacity="0.35"/>
      <rect x="3" y="10" width="26" height="6" rx="1.5" fill={blue}  opacity="1"/>
      <rect x="6" y="19" width="26" height="6" rx="1.5" fill={muted} opacity="0.18"/>
    </svg>
  );
}