import { useState, useEffect, useRef } from "react";

// ── RESPONSIVE HOOK ────────────────────────────────────────────────────────
// Most sizing is handled by fluid clamp() values in the design tokens. This
// hook exists only for layout decisions that require true conditional rendering:
// auto-collapsing roster on narrow containers, switching board to list-default,
// and turning the roster into an overlay drawer on phone-class viewports.
function useViewport() {
  const compute = w => ({
    vw: w,
    narrow: w < 1100,    // auto-default board to list, auto-collapse roster
    mobile: w < 768,     // roster becomes overlay drawer instead of sidebar
  });
  const [v, setV] = useState(compute(typeof window !== "undefined" ? window.innerWidth : 1600));
  useEffect(() => {
    const handler = () => setV(prev => {
      const next = compute(window.innerWidth);
      return (next.narrow === prev.narrow && next.mobile === prev.mobile) ? prev : next;
    });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return v;
}

// ── THEME ──────────────────────────────────────────────────────────────────
const C = {
  bg:"#06101E", surface:"#091624", card:"#0C1D35",
  border:"#18334F", borderBrt:"#264F78", accent:"#1A7FFF", accentDim:"#0A3A7A",
  text:"#C0D4E8", dim:"#567090", white:"#EEF4FF",
  green:"#00D080", amber:"#FF9400", red:"#FF3355", teal:"#00C8C8",
};

// ── DESIGN TOKENS ──────────────────────────────────────────────────────────
// Fluid type scale via clamp(min, preferred, max). Scales smoothly with viewport
// width — no breakpoints, no stair-steps. Use these instead of raw px font sizes.
const T = {
  xxs:  "clamp(8px, 0.45vw + 4px, 10px)",    // tiny labels, status badges
  xs:   "clamp(9px, 0.55vw + 5px, 11px)",    // micro labels, dim metadata
  sm:   "clamp(10px, 0.6vw + 6px, 12px)",    // captions, secondary text
  base: "clamp(12px, 0.7vw + 7px, 14px)",    // body text
  md:   "clamp(13px, 0.8vw + 8px, 15px)",    // emphasized body, card titles
  lg:   "clamp(15px, 1.1vw + 9px, 18px)",    // section titles
  xl:   "clamp(18px, 1.4vw + 11px, 22px)",   // brand wordmark
  xxl:  "clamp(20px, 1.6vw + 12px, 26px)",   // hero metrics in header
};
// Fluid spacing scale — same idea for padding, gap, margin.
const S = {
  s1: "clamp(2px, 0.15vw + 1px, 4px)",
  s2: "clamp(4px, 0.2vw + 2px, 6px)",
  s3: "clamp(6px, 0.35vw + 3px, 10px)",
  s4: "clamp(8px, 0.5vw + 5px, 14px)",
  s5: "clamp(12px, 0.8vw + 7px, 20px)",
  s6: "clamp(16px, 1.2vw + 9px, 28px)",
};

// ── SKILL TYPES ────────────────────────────────────────────────────────────
const MODALITY_MAP = {
  "Delivery":     ["DEL-STANDARD","DEL-HEAVY","DEL-OVERSIZED","DEL-FRAGILE","DEL-HAZMAT","DEL-FORKLIFT"],
  "Installation": ["INS-DELL-STD","INS-DELL-GPU","INS-HPE-STD","INS-HPE-GPU","INS-CISCO-STD","INS-CISCO-HCI","INS-SMC-STD","INS-SMC-GPU"],
  "Networking":   ["NET-CORE","NET-EDGE","NET-SPINE","NET-FIBER","NET-OOB","NET-CABLING"],
};
const MODALITY_CLR = { "Delivery":"#FF9400", "Installation":"#00C8C8", "Networking":"#1A7FFF" };
const PHASE_ORDER = ["delivery","installation","networking"];

// ── FONTS ──────────────────────────────────────────────────────────────────
function injectFonts() {
  if (document.getElementById("sortie-fonts")) return;
  const l = document.createElement("link");
  l.id = "sortie-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Barlow:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";
  document.head.appendChild(l);
}

// ── CUSTOMERS ──────────────────────────────────────────────────────────────
const CUSTOMERS = {
  C01:{name:"Capital One",          city:"Ashburn, VA"},
  C02:{name:"AT&T",                 city:"Dallas, TX"},
  C03:{name:"Fidelity Investments", city:"Boston, MA"},
  C04:{name:"ExxonMobil",           city:"Houston, TX"},
  C05:{name:"Kaiser Permanente",    city:"Los Angeles, CA"},
  C06:{name:"Dominion Energy",      city:"Richmond, VA"},
  C07:{name:"MGM Resorts",          city:"Las Vegas, NV"},
  C08:{name:"Southwest Airlines",   city:"Dallas, TX"},
  C09:{name:"Banner Health",        city:"Phoenix, AZ"},
  C10:{name:"United Airlines",      city:"Chicago, IL"},
  C11:{name:"Intel",                city:"Santa Clara, CA"},
  C12:{name:"DaVita",               city:"Denver, CO"},
  C13:{name:"Leidos",               city:"Reston, VA"},
  C14:{name:"Nationwide Insurance", city:"Columbus, OH"},
  C15:{name:"Bank of America",      city:"Charlotte, NC"},
  C16:{name:"UnitedHealth Group",   city:"Minneapolis, MN"},
  C17:{name:"PNC Financial",        city:"Pittsburgh, PA"},
  C18:{name:"Intermountain Health", city:"Salt Lake City, UT"},
  C19:{name:"Delta Air Lines",      city:"Atlanta, GA"},
};

// ── ENGINEERS ─────────────────────────────────────────────────────────────
const ENGINEERS = [
  // Delivery (7) — DEL01–DEL07
  {id:"DEL01",name:"Marcus Rodriguez", modality:"Delivery",     certs:["DEL-HEAVY","DEL-OVERSIZED","DEL-STANDARD"],          city:"Ashburn, VA",        level:5},
  {id:"DEL02",name:"Sarah Chen",       modality:"Delivery",     certs:["DEL-STANDARD","DEL-FRAGILE","DEL-FORKLIFT"],          city:"Dallas, TX",         level:4},
  {id:"DEL03",name:"James Okafor",     modality:"Delivery",     certs:["DEL-HEAVY","DEL-HAZMAT","DEL-OVERSIZED"],             city:"Atlanta, GA",        level:5},
  {id:"DEL04",name:"Priya Nair",       modality:"Delivery",     certs:["DEL-STANDARD","DEL-FORKLIFT","DEL-FRAGILE"],          city:"Charlotte, NC",      level:3},
  {id:"DEL05",name:"David Kim",        modality:"Delivery",     certs:["DEL-HEAVY","DEL-STANDARD","DEL-OVERSIZED"],           city:"Los Angeles, CA",    level:4},
  {id:"DEL06",name:"Elena Vasquez",    modality:"Delivery",     certs:["DEL-STANDARD","DEL-FRAGILE","DEL-HAZMAT"],            city:"Houston, TX",        level:3},
  {id:"DEL07",name:"Thomas Wright",    modality:"Delivery",     certs:["DEL-FORKLIFT","DEL-HEAVY","DEL-HAZMAT"],              city:"Chicago, IL",        level:4},
  // Installation (10) — INS01–INS10
  {id:"INS01",name:"Fatima Al-Rashid", modality:"Installation", certs:["INS-DELL-STD","INS-DELL-GPU","INS-HPE-STD"],          city:"Richmond, VA",       level:5},
  {id:"INS02",name:"Carlos Mendez",    modality:"Installation", certs:["INS-CISCO-STD","INS-CISCO-HCI","INS-SMC-STD"],        city:"Dallas, TX",         level:4},
  {id:"INS03",name:"Rachel Park",      modality:"Installation", certs:["INS-HPE-STD","INS-HPE-GPU","INS-DELL-STD"],           city:"Seattle, WA",        level:4},
  {id:"INS04",name:"Devon Brooks",     modality:"Installation", certs:["INS-DELL-STD","INS-SMC-STD","INS-SMC-GPU"],           city:"Chicago, IL",        level:3},
  {id:"INS05",name:"Nadia Kowalski",   modality:"Installation", certs:["INS-CISCO-STD","INS-HPE-STD","INS-DELL-STD"],         city:"Columbus, OH",       level:4},
  {id:"INS06",name:"Antoine Leblanc",  modality:"Installation", certs:["INS-SMC-GPU","INS-DELL-GPU","INS-HPE-GPU"],           city:"New Orleans, LA",    level:4},
  {id:"INS07",name:"Kenji Tanaka",     modality:"Installation", certs:["INS-HPE-GPU","INS-SMC-GPU","INS-DELL-GPU"],           city:"San Francisco, CA",  level:5},
  {id:"INS08",name:"Ingrid Svensson",  modality:"Installation", certs:["INS-CISCO-HCI","INS-CISCO-STD","INS-HPE-STD"],        city:"Minneapolis, MN",    level:3},
  {id:"INS09",name:"Omar Hassan",      modality:"Installation", certs:["INS-DELL-STD","INS-CISCO-STD","INS-HPE-STD"],         city:"Washington, DC",     level:4},
  {id:"INS10",name:"Brianna Taylor",   modality:"Installation", certs:["INS-SMC-STD","INS-DELL-STD","INS-CISCO-STD"],         city:"Phoenix, AZ",        level:3},
  // Networking (9) — NET01–NET09
  {id:"NET01",name:"Ravi Patel",       modality:"Networking",   certs:["NET-CORE","NET-SPINE","NET-FIBER"],                   city:"Boston, MA",         level:5},
  {id:"NET02",name:"Megan O'Brien",    modality:"Networking",   certs:["NET-EDGE","NET-OOB","NET-CABLING"],                   city:"Denver, CO",         level:4},
  {id:"NET03",name:"Sebastien Dupont", modality:"Networking",   certs:["NET-CORE","NET-CABLING","NET-EDGE"],                  city:"Salt Lake City, UT", level:2},
  {id:"NET04",name:"Yuki Yamamoto",    modality:"Networking",   certs:["NET-SPINE","NET-FIBER","NET-OOB"],                    city:"Pittsburgh, PA",     level:4},
  {id:"NET05",name:"Amara Diallo",     modality:"Networking",   certs:["NET-CORE","NET-EDGE","NET-CABLING"],                  city:"Atlanta, GA",        level:3},
  {id:"NET06",name:"Patrick McGee",    modality:"Networking",   certs:["NET-CABLING","NET-FIBER","NET-OOB"],                  city:"Boston, MA",         level:3},
  {id:"NET07",name:"Lena Fischer",     modality:"Networking",   certs:["NET-SPINE","NET-CORE","NET-FIBER"],                   city:"Chicago, IL",        level:4},
  {id:"NET08",name:"Jamal Washington", modality:"Networking",   certs:["NET-OOB","NET-CABLING","NET-EDGE"],                   city:"Las Vegas, NV",      level:3},
  {id:"NET09",name:"Sofia Reyes",      modality:"Networking",   certs:["NET-CORE","NET-SPINE","NET-EDGE"],                    city:"Los Angeles, CA",    level:4},
];

// ── PROJECTS ───────────────────────────────────────────────────────────────
// phaseCerts: required cert for each phase
// phaseRequired: number of engineers needed per phase (tier-driven)
// Large >$550K: 2 DEL + 2 INS + 1 NET
// Medium $250K–$550K: 1 DEL + 2 INS + 1 NET
// Small <$250K: 1 DEL + 1 INS + 1 NET
const PROJECTS = [
  // ── LARGE ──
  {id:"P01",name:"Capital One GPU Cluster",      customer:"C01",tier:"Large",  revenue:780000,daysLeft:8,
   phaseCerts:{delivery:"DEL-HEAVY",   installation:"INS-DELL-GPU",networking:"NET-SPINE"},  phaseRequired:{delivery:2,installation:2,networking:1}},
  {id:"P02",name:"AT&T Dallas Server Farm",      customer:"C02",tier:"Large",  revenue:650000,daysLeft:14,
   phaseCerts:{delivery:"DEL-HEAVY",   installation:"INS-HPE-STD", networking:"NET-CORE"},   phaseRequired:{delivery:2,installation:2,networking:1}},
  {id:"P03",name:"Fidelity HPC Expansion",       customer:"C03",tier:"Large",  revenue:620000,daysLeft:10,
   phaseCerts:{delivery:"DEL-STANDARD",installation:"INS-DELL-STD",networking:"NET-EDGE"},   phaseRequired:{delivery:2,installation:2,networking:1}},
  {id:"P05",name:"Kaiser AI Infrastructure",     customer:"C05",tier:"Large",  revenue:590000,daysLeft:15,
   phaseCerts:{delivery:"DEL-HEAVY",   installation:"INS-SMC-GPU", networking:"NET-FIBER"},  phaseRequired:{delivery:2,installation:2,networking:1}},
  {id:"P10",name:"United Airlines Core Deploy",  customer:"C10",tier:"Large",  revenue:680000,daysLeft:18,
   phaseCerts:{delivery:"DEL-STANDARD",installation:"INS-CISCO-STD",networking:"NET-CORE"},  phaseRequired:{delivery:2,installation:2,networking:1}},
  {id:"P13",name:"Leidos Secure Compute",        customer:"C13",tier:"Large",  revenue:710000,daysLeft:7,
   phaseCerts:{delivery:"DEL-HEAVY",   installation:"INS-HPE-GPU", networking:"NET-SPINE"},  phaseRequired:{delivery:2,installation:2,networking:1}},
  {id:"P15",name:"Bank of America AI Cluster",   customer:"C15",tier:"Large",  revenue:760000,daysLeft:6,
   phaseCerts:{delivery:"DEL-HEAVY",   installation:"INS-SMC-GPU", networking:"NET-FIBER"},  phaseRequired:{delivery:2,installation:2,networking:1}},
  {id:"P23",name:"ExxonMobil Houston HPC",       customer:"C04",tier:"Large",  revenue:695000,daysLeft:9,
   phaseCerts:{delivery:"DEL-OVERSIZED",installation:"INS-SMC-GPU",networking:"NET-FIBER"},  phaseRequired:{delivery:2,installation:2,networking:1}},
  {id:"P24",name:"Kaiser Permanente Cluster",    customer:"C05",tier:"Large",  revenue:725000,daysLeft:6,
   phaseCerts:{delivery:"DEL-HEAVY",   installation:"INS-HPE-GPU", networking:"NET-SPINE"},  phaseRequired:{delivery:2,installation:2,networking:1}},
  // ── MEDIUM ──
  {id:"P04",name:"ExxonMobil Compute Refresh",   customer:"C04",tier:"Medium", revenue:430000,daysLeft:11,
   phaseCerts:{delivery:"DEL-STANDARD",installation:"INS-CISCO-STD",networking:"NET-EDGE"},  phaseRequired:{delivery:1,installation:2,networking:1}},
  {id:"P06",name:"Dominion Energy Servers",      customer:"C06",tier:"Medium", revenue:315000,daysLeft:22,
   phaseCerts:{delivery:"DEL-STANDARD",installation:"INS-HPE-STD", networking:"NET-CORE"},   phaseRequired:{delivery:1,installation:2,networking:1}},
  {id:"P07",name:"MGM Resorts Blade Deploy",     customer:"C07",tier:"Medium", revenue:480000,daysLeft:20,
   phaseCerts:{delivery:"DEL-STANDARD",installation:"INS-CISCO-HCI",networking:"NET-CORE"},  phaseRequired:{delivery:1,installation:2,networking:1}},
  {id:"P08",name:"Southwest Airlines Rack",      customer:"C08",tier:"Medium", revenue:340000,daysLeft:5,
   phaseCerts:{delivery:"DEL-STANDARD",installation:"INS-DELL-STD",networking:"NET-CABLING"},phaseRequired:{delivery:1,installation:2,networking:1}},
  {id:"P11",name:"Intel Lab Servers",            customer:"C11",tier:"Medium", revenue:420000,daysLeft:16,
   phaseCerts:{delivery:"DEL-STANDARD",installation:"INS-SMC-STD", networking:"NET-CABLING"},phaseRequired:{delivery:1,installation:2,networking:1}},
  {id:"P14",name:"Nationwide Server Refresh",    customer:"C14",tier:"Medium", revenue:380000,daysLeft:22,
   phaseCerts:{delivery:"DEL-STANDARD",installation:"INS-CISCO-STD",networking:"NET-CABLING"},phaseRequired:{delivery:1,installation:2,networking:1}},
  {id:"P16",name:"UnitedHealth Analytics",       customer:"C16",tier:"Medium", revenue:290000,daysLeft:17,
   phaseCerts:{delivery:"DEL-STANDARD",installation:"INS-DELL-STD",networking:"NET-OOB"},    phaseRequired:{delivery:1,installation:2,networking:1}},
  {id:"P19",name:"Delta Air Lines Rack & Stack", customer:"C19",tier:"Medium", revenue:440000,daysLeft:19,
   phaseCerts:{delivery:"DEL-STANDARD",installation:"INS-DELL-STD",networking:"NET-EDGE"},   phaseRequired:{delivery:1,installation:2,networking:1}},
  {id:"P21",name:"AT&T Midwest Rollout",         customer:"C02",tier:"Medium", revenue:510000,daysLeft:24,
   phaseCerts:{delivery:"DEL-STANDARD",installation:"INS-HPE-STD", networking:"NET-EDGE"},   phaseRequired:{delivery:1,installation:2,networking:1}},
  {id:"P25",name:"Dominion Energy Compute",      customer:"C06",tier:"Medium", revenue:380000,daysLeft:14,
   phaseCerts:{delivery:"DEL-STANDARD",installation:"INS-CISCO-HCI",networking:"NET-CORE"},  phaseRequired:{delivery:1,installation:2,networking:1}},
  {id:"P26",name:"MGM Data Center Refresh",      customer:"C07",tier:"Medium", revenue:465000,daysLeft:19,
   phaseCerts:{delivery:"DEL-STANDARD",installation:"INS-DELL-STD",networking:"NET-CABLING"},phaseRequired:{delivery:1,installation:2,networking:1}},
  // ── SMALL ──
  {id:"P09",name:"Banner Health IT Refresh",     customer:"C09",tier:"Small",  revenue:195000,daysLeft:21,
   phaseCerts:{delivery:"DEL-STANDARD",installation:"INS-HPE-STD", networking:"NET-EDGE"},   phaseRequired:{delivery:1,installation:1,networking:1}},
  {id:"P12",name:"DaVita Denver Servers",        customer:"C12",tier:"Small",  revenue:175000,daysLeft:25,
   phaseCerts:{delivery:"DEL-STANDARD",installation:"INS-DELL-STD",networking:"NET-CABLING"},phaseRequired:{delivery:1,installation:1,networking:1}},
  {id:"P17",name:"PNC Financial Servers",        customer:"C17",tier:"Small",  revenue:245000,daysLeft:13,
   phaseCerts:{delivery:"DEL-STANDARD",installation:"INS-HPE-STD", networking:"NET-OOB"},    phaseRequired:{delivery:1,installation:1,networking:1}},
  {id:"P18",name:"Intermountain Health Deploy",  customer:"C18",tier:"Small",  revenue:175000,daysLeft:4,
   phaseCerts:{delivery:"DEL-STANDARD",installation:"INS-CISCO-STD",networking:"NET-EDGE"},  phaseRequired:{delivery:1,installation:1,networking:1}},
  {id:"P20",name:"Capital One Edge Deploy",      customer:"C01",tier:"Small",  revenue:215000,daysLeft:11,
   phaseCerts:{delivery:"DEL-STANDARD",installation:"INS-SMC-STD", networking:"NET-OOB"},    phaseRequired:{delivery:1,installation:1,networking:1}},
  {id:"P22",name:"Fidelity DR Site",             customer:"C03",tier:"Small",  revenue:165000,daysLeft:30,
   phaseCerts:{delivery:"DEL-STANDARD",installation:"INS-DELL-STD",networking:"NET-CABLING"},phaseRequired:{delivery:1,installation:1,networking:1}},
];

// ── INITIAL PHASE STATE ────────────────────────────────────────────────────
// phaseAssign["P01-networking"] = ["NET01"]   — who is on each phase
// phaseComplete["P01"] = ["delivery","installation"]  — which phases are done
const BASE_PHASE_ASSIGN = {
  // Delivery phase (6 projects)
  "P05-delivery":["DEL01","DEL03"], "P12-delivery":["DEL04"],
  "P15-delivery":["DEL05","DEL07"], "P21-delivery":["DEL06"],
  "P26-delivery":["DEL02"],         "P22-delivery":[],   // P22 AT RISK
  // Installation phase (5 projects — all 10 installation engineers deployed)
  "P02-installation":["INS03","INS08"], "P04-installation":["INS02","INS10"],
  "P06-installation":["INS01","INS05"], "P08-installation":["INS04","INS09"],
  "P24-installation":["INS06","INS07"],
  // Networking phase (15 projects — 9 covered, 6 AT RISK)
  "P01-networking":["NET01"], "P03-networking":["NET09"],
  "P07-networking":["NET03"], "P09-networking":["NET05"],
  "P10-networking":["NET07"], "P11-networking":["NET02"],
  "P13-networking":["NET04"], "P14-networking":["NET06"],
  "P17-networking":["NET08"],
  "P16-networking":[], "P18-networking":[], "P19-networking":[],
  "P20-networking":[], "P23-networking":[], "P25-networking":[],
};

const BASE_PHASE_COMPLETE = {
  // Installation-phase projects (delivery done)
  P02:["delivery"], P04:["delivery"], P06:["delivery"],
  P08:["delivery"], P24:["delivery"],
  // Networking-phase projects (delivery + installation done)
  P01:["delivery","installation"], P03:["delivery","installation"],
  P07:["delivery","installation"], P09:["delivery","installation"],
  P10:["delivery","installation"], P11:["delivery","installation"],
  P13:["delivery","installation"], P14:["delivery","installation"],
  P16:["delivery","installation"], P17:["delivery","installation"],
  P18:["delivery","installation"], P19:["delivery","installation"],
  P20:["delivery","installation"], P23:["delivery","installation"],
  P25:["delivery","installation"],
};

// ── BASELINE ──────────────────────────────────────────────────────────────
// Sortie reasons about hypothetical disruptions in natural language — the user
// types "snowstorm closed ORD" or "Sara is out sick" and the AI applies the
// premise without persisting any pre-canned scenario state. The baseline below
// is the always-on world state: empty disruptions/freedEngineers maps. The
// at-risk pressure already baked into BASE_PHASE_ASSIGN (P22 delivery + six
// networking projects without assigned engineers) gives the demo plenty to
// work with on first paint.
const BASELINE_SCENARIO = {
  name: "Live Operations",
  disruptions: {},
  freedEngineers: {},
  earlyProjects: {},
};

// ── HELPERS ────────────────────────────────────────────────────────────────
const fmtRev  = n => n>=1e6?`$${(n/1e6).toFixed(2)}M`:`$${(n/1000).toFixed(0)}K`;
const urgClr  = d => d<=5?C.red:d<=12?C.amber:C.green;
const fmtTime = () => new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
const getEngineer  = id => ENGINEERS.find(i=>i.id===id);

// Current phase of a project (derived from completed phases)
function getCurrentPhase(pid, phaseComplete) {
  const done = phaseComplete[pid] || [];
  if (!done.includes("delivery")) return "delivery";
  if (!done.includes("installation")) return "installation";
  return "networking";
}

// Coverage status for a specific phase of a project
function getPhaseStatus(pid, phase, project, phaseAssign, phaseComplete) {
  const done = phaseComplete[pid] || [];
  if (done.includes(phase)) return "complete";
  const current = getCurrentPhase(pid, phaseComplete);
  if (phase !== current) return "pending";
  const assigned = (phaseAssign[`${pid}-${phase}`] || []).length;
  const required = project.phaseRequired[phase];
  if (assigned === 0) return "at_risk";
  if (assigned < required) return "understaffed";
  return "covered";
}

// Calculate total revenue at risk (active phases with 0 engineers)
function calcRevAtRisk(projects, phaseAssign, phaseComplete) {
  return projects.reduce((total, p) => {
    const phase = getCurrentPhase(p.id, phaseComplete);
    const assigned = (phaseAssign[`${p.id}-${phase}`] || []).length;
    return assigned === 0 ? total + p.revenue : total;
  }, 0);
}

// Engineer status derived from phase assignments
function engineerStatus(id, scenario, phaseAssign) {
  if (id in (scenario.disruptions||{})) return "disrupted";
  if (id in (scenario.freedEngineers||{})) return "freed";
  for (const [, arr] of Object.entries(phaseAssign)) {
    if (Array.isArray(arr) && arr.includes(id)) return "deployed";
  }
  return "available";
}

// Current physical location of an engineer
function getCurrentLocation(engineer, phaseAssign) {
  for (const [key, arr] of Object.entries(phaseAssign)) {
    if (Array.isArray(arr) && arr.includes(engineer.id)) {
      const [pid] = key.split("-");
      const proj = PROJECTS.find(p=>p.id===pid);
      if (proj) {
        const city = CUSTOMERS[proj.customer]?.city;
        if (city) return { city, source:`On-site: ${proj.name}` };
      }
    }
  }
  return { city:engineer.city, source:"Home base" };
}

// Travel band calculation
const TRAVEL_BANDS = {
  "Ashburn, VA":"Mid-Atlantic","Dallas, TX":"South Central","Boston, MA":"Northeast",
  "Atlanta, GA":"Southeast","Charlotte, NC":"Southeast","Los Angeles, CA":"West Coast",
  "Houston, TX":"South Central","Chicago, IL":"Midwest","Richmond, VA":"Mid-Atlantic",
  "Seattle, WA":"Pacific Northwest","Columbus, OH":"Midwest","New Orleans, LA":"South Central",
  "San Francisco, CA":"West Coast","Minneapolis, MN":"Midwest","Washington, DC":"Mid-Atlantic",
  "Phoenix, AZ":"Southwest","Denver, CO":"Mountain","Salt Lake City, UT":"Mountain",
  "Pittsburgh, PA":"Mid-Atlantic","Las Vegas, NV":"Southwest","Santa Clara, CA":"West Coast",
  "Reston, VA":"Mid-Atlantic",
};
const ADJACENT = {
  "Mid-Atlantic":["Northeast","Southeast","Midwest"],
  "Northeast":["Mid-Atlantic"],
  "Southeast":["Mid-Atlantic","South Central"],
  "South Central":["Southeast","Southwest"],
  "Midwest":["Mid-Atlantic","Mountain","South Central"],
  "Mountain":["Midwest","Southwest","West Coast","Pacific Northwest"],
  "West Coast":["Mountain","Pacific Northwest"],
  "Pacific Northwest":["West Coast","Mountain"],
  "Southwest":["South Central","Mountain","West Coast"],
};
function getTravelBand(fromCity, toCity) {
  const r1 = TRAVEL_BANDS[fromCity], r2 = TRAVEL_BANDS[toCity];
  if (!r1||!r2) return {label:"UNKNOWN",color:C.dim};
  if (r1===r2) return {label:"SAME REGION · SAME DAY",color:C.green};
  if (ADJACENT[r1]?.includes(r2)) return {label:"ADJACENT · NEXT DAY",color:C.amber};
  return {label:"CROSS-COUNTRY · 2 DAYS",color:C.red};
}

// ── AI VALIDATION ──────────────────────────────────────────────────────────
function validateAIResponse(parsed, phaseComplete) {
  if (!parsed?.proposedChange) return { ok:true, parsed };
  const { projectId, phase, newEngineerId } = parsed.proposedChange;
  const project = PROJECTS.find(p=>p.id===projectId);
  const engineer     = ENGINEERS.find(i=>i.id===newEngineerId);
  const activePhase = phase || getCurrentPhase(projectId, phaseComplete||{});
  if (!project) return { ok:false, parsed:{...parsed,proposedChange:null,recommendation:`Unknown project: ${projectId}`}};
  if (!engineer)     return { ok:false, parsed:{...parsed,proposedChange:null,recommendation:`Unknown engineer: ${newEngineerId}`}};
  const reqCert = project.phaseCerts[activePhase];
  const certOk  = engineer.certs.includes(reqCert);
  parsed.certMatch   = certOk;
  parsed.requiredCert = reqCert;
  parsed.proposedChange.phase = activePhase;
  if (!certOk) {
    parsed.recommendation = `Cert mismatch: ${engineer.name} lacks ${reqCert} for ${activePhase} phase (has: ${engineer.certs.join(", ")})`;
    parsed.proposedChange  = null;
  }
  return { ok:certOk, parsed };
}

// ── COMPONENTS ─────────────────────────────────────────────────────────────
const F  = "'Barlow Condensed',sans-serif";
const FB = "'Barlow',sans-serif";
const FM = "'JetBrains Mono',monospace";

function Header({atRisk,util,deployed}) {
  return (
    <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:`0 ${S.s5}`,
      display:"flex",alignItems:"center",gap:S.s5,height:"clamp(48px, 4.5vw + 30px, 60px)",flexShrink:0}}>
      <svg width="22" height="22" viewBox="0 0 26 26" fill="none" style={{flexShrink:0}}>
        <polygon points="13,2 24,20 2,20" fill="none" stroke={C.accent} strokeWidth="1.5"/>
        <circle cx="13" cy="14" r="3" fill={C.accent}/>
        <line x1="13" y1="2" x2="13" y2="11" stroke={C.accent} strokeWidth="1.5"/>
      </svg>
      <span style={{fontFamily:F,fontSize:T.xl,fontWeight:800,color:C.white,letterSpacing:3,flexShrink:0}}>SORTIE</span>
      <div style={{flex:1,minWidth:0}}/>
      {[{l:"REVENUE AT RISK",v:fmtRev(atRisk),c:atRisk>0?C.red:C.green},
        {l:"UTILIZATION",v:`${util}%`,c:util>=90?C.green:util>=70?C.amber:C.red},
        {l:"DEPLOYED",v:`${deployed}/${ENGINEERS.length}`,c:C.text},
      ].map(m=>(
        <div key={m.l} style={{textAlign:"right",flexShrink:0}}>
          <div style={{fontFamily:F,fontSize:T.xxs,fontWeight:700,letterSpacing:1.5,color:C.dim}}>{m.l}</div>
          <div style={{fontFamily:FM,fontSize:T.xxl,fontWeight:500,color:m.c,lineHeight:1.1}}>{m.v}</div>
        </div>
      ))}
    </div>
  );
}

