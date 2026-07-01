import fs from "node:fs"

const DIR = "scripts/data"
const files = {
  campaigns: `${DIR}/campaigns.csv`,
  adsets: `${DIR}/adsets.csv`,
  ads: `${DIR}/ads.csv`,
}

function parseCSV(text) {
  const rows = []
  let field = ""
  let row = []
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ } else inQuotes = false
      } else field += c
    } else {
      if (c === '"') inQuotes = true
      else if (c === ",") { row.push(field); field = "" }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = "" }
      else if (c === "\r") { /* skip */ }
      else field += c
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row) }
  return rows.filter((r) => r.length > 1)
}

function num(x) {
  const n = parseFloat(x)
  return Number.isFinite(n) ? n : 0
}

function load(file) {
  const text = fs.readFileSync(file, "utf8")
  const rows = parseCSV(text)
  const header = rows[0]
  return rows.slice(1).map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])))
}

const col = {
  spend: "Amount spent (USD)",
  reach: "Reach",
  impr: "Impressions",
  clicks: "Link clicks",
  profileVisits: "Instagram profile visits",
  follows: "Instagram follows",
}

// ---------- CAMPAIGNS ----------
const camp = load(files.campaigns)
const campAgg = {}
const dates = new Set()
for (const r of camp) {
  const name = r["Campaign name"]
  dates.add(r["Reporting starts"])
  campAgg[name] ||= { spend: 0, reach: 0, impr: 0, clicks: 0, profileVisits: 0, follows: 0 }
  const a = campAgg[name]
  a.spend += num(r[col.spend])
  a.reach += num(r[col.reach])
  a.impr += num(r[col.impr])
  a.clicks += num(r[col.clicks])
  a.profileVisits += num(r[col.profileVisits])
  a.follows += num(r[col.follows])
}
console.log("=== CAMPAIGN TOTALS (Jun 1-30) ===")
let grand = { spend: 0, reach: 0, impr: 0, clicks: 0, profileVisits: 0, follows: 0 }
for (const [n, a] of Object.entries(campAgg)) {
  console.log(`\n${n}`)
  console.log(`  spend=$${a.spend.toFixed(2)} impr=${a.impr} reach=${a.reach} clicks=${a.clicks} profileVisits=${a.profileVisits} follows=${a.follows}`)
  console.log(`  CTR=${((a.clicks / a.impr) * 100).toFixed(3)}% CPC=$${(a.spend / a.clicks).toFixed(3)} CPM=$${(a.spend / a.impr * 1000).toFixed(2)} CPF=${a.follows ? "$" + (a.spend / a.follows).toFixed(2) : "n/a"}`)
  for (const k of Object.keys(grand)) grand[k] += a[k]
}
console.log("\n--- GRAND TOTAL ---")
console.log(`  spend=$${grand.spend.toFixed(2)} impr=${grand.impr} reach=${grand.reach} clicks=${grand.clicks} profileVisits=${grand.profileVisits} follows=${grand.follows}`)
console.log(`  CTR=${((grand.clicks / grand.impr) * 100).toFixed(3)}% CPC=$${(grand.spend / grand.clicks).toFixed(3)} CPM=$${(grand.spend / grand.impr * 1000).toFixed(2)}`)
console.log(`  date range: ${[...dates].sort()[0]} .. ${[...dates].sort().slice(-1)[0]} (${dates.size} days)`)

// ---------- AD SETS ----------
const adsets = load(files.adsets)
const setAgg = {}
const setDates = {}
for (const r of adsets) {
  const name = r["Ad set name"] || r["Ad Set Name"] || r["Ad set name "]
  setAgg[name] ||= { spend: 0, reach: 0, impr: 0, clicks: 0, profileVisits: 0, follows: 0, delivery: new Set() }
  const a = setAgg[name]
  a.spend += num(r[col.spend]); a.reach += num(r[col.reach]); a.impr += num(r[col.impr])
  a.clicks += num(r[col.clicks]); a.profileVisits += num(r[col.profileVisits]); a.follows += num(r[col.follows])
  a.delivery.add(r["Ad set delivery"])
  ;(setDates[name] ||= []).push(r["Reporting starts"])
}
console.log("\n\n=== AD SET TOTALS (Jun 1-30) ===")
for (const [n, a] of Object.entries(setAgg)) {
  const ds = setDates[n].sort()
  console.log(`\n${n}  [${[...a.delivery].join(",")}]  ${ds[0]}..${ds.slice(-1)[0]} (${ds.length}d)`)
  console.log(`  spend=$${a.spend.toFixed(2)} impr=${a.impr} clicks=${a.clicks} follows=${a.follows} profileVisits=${a.profileVisits}`)
  console.log(`  CTR=${a.impr ? ((a.clicks / a.impr) * 100).toFixed(3) : 0}% CPC=$${a.clicks ? (a.spend / a.clicks).toFixed(3) : "n/a"} CPM=$${a.impr ? (a.spend / a.impr * 1000).toFixed(2) : "n/a"} CPF=${a.follows ? "$" + (a.spend / a.follows).toFixed(2) : "n/a"}`)
}

// ---------- ADS ----------
const ads = load(files.ads)
const adAgg = {}
const adDates = {}
for (const r of ads) {
  const name = r["Ad name"]
  adAgg[name] ||= { spend: 0, reach: 0, impr: 0, clicks: 0, profileVisits: 0, follows: 0, delivery: new Set() }
  const a = adAgg[name]
  a.spend += num(r[col.spend]); a.reach += num(r[col.reach]); a.impr += num(r[col.impr])
  a.clicks += num(r[col.clicks]); a.profileVisits += num(r[col.profileVisits]); a.follows += num(r[col.follows])
  a.delivery.add(r["Ad delivery"])
  ;(adDates[name] ||= []).push(r["Reporting starts"])
}
console.log("\n\n=== AD TOTALS (Jun 1-30), sorted by spend ===")
const adList = Object.entries(adAgg).sort((a, b) => b[1].spend - a[1].spend)
for (const [n, a] of adList) {
  const ds = adDates[n].sort()
  console.log(`\n${n}  [${[...a.delivery].join(",")}]  ${ds[0]}..${ds.slice(-1)[0]} (${ds.length}d)`)
  console.log(`  spend=$${a.spend.toFixed(2)} impr=${a.impr} clicks=${a.clicks} follows=${a.follows} profileVisits=${a.profileVisits} CTR=${a.impr ? ((a.clicks / a.impr) * 100).toFixed(2) : 0}% CPF=${a.follows ? "$" + (a.spend / a.follows).toFixed(2) : "n/a"}`)
}

// ---------- DAILY CAMPAIGN SPEND/FOLLOWS ----------
console.log("\n\n=== DAILY BY CAMPAIGN ===")
const daily = {}
for (const r of camp) {
  const d = r["Reporting starts"]
  const name = r["Campaign name"]
  daily[d] ||= {}
  daily[d][name] = { spend: num(r[col.spend]), follows: num(r[col.follows]), impr: num(r[col.impr]) }
}
for (const d of Object.keys(daily).sort()) {
  const e = daily[d]
  const parts = Object.entries(e).map(([n, v]) => `${n.replace("[2026] ", "").replace(" Campaign", "").replace(" Campaigns", "")}: $${v.spend.toFixed(2)}/${v.follows}f`)
  console.log(`${d}  ${parts.join("  |  ")}`)
}
