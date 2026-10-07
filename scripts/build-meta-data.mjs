// Parses the raw Meta Ads Manager CSV exports in data/meta/ into a single JSON
// file the dashboard reads. Files are identified by their columns, not names:
//   - "Ad set name" vs "Ad name"   -> ad set vs ad level
//   - "Age" / "Platform" column    -> 90-day breakdown by that dimension
//   - neither, one day per row     -> September daily rows
// No aggregation happens here; every metric is computed in lib/data/meta/analytics.ts.
//
// Usage: node scripts/build-meta-data.mjs
import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const SRC_DIR = path.join(ROOT, "data/meta")
const OUT_FILE = path.join(ROOT, "lib/data/meta/exports.generated.json")

function parseCsv(text) {
  const rows = []
  let row = []
  let field = ""
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (c === '"') inQuotes = false
      else field += c
    } else if (c === '"') inQuotes = true
    else if (c === ",") {
      row.push(field)
      field = ""
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++
      row.push(field)
      if (row.some((f) => f !== "")) rows.push(row)
      row = []
      field = ""
    } else field += c
  }
  if (field !== "" || row.length) {
    row.push(field)
    if (row.some((f) => f !== "")) rows.push(row)
  }
  return rows
}

const num = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

const out = {
  adsetDaily: [],
  adDaily: [],
  adsetByAge: [],
  adByAge: [],
  adsetByPlatform: [],
  adByPlatform: [],
}

const files = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith(".csv"))
for (const file of files) {
  const [header, ...body] = parseCsv(fs.readFileSync(path.join(SRC_DIR, file), "utf8"))
  const col = (name) => header.indexOf(name)
  const level = col("Ad set name") >= 0 ? "adset" : col("Ad name") >= 0 ? "ad" : null
  if (!level) throw new Error(`${file}: no "Ad set name" or "Ad name" column`)
  const dimCol = col("Age") >= 0 ? "Age" : col("Platform") >= 0 ? "Platform" : null
  const nameIdx = col(level === "adset" ? "Ad set name" : "Ad name")
  const deliveryIdx = col(level === "adset" ? "Ad set delivery" : "Ad delivery")

  const rows = body.map((r) => ({
    start: r[col("Reporting starts")],
    end: r[col("Reporting ends")],
    name: r[nameIdx],
    dim: dimCol ? r[col(dimCol)] : null,
    delivery: r[deliveryIdx],
    budget: num(r[col("Ad set budget")]),
    spend: num(r[col("Amount spent (USD)")]),
    impressions: num(r[col("Impressions")]),
    clicks: num(r[col("Link clicks")]),
    reach: num(r[col("Reach")]),
    visits: num(r[col("Instagram profile visits")]),
    follows: num(r[col("Instagram follows")]),
  }))

  let key
  if (dimCol === "Age") key = level === "adset" ? "adsetByAge" : "adByAge"
  else if (dimCol === "Platform") key = level === "adset" ? "adsetByPlatform" : "adByPlatform"
  else {
    const daily = rows.every((r) => r.start === r.end)
    if (!daily) throw new Error(`${file}: no Age/Platform column and rows are not daily`)
    key = level === "adset" ? "adsetDaily" : "adDaily"
  }
  if (out[key].length) throw new Error(`${file}: duplicate export for ${key}`)
  out[key] = rows
  console.log(`${file} -> ${key} (${rows.length} rows)`)
}

for (const [k, v] of Object.entries(out)) {
  if (!v.length) throw new Error(`Missing export: ${k}`)
}

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
fs.writeFileSync(OUT_FILE, JSON.stringify(out))
console.log(`Wrote ${path.relative(ROOT, OUT_FILE)}`)
