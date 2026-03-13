interface PFScoreBarProps {
  authority: number;
  reach: number;
  pf: number;
}

function ScoreRow({ label, value, color }: { label: string; value: number; color: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-sm shrink-0" style={{ color: "var(--muted-foreground)" }}>{label}</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${clamped}%`, backgroundColor: color }} />
      </div>
      <span className="w-8 text-right text-sm font-mono font-semibold tabular-nums" style={{ color: "var(--foreground)" }}>
        {value || "—"}
      </span>
    </div>
  );
}

export default function PFScoreBar({ authority, reach, pf }: PFScoreBarProps) {
  return (
    <div className="space-y-3">
      <ScoreRow label="Authority" value={authority} color="var(--score-authority)" />
      <ScoreRow label="Reach" value={reach} color="var(--score-reach)" />
      <ScoreRow label="PF Score" value={pf} color="var(--score-pf)" />
    </div>
  );
}