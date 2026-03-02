interface PFScoreBarProps {
  authority: number;
  reach: number;
  pf: number;
}

interface ScoreRowProps {
  label: string;
  value: number;
  color: string;
}

function ScoreRow({ label, value, color }: ScoreRowProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-sm text-gray-400 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-[#1f2937] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-8 text-right text-sm font-mono font-semibold text-white tabular-nums">
        {value || "—"}
      </span>
    </div>
  );
}

export default function PFScoreBar({ authority, reach, pf }: PFScoreBarProps) {
  return (
    <div className="space-y-3">
      <ScoreRow label="Authority" value={authority} color="#60a5fa" />
      <ScoreRow label="Reach" value={reach} color="#f97316" />
      <ScoreRow label="PF Score" value={pf} color="#3b82f6" />
    </div>
  );
}
