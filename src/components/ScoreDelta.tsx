interface ScoreDeltaProps {
  delta: number;
}

export default function ScoreDelta({ delta }: ScoreDeltaProps) {
  if (!delta || delta === 0) return null;
  const positive = delta > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded tabular-nums ${
        positive
          ? "text-[#22c55e] bg-[#22c55e]/10"
          : "text-[#ef4444] bg-[#ef4444]/10"
      }`}
    >
      {positive ? "▲" : "▼"}
      {Math.abs(delta)}
    </span>
  );
}
