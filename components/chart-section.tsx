interface ChartSectionProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function ChartSection({ title, subtitle, children }: ChartSectionProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="text-sm font-medium text-foreground mb-1">{title}</div>
      {subtitle && (
        <div className="text-xs text-muted-foreground mb-4">{subtitle}</div>
      )}
      {children}
    </div>
  )
}
