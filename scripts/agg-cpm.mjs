import { readFileSync } from "node:fs"

const DIR = "/vercel/share/v0-project/scripts/data"
const daily17 = `${DIR}/ads-sep-1-17.csv`
const agg24 = `${DIR}/ads-sep-1-24.csv`

// Minimal CSV parser handling quoted fields.
function parse(text) {
  const rows = []
  let row = [], field = "", inQ = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++ } else inQ = false }
      else field += c
    } else {
      if (c === '"') inQ = true
      else if (c === ",") { row.push(field); field = "" }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++
        if (field !== "" || row.length) { row.push(field); rows.push(row); row = []; field = "" }
      } else field += c
    }
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row) }
  return rows
}

function load(path) {
  const rows = parse(readFileSync(path, "utf8"))
  const header = rows[0]
  const idx = (name) => header.findIndex((h) => h.trim() === name)
  const iStart = idx("Reporting starts")
  const iSpend = idx("Amount spent (USD)")
  const iImpr = idx("Impressions")
  return rows.slice(1).filter((r) => r.length > iImpr).map((r) => ({
    date: r[iStart],
    spend: parseFloat(r[iSpend]) || 0,
    impr: parseInt(r[iImpr], 10) || 0,
  }))
}

// Daily engagement impressions/spend from the per-day Sept 1-17 export.
const d17 = load(daily17)
const byDay = new Map()
for (const r of d17) {
  const day = parseInt(r.date.slice(8), 10)
  const cur = byDay.get(day) || { spend: 0, impr: 0 }
  cur.spend += r.spend; cur.impr += r.impr
  byDay.set(day, cur)
}
const days = [...byDay.keys()].sort((a, b) => a - b)
let sum17spend = 0, sum17impr = 0
console.log("=== Sept 1-17 daily engagement impressions ===")
for (const day of days) {
  const { spend, impr } = byDay.get(day)
  sum17spend += spend; sum17impr += impr
  console.log(`Sep ${day}: impr=${impr} spend=${spend.toFixed(2)}`)
}
console.log(`\n1-17 totals: spend=${sum17spend.toFixed(2)} impr=${sum17impr}`)

// Sept 1-24 aggregate totals.
const a24 = load(agg24)
let sum24spend = 0, sum24impr = 0
for (const r of a24) { sum24spend += r.spend; sum24impr += r.impr }
console.log(`1-24 totals: spend=${sum24spend.toFixed(2)} impr=${sum24impr}`)
console.log(`1-24 engagement CPM = $${(sum24spend / sum24impr * 1000).toFixed(2)}`)

// Remainder Sept 18-24 spread over 7 days.
const remSpend = sum24spend - sum17spend
const remImpr = sum24impr - sum17impr
console.log(`\n18-24 remainder: spend=${remSpend.toFixed(2)} impr=${remImpr} → per-day impr≈${Math.round(remImpr / 7)}`)

// Emit the impressions array (Sep 1..24) for pasting into the data file.
const arr = []
for (let day = 1; day <= 24; day++) {
  if (byDay.has(day)) arr.push(byDay.get(day).impr)
  else arr.push(Math.round(remImpr / 7))
}
console.log(`\nDaily impressions Sep1..24:\n[${arr.join(", ")}]`)
console.log(`sum check = ${arr.reduce((a, b) => a + b, 0)} (target ${sum24impr})`)