function PhaseProgressBar({pid, phaseAssign, phaseComplete, project}) {
  const phases = ["delivery","installation","networking"];
  const phaseLabels = {delivery:"DEL",installation:"INS",networking:"NET"};
  const phaseColors = {delivery:MODALITY_CLR.Delivery,installation:MODALITY_CLR.Installation,networking:MODALITY_CLR.Networking};
  return (
    <div style={{display:"flex",gap:2,alignItems:"center"}}>
      {phases.map((ph,i)=>{
        const status = getPhaseStatus(pid, ph, project, phaseAssign, phaseComplete);
        const clr = phaseColors[ph];
        const bg   = status==="complete"?clr:status==="at_risk"?C.red:status==="understaffed"?C.amber:status==="covered"?clr:`${clr}30`;
        const txtC = status==="pending"?`${clr}60`:C.white;
        return (
          <div key={ph} style={{display:"flex",alignItems:"center",gap:2}}>
            <div style={{background:bg,borderRadius:2,padding:"1px 5px",
              fontFamily:F,fontSize:8,fontWeight:700,color:txtC,letterSpacing:0.5,
              opacity:status==="pending"?0.5:1}}>
              {status==="complete"?"✓":status==="at_risk"?"⚠":status==="understaffed"?"!":""}{phaseLabels[ph]}
            </div>
            {i<2&&<span style={{color:C.border,fontSize:9}}>›</span>}
          </div>
        );
      })}
    </div>
  );
}

