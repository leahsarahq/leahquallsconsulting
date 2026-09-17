import { readFileSync } from "node:fs"

const raw = readFileSync(new URL("./tmp/ads-sep17.csv", import.meta.url), "utf8")

// Split into lines, handle quoted CSV
function parseCSV(text) {
  const rows = []
  let row = []
  let field = ""
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ } else { inQuotes = false }
      } else { field += c }
    } else {
      if (c === '"') inQuotes = true
      else if (c === ",") { row.push(field); field = "" }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = "" }
      else if (c === "\r") { /* skip */ }
      else field += c
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row) }
  return rows
}

const rows = parseCSV(raw).filter((r) => r.length > 1 && r[0])
const header = rows[0]
const idx = (name) => header.indexOf(name)
const dateI = idx("Reporting starts")
const nameI = idx("Ad name")
const spendI = idx("Amount spent (USD)")
const visitsI = idx("Instagram profile visits")
const followsI = idx("Instagram follows")
const clicksI = idx("Link clicks")
const imprI = idx("Impressions")

const data = rows.slice(1)

const byDate = {}
let totSpend = 0, totFollows = 0, totVisits = 0, totClicks = 0, totImpr = 0
const adTotals = {}

for (const r of data) {
  const d = r[dateI]
  const name = r[nameI]
  const spend = parseFloat(r[spendI]) || 0
  const visits = parseFloat(r[visitsI]) || 0
  const follows = parseFloat(r[followsI]) || 0
  const clicks = parseFloat(r[clicksI]) || 0
  const impr = parseFloat(r[imprI]) || 0
  if (!byDate[d]) byDate[d] = { spend: 0, follows: 0, visits: 0, clicks: 0, impr: 0 }
  byDate[d].spend += spend
  byDate[d].follows += follows
  byDate[d].visits += visits
  byDate[d].clicks += clicks
  byDate[d].impr += impr
  totSpend += spend; totFollows += follows; totVisits += visits; totClicks += clicks; totImpr += impr
  if (!adTotals[name]) adTotals[name] = { spend: 0, follows: 0, visits: 0 }
  adTotals[name].spend += spend
  adTotals[name].follows += follows
  adTotals[name].visits += visits
}

console.log("=== DAILY (all ads in export) ===")
const dates = Object.keys(byDate).sort()
let cumSpend = 0, cumFollows = 0
for (const d of dates) {
  const x = byDate[d]
  cumSpend += x.spend; cumFollows += x.follows
  console.log(
    `${d}  spend $${x.spend.toFixed(2).padStart(8)}  follows ${String(x.follows).padStart(3)}  visits ${String(x.visits).padStart(4)}  | cum $${cumSpend.toFixed(2).padStart(9)} / ${cumFollows} follows`
  )
}

console.log("\n=== TOTALS (Sep 1-17, all ads) ===")
console.log(`spend $${totSpend.toFixed(2)}  follows ${totFollows}  visits ${totVisits}  clicks ${totClicks}  impr ${totImpr}`)
console.log(`CPF $${(totSpend / totFollows).toFixed(2)}  visit->follow ${((totFollows / totVisits) * 100).toFixed(2)}%`)

console.log("\n=== PER-AD TOTALS ===")
for (const [n, x] of Object.entries(adTotals).sort((a, b) => b[1].spend - a[1].spend)) {
  const cpf = x.follows ? `$${(x.spend / x.follows).toFixed(2)}` : "—"
  console.log(`${n.padEnd(34)} spend $${x.spend.toFixed(2).padStart(8)}  follows ${String(x.follows).padStart(3)}  visits ${String(x.visits).padStart(4)}  CPF ${cpf}`)
}

// Reconcile Sep 1-11 window
let s11 = 0, f11 = 0
for (const d of dates) {
  if (d <= "2026-09-11") { s11 += byDate[d].spend; f11 += byDate[d].follows }
}
console.log("\n=== RECONCILE Sep 1-11 (expected $1927.96 / 707 from ad-set export) ===")
console.log(`spend $${s11.toFixed(2)}  follows ${f11}  CPF $${(s11 / f11).toFixed(2)}`)

// Follows-only ads vs zero-follow (traffic) ads
console.log("\n=== ZERO-FOLLOW ADS (likely non-engagement/traffic) ===")
for (const [n, x] of Object.entries(adTotals)) {
  if (x.follows === 0) console.log(`${n.padEnd(34)} spend $${x.spend.toFixed(2)}  visits ${x.visits}`)
}
