interface KPICardProps {
  label: string
  value: string | number
  subtext?: string
}

export function KPICard({ label, value, subtext }: KPICardProps) {
  return (
    <div className="rounded-lg border border-border/60 bg-card p-4">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
        {label}
      </div>
      <div className="text-2xl font-medium text-foreground">{value}</div>
      {subtext && (
        <div className="text-[11px] text-muted-foreground/70 mt-0.5">{subtext}</div>
      )}
    </div>
  )
}