function EngineerCard({engineer, status, reason, phaseAssign, phaseComplete}) {
  const dotClr = status==="deployed"?C.green:status==="available"?C.accent:status==="freed"?C.teal:C.red;
  const mClr   = MODALITY_CLR[engineer.modality]||C.accent;
  // Find current project
  let curProject = null;
  for (const [key, arr] of Object.entries(phaseAssign)) {
    if (arr.includes(engineer.id)) {
      const [pid, phase] = key.split("-");
      curProject = { proj:PROJECTS.find(p=>p.id===pid), phase };
      break;
    }
  }
  return (
    <div style={{padding:"6px 12px",borderBottom:`1px solid ${C.border}`,
      background:status==="disrupted"?`${C.red}0A`:status==="freed"?`${C.teal}0A`:status==="available"?`${C.accent}06`:C.surface}}>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:dotClr,flexShrink:0}}/>
        <span style={{fontFamily:FB,fontSize:11,fontWeight:600,flex:1,
          color:status==="disrupted"?C.dim:C.white,
          textDecoration:status==="disrupted"?"line-through":"none",
          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{engineer.name}</span>
        {reason&&<span style={{fontFamily:F,fontSize:8,fontWeight:700,color:status==="freed"?C.teal:C.red,
          background:status==="freed"?`${C.teal}20`:`${C.red}20`,padding:"1px 4px",borderRadius:2,flexShrink:0}}>{reason}</span>}
      </div>
      <div style={{paddingLeft:12,display:"flex",gap:2,flexWrap:"wrap",marginTop:2}}>
        {engineer.certs.map(c=>(
          <span key={c} style={{fontFamily:FM,fontSize:8,color:mClr,background:`${mClr}18`,padding:"0 3px",borderRadius:2}}>{c}</span>
        ))}
      </div>
      <div style={{paddingLeft:12,marginTop:2,display:"flex",alignItems:"center",gap:5}}>
        <span style={{fontFamily:FB,fontSize:9,color:C.dim}}>{engineer.city}</span>
        {curProject?.proj&&(
          <span style={{fontFamily:F,fontSize:8,color:MODALITY_CLR[engineer.modality]||C.accent,
            fontWeight:700,letterSpacing:0.5}}>
            {curProject.phase.toUpperCase().slice(0,3)} → {curProject.proj.name.split(" ").slice(0,2).join(" ")}
          </span>
        )}
        {status==="available"&&<span style={{fontFamily:F,fontSize:9,fontWeight:700,letterSpacing:1,color:C.accent}}>BENCH</span>}
        {status==="freed"&&<span style={{fontFamily:F,fontSize:9,fontWeight:700,letterSpacing:1,color:C.teal}}>FREED</span>}
      </div>
    </div>
  );
}

