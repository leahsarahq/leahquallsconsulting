"use client"

import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Brief, RichText as RichTextValue } from "@/lib/data/types"

export function InfoTip({ text, label = "More detail" }: { text: string; label?: string }) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={label}
            className="inline-flex align-middle text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
          >
            <Info className="h-3 w-3" aria-hidden="true" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs leading-relaxed">{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function FootNote({ text, tip, className = "" }: { text: string; tip?: string; className?: string }) {
  return (
    <p className={`flex items-center gap-1 text-[11px] text-muted-foreground ${className}`}>
      <span>{text}</span>
      {tip && <InfoTip text={tip} />}
    </p>
  )
}

export function BriefView({ brief, className = "" }: { brief: Brief; className?: string }) {
  return (
    <div className={className}>
      {brief.takeaway && (
        <p className="text-sm text-foreground text-pretty">
          <span className="font-semibold">Takeaway:</span> {brief.takeaway}
        </p>
      )}
      {brief.bullets && brief.bullets.length > 0 && (
        <ul className={`space-y-2 ${brief.takeaway ? "mt-2.5" : ""}`}>
          {brief.bullets.map((b) => (
            <li key={b.lead + (b.text ?? "")} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <span className="text-pretty">
                <span className="font-semibold text-foreground">{b.lead}</span>
                {b.text}
              </span>
            </li>
          ))}
        </ul>
      )}
      {brief.note && <FootNote text={brief.note} tip={brief.tip} className="mt-2.5" />}
    </div>
  )
}

// Renders either a legacy paragraph (older months) or a structured brief.
export function RichText({
  value,
  className = "",
  paragraphClassName = "text-sm leading-relaxed text-muted-foreground text-pretty",
}: {
  value: RichTextValue
  className?: string
  paragraphClassName?: string
}) {
  if (typeof value === "string") return <p className={`${paragraphClassName} ${className}`}>{value}</p>
  return <BriefView brief={value} className={className} />
}