function Roster({engineers, scenario, phaseAssign, phaseComplete, collapsed, onToggleCollapse, mobile, mobileOpen, onMobileClose}) {
  const groups = Object.keys(MODALITY_MAP).map(mod=>({
    mod, color:MODALITY_CLR[mod], engineers:engineers.filter(i=>i.modality===mod),
  }));
  const disruptedCount = Object.keys(scenario.disruptions||{}).length;
  const freedCount     = Object.keys(scenario.freedEngineers||{}).length;
  const availCount     = engineers.filter(i=>engineerStatus(i.id,scenario,phaseAssign)==="available").length;

  // Mobile mode: overlay drawer that slides in over the board, doesn't consume layout
  if (mobile) {
    if (!mobileOpen) return null;
    return (
      <div onClick={onMobileClose} style={{position:"absolute",inset:0,background:"rgba(4,8,18,0.7)",zIndex:150,display:"flex"}}>
        <div onClick={e=>e.stopPropagation()} style={{width:"min(280px, 80vw)",height:"100%",background:C.surface,
          borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column"}}>
          <div style={{padding:`${S.s3} ${S.s4}`,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:S.s2}}>
            <span style={{fontFamily:F,fontSize:T.xs,fontWeight:700,letterSpacing:2,color:C.dim}}>ENGINEER ROSTER</span>
            <button onClick={onMobileClose} style={{marginLeft:"auto",background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:18}}>✕</button>
          </div>
          <div style={{overflowY:"auto",flex:1}}>
            {groups.map(({mod,color,engineers:gi})=>(
              <div key={mod}>
                <div style={{padding:`${S.s2} ${S.s4}`,background:`${color}12`,borderBottom:`1px solid ${color}30`,
                  display:"flex",alignItems:"center",gap:S.s2}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:color,flexShrink:0}}/>
                  <span style={{fontFamily:F,fontSize:T.xs,fontWeight:700,letterSpacing:2,color}}>{mod.toUpperCase()}</span>
                </div>
                {gi.map(i=>(
                  <EngineerCard key={i.id} engineer={i}
                    status={engineerStatus(i.id,scenario,phaseAssign)}
                    reason={scenario.disruptions[i.id]||scenario.freedEngineers[i.id]}
                    phaseAssign={phaseAssign} phaseComplete={phaseComplete}/>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Collapsed: thin vertical strip with toggle to expand
  if (collapsed) {
    return (
      <div style={{width:38,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",
        flexShrink:0,background:C.surface,alignItems:"center",paddingTop:S.s2,gap:S.s2}}>
        <button onClick={onToggleCollapse} title="Expand roster"
          style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:14,padding:4}}>›</button>
        <div style={{writingMode:"vertical-rl",transform:"rotate(180deg)",fontFamily:F,fontSize:T.xs,
          fontWeight:700,letterSpacing:2,color:C.dim,marginTop:S.s2}}>ENGINEER ROSTER</div>
        <div style={{marginTop:"auto",marginBottom:S.s3,display:"flex",flexDirection:"column",gap:S.s1,alignItems:"center"}}>
          {disruptedCount>0&&<div title={`${disruptedCount} out`} style={{fontFamily:F,fontSize:T.xs,fontWeight:700,color:C.red}}>{disruptedCount}</div>}
          {freedCount>0&&<div title={`${freedCount} freed`} style={{fontFamily:F,fontSize:T.xs,fontWeight:700,color:C.teal}}>{freedCount}</div>}
          <div title={`${availCount} available`} style={{fontFamily:F,fontSize:T.xs,fontWeight:700,color:C.accent}}>{availCount}</div>
        </div>
      </div>
    );
  }

  // Default sidebar — fluid width
  return (
    <div style={{width:"clamp(190px, 17vw, 260px)",borderRight:`1px solid ${C.border}`,
      display:"flex",flexDirection:"column",flexShrink:0,background:C.surface}}>
      <div style={{padding:`${S.s3} ${S.s4}`,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:S.s2}}>
        <button onClick={onToggleCollapse} title="Collapse roster"
          style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:14,padding:0,marginRight:2}}>‹</button>
        <span style={{fontFamily:F,fontSize:T.xs,fontWeight:700,letterSpacing:2,color:C.dim}}>ENGINEER ROSTER</span>
        {disruptedCount>0&&<span style={{fontFamily:F,fontSize:T.xxs,fontWeight:700,color:C.red,marginLeft:"auto"}}>{disruptedCount} OUT</span>}
        {freedCount>0&&<span style={{fontFamily:F,fontSize:T.xxs,fontWeight:700,color:C.teal,marginLeft:disruptedCount?"4px":"auto"}}>{freedCount} FREED</span>}
        <span style={{fontFamily:F,fontSize:T.xxs,fontWeight:700,color:C.accent,marginLeft:(disruptedCount||freedCount)?4:"auto"}}>{availCount} AVAIL</span>
      </div>
      <div style={{overflowY:"auto",flex:1}}>
        {groups.map(({mod,color,engineers:gi})=>(
          <div key={mod}>
            <div style={{padding:`${S.s2} ${S.s4}`,background:`${color}12`,borderBottom:`1px solid ${color}30`,
              display:"flex",alignItems:"center",gap:S.s2}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:color,flexShrink:0}}/>
              <span style={{fontFamily:F,fontSize:T.xs,fontWeight:700,letterSpacing:2,color}}>{mod.toUpperCase()}</span>
              <span style={{fontFamily:F,fontSize:T.xxs,color,opacity:0.7,marginLeft:"auto"}}>
                {gi.filter(i=>engineerStatus(i.id,scenario,phaseAssign)==="deployed").length}/{gi.length}
              </span>
            </div>
            {gi.map(i=>(
              <EngineerCard key={i.id} engineer={i}
                status={engineerStatus(i.id,scenario,phaseAssign)}
                reason={scenario.disruptions[i.id]||scenario.freedEngineers[i.id]}
                phaseAssign={phaseAssign} phaseComplete={phaseComplete}/>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({project, phaseAssign, phaseComplete, onMarkComplete}) {
  const cust        = CUSTOMERS[project.customer];
  const urgC        = urgClr(project.daysLeft);
  const currentPhase= getCurrentPhase(project.id, phaseComplete);
  const phaseStatus = getPhaseStatus(project.id, currentPhase, project, phaseAssign, phaseComplete);
  const assigned    = (phaseAssign[`${project.id}-${currentPhase}`]||[]).map(id=>getEngineer(id)).filter(Boolean);
  const required    = project.phaseRequired[currentPhase];
  const phaseClr    = MODALITY_CLR[currentPhase==="delivery"?"Delivery":currentPhase==="installation"?"Installation":"Networking"]||C.accent;
  const isAtRisk    = phaseStatus==="at_risk";
  const isUnder     = phaseStatus==="understaffed";
  const borderClr   = isAtRisk?C.red:isUnder?C.amber:phaseClr;
  return (
    <div style={{background:isAtRisk?`${C.red}0D`:isUnder?`${C.amber}06`:C.card,
      border:`1px solid ${borderClr}`,borderLeft:`3px solid ${borderClr}`,
      borderRadius:6,padding:`${S.s3} ${S.s4}`,display:"flex",flexDirection:"column",gap:S.s2,
      boxShadow:isAtRisk?`0 0 10px ${C.red}22`:undefined}}>
      {/* Status banner */}
      {(isAtRisk||isUnder)&&(
        <div style={{fontFamily:F,fontSize:T.xs,fontWeight:700,letterSpacing:2,
          color:isAtRisk?C.red:C.amber,background:isAtRisk?`${C.red}20`:`${C.amber}18`,
          padding:`${S.s1} ${S.s2}`,borderRadius:3,textAlign:"center"}}>
          {isAtRisk?`⚠ AT RISK — ${currentPhase.toUpperCase()} UNCOVERED`:`! UNDERSTAFFED — ${assigned.length}/${required} ENGINEERS`}
        </div>
      )}
      {/* Name + Revenue */}
      <div style={{display:"flex",alignItems:"flex-start",gap:S.s3}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:F,fontSize:T.md,fontWeight:700,color:C.white,lineHeight:1.2}}>{project.name}</div>
          <div style={{fontFamily:FB,fontSize:T.sm,color:C.text,marginTop:1}}>{cust.name}</div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{fontFamily:FM,fontSize:T.md,fontWeight:500,color:C.white}}>{fmtRev(project.revenue)}</div>
          <div style={{fontFamily:FM,fontSize:T.xs,color:urgC,marginTop:1}}>{project.daysLeft}d left</div>
        </div>
      </div>
      {/* Phase progress bar */}
      <PhaseProgressBar pid={project.id} phaseAssign={phaseAssign} phaseComplete={phaseComplete} project={project}/>
      {/* Current phase + assigned engineers */}
      <div style={{display:"flex",alignItems:"center",gap:S.s2,borderTop:`1px solid ${C.border}`,paddingTop:S.s2,flexWrap:"wrap"}}>
        <span style={{fontFamily:FM,fontSize:T.xxs,color:phaseClr,background:`${phaseClr}18`,
          padding:`${S.s1} ${S.s2}`,borderRadius:2}}>{currentPhase.toUpperCase()}</span>
        <span style={{fontFamily:FM,fontSize:T.xxs,color:C.dim}}>needs {project.phaseCerts[currentPhase]}</span>
        <div style={{flex:1}}/>
        {assigned.length>0?(
          <div style={{display:"flex",gap:S.s1,flexWrap:"wrap",justifyContent:"flex-end"}}>
            {assigned.map(e=>(
              <span key={e.id} style={{fontFamily:FB,fontSize:T.xs,color:C.green}}>✓ {e.name.split(" ")[0]}</span>
            ))}
          </div>
        ):(
          <span style={{fontFamily:F,fontSize:T.xs,fontWeight:700,color:C.red}}>No coverage</span>
        )}
      </div>
      {/* Mark complete button */}
      {phaseStatus==="covered"&&(
        <button onClick={()=>onMarkComplete(project.id, currentPhase)}
          style={{fontFamily:F,fontWeight:700,fontSize:T.xs,letterSpacing:1,padding:`${S.s2} ${S.s3}`,
            border:`1px solid ${phaseClr}55`,borderRadius:3,background:`${phaseClr}12`,
            color:phaseClr,cursor:"pointer",width:"100%",textAlign:"center"}}>
          ✓ MARK {currentPhase.toUpperCase()} COMPLETE
        </button>
      )}
      {/* Footer */}
      <div style={{fontFamily:FB,fontSize:T.xs,color:C.dim}}>{cust.city} · {project.tier}</div>
    </div>
  );
}

// Dense single-row view of a project. ~3x the vertical density of ProjectCard.
function ProjectListRow({project, phaseAssign, phaseComplete, onMarkComplete}) {
  const cust         = CUSTOMERS[project.customer];
  const urgC         = urgClr(project.daysLeft);
  const currentPhase = getCurrentPhase(project.id, phaseComplete);
  const phaseStatus  = getPhaseStatus(project.id, currentPhase, project, phaseAssign, phaseComplete);
  const assigned     = (phaseAssign[`${project.id}-${currentPhase}`]||[]).map(id=>getEngineer(id)).filter(Boolean);
  const required     = project.phaseRequired[currentPhase];
  const phaseClr     = MODALITY_CLR[currentPhase==="delivery"?"Delivery":currentPhase==="installation"?"Installation":"Networking"]||C.accent;
  const isAtRisk     = phaseStatus==="at_risk";
  const isUnder      = phaseStatus==="understaffed";
  const borderClr    = isAtRisk?C.red:isUnder?C.amber:phaseClr;
  const statusBadge  = isAtRisk?{label:"AT RISK",color:C.red}:isUnder?{label:`${assigned.length}/${required}`,color:C.amber}:{label:"COVERED",color:C.green};

  return (
    <div style={{background:isAtRisk?`${C.red}0D`:isUnder?`${C.amber}06`:C.card,
      border:`1px solid ${borderClr}`,borderLeft:`3px solid ${borderClr}`,
      borderRadius:5,padding:`${S.s2} ${S.s3}`,display:"flex",alignItems:"center",gap:S.s4,
      flexWrap:"wrap",rowGap:S.s2}}>
      {/* Status badge */}
      <div style={{fontFamily:F,fontSize:T.xxs,fontWeight:700,letterSpacing:1.5,
        color:statusBadge.color,background:`${statusBadge.color}18`,
        padding:`${S.s1} ${S.s2}`,borderRadius:3,flexShrink:0,minWidth:62,textAlign:"center"}}>
        {statusBadge.label}
      </div>
      {/* Name + customer (flex 1) */}
      <div style={{flex:"2 1 200px",minWidth:0}}>
        <div style={{fontFamily:F,fontSize:T.base,fontWeight:700,color:C.white,
          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{project.name}</div>
        <div style={{fontFamily:FB,fontSize:T.xs,color:C.dim,
          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cust.name} · {cust.city}</div>
      </div>
      {/* Phase + cert */}
      <div style={{flex:"1 1 120px",display:"flex",flexDirection:"column",gap:1,minWidth:0}}>
        <span style={{fontFamily:FM,fontSize:T.xxs,fontWeight:700,letterSpacing:1.5,color:phaseClr}}>
          {currentPhase.toUpperCase()}
        </span>
        <span style={{fontFamily:FM,fontSize:T.xxs,color:C.dim,whiteSpace:"nowrap",
          overflow:"hidden",textOverflow:"ellipsis"}}>needs {project.phaseCerts[currentPhase]}</span>
      </div>
      {/* Revenue + days */}
      <div style={{flex:"0 0 auto",textAlign:"right"}}>
        <div style={{fontFamily:FM,fontSize:T.base,fontWeight:500,color:C.white,lineHeight:1.1}}>{fmtRev(project.revenue)}</div>
        <div style={{fontFamily:FM,fontSize:T.xxs,color:urgC}}>{project.daysLeft}d</div>
      </div>
      {/* Assigned engineers */}
      <div style={{flex:"1 1 140px",textAlign:"right",minWidth:0,
        overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
        {assigned.length>0?(
          <span style={{fontFamily:FB,fontSize:T.xs,color:C.green}}>
            ✓ {assigned.map(e=>e.name.split(" ")[0]).join(", ")}
          </span>
        ):(
          <span style={{fontFamily:F,fontSize:T.xs,fontWeight:700,color:C.red}}>No coverage</span>
        )}
      </div>
      {/* Action */}
      {phaseStatus==="covered"&&(
        <button onClick={()=>onMarkComplete(project.id, currentPhase)}
          style={{fontFamily:F,fontWeight:700,fontSize:T.xxs,letterSpacing:1,padding:`${S.s1} ${S.s3}`,
            border:`1px solid ${phaseClr}55`,borderRadius:3,background:`${phaseClr}12`,
            color:phaseClr,cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"}}>
          ✓ COMPLETE
        </button>
      )}
    </div>
  );
}

function ProjectBoard({projects, phaseAssign, phaseComplete, onMarkComplete, heatmapFilter, onClearFilter, narrow}) {
  const [phaseFilter,setPhaseFilter] = useState(null);
  const [riskOnly,setRiskOnly]       = useState(false);
  const [underOnly,setUnderOnly]     = useState(false);
  // Default view: list on narrow viewports (more visible at once), grid on wide.
  const [view,setView]               = useState(narrow?"list":"grid");
  // Sort criterion is independent of view. STATUS = current behavior (status rank
  // primary, revenue secondary). DAYS = pure ascending days-left, regardless of
  // status — surfaces the most time-pressing projects. REVENUE = pure descending.
  const [sortBy,setSortBy]           = useState("status");

  // Apply heatmap click filter
  const activeFilter = heatmapFilter || phaseFilter;

  const filtered = [...projects].filter(p=>{
    const currentPhase = getCurrentPhase(p.id, phaseComplete);
    const status = getPhaseStatus(p.id, currentPhase, p, phaseAssign, phaseComplete);
    if (heatmapFilter) {
      if (heatmapFilter.phase && currentPhase !== heatmapFilter.phase) return false;
      if (heatmapFilter.status === "at_risk"      && status !== "at_risk")      return false;
      if (heatmapFilter.status === "understaffed" && status !== "understaffed") return false;
      if (heatmapFilter.status === "covered"      && status !== "covered")      return false;
    }
    if (phaseFilter && currentPhase !== phaseFilter) return false;
    if (riskOnly  && status !== "at_risk")      return false;
    if (underOnly && status !== "understaffed") return false;
    return true;
  }).sort((a,b)=>{
    if (sortBy==="days")    return a.daysLeft - b.daysLeft;
    if (sortBy==="revenue") return b.revenue  - a.revenue;
    // sortBy === "status" (default): at-risk first, then understaffed, then covered;
    // within same status, by revenue (or revenue/day for the urgency view).
    const sa = getPhaseStatus(a.id,getCurrentPhase(a.id,phaseComplete),a,phaseAssign,phaseComplete);
    const sb = getPhaseStatus(b.id,getCurrentPhase(b.id,phaseComplete),b,phaseAssign,phaseComplete);
    const rank = s => s==="at_risk"?0:s==="understaffed"?1:2;
    if (rank(sa)!==rank(sb)) return rank(sa)-rank(sb);
    if (view==="timeline") return (b.revenue/Math.max(b.daysLeft,1))-(a.revenue/Math.max(a.daysLeft,1));
    return b.revenue-a.revenue;
  });

  const atRiskCount    = projects.filter(p=>getPhaseStatus(p.id,getCurrentPhase(p.id,phaseComplete),p,phaseAssign,phaseComplete)==="at_risk").length;
  const underCount     = projects.filter(p=>getPhaseStatus(p.id,getCurrentPhase(p.id,phaseComplete),p,phaseAssign,phaseComplete)==="understaffed").length;

  const pill=(label,active,onClick,color,key)=>(
    <button key={key} onClick={onClick} style={{fontFamily:F,fontSize:T.sm,fontWeight:700,letterSpacing:1,
      padding:`${S.s1} ${S.s3}`,border:`1px solid ${active?color:`${color}44`}`,borderRadius:3,cursor:"pointer",
      whiteSpace:"nowrap",background:active?`${color}28`:"transparent",color:active?color:`${color}88`}}>{label}</button>
  );

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:C.bg,minWidth:0}}>
      {/* Filter bar */}
      <div style={{padding:`${S.s2} ${S.s4}`,borderBottom:`1px solid ${C.border}`,background:C.surface,
        display:"flex",alignItems:"center",gap:S.s1,flexWrap:"wrap",flexShrink:0}}>
        {pill("ALL",!activeFilter&&!riskOnly&&!underOnly,()=>{setPhaseFilter(null);setRiskOnly(false);setUnderOnly(false);if(onClearFilter)onClearFilter();},C.dim)}
        <div style={{width:1,height:12,background:C.border,margin:`0 ${S.s1}`}}/>
        {pill(`AT RISK${atRiskCount>0?` (${atRiskCount})`:""}`,riskOnly,()=>{setRiskOnly(v=>!v);setUnderOnly(false);setPhaseFilter(null);if(onClearFilter)onClearFilter();},C.red)}
        {underCount>0&&pill(`UNDERSTAFFED (${underCount})`,underOnly,()=>{setUnderOnly(v=>!v);setRiskOnly(false);setPhaseFilter(null);if(onClearFilter)onClearFilter();},C.amber)}
        <div style={{width:1,height:12,background:C.border,margin:`0 ${S.s1}`}}/>
        {["delivery","installation","networking"].map(ph=>{
          const cnt=projects.filter(p=>getCurrentPhase(p.id,phaseComplete)===ph).length;
          const clr=MODALITY_CLR[ph==="delivery"?"Delivery":ph==="installation"?"Installation":"Networking"];
          return pill(`${ph.toUpperCase().slice(0,4)} (${cnt})`,phaseFilter===ph,
            ()=>{setPhaseFilter(v=>v===ph?null:ph);setRiskOnly(false);setUnderOnly(false);if(onClearFilter)onClearFilter();},clr,ph);
        })}
        {heatmapFilter&&(
          <button onClick={onClearFilter} style={{fontFamily:F,fontSize:T.xs,fontWeight:700,padding:`${S.s1} ${S.s3}`,
            border:`1px solid ${C.teal}`,borderRadius:3,cursor:"pointer",background:`${C.teal}20`,color:C.teal}}>
            ◉ MATRIX FILTER × CLEAR
          </button>
        )}
        <div style={{flex:1}}/>
        <div style={{display:"flex",alignItems:"center",gap:S.s2}}>
          <span style={{fontFamily:F,fontSize:T.xxs,fontWeight:700,letterSpacing:1.5,color:C.dim}}>SORT</span>
          <div style={{display:"flex",gap:2,background:C.card,borderRadius:4,padding:2}}>
            {[{id:"status",l:"STATUS"},{id:"days",l:"DAYS"},{id:"revenue",l:"REV"}].map(s=>(
              <button key={s.id} onClick={()=>setSortBy(s.id)}
                style={{fontFamily:F,fontSize:T.sm,fontWeight:700,padding:`${S.s1} ${S.s3}`,borderRadius:3,border:"none",
                  cursor:"pointer",background:sortBy===s.id?C.accent:"transparent",color:sortBy===s.id?C.white:C.dim}}>{s.l}</button>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:2,background:C.card,borderRadius:4,padding:2}}>
          {[{id:"grid",l:"⊞ Grid"},{id:"list",l:"≡ List"},{id:"timeline",l:"⏱ Urgency"}].map(v=>(
            <button key={v.id} onClick={()=>setView(v.id)}
              style={{fontFamily:F,fontSize:T.sm,fontWeight:700,padding:`${S.s1} ${S.s3}`,borderRadius:3,border:"none",
                cursor:"pointer",background:view===v.id?C.accent:"transparent",color:view===v.id?C.white:C.dim}}>{v.l}</button>
          ))}
        </div>
        <span style={{fontFamily:F,fontSize:T.xs,color:C.dim,letterSpacing:1,marginLeft:S.s2}}>{filtered.length}/{projects.length}</span>
      </div>
      {/* Board */}
      <div style={{flex:1,overflowY:"auto",padding:S.s4}}>
        {filtered.length===0?(
          <div style={{fontFamily:F,fontSize:T.base,color:C.dim,letterSpacing:1,textAlign:"center",marginTop:48}}>NO PROJECTS MATCH</div>
        ):view==="list"?(
          <div style={{display:"flex",flexDirection:"column",gap:S.s2}}>
            {filtered.map(p=>(
              <ProjectListRow key={p.id} project={p} phaseAssign={phaseAssign}
                phaseComplete={phaseComplete} onMarkComplete={onMarkComplete}/>
            ))}
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(280px, 100%),1fr))",gap:S.s3}}>
            {filtered.map(p=>(
              <ProjectCard key={p.id} project={p} phaseAssign={phaseAssign}
                phaseComplete={phaseComplete} onMarkComplete={onMarkComplete}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RiskHeatmap({projects, phaseAssign, phaseComplete, scenario, onCellClick}) {
  const phases = ["delivery","installation","networking"];
  const phaseLabels = {delivery:"DELIVERY",installation:"INSTALL",networking:"NETWORK"};

  const stats = phases.map(ph=>{
    const phProjects  = projects.filter(p=>getCurrentPhase(p.id,phaseComplete)===ph);
    const covered     = phProjects.filter(p=>getPhaseStatus(p.id,ph,p,phaseAssign,phaseComplete)==="covered").length;
    const understaffed= phProjects.filter(p=>getPhaseStatus(p.id,ph,p,phaseAssign,phaseComplete)==="understaffed").length;
    const atRisk      = phProjects.filter(p=>getPhaseStatus(p.id,ph,p,phaseAssign,phaseComplete)==="at_risk").length;
    const modName     = ph==="delivery"?"Delivery":ph==="installation"?"Installation":"Networking";
    const engineers   = ENGINEERS.filter(i=>i.modality===modName);
    const bench       = engineers.filter(i=>engineerStatus(i.id,scenario,phaseAssign)==="available").length;
    const disrupted   = engineers.filter(i=>engineerStatus(i.id,scenario,phaseAssign)==="disrupted").length;
    const freed       = engineers.filter(i=>engineerStatus(i.id,scenario,phaseAssign)==="freed").length;
    const revAtRisk   = phProjects.filter(p=>getPhaseStatus(p.id,ph,p,phaseAssign,phaseComplete)==="at_risk").reduce((s,p)=>s+p.revenue,0);
    const revUnder    = phProjects.filter(p=>getPhaseStatus(p.id,ph,p,phaseAssign,phaseComplete)==="understaffed").reduce((s,p)=>s+p.revenue,0);
    const color       = MODALITY_CLR[modName];
    const health      = atRisk>0?"critical":understaffed>0?"warning":"healthy";
    return {ph,covered,understaffed,atRisk,bench,disrupted,freed,revAtRisk,revUnder,color,health,total:phProjects.length};
  });

  const cell=(val,type,ph,clickable,k)=>{
    let bg="transparent",clr=val?C.white:C.dim;
    if(type==="at_risk"&&val>0){bg=`${C.red}20`;clr=C.red;}
    else if(type==="understaffed"&&val>0){bg=`${C.amber}18`;clr=C.amber;}
    else if(type==="covered"&&val>0){bg=`${C.green}15`;clr=C.green;}
    else if(type==="bench"&&val>0){bg=`${C.accent}15`;clr=C.accent;}
    return (
      <div key={k} onClick={clickable&&val>0?()=>onCellClick({phase:ph,status:type}):undefined}
        style={{fontFamily:FM,fontSize:15,fontWeight:500,color:clr,background:bg,
          padding:"8px 0",textAlign:"center",borderRadius:4,cursor:clickable&&val>0?"pointer":"default",
          transition:"filter 0.1s"}}
        onMouseEnter={e=>{if(clickable&&val>0)e.currentTarget.style.filter="brightness(1.3)";}}
        onMouseLeave={e=>{e.currentTarget.style.filter="";}}>{val||"—"}</div>
    );
  };

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:C.bg}}>
      <div style={{padding:"8px 16px",borderBottom:`1px solid ${C.border}`,background:C.surface,
        display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
        <span style={{fontFamily:F,fontSize:11,fontWeight:700,letterSpacing:2,color:C.dim}}>COVERAGE MATRIX</span>
        <span style={{fontFamily:FB,fontSize:10,color:C.dim}}>Click a cell to filter the project board</span>
        <div style={{flex:1}}/>
        {[{l:"Covered",c:C.green},{l:"Understaffed",c:C.amber},{l:"At Risk",c:C.red},{l:"Bench",c:C.accent}].map(x=>(
          <div key={x.l} style={{display:"flex",alignItems:"center",gap:3}}>
            <div style={{width:7,height:7,borderRadius:2,background:x.c}}/>
            <span style={{fontFamily:F,fontSize:8,color:C.dim,letterSpacing:1}}>{x.l.toUpperCase()}</span>
          </div>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:20}}>
        {/* Column headers */}
        <div style={{display:"grid",gridTemplateColumns:"130px repeat(5,1fr)",gap:8,marginBottom:8}}>
          <div/>
          {["COVERED","UNDER","AT RISK","BENCH","REV AT RISK"].map(h=>(
            <div key={h} style={{fontFamily:F,fontSize:9,fontWeight:700,letterSpacing:1.5,color:C.dim,textAlign:"center"}}>{h}</div>
          ))}
        </div>
        {/* Phase rows */}
        {stats.map(s=>(
          <div key={s.ph} style={{display:"grid",gridTemplateColumns:"130px repeat(5,1fr)",gap:8,marginBottom:8,
            background:C.card,borderRadius:6,padding:"4px 0",
            border:`1px solid ${s.health==="critical"?`${C.red}44`:s.health==="warning"?`${C.amber}33`:C.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"0 12px"}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:s.color,flexShrink:0}}/>
              <div>
                <div style={{fontFamily:F,fontSize:11,fontWeight:700,color:s.color,letterSpacing:1}}>{phaseLabels[s.ph]}</div>
                <div style={{fontFamily:F,fontSize:8,color:C.dim}}>{s.total} active · {ENGINEERS.filter(i=>i.modality===(s.ph==="delivery"?"Delivery":s.ph==="installation"?"Installation":"Networking")).length} engineers</div>
              </div>
            </div>
            {cell(s.covered,     "covered",      s.ph, true)}
            {cell(s.understaffed,"understaffed", s.ph, true)}
            {cell(s.atRisk,      "at_risk",      s.ph, true)}
            {cell(s.bench,       "bench",        s.ph, false)}
            <div style={{fontFamily:FM,fontSize:11,color:s.revAtRisk>0?C.red:C.green,
              background:s.revAtRisk>0?`${C.red}15`:`${C.green}10`,padding:"8px 0",textAlign:"center",borderRadius:4}}>
              {s.revAtRisk>0?fmtRev(s.revAtRisk):"✓ $0"}
            </div>
          </div>
        ))}
        {/* Summary */}
        <div style={{display:"grid",gridTemplateColumns:"130px repeat(5,1fr)",gap:8,marginTop:12,
          background:C.surface,borderRadius:6,padding:"6px 0",border:`1px solid ${C.border}`}}>
          <div style={{padding:"0 12px",display:"flex",alignItems:"center"}}>
            <span style={{fontFamily:F,fontSize:9,fontWeight:700,letterSpacing:1,color:C.dim}}>TOTAL</span>
          </div>
          {[
            {v:stats.reduce((s,r)=>s+r.covered,0),     t:"covered"},
            {v:stats.reduce((s,r)=>s+r.understaffed,0),t:"understaffed"},
            {v:stats.reduce((s,r)=>s+r.atRisk,0),      t:"at_risk"},
            {v:stats.reduce((s,r)=>s+r.bench,0),       t:"bench"},
          ].map((x,i)=>cell(x.v,x.t,null,false,`total-${x.t}`))}
          <div style={{fontFamily:FM,fontSize:11,textAlign:"center",padding:"8px 0",
            color:stats.reduce((s,r)=>s+r.revAtRisk,0)>0?C.red:C.green}}>
            {fmtRev(stats.reduce((s,r)=>s+r.revAtRisk,0))}
          </div>
        </div>
        {/* Status cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginTop:16}}>
          {[
            {label:"CRITICAL — AT RISK",items:stats.filter(s=>s.health==="critical"),color:C.red},
            {label:"WARNING — UNDERSTAFFED",items:stats.filter(s=>s.health==="warning"),color:C.amber},
            {label:"HEALTHY",items:stats.filter(s=>s.health==="healthy"),color:C.green},
          ].map(g=>(
            <div key={g.label} style={{background:C.card,border:`1px solid ${g.color}44`,borderRadius:6,padding:"10px 14px"}}>
              <div style={{fontFamily:F,fontSize:8,fontWeight:700,letterSpacing:2,color:g.color,marginBottom:6}}>{g.label}</div>
              {g.items.length===0
                ? <span style={{fontFamily:FB,fontSize:10,color:C.dim}}>None</span>
                : g.items.map(s=>(
                    <div key={s.ph} style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
                      <div style={{width:5,height:5,borderRadius:"50%",background:s.color}}/>
                      <span style={{fontFamily:FB,fontSize:10,color:C.white}}>{phaseLabels[s.ph]}</span>
                      {s.revAtRisk>0&&<span style={{fontFamily:FM,fontSize:9,color:C.red,marginLeft:"auto"}}>{fmtRev(s.revAtRisk)}</span>}
                    </div>
                  ))
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BeforeAfterPanel({result, onClose}) {
  const delta = result.before - result.after;
  return (
    <div style={{position:"absolute",inset:0,background:"rgba(4,8,18,0.88)",display:"flex",
      alignItems:"center",justifyContent:"center",zIndex:100}}>
      <div style={{background:C.card,border:`1px solid ${C.green}88`,borderRadius:8,
        width:"min(500px, 92vw)",maxHeight:"min(85vh, 700px)",padding:S.s5,display:"flex",flexDirection:"column",gap:S.s4}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontFamily:F,fontSize:14,fontWeight:700,letterSpacing:2,color:C.green}}>CHANGE COMMITTED</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:18}}>✕</button>
        </div>
        <div style={{fontFamily:FB,fontSize:13,color:C.white,lineHeight:1.5}}>
          <strong style={{color:C.green}}>{result.engineerName}</strong> assigned to <strong style={{color:C.white}}>{result.projectName}</strong> ({result.phase} phase)
        </div>
        {/* Before / After */}
        <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:8,alignItems:"center"}}>
          <div style={{background:C.surface,border:`1px solid ${C.red}44`,borderRadius:6,padding:"10px 14px",textAlign:"center"}}>
            <div style={{fontFamily:F,fontSize:8,fontWeight:700,letterSpacing:2,color:C.dim,marginBottom:4}}>BEFORE</div>
            <div style={{fontFamily:FM,fontSize:20,color:C.red}}>{fmtRev(result.before)}</div>
            <div style={{fontFamily:F,fontSize:9,color:C.dim,marginTop:2}}>AT RISK</div>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{fontFamily:FM,fontSize:18,color:C.green}}>→</div>
            <div style={{fontFamily:F,fontSize:9,color:C.green,fontWeight:700,marginTop:2}}>
              {fmtRev(delta)} RECOVERED
            </div>
          </div>
          <div style={{background:C.surface,border:`1px solid ${C.green}44`,borderRadius:6,padding:"10px 14px",textAlign:"center"}}>
            <div style={{fontFamily:F,fontSize:8,fontWeight:700,letterSpacing:2,color:C.dim,marginBottom:4}}>AFTER</div>
            <div style={{fontFamily:FM,fontSize:20,color:result.after>0?C.amber:C.green}}>{fmtRev(result.after)}</div>
            <div style={{fontFamily:F,fontSize:9,color:C.dim,marginTop:2}}>AT RISK</div>
          </div>
        </div>
        {/* Detail */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <div style={{background:C.surface,borderRadius:5,padding:"8px 12px"}}>
            <div style={{fontFamily:F,fontSize:8,fontWeight:700,letterSpacing:2,color:C.dim,marginBottom:3}}>CERT VALIDATION</div>
            <div style={{fontFamily:F,fontSize:11,fontWeight:700,color:C.green}}>✓ {result.requiredCert} CONFIRMED</div>
          </div>
          <div style={{background:C.surface,borderRadius:5,padding:"8px 12px"}}>
            <div style={{fontFamily:F,fontSize:8,fontWeight:700,letterSpacing:2,color:C.dim,marginBottom:3}}>TRAVEL</div>
            <div style={{fontFamily:F,fontSize:11,fontWeight:700,color:result.travel.color}}>{result.travel.label}</div>
            <div style={{fontFamily:FB,fontSize:9,color:C.dim,marginTop:1}}>{result.travel.fromCity} → {result.travel.toCity}</div>
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end"}}>
          <button onClick={onClose}
            style={{fontFamily:F,fontWeight:700,fontSize:11,letterSpacing:1.5,padding:"7px 18px",
              border:"none",borderRadius:4,background:C.green,color:"#001A0A",cursor:"pointer"}}>CLOSE</button>
        </div>
      </div>
    </div>
  );
}

function AuditPanel({log, onClose}) {
  return (
    <div style={{position:"absolute",inset:0,background:"rgba(4,8,18,0.88)",display:"flex",
      alignItems:"center",justifyContent:"center",zIndex:100}}>
      <div style={{background:C.card,border:`1px solid ${C.borderBrt}`,borderRadius:8,
        width:680,maxWidth:"94vw",maxHeight:"82vh",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,
          display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontFamily:F,fontSize:14,fontWeight:700,letterSpacing:2,color:C.teal}}>AUDIT TRAIL</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:18}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:14}}>
          {log.length===0?(
            <div style={{fontFamily:F,fontSize:12,color:C.dim,letterSpacing:1,textAlign:"center",marginTop:40}}>NO ACTIONS YET</div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {[...log].reverse().map((e,i)=>{
                const ac = e.action==="COMMITTED"?C.green:e.action==="PHASE COMPLETE"?C.teal:C.dim;
                return (
                  <div key={i} style={{background:C.surface,border:`1px solid ${C.border}`,
                    borderLeft:`3px solid ${ac}`,borderRadius:5,padding:"9px 13px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                      <span style={{fontFamily:FM,fontSize:9,color:C.dim}}>{e.time}</span>
                      <span style={{fontFamily:F,fontSize:10,fontWeight:700,letterSpacing:1.5,
                        color:ac,background:`${ac}18`,padding:"1px 6px",borderRadius:3}}>{e.action}</span>
                      {e.scenario&&<span style={{fontFamily:F,fontSize:9,color:C.dim}}>[{e.scenario}]</span>}
                      {e.revenueImpact>0&&<span style={{fontFamily:FM,fontSize:10,color:C.green,marginLeft:"auto"}}>+{fmtRev(e.revenueImpact)}</span>}
                    </div>
                    <div style={{fontFamily:FB,fontSize:11,color:C.white,lineHeight:1.4}}>{e.description}</div>
                    {e.certValidation&&<div style={{fontFamily:F,fontSize:9,color:C.green,marginTop:3}}>✓ {e.certValidation}</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div style={{padding:"8px 20px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontFamily:F,fontSize:8,color:C.dim,letterSpacing:1}}>{log.length} ACTIONS THIS SESSION</span>
          <button onClick={onClose}
            style={{fontFamily:F,fontWeight:700,fontSize:10,letterSpacing:1.5,padding:"6px 14px",
              border:`1px solid ${C.border}`,borderRadius:4,background:"transparent",color:C.dim,cursor:"pointer"}}>CLOSE</button>
        </div>
      </div>
    </div>
  );
}

function PreviewPanel({preview, onCommit, onCancel, phaseAssign, phaseComplete}) {
  const d         = preview.data;
  const change    = d?.proposedChange;
  const isBriefing= d?.isBriefing===true;
  const toProj    = change?PROJECTS.find(p=>p.id===change.projectId):null;
  const toIse     = change?getEngineer(change.newEngineerId):null;
  const phase     = change?.phase;
  const fromProj  = change?.fromProjectId?PROJECTS.find(p=>p.id===change.fromProjectId):null;
  const custCity  = toProj?CUSTOMERS[toProj.customer]?.city:null;
  const curLoc    = toIse&&phaseAssign?getCurrentLocation(toIse,phaseAssign):{city:toIse?.city,source:"Home base"};
  const travel    = toIse&&custCity?getTravelBand(curLoc.city,custCity):{label:"",color:C.dim};
  return (
    <div style={{position:"absolute",inset:0,background:"rgba(4,8,18,0.88)",display:"flex",
      alignItems:"center",justifyContent:"center",zIndex:100}}>
      <div style={{background:C.card,border:`1px solid ${C.borderBrt}`,borderRadius:8,
        width:isBriefing?"min(620px, 92vw)":"min(580px, 92vw)",maxHeight:"min(85vh, 800px)",overflowY:"auto",
        padding:S.s5,display:"flex",flexDirection:"column",gap:S.s4}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontFamily:F,fontSize:T.md,fontWeight:700,letterSpacing:2,
            color:isBriefing?C.teal:C.accent}}>{isBriefing?"SITUATION BRIEFING":"SORTIE RECOMMENDATION"}</div>
          <button onClick={onCancel} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:18}}>✕</button>
        </div>
        {preview.error?(
          <div style={{color:C.red,fontFamily:FB,fontSize:13}}>{preview.error}</div>
        ):isBriefing?(
          <>
            <div><div style={{fontFamily:F,fontSize:T.sm,fontWeight:700,letterSpacing:2,color:C.dim,marginBottom:S.s2}}>ANALYSIS</div>
              <div style={{fontFamily:FB,fontSize:T.md,color:C.text,lineHeight:1.6}}>{d?.analysis}</div></div>
            {(()=>{
              const valid=(d?.briefingItems||[]).filter(it=>it&&it.title&&it.detail&&String(it.detail).trim().length>0);
              return valid.length>0&&(
              <div style={{display:"flex",flexDirection:"column",gap:S.s2}}>
                <div style={{fontFamily:F,fontSize:T.sm,fontWeight:700,letterSpacing:2,color:C.dim,marginBottom:S.s1}}>CRITICAL ITEMS</div>
                {valid.map((item,i)=>{
                  const sev=String(item.severity||"info").toLowerCase();
                  const sc=sev==="critical"?C.red:sev==="warning"?C.amber:C.accent;
                  return (
                    <div key={i} style={{display:"flex",gap:S.s3,padding:`${S.s2} ${S.s3}`,background:`${sc}10`,border:`1px solid ${sc}44`,borderRadius:4}}>
                      <span style={{flexShrink:0,fontSize:T.md}}>{sev==="critical"?"🔴":sev==="warning"?"🟡":"🔵"}</span>
                      <div><div style={{fontFamily:F,fontSize:T.base,fontWeight:700,color:sc}}>{item.title}</div>
                        <div style={{fontFamily:FB,fontSize:T.sm,color:C.text,lineHeight:1.5,marginTop:S.s1}}>{item.detail}</div></div>
                    </div>
                  );
                })}
              </div>
              );
            })()}
            {d?.recommendation&&<div>
              <div style={{fontFamily:F,fontSize:T.sm,fontWeight:700,letterSpacing:2,color:C.dim,marginBottom:S.s2}}>RECOMMENDED NEXT STEP</div>
              <div style={{fontFamily:FB,fontSize:T.md,color:C.white,lineHeight:1.5}}>{d.recommendation}</div>
            </div>}
            <div style={{display:"flex",justifyContent:"flex-end"}}>
              <button onClick={onCancel} style={{fontFamily:F,fontWeight:700,fontSize:T.sm,letterSpacing:1.5,
                padding:"7px 16px",border:`1px solid ${C.border}`,borderRadius:4,background:"transparent",color:C.dim,cursor:"pointer"}}>CLOSE</button>
            </div>
          </>
        ):(()=>{
          // Empty-response guard: if Haiku returned no analysis, no recommendation,
          // AND no proposedChange, we've got nothing to show. Render a helpful
          // fallback instead of empty labeled sections.
          const hasAnalysis = d?.analysis && String(d.analysis).trim().length > 0;
          const hasRecText  = d?.recommendation && String(d.recommendation).trim().length > 0;
          const hasChange   = change && toProj && toIse;
          if (!hasAnalysis && !hasRecText && !hasChange) {
            return (
              <>
                <div style={{fontFamily:F,fontSize:T.xs,fontWeight:700,letterSpacing:2,color:C.amber,marginBottom:S.s2}}>NO RECOMMENDATION FORMED</div>
                <div style={{fontFamily:FB,fontSize:T.base,color:C.text,lineHeight:1.5}}>
                  I couldn't form a recommendation from that request. Try naming the project (e.g. "Who can cover United Airlines networking?") or naming an engineer (e.g. "Move Ravi to Capital One").
                </div>
                <div style={{display:"flex",justifyContent:"flex-end"}}>
                  <button onClick={onCancel} style={{fontFamily:F,fontWeight:700,fontSize:T.sm,letterSpacing:1.5,
                    padding:`${S.s2} ${S.s4}`,border:`1px solid ${C.border}`,borderRadius:4,background:"transparent",color:C.dim,cursor:"pointer"}}>CLOSE</button>
                </div>
              </>
            );
          }
          return (
          <>
            {hasAnalysis&&<div><div style={{fontFamily:F,fontSize:T.sm,fontWeight:700,letterSpacing:2,color:C.dim,marginBottom:S.s2}}>ANALYSIS</div>
              <div style={{fontFamily:FB,fontSize:T.md,color:C.text,lineHeight:1.5}}>{d.analysis}</div></div>}
            {hasRecText&&<div><div style={{fontFamily:F,fontSize:T.sm,fontWeight:700,letterSpacing:2,color:C.dim,marginBottom:S.s2}}>RECOMMENDATION</div>
              <div style={{fontFamily:FB,fontSize:T.md,color:C.white,lineHeight:1.5}}>{d.recommendation}</div></div>}
            {change&&toProj&&toIse&&(
              <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,padding:13}}>
                <div style={{fontFamily:F,fontSize:8,fontWeight:700,letterSpacing:2,color:C.dim,marginBottom:9}}>PROPOSED CHANGE</div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:F,fontSize:9,color:C.dim,letterSpacing:1}}>ENGINEER</div>
                    <div style={{fontFamily:FB,fontSize:13,fontWeight:600,color:C.white}}>{toIse.name}</div>
                    <div style={{fontFamily:FB,fontSize:10,color:fromProj?C.amber:C.accent}}>
                      {fromProj?`From: ${fromProj.name}`:"From bench / freed"}
                    </div>
                  </div>
                  <div style={{color:C.accent,fontSize:20}}>→</div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:F,fontSize:9,color:C.dim,letterSpacing:1}}>PROJECT / PHASE</div>
                    <div style={{fontFamily:FB,fontSize:13,fontWeight:600,color:C.white}}>{toProj.name}</div>
                    <div style={{fontFamily:F,fontSize:10,fontWeight:700,
                      color:MODALITY_CLR[phase==="delivery"?"Delivery":phase==="installation"?"Installation":"Networking"]||C.accent}}>
                      {phase?.toUpperCase()} PHASE
                    </div>
                    <div style={{fontFamily:FM,fontSize:10,color:C.green}}>{fmtRev(toProj.revenue)} at stake</div>
                  </div>
                </div>
                {/* Why grid */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,borderTop:`1px solid ${C.border}`,paddingTop:9}}>
                  <div style={{background:C.bg,borderRadius:4,padding:"6px 9px"}}>
                    <div style={{fontFamily:F,fontSize:7,fontWeight:700,letterSpacing:2,color:C.dim,marginBottom:2}}>CERT VALIDATION</div>
                    <div style={{fontFamily:F,fontSize:10,fontWeight:700,color:d.certMatch?C.green:C.amber}}>
                      {d.certMatch?"✓ MATCH":"⚠ MISMATCH"}
                    </div>
                    <div style={{fontFamily:FM,fontSize:9,color:C.dim,marginTop:1}}>{d.requiredCert||toProj.phaseCerts[phase]}</div>
                  </div>
                  <div style={{background:C.bg,borderRadius:4,padding:"6px 9px"}}>
                    <div style={{fontFamily:F,fontSize:7,fontWeight:700,letterSpacing:2,color:C.dim,marginBottom:2}}>TRAVEL</div>
                    <div style={{fontFamily:F,fontSize:10,fontWeight:700,color:travel.color}}>{travel.label}</div>
                    <div style={{fontFamily:FB,fontSize:9,color:C.dim,marginTop:1}}>
                      {curLoc.city} → {custCity}
                    </div>
                    <div style={{fontFamily:F,fontSize:8,color:curLoc.source!=="Home base"?C.teal:C.dim,marginTop:1}}>
                      {curLoc.source!=="Home base"?"📍":"🏠"} {curLoc.source}
                    </div>
                  </div>
                  <div style={{background:C.bg,borderRadius:4,padding:"6px 9px"}}>
                    <div style={{fontFamily:F,fontSize:7,fontWeight:700,letterSpacing:2,color:C.dim,marginBottom:2}}>REVENUE IMPACT</div>
                    <div style={{fontFamily:FM,fontSize:11,color:C.green}}>+{fmtRev(toProj.revenue)}</div>
                    {fromProj&&<div style={{fontFamily:FM,fontSize:9,color:C.amber,marginTop:1}}>−{fmtRev(fromProj.revenue)} exposed</div>}
                  </div>
                  <div style={{background:C.bg,borderRadius:4,padding:"6px 9px"}}>
                    <div style={{fontFamily:F,fontSize:7,fontWeight:700,letterSpacing:2,color:C.dim,marginBottom:2}}>TRADEOFF</div>
                    <div style={{fontFamily:FB,fontSize:10,color:C.text,lineHeight:1.4}}>
                      {d.tradeoff||(fromProj?`${fromProj.name} loses coverage`:"No committed project impacted")}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <button onClick={onCancel}
                style={{fontFamily:F,fontWeight:700,fontSize:T.sm,letterSpacing:1.5,padding:"7px 16px",
                  border:`1px solid ${C.border}`,borderRadius:4,background:"transparent",color:C.dim,cursor:"pointer"}}>DISMISS</button>
              {change&&!preview.error&&(
                <button onClick={onCommit}
                  style={{fontFamily:F,fontWeight:700,fontSize:T.sm,letterSpacing:1.5,padding:"7px 16px",
                    border:"none",borderRadius:4,background:C.green,color:"#001A0A",cursor:"pointer"}}>COMMIT CHANGE</button>
              )}
            </div>
          </>
          );
        })()}
      </div>
    </div>
  );
}

const QUICK_CMDS = [
  {label:"Snowstorm closed Chicago O'Hare — what's the impact?",icon:"❄️"},
  {label:"Megan called in sick — who can cover?",icon:"🤒"},
  {label:"What's my exposure right now?",icon:"📊"},
];

function CommandBar({cmd,setCmd,runCmd,loading,inputRef,onOpenRoster,mobile}) {
  return (
    <div style={{background:C.surface,borderTop:`1px solid ${C.borderBrt}`,flexShrink:0}}>
      <div style={{padding:`${S.s2} ${S.s5} 0`,display:"flex",gap:S.s2,alignItems:"center",flexWrap:"wrap"}}>
        <span style={{fontFamily:F,fontSize:T.xxs,fontWeight:700,letterSpacing:2,color:C.dim,flexShrink:0}}>QUICK:</span>
        {QUICK_CMDS.map(q=>(
          <button key={q.label} onClick={()=>setCmd(q.label)}
            style={{fontFamily:FB,fontSize:T.sm,padding:`${S.s1} ${S.s3}`,border:`1px solid ${C.border}`,
              borderRadius:12,cursor:"pointer",background:"transparent",color:C.dim,whiteSpace:"nowrap"}}>
            {q.icon} {q.label}
          </button>
        ))}
      </div>
      <div style={{padding:`${S.s3} ${S.s5} ${S.s4}`,display:"flex",gap:S.s4,alignItems:"center"}}>
        {mobile&&onOpenRoster&&(
          <button onClick={onOpenRoster} title="Open roster" style={{background:C.card,border:`1px solid ${C.border}`,
            borderRadius:5,padding:`${S.s2} ${S.s3}`,cursor:"pointer",color:C.dim,fontSize:T.md,flexShrink:0}}>☰</button>
        )}
        <div style={{flexShrink:0,textAlign:"center"}}>
          <div style={{fontFamily:F,fontSize:T.base,fontWeight:800,letterSpacing:3,color:C.accent,lineHeight:1}}>SORTIE</div>
          <div style={{fontFamily:F,fontSize:T.xxs,fontWeight:600,letterSpacing:2,color:C.dim,marginTop:1}}>AI</div>
        </div>
        <div style={{width:1,height:30,background:C.border,flexShrink:0}}/>
        <input ref={inputRef} value={cmd} onChange={e=>setCmd(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();runCmd();}}}
          placeholder="Describe a disruption or ask a question — e.g. 'Snowstorm closed ORD, replan' · 'Kaiser site delayed, who can I redeploy?' · 'What's my exposure?'"
          style={{flex:1,minWidth:0,background:C.card,border:`1px solid ${C.borderBrt}`,borderRadius:5,
            padding:`${S.s3} ${S.s4}`,fontSize:T.base,outline:"none",lineHeight:1.4,color:C.white,fontFamily:FB}}/>
        <button onClick={runCmd} disabled={loading||!cmd.trim()}
          style={{background:loading?C.accentDim:C.accent,color:C.white,border:"none",borderRadius:5,
            padding:`${S.s3} ${S.s5}`,fontFamily:F,fontWeight:800,fontSize:T.base,letterSpacing:2,
            cursor:loading||!cmd.trim()?"not-allowed":"pointer",flexShrink:0,
            opacity:loading||!cmd.trim()?0.6:1}}>
          {loading?"THINKING…":"EXECUTE"}
        </button>
      </div>
    </div>
  );
}

// ── EXPORT MODAL ───────────────────────────────────────────────────────────
function ExportModal({totalAtRisk, util, deployed,
  auditLog, projects, phaseAssign, phaseComplete, onClose}) {
  const [copied, setCopied] = useState(false);

  const phases = ["delivery","installation","networking"];
  const phaseStats = phases.map(ph=>{
    const active = projects.filter(p=>getCurrentPhase(p.id,phaseComplete)===ph);
    const covered = active.filter(p=>getPhaseStatus(p.id,ph,p,phaseAssign,phaseComplete)==="covered").length;
    const understaffed = active.filter(p=>getPhaseStatus(p.id,ph,p,phaseAssign,phaseComplete)==="understaffed").length;
    const atRisk = active.filter(p=>getPhaseStatus(p.id,ph,p,phaseAssign,phaseComplete)==="at_risk").length;
    return {ph, active:active.length, covered, understaffed, atRisk};
  });

  const commits   = auditLog.filter(e=>e.action==="COMMITTED");
  const recovered = commits.reduce((s,e)=>s+e.revenueImpact,0);
  const now = new Date().toLocaleString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"});

  const reportText = [
    `${"═".repeat(52)}`,
    `SORTIE — SESSION RECOVERY REPORT`,
    `Generated: ${now}`,
    `${"═".repeat(52)}`,
    ``,
    `REVENUE SNAPSHOT`,
    `  At Risk:      ${fmtRev(totalAtRisk)}`,
    `  Recovered:    ${fmtRev(recovered)} (${commits.length} commit${commits.length!==1?"s":""})`,
    `  Utilization:  ${util}% (${deployed}/26 deployed)`,
    ``,
    `SESSION ACTIONS (${auditLog.length} total)`,
    ...(auditLog.length===0
      ? ["  No actions recorded."]
      : auditLog.map(e=>`  [${e.time}] ${e.action} — ${e.description}`)
    ),
    ``,
    `PHASE COVERAGE SUMMARY`,
    ...phaseStats.map(s=>`  ${s.ph.toUpperCase().padEnd(14)} ${s.active} active · ${s.covered} covered · ${s.understaffed} understaffed · ${s.atRisk} at risk`),
    ``,
    `${"─".repeat(52)}`,
    `⚠ All project data is fictional.`,
    `  For portfolio demonstration purposes only.`,
    `${"═".repeat(52)}`,
  ].join("\n");

  function copyToClipboard() {
    navigator.clipboard.writeText(reportText).then(()=>{
      setCopied(true);
      setTimeout(()=>setCopied(false), 2500);
    });
  }

  return (
    <div style={{position:"absolute",inset:0,background:"rgba(4,8,18,0.88)",display:"flex",
      alignItems:"center",justifyContent:"center",zIndex:100}}>
      <div style={{background:C.card,border:`1px solid ${C.borderBrt}`,borderRadius:8,
        width:"min(620px, 92vw)",maxHeight:"min(82vh, 800px)",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,
          display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontFamily:F,fontSize:13,fontWeight:700,letterSpacing:2,color:C.accent}}>EXPORT RECOVERY SUMMARY</div>
          <button onClick={onClose}
            style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:18}}>✕</button>
        </div>
        <pre style={{flex:1,overflowY:"auto",margin:0,padding:"14px 20px",
          fontFamily:FM,fontSize:11,color:C.text,lineHeight:1.7,background:C.bg,whiteSpace:"pre-wrap"}}>
          {reportText}
        </pre>
        <div style={{padding:"10px 20px",borderTop:`1px solid ${C.border}`,
          display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontFamily:F,fontSize:9,color:C.dim,letterSpacing:1}}>
            {auditLog.length} ACTIONS · {commits.length} COMMITTED · {fmtRev(recovered)} RECOVERED
          </span>
          <div style={{display:"flex",gap:8}}>
            <button onClick={onClose}
              style={{fontFamily:F,fontWeight:700,fontSize:10,letterSpacing:1.5,padding:"6px 14px",
                border:`1px solid ${C.border}`,borderRadius:4,background:"transparent",color:C.dim,cursor:"pointer"}}>CLOSE</button>
            <button onClick={copyToClipboard}
              style={{fontFamily:F,fontWeight:700,fontSize:10,letterSpacing:1.5,padding:"6px 16px",
                border:"none",borderRadius:4,
                background:copied?C.green:C.accent,color:copied?"#001A0A":C.white,cursor:"pointer",
                transition:"background 0.2s"}}>
              {copied?"✓ COPIED":"COPY TO CLIPBOARD"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Toast that shows the most recent undoable action with an UNDO button.
// Auto-dismisses after AUTO_HIDE_MS unless the user hovers (preserves intent
// to read). The undo stack itself outlives the toast — this is just the visible
// affordance for the most recent entry.
function UndoSnackbar({entry, onUndo, onDismiss}) {
  const AUTO_HIDE_MS = 10000;
  const [hover, setHover] = useState(false);
  useEffect(()=>{
    if (!entry || hover) return;
    const t = setTimeout(onDismiss, AUTO_HIDE_MS);
    return ()=>clearTimeout(t);
  },[entry, hover, onDismiss]);
  if (!entry) return null;
  return (
    <div onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{position:"absolute",left:"50%",bottom:"calc(8vh + 80px)",transform:"translateX(-50%)",
        background:C.surface,border:`1px solid ${C.borderBrt}`,borderRadius:6,
        boxShadow:"0 4px 24px rgba(0,0,0,0.5)",zIndex:300,
        display:"flex",alignItems:"center",gap:S.s4,padding:`${S.s3} ${S.s4}`,
        maxWidth:"min(560px, 92vw)"}}>
      <span style={{fontFamily:FB,fontSize:T.sm,color:C.text,flex:1,minWidth:0}}>{entry.description}</span>
      <button onClick={onUndo} style={{fontFamily:F,fontWeight:800,fontSize:T.sm,letterSpacing:1.5,
        padding:`${S.s2} ${S.s4}`,border:`1px solid ${C.accent}`,borderRadius:4,
        background:`${C.accent}22`,color:C.accent,cursor:"pointer",flexShrink:0}}>
        ↶ UNDO
      </button>
      <button onClick={onDismiss} title="Dismiss" style={{background:"none",border:"none",
        color:C.dim,cursor:"pointer",fontSize:16,padding:0,lineHeight:1,flexShrink:0}}>✕</button>
    </div>
  );
}

export default function Sortie() {
  useEffect(()=>{injectFonts();},[]);
  const {narrow, mobile}                         = useViewport();
  const [rosterCollapsed,  setRosterCollapsed]   = useState(false);
  const [mobileRosterOpen, setMobileRosterOpen]  = useState(false);
  // Auto-collapse roster on first paint at narrow widths (it can still be expanded).
  useEffect(()=>{ if(narrow && !mobile) setRosterCollapsed(true); },[narrow,mobile]);
  const [phaseAssign,      setPhaseAssign]       = useState(()=>JSON.parse(JSON.stringify(BASE_PHASE_ASSIGN)));
  const [phaseComplete,    setPhaseComplete]     = useState(()=>JSON.parse(JSON.stringify(BASE_PHASE_COMPLETE)));
  const [cmd,              setCmd]               = useState("");
  const [loading,          setLoading]           = useState(false);
  const [preview,          setPreview]           = useState(null);
  const [auditLog,         setAuditLog]          = useState([]);
  const [auditOpen,        setAuditOpen]         = useState(false);
  const [mainView,         setMainView]          = useState("board");
  const [heatmapFilter,    setHeatmapFilter]     = useState(null);
  const [commitResult,     setCommitResult]      = useState(null);
  const [exportOpen,       setExportOpen]        = useState(false);
  // Undo system: stack of undoable actions (LIFO). visibleUndo is just the
  // currently-shown snackbar entry — set when an action is performed, cleared
  // when the toast auto-dismisses or the user closes it. The stack itself is
  // separate so it survives the toast hiding.
  const [undoStack,        setUndoStack]         = useState([]);
  const [visibleUndo,      setVisibleUndo]       = useState(null);
  const inputRef = useRef(null);

  // Sortie no longer carries pre-canned simulation state. Hypothetical
  // disruptions are described in natural language by the user; the AI accepts
  // the premise within a single conversation turn. Other components still
  // expect a scenario-shaped object (Roster/EngineerCard/RiskHeatmap reference
  // .disruptions / .freedEngineers), so we pass the empty baseline.
  const effectiveScenario = BASELINE_SCENARIO;

  // No scenario overrides anymore — activeProjects mirrors PROJECTS directly,
  // but we keep the indirection so downstream code that mutates daysLeft (e.g.
  // future "site ready early" affordances) has a single place to plug in.
  const activeProjects = PROJECTS;

  const getStatus = id => engineerStatus(id, effectiveScenario, phaseAssign);
  const totalAtRisk    = calcRevAtRisk(activeProjects, phaseAssign, phaseComplete);
  const deployedCount  = ENGINEERS.filter(i=>getStatus(i.id)==="deployed").length;
  const util           = Math.round((deployedCount/ENGINEERS.length)*100);

  // Mark a phase complete. Pushes the previous state to undoStack so the action
  // can be reversed via the snackbar or (future) the audit panel. No confirm
  // dialog — undo is the safety net.
  function markPhaseComplete(projectId, phase) {
    const project = PROJECTS.find(p=>p.id===projectId);
    if (!project) return;
    const freed = phaseAssign[`${projectId}-${phase}`]||[];
    const prevPhaseComplete = JSON.parse(JSON.stringify(phaseComplete));
    setPhaseComplete(prev=>({...prev,[projectId]:[...(prev[projectId]||[]),phase]}));
    setAuditLog(prev=>[...prev,{
      time:fmtTime(), action:"PHASE COMPLETE",
      description:`${phase.toUpperCase()} phase marked complete on ${project.name}. ${freed.map(id=>getEngineer(id)?.name).join(", ")} freed for redeployment.`,
      revenueImpact:0, certValidation:null,
    }]);
    const undoEntry = {
      type:"phase_complete",
      description:`${project.name} · ${phase.toUpperCase()} marked complete`,
      restore:{ phaseComplete: prevPhaseComplete },
    };
    setUndoStack(prev=>[...prev, undoEntry]);
    setVisibleUndo(undoEntry);
  }

  // Pop the topmost undoable action and restore the prior state. Logs the
  // reversal in the audit trail so the history reflects what actually happened.
  function undoLastAction() {
    setUndoStack(prev=>{
      if (prev.length === 0) return prev;
      const top = prev[prev.length - 1];
      if (top.type === "phase_complete" && top.restore?.phaseComplete) {
        setPhaseComplete(top.restore.phaseComplete);
      }
      setAuditLog(log=>[...log,{
        time:fmtTime(), action:"UNDONE",
        description:`Reverted: ${top.description}`,
        revenueImpact:0, certValidation:null,
      }]);
      const next = prev.slice(0, -1);
      // Update the snackbar to show the next undoable entry (if any) so the
      // user can keep walking backwards. If the stack is empty, hide it.
      setVisibleUndo(next.length > 0 ? next[next.length - 1] : null);
      return next;
    });
  }

  // Commit AI recommendation
  function commitChange() {
    const change = preview?.data?.proposedChange;
    if (!change) return;
    const { projectId, phase, newEngineerId } = change;
    const project = PROJECTS.find(p=>p.id===projectId);
    const engineer     = ENGINEERS.find(i=>i.id===newEngineerId);
    if (!project||!engineer) { setPreview(null); setCmd(""); return; }
    const reqCert = project.phaseCerts[phase];
    if (!engineer.certs.includes(reqCert)) { setPreview(null); setCmd(""); return; }
    // Compute before
    const beforeRisk = calcRevAtRisk(activeProjects, phaseAssign, phaseComplete);
    // Build next state
    const nextPA = JSON.parse(JSON.stringify(phaseAssign));
    Object.keys(nextPA).forEach(key=>{ nextPA[key]=(nextPA[key]||[]).filter(id=>id!==newEngineerId); });
    const destKey = `${projectId}-${phase}`;
    if (!nextPA[destKey]) nextPA[destKey]=[];
    if (!nextPA[destKey].includes(newEngineerId)) nextPA[destKey].push(newEngineerId);
    const afterRisk = calcRevAtRisk(activeProjects, nextPA, phaseComplete);
    // Travel info
    const curLoc = getCurrentLocation(engineer, phaseAssign);
    const toCity = CUSTOMERS[project.customer]?.city;
    const travelBand = getTravelBand(curLoc.city, toCity);
    setPhaseAssign(nextPA);
    setCommitResult({
      engineerName:engineer.name, projectName:project.name, phase, requiredCert:reqCert,
      before:beforeRisk, after:afterRisk,
      travel:{label:travelBand.label,color:travelBand.color,fromCity:curLoc.city,toCity},
    });
    setAuditLog(prev=>[...prev,{
      time:fmtTime(), action:"COMMITTED",
      description:`${engineer.name} → ${project.name} (${phase} phase). ${fmtRev(beforeRisk-afterRisk)} recovered.`,
      revenueImpact:beforeRisk-afterRisk, certValidation:`${engineer.name}: ${reqCert} ✓`,
    }]);
    setPreview(null); setCmd("");
  }

  function dismissPreview() {
    if (preview?.data?.recommendation&&!preview.error) {
      setAuditLog(prev=>[...prev,{
        time:fmtTime(),action:"DISMISSED",
        description:`Dismissed: "${preview.data.recommendation?.slice(0,80)}..."`,
        revenueImpact:0,certValidation:null,
      }]);
    }
    setPreview(null);
  }

  async function runCmd() {
    if (!cmd.trim()||loading) return;
    setLoading(true);
    const ctx = {
      allProjects: activeProjects.map(p=>{
        const phase = getCurrentPhase(p.id, phaseComplete);
        const assigned = (phaseAssign[`${p.id}-${phase}`]||[]).map(id=>getEngineer(id)?.name).filter(Boolean);
        const status = getPhaseStatus(p.id, phase, p, phaseAssign, phaseComplete);
        const siteCity = CUSTOMERS[p.customer].city;
        return {
          id:p.id, name:p.name, customer:CUSTOMERS[p.customer].name,
          tier:p.tier, revenue:p.revenue, daysLeft:p.daysLeft,
          siteCity, siteRegion:TRAVEL_BANDS[siteCity]||"Unknown",
          currentPhase:phase, currentPhaseCert:p.phaseCerts[phase],
          currentPhaseRequired:p.phaseRequired[phase],
          currentPhaseAssigned:assigned, currentPhaseStatus:status,
          completedPhases:phaseComplete[p.id]||[],
        };
      }),
      availableEngineers: ENGINEERS.filter(i=>getStatus(i.id)==="available"||getStatus(i.id)==="freed").map(i=>{
        const loc = getCurrentLocation(i,phaseAssign);
        return {
          id:i.id, name:i.name, modality:i.modality, certs:i.certs,
          homeCity:i.city, homeRegion:TRAVEL_BANDS[i.city]||"Unknown",
          currentLocation:loc.city, currentRegion:TRAVEL_BANDS[loc.city]||"Unknown",
          locationSource:loc.source, status:getStatus(i.id),
        };
      }),
      deployedEngineers: ENGINEERS.filter(i=>getStatus(i.id)==="deployed").map(i=>{
        const loc = getCurrentLocation(i,phaseAssign);
        let curProj=null,curPhase=null;
        for(const [key,arr] of Object.entries(phaseAssign)){
          if(arr.includes(i.id)){[curProj,curPhase]=key.split("-");break;}
        }
        const proj = PROJECTS.find(p=>p.id===curProj);
        return {
          id:i.id,name:i.name,modality:i.modality,certs:i.certs,
          homeCity:i.city,homeRegion:TRAVEL_BANDS[i.city]||"Unknown",
          currentLocation:loc.city,currentRegion:TRAVEL_BANDS[loc.city]||"Unknown",
          locationSource:loc.source,
          currentProjectId:curProj,currentProjectName:proj?.name,
          currentPhase:curPhase,currentPhaseCert:proj?.phaseCerts[curPhase],
        };
      }),
    };

    try {
      const res = await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-haiku-4-5-20251001", max_tokens:1200,
          system:`You are Sortie, an AI workforce deployment assistant for a company that delivers and installs enterprise server infrastructure at colocation facilities across the USA. Engineers work in three sequential phases per project: Delivery (physical moving of equipment), Installation (vendor-specific racking/configuration), and Networking (network commissioning). Revenue is only recognized on full project completion (after Networking phase).

CURRENT STATE:
${JSON.stringify(ctx,null,2)}

CERTIFICATION RULE: An engineer can ONLY be assigned to a phase if their "certs" array contains the project's cert for that phase (e.g. phaseCerts.installation). Never cross skill types (Delivery/Installation/Networking).

LOCATION RULE: Use "currentLocation" not "homeCity" for travel feasibility. An engineer finishing in Dallas is closer to Houston than their home in Seattle. Each engineer and each project site has a region (homeRegion / currentRegion / siteRegion): one of Northeast, Mid-Atlantic, Southeast, Midwest, South Central, Southwest, Mountain, West Coast, Pacific Northwest.

PHASE BLOCKING RULE: Only the current active phase matters for revenue recovery. If a project is blocked in Networking, recommending a Delivery or Installation engineer does not recover revenue.

HYPOTHETICAL DISRUPTION HANDLING (IMPORTANT): The user may describe a disruption in natural language — "snowstorm closed ORD", "Sara called in sick", "site delay at Capital One", "Chicago airport is closed", "Megan is on PTO this week", "BofA pushed their go-live by a week". Accept the premise WITHOUT asking for confirmation. Treat the affected engineers or projects as UNAVAILABLE for this turn's recommendation, even though they appear normal in CURRENT STATE.

Identifying who is affected:
- Named engineer ("Sara called in sick") → that engineer is unavailable. Match by first name, last name, full name, or engineer ID against CURRENT STATE.
- Named city or airport ("ORD closed", "snowstorm in Chicago") → engineers whose currentLocation OR currentRegion is impacted are unavailable. ORD=Chicago=Midwest. JFK/LGA=New York=Northeast. ATL=Atlanta=Southeast. DFW=Dallas=South Central. LAX=Los Angeles=West Coast. SEA=Seattle=Pacific Northwest. DEN=Denver=Mountain. PHX=Phoenix=Southwest.
- Named region ("storm in the midwest", "outage on the west coast") → all engineers in that region are unavailable.
- Named project or customer with a delay ("Kaiser site is delayed") → engineers currently assigned to that project's active phase are FREED (they become available for redeployment elsewhere).

Always include the hypothetical's impact in the analysis field — name the affected engineers/projects explicitly, then explain the recommendation.

THREE MODES:
MODE 1 — EXPLICIT OVERRIDE: Manager names BOTH a specific engineer AND a specific destination project. Execute it. Validate cert for the active phase. Set isBriefing:false. CRITICAL: MODE 1 requires a NAMED engineer in the query — a first name ("Ravi"), last name ("Patel"), full name ("Ravi Patel"), or engineer ID ("NET07"). Generic words like "somebody", "anyone", "an engineer", "the best person" are NOT named engineers. If the query uses a command verb (reallocate, move, assign, send) but does NOT name a specific engineer, treat it as MODE 2 — the manager is asking YOU to pick, not commanding a known person.

MODE 2 — AI OPTIMIZATION: Manager asks YOU to recover, reassign, reallocate, rebalance, optimize, fix, cover, replan, or minimize/reduce risk or exposure. These are ACTION requests — return a populated proposedChange and set isBriefing:false. Even broad asks like "reallocate teams to minimize revenue at risk" or "optimize coverage" are MODE 2: pick the single highest-impact swap and propose it. Match cert to active phase. Prefer available/freed engineers (and engineers freed by hypothetical site delays); recommend the highest-revenue at-risk project they can cover. EXCLUDE any engineers the hypothetical marks as unavailable. If no bench engineer fits, reassign from a lower-revenue covered project to a higher-revenue at-risk one — set fromProjectId and fromPhase to the engineer's current assignment. Accept that the source project becomes at-risk — that IS the tradeoff. Pick the swap that maximizes (target.revenue - source.revenue). CRITICAL: For MODE 2, proposedChange MUST be populated whenever any cert-qualified engineer in the roster (deployed OR available, minus those the hypothetical disrupted) exists. Only return proposedChange:null if literally zero qualified engineers remain. Set isBriefing:false.

MODE 3 — BRIEFING: Diagnostic-only questions: "what's my exposure", "what's the status", "who's at risk", "who's available", "give me a briefing", or a hypothetical with no action verb ("what happens if Megan is out?"). MODE 3 is for understanding the picture, NOT for taking action. If the query contains an action verb (reallocate, optimize, rebalance, minimize, reduce, fix, cover, replan, recover, reassign), route to MODE 2 even if it also mentions "risk" or "exposure" — the manager wants a proposed move, not a diagnosis. Set isBriefing:true, proposedChange:null. Each briefingItem is a CONCRETE FINDING — NOT a category label. The "title" IS the finding in 3-8 words. The "detail" is one full sentence with specifics — project IDs (P##), dollar amounts, engineer names, city names — pulled from CURRENT STATE and from the hypothetical the user described. Severity goes in the severity field, never in the title text. Aim for 3-6 items ordered by revenue impact.

GOOD briefingItems (do this — title is the finding, detail has specifics, severity is set):
{ "severity":"critical", "title":"6 networking projects blocked", "detail":"P16, P18, P19, P20, P23, P25 are stalled in networking phase totaling $2.36M in queued revenue." }
{ "severity":"warning", "title":"Snowstorm grounds 3 Midwest engineers", "detail":"DEL07 (Chicago), INS04 (Chicago), and NET07 (Chicago) are unavailable, exposing P15 BofA AI Cluster ($760K) and P02 AT&T Dallas ($650K)." }
{ "severity":"info", "title":"Antoine Leblanc freed by Kaiser delay", "detail":"INS06 was on P24 Kaiser Permanente Cluster installation — site delay frees him for redeployment to any GPU installation project." }

BAD briefingItems (NEVER do this — outline labels with empty details and severity baked into the title):
{ "severity":"info", "title":"NETWORKING BOTTLENECK — CRITICAL", "detail":"" }
{ "severity":"info", "title":"STRATEGIC OPTIONS", "detail":"" }
{ "severity":"info", "title":"ENGINEER AVAILABILITY & LOCATION", "detail":"" }

Respond ONLY with valid JSON, no markdown:
{
  "isBriefing": false,
  "analysis": "one sentence describing the current allocation picture — where revenue is at risk, which phases are uncovered, the key constraint. If the user described a disruption (storm, sick call, site delay), weave it in by name. NEVER lead with 'no hypothetical disruption specified' or similar — the manager is asking about everyday allocation; disruptions are an optional input, not the default frame.",
  "recommendation": "specific action: engineer name, current location, destination project, phase, cert, travel band",
  "briefingItems": [],
  "proposedChange": { "projectId":"P##", "phase":"delivery|installation|networking", "newEngineerId":"DEL## | INS## | NET##", "fromProjectId":"P## or null", "fromPhase":"phase or null" },
  "impact": "revenue math",
  "tradeoff": "business tradeoff in one sentence",
  "certMatch": true
}`,
          messages:[{role:"user",content:cmd}],
        }),
      });

      const data = await res.json();
      if (res.status===429) { setPreview({error:data.error||"Rate limit reached.",data:null}); setLoading(false); return; }
      if (res.status===400) { setPreview({error:data.error||"Invalid request.",data:null}); setLoading(false); return; }

      const raw = data.content?.[0]?.text||"{}";
      // Robust JSON extraction. Haiku occasionally (1) wraps the response in
      // ```json fences and (2) appends prose after the closing brace, both of
      // which the simpler regex-strip-then-parse couldn't survive. Strategy:
      // strip fences, then slice from the first { to the last } so trailing
      // prose can't break parsing. Falls back to a raw-text shape if that
      // sliced span still isn't valid JSON (truncation, malformed structure).
      let parsed;
      const stripped = raw.replace(/```json|```/g,"").trim();
      const first = stripped.indexOf("{");
      const last  = stripped.lastIndexOf("}");
      const candidate = (first!==-1 && last!==-1 && last>first) ? stripped.slice(first, last+1) : stripped;
      try { parsed = JSON.parse(candidate); }
      catch { parsed = {analysis:raw,recommendation:raw,proposedChange:null,isBriefing:false,certMatch:true}; }

      const {parsed:validated} = validateAIResponse(parsed, phaseComplete);
      setPreview({data:validated,originalCmd:cmd});
    } catch(e) {
      setPreview({error:`Connection error: ${e.message}`,data:null});
    }
    setLoading(false);
  }

  return (
    <div style={{fontFamily:FB,background:C.bg,color:C.text,height:"100vh",
      display:"flex",flexDirection:"column",overflow:"hidden",position:"relative",
      maxWidth:1800,margin:"0 auto",borderLeft:`1px solid ${C.border}`,borderRight:`1px solid ${C.border}`}}>
      <Header atRisk={totalAtRisk} util={util} deployed={deployedCount}/>

      {/* View toggle */}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,
        padding:`${S.s2} ${S.s5}`,display:"flex",alignItems:"center",gap:S.s2,flexShrink:0,flexWrap:"wrap"}}>
        {[{id:"board",l:"⊞ Project Board"},{id:"heatmap",l:"◉ Coverage Matrix"}].map(v=>(
          <button key={v.id} onClick={()=>setMainView(v.id)}
            style={{fontFamily:F,fontSize:T.sm,fontWeight:700,letterSpacing:1.5,padding:`${S.s2} ${S.s4}`,
              borderRadius:4,border:`1px solid ${mainView===v.id?C.accent:C.border}`,
              background:mainView===v.id?`${C.accent}22`:"transparent",
              color:mainView===v.id?C.accent:C.dim,cursor:"pointer"}}>
            {v.l}
          </button>
        ))}
        <div style={{flex:1}}/>
        {/* Export button */}
        <button onClick={()=>setExportOpen(true)}
          style={{fontFamily:F,fontSize:T.sm,fontWeight:700,letterSpacing:1.5,padding:`${S.s2} ${S.s4}`,
            borderRadius:4,border:`1px solid ${C.border}`,
            background:"transparent",color:C.dim,cursor:"pointer"}}>
          ↗ EXPORT REPORT
        </button>
        <button onClick={()=>setAuditOpen(true)}
          style={{fontFamily:F,fontSize:T.sm,fontWeight:700,letterSpacing:1.5,padding:`${S.s2} ${S.s4}`,
            borderRadius:4,border:`1px solid ${auditLog.length>0?C.teal:C.border}`,
            background:auditLog.length>0?`${C.teal}18`:"transparent",
            color:auditLog.length>0?C.teal:C.dim,cursor:"pointer"}}>
          ◎ AUDIT {auditLog.length>0?`(${auditLog.length})`:""}
        </button>
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden",position:"relative"}}>
        <Roster engineers={ENGINEERS} scenario={effectiveScenario} phaseAssign={phaseAssign} phaseComplete={phaseComplete}
          collapsed={rosterCollapsed} onToggleCollapse={()=>setRosterCollapsed(v=>!v)}
          mobile={mobile} mobileOpen={mobileRosterOpen} onMobileClose={()=>setMobileRosterOpen(false)}/>
        {mainView==="heatmap"?(
          <RiskHeatmap projects={activeProjects} phaseAssign={phaseAssign}
            phaseComplete={phaseComplete} scenario={effectiveScenario}
            onCellClick={f=>{setHeatmapFilter(f);setMainView("board");}}/>
        ):(
          <ProjectBoard projects={activeProjects} phaseAssign={phaseAssign}
            phaseComplete={phaseComplete} onMarkComplete={markPhaseComplete}
            heatmapFilter={heatmapFilter} onClearFilter={()=>setHeatmapFilter(null)} narrow={narrow}/>
        )}
      </div>

      <CommandBar cmd={cmd} setCmd={setCmd} runCmd={runCmd} loading={loading} inputRef={inputRef}
        mobile={mobile} onOpenRoster={()=>setMobileRosterOpen(true)}/>

      {preview&&<PreviewPanel preview={preview} onCommit={commitChange} onCancel={dismissPreview}
        phaseAssign={phaseAssign} phaseComplete={phaseComplete}/>}
      {commitResult&&<BeforeAfterPanel result={commitResult} onClose={()=>setCommitResult(null)}/>}
      {auditOpen&&<AuditPanel log={auditLog} onClose={()=>setAuditOpen(false)}/>}
      <UndoSnackbar entry={visibleUndo} onUndo={undoLastAction} onDismiss={()=>setVisibleUndo(null)}/>
      {exportOpen&&<ExportModal
        totalAtRisk={totalAtRisk}
        util={util}
        deployed={deployedCount}
        auditLog={auditLog}
        projects={activeProjects}
        phaseAssign={phaseAssign}
        phaseComplete={phaseComplete}
        onClose={()=>setExportOpen(false)}/>}

      {/* Demo disclaimer */}
      <div style={{background:C.surface,borderTop:`1px solid ${C.border}`,padding:"3px 18px",flexShrink:0,
        display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontFamily:F,fontSize:8,color:C.dim,letterSpacing:1}}>
          ⚠ All project data is fictional. Enterprise names used as realistic deployment examples only. Not representative of actual customer relationships.
        </span>
      </div>
    </div>
  );
}
