import { useState, useEffect, useRef } from "react";

// ── THEME ──────────────────────────────────────────────────────────────────
const C = {
  bg:"#06101E", surface:"#091624", card:"#0C1D35",
  border:"#18334F", borderBrt:"#264F78", accent:"#1A7FFF", accentDim:"#0A3A7A",
  text:"#C0D4E8", dim:"#567090", white:"#EEF4FF",
  green:"#00D080", amber:"#FF9400", red:"#FF3355", teal:"#00C8C8",
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

// ── SCENARIOS ─────────────────────────────────────────────────────────────
const SCENARIOS = [
  {id:0,label:"NOMINAL",name:"Normal Operations",color:C.green,
   desc:"Installation fully covered. Delivery has P22 open (no bench engineer). Networking is the constraint — 9 engineers active, 6 projects queued AT RISK.",
   disruptions:{},freedEngineers:{},earlyProjects:{},
  },
  {id:1,label:"SICK CALL",name:"Engineer Sick Call",color:C.amber,
   desc:"Megan O'Brien (Networking) out sick. Intel Lab Servers ($420K) Networking phase loses coverage — AT RISK.",
   disruptions:{NET02:"Sick"},freedEngineers:{},earlyProjects:{},
  },
  {id:2,label:"READINESS",name:"Site Readiness Delay",color:C.teal,
   desc:"Kaiser Permanente site not ready — HVAC overrun. Antoine Leblanc freed from P24 Installation. P24 now understaffed: 1 of 2 engineers.",
   disruptions:{},freedEngineers:{INS06:"Site Delay"},earlyProjects:{},
  },
  {id:3,label:"WEATHER",name:"Snowstorm Delay",color:C.amber,
   desc:"Winter storm grounds 3 engineers. BofA AI Delivery understaffed (1/2). Capital One & United Airlines Networking AT RISK. $1.46M exposed.",
   disruptions:{DEL07:"Weather",NET01:"Weather",NET07:"Weather"},freedEngineers:{},earlyProjects:{},
  },
  {id:4,label:"EARLY READY",name:"Site Ready Early",color:C.green,
   desc:"Capital One GPU Cluster ($780K) site prep complete 5 days early. P01 timeline tightens to 3 days — already covered by NET01, but urgency now drives prioritization.",
   disruptions:{},freedEngineers:{},earlyProjects:{P01:3},
  },
  {id:5,label:"SUPPLY CHAIN",name:"Supply Chain Shock",color:C.red,
   desc:"Hardware backordered 4–6 weeks. 3 engineers freed: P04 and P24 Installation understaffed, P17 Networking AT RISK.",
   disruptions:{},freedEngineers:{INS02:"Parts Delay",INS07:"Parts Delay",NET08:"Parts Delay"},earlyProjects:{},
  },
  {id:6,label:"PEAK DEMAND",name:"Peak Demand Overload",color:C.red,
   desc:"5 engineers on PTO during peak period. $4.24M across 10 at-risk projects. Bench is empty — AI must prioritize the highest-value recoveries.",
   disruptions:{INS01:"PTO",INS07:"PTO",NET01:"PTO",NET02:"PTO",NET07:"PTO"},freedEngineers:{},earlyProjects:{},
  },
];

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

function Header({scenarioId,atRisk,util,deployed,demoOpen,setDemoOpen}) {
  const sc = SCENARIOS.find(s=>s.id===scenarioId)||SCENARIOS[0];
  return (
    <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 20px",
      display:"flex",alignItems:"center",gap:20,height:56,flexShrink:0}}>
      <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
        <polygon points="13,2 24,20 2,20" fill="none" stroke={C.accent} strokeWidth="1.5"/>
        <circle cx="13" cy="14" r="3" fill={C.accent}/>
        <line x1="13" y1="2" x2="13" y2="11" stroke={C.accent} strokeWidth="1.5"/>
      </svg>
      <div>
        <div style={{display:"flex",alignItems:"baseline",gap:8}}>
          <span style={{fontFamily:F,fontSize:22,fontWeight:800,color:C.white,letterSpacing:3}}>SORTIE</span>
          <span style={{fontFamily:F,fontSize:10,fontWeight:600,color:C.dim,letterSpacing:2}}>WORKFORCE OPS</span>
        </div>
        <div style={{fontFamily:FB,fontSize:9,color:C.dim}}>Revenue-weighted deployment intelligence for enterprise server installations</div>
      </div>
      {scenarioId!==0&&(
        <div style={{display:"flex",alignItems:"center",gap:5,background:`${sc.color}18`,
          border:`1px solid ${sc.color}55`,borderRadius:4,padding:"2px 10px",flexShrink:0}}>
          <div style={{width:5,height:5,borderRadius:"50%",background:sc.color}}/>
          <span style={{fontFamily:F,fontSize:10,fontWeight:700,letterSpacing:1.5,color:sc.color}}>{sc.name.toUpperCase()}</span>
        </div>
      )}
      <div style={{flex:1}}/>
      {[{l:"REVENUE AT RISK",v:fmtRev(atRisk),c:atRisk>0?C.red:C.green},
        {l:"UTILIZATION",v:`${util}%`,c:util>=90?C.green:util>=70?C.amber:C.red},
        {l:"DEPLOYED",v:`${deployed}/26`,c:C.text},
      ].map(m=>(
        <div key={m.l} style={{textAlign:"right",minWidth:88}}>
          <div style={{fontFamily:F,fontSize:8,fontWeight:700,letterSpacing:1.5,color:C.dim}}>{m.l}</div>
          <div style={{fontFamily:FM,fontSize:18,fontWeight:500,color:m.c,lineHeight:1.1}}>{m.v}</div>
        </div>
      ))}
      <button onClick={()=>setDemoOpen(v=>!v)} title="Simulation controls"
        style={{width:32,height:32,borderRadius:4,border:`1px solid ${demoOpen?C.borderBrt:C.border}`,
          background:demoOpen?C.card:"transparent",cursor:"pointer",display:"flex",
          alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="7.5" cy="7.5" r="2.5" stroke={demoOpen?C.accent:C.dim} strokeWidth="1.3"/>
          <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M2.9 2.9l1.1 1.1M11 11l1.1 1.1M11 2.9l-1.1 1.1M3 11l-1.1 1.1"
            stroke={demoOpen?C.accent:C.dim} strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

function DemoPanel({scenarioId,setScenarioId,onClose}) {
  return (
    <div style={{position:"absolute",top:57,right:0,width:320,maxHeight:"calc(100vh - 57px)",
      background:C.card,borderLeft:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,
      zIndex:200,display:"flex",flexDirection:"column"}}>
      <style>{`
        .sortie-demopanel-scroll::-webkit-scrollbar { width: 10px; }
        .sortie-demopanel-scroll::-webkit-scrollbar-track { background: ${C.surface}; }
        .sortie-demopanel-scroll::-webkit-scrollbar-thumb { background: ${C.accent}66; border-radius: 5px; border: 2px solid ${C.surface}; }
        .sortie-demopanel-scroll::-webkit-scrollbar-thumb:hover { background: ${C.accent}cc; }
        .sortie-demopanel-scroll { scrollbar-width: thin; scrollbar-color: ${C.accent}66 ${C.surface}; }
      `}</style>
      <div style={{padding:"10px 14px",borderBottom:`1px solid ${C.border}`,flexShrink:0,
        display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontFamily:F,fontSize:11,fontWeight:700,letterSpacing:2,color:C.dim}}>SIMULATION CONTROLS</span>
        <button onClick={onClose} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:16}}>✕</button>
      </div>
      <div className="sortie-demopanel-scroll" style={{padding:10,display:"flex",flexDirection:"column",gap:5,overflowY:"auto",flex:1,minHeight:0}}>
        {SCENARIOS.map(s=>(
          <button key={s.id} onClick={()=>{setScenarioId(s.id);onClose();}}
            style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 11px",flexShrink:0,
              border:`1px solid ${scenarioId===s.id?s.color:C.border}`,borderRadius:5,
              background:scenarioId===s.id?`${s.color}14`:C.surface,cursor:"pointer",textAlign:"left"}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:s.color,flexShrink:0,marginTop:3}}/>
            <div>
              <div style={{fontFamily:F,fontSize:11,fontWeight:700,letterSpacing:1,
                color:scenarioId===s.id?s.color:C.white}}>{s.name}</div>
              <div style={{fontFamily:FB,fontSize:10,color:C.dim,lineHeight:1.4,marginTop:2}}>{s.desc}</div>
            </div>
          </button>
        ))}
      </div>
      <div style={{padding:"6px 14px",borderTop:`1px solid ${C.border}`,flexShrink:0}}>
        <span style={{fontFamily:F,fontSize:8,color:C.dim,letterSpacing:1}}>
          DEMO MODE · All project data is fictional
        </span>
      </div>
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

function Roster({engineers, scenario, phaseAssign, phaseComplete}) {
  const groups = Object.keys(MODALITY_MAP).map(mod=>({
    mod, color:MODALITY_CLR[mod], engineers:engineers.filter(i=>i.modality===mod),
  }));
  const disruptedCount = Object.keys(scenario.disruptions||{}).length;
  const freedCount     = Object.keys(scenario.freedEngineers||{}).length;
  const availCount     = engineers.filter(i=>engineerStatus(i.id,scenario,phaseAssign)==="available").length;
  return (
    <div style={{width:260,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",flexShrink:0,background:C.surface}}>
      <div style={{padding:"8px 12px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:6}}>
        <span style={{fontFamily:F,fontSize:9,fontWeight:700,letterSpacing:2,color:C.dim}}>ENGINEER ROSTER</span>
        {disruptedCount>0&&<span style={{fontFamily:F,fontSize:8,fontWeight:700,color:C.red,marginLeft:"auto"}}>{disruptedCount} OUT</span>}
        {freedCount>0&&<span style={{fontFamily:F,fontSize:8,fontWeight:700,color:C.teal,marginLeft:disruptedCount?"4px":"auto"}}>{freedCount} FREED</span>}
        <span style={{fontFamily:F,fontSize:8,fontWeight:700,color:C.accent,marginLeft:(disruptedCount||freedCount)?4:"auto"}}>{availCount} AVAIL</span>
      </div>
      <div style={{overflowY:"auto",flex:1}}>
        {groups.map(({mod,color,engineers:gi})=>(
          <div key={mod}>
            <div style={{padding:"4px 12px",background:`${color}12`,borderBottom:`1px solid ${color}30`,
              display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:color,flexShrink:0}}/>
              <span style={{fontFamily:F,fontSize:9,fontWeight:700,letterSpacing:2,color}}>{mod.toUpperCase()}</span>
              <span style={{fontFamily:F,fontSize:8,color,opacity:0.7,marginLeft:"auto"}}>
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
      borderRadius:6,padding:"9px 11px",display:"flex",flexDirection:"column",gap:5,
      boxShadow:isAtRisk?`0 0 10px ${C.red}22`:undefined}}>
      {/* Status banner */}
      {(isAtRisk||isUnder)&&(
        <div style={{fontFamily:F,fontSize:9,fontWeight:700,letterSpacing:2,
          color:isAtRisk?C.red:C.amber,background:isAtRisk?`${C.red}20`:`${C.amber}18`,
          padding:"2px 6px",borderRadius:3,textAlign:"center"}}>
          {isAtRisk?`⚠ AT RISK — ${currentPhase.toUpperCase()} UNCOVERED`:`! UNDERSTAFFED — ${assigned.length}/${required} ENGINEERS`}
        </div>
      )}
      {/* Name + Revenue */}
      <div style={{display:"flex",alignItems:"flex-start",gap:6}}>
        <div style={{flex:1}}>
          <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:C.white,lineHeight:1.2}}>{project.name}</div>
          <div style={{fontFamily:FB,fontSize:10,color:C.text,marginTop:1}}>{cust.name}</div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{fontFamily:FM,fontSize:14,fontWeight:500,color:C.white}}>{fmtRev(project.revenue)}</div>
          <div style={{fontFamily:FM,fontSize:9,color:urgC,marginTop:1}}>{project.daysLeft}d left</div>
        </div>
      </div>
      {/* Phase progress bar */}
      <PhaseProgressBar pid={project.id} phaseAssign={phaseAssign} phaseComplete={phaseComplete} project={project}/>
      {/* Current phase + assigned engineers */}
      <div style={{display:"flex",alignItems:"center",gap:5,borderTop:`1px solid ${C.border}`,paddingTop:5}}>
        <span style={{fontFamily:FM,fontSize:8,color:phaseClr,background:`${phaseClr}18`,
          padding:"1px 4px",borderRadius:2}}>{currentPhase.toUpperCase()}</span>
        <span style={{fontFamily:FM,fontSize:8,color:C.dim}}>needs {project.phaseCerts[currentPhase]}</span>
        <div style={{flex:1}}/>
        {assigned.length>0?(
          <div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:"flex-end"}}>
            {assigned.map(e=>(
              <span key={e.id} style={{fontFamily:FB,fontSize:9,color:C.green}}>✓ {e.name.split(" ")[0]}</span>
            ))}
          </div>
        ):(
          <span style={{fontFamily:F,fontSize:9,fontWeight:700,color:C.red}}>No coverage</span>
        )}
      </div>
      {/* Mark complete button */}
      {phaseStatus==="covered"&&(
        <button onClick={()=>onMarkComplete(project.id, currentPhase)}
          style={{fontFamily:F,fontWeight:700,fontSize:9,letterSpacing:1,padding:"3px 8px",
            border:`1px solid ${phaseClr}55`,borderRadius:3,background:`${phaseClr}12`,
            color:phaseClr,cursor:"pointer",width:"100%",textAlign:"center"}}>
          ✓ MARK {currentPhase.toUpperCase()} COMPLETE
        </button>
      )}
      {/* Footer */}
      <div style={{fontFamily:FB,fontSize:9,color:C.dim}}>{cust.city} · {project.tier}</div>
    </div>
  );
}

function ProjectBoard({projects, phaseAssign, phaseComplete, onMarkComplete, heatmapFilter, onClearFilter}) {
  const [phaseFilter,setPhaseFilter] = useState(null);
  const [riskOnly,setRiskOnly]       = useState(false);
  const [underOnly,setUnderOnly]     = useState(false);
  const [view,setView]               = useState("grid");

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
    <button key={key} onClick={onClick} style={{fontFamily:F,fontSize:10,fontWeight:700,letterSpacing:1,
      padding:"2px 7px",border:`1px solid ${active?color:`${color}44`}`,borderRadius:3,cursor:"pointer",
      whiteSpace:"nowrap",background:active?`${color}28`:"transparent",color:active?color:`${color}88`}}>{label}</button>
  );

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:C.bg}}>
      {/* Filter bar */}
      <div style={{padding:"6px 12px",borderBottom:`1px solid ${C.border}`,background:C.surface,
        display:"flex",alignItems:"center",gap:4,flexWrap:"wrap",flexShrink:0}}>
        {pill("ALL",!activeFilter&&!riskOnly&&!underOnly,()=>{setPhaseFilter(null);setRiskOnly(false);setUnderOnly(false);if(onClearFilter)onClearFilter();},C.dim)}
        <div style={{width:1,height:12,background:C.border,margin:"0 2px"}}/>
        {pill(`AT RISK${atRiskCount>0?` (${atRiskCount})`:""}`,riskOnly,()=>{setRiskOnly(v=>!v);setUnderOnly(false);setPhaseFilter(null);if(onClearFilter)onClearFilter();},C.red)}
        {underCount>0&&pill(`UNDERSTAFFED (${underCount})`,underOnly,()=>{setUnderOnly(v=>!v);setRiskOnly(false);setPhaseFilter(null);if(onClearFilter)onClearFilter();},C.amber)}
        <div style={{width:1,height:12,background:C.border,margin:"0 2px"}}/>
        {["delivery","installation","networking"].map(ph=>{
          const cnt=projects.filter(p=>getCurrentPhase(p.id,phaseComplete)===ph).length;
          const clr=MODALITY_CLR[ph==="delivery"?"Delivery":ph==="installation"?"Installation":"Networking"];
          return pill(`${ph.toUpperCase().slice(0,4)} (${cnt})`,phaseFilter===ph,
            ()=>{setPhaseFilter(v=>v===ph?null:ph);setRiskOnly(false);setUnderOnly(false);if(onClearFilter)onClearFilter();},clr,ph);
        })}
        {heatmapFilter&&(
          <button onClick={onClearFilter} style={{fontFamily:F,fontSize:9,fontWeight:700,padding:"2px 7px",
            border:`1px solid ${C.teal}`,borderRadius:3,cursor:"pointer",background:`${C.teal}20`,color:C.teal}}>
            ◉ MATRIX FILTER × CLEAR
          </button>
        )}
        <div style={{flex:1}}/>
        <div style={{display:"flex",gap:2,background:C.card,borderRadius:4,padding:2}}>
          {[{id:"grid",l:"⊞ Board"},{id:"timeline",l:"≡ Urgency"}].map(v=>(
            <button key={v.id} onClick={()=>setView(v.id)}
              style={{fontFamily:F,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:3,border:"none",
                cursor:"pointer",background:view===v.id?C.accent:"transparent",color:view===v.id?C.white:C.dim}}>{v.l}</button>
          ))}
        </div>
        <span style={{fontFamily:F,fontSize:9,color:C.dim,letterSpacing:1,marginLeft:6}}>{filtered.length}/{projects.length}</span>
      </div>
      {/* Board */}
      <div style={{flex:1,overflowY:"auto",padding:12}}>
        {filtered.length===0?(
          <div style={{fontFamily:F,fontSize:12,color:C.dim,letterSpacing:1,textAlign:"center",marginTop:48}}>NO PROJECTS MATCH</div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:8}}>
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
        width:480,maxWidth:"92vw",padding:22,display:"flex",flexDirection:"column",gap:14}}>
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
        width:isBriefing?600:560,maxWidth:"92vw",maxHeight:"85vh",overflowY:"auto",
        padding:22,display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontFamily:F,fontSize:13,fontWeight:700,letterSpacing:2,
            color:isBriefing?C.teal:C.accent}}>{isBriefing?"SITUATION BRIEFING":"SORTIE RECOMMENDATION"}</div>
          <button onClick={onCancel} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:18}}>✕</button>
        </div>
        {preview.error?(
          <div style={{color:C.red,fontFamily:FB,fontSize:13}}>{preview.error}</div>
        ):isBriefing?(
          <>
            <div><div style={{fontFamily:F,fontSize:8,fontWeight:700,letterSpacing:2,color:C.dim,marginBottom:5}}>ANALYSIS</div>
              <div style={{fontFamily:FB,fontSize:13,color:C.text,lineHeight:1.6}}>{d?.analysis}</div></div>
            {(()=>{
              const valid=(d?.briefingItems||[]).filter(it=>it&&it.title&&it.detail&&String(it.detail).trim().length>0);
              return valid.length>0&&(
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                <div style={{fontFamily:F,fontSize:8,fontWeight:700,letterSpacing:2,color:C.dim,marginBottom:2}}>CRITICAL ITEMS</div>
                {valid.map((item,i)=>{
                  const sev=String(item.severity||"info").toLowerCase();
                  const sc=sev==="critical"?C.red:sev==="warning"?C.amber:C.accent;
                  return (
                    <div key={i} style={{display:"flex",gap:8,padding:"6px 10px",background:`${sc}10`,border:`1px solid ${sc}44`,borderRadius:4}}>
                      <span style={{flexShrink:0,fontSize:12}}>{sev==="critical"?"🔴":sev==="warning"?"🟡":"🔵"}</span>
                      <div><div style={{fontFamily:F,fontSize:11,fontWeight:700,color:sc}}>{item.title}</div>
                        <div style={{fontFamily:FB,fontSize:10,color:C.text,lineHeight:1.4,marginTop:1}}>{item.detail}</div></div>
                    </div>
                  );
                })}
              </div>
              );
            })()}
            {d?.recommendation&&<div>
              <div style={{fontFamily:F,fontSize:8,fontWeight:700,letterSpacing:2,color:C.dim,marginBottom:4}}>RECOMMENDED NEXT STEP</div>
              <div style={{fontFamily:FB,fontSize:13,color:C.white,lineHeight:1.5}}>{d.recommendation}</div>
            </div>}
            <div style={{display:"flex",justifyContent:"flex-end"}}>
              <button onClick={onCancel} style={{fontFamily:F,fontWeight:700,fontSize:11,letterSpacing:1.5,
                padding:"7px 16px",border:`1px solid ${C.border}`,borderRadius:4,background:"transparent",color:C.dim,cursor:"pointer"}}>CLOSE</button>
            </div>
          </>
        ):(
          <>
            <div><div style={{fontFamily:F,fontSize:8,fontWeight:700,letterSpacing:2,color:C.dim,marginBottom:4}}>ANALYSIS</div>
              <div style={{fontFamily:FB,fontSize:13,color:C.text,lineHeight:1.5}}>{d?.analysis}</div></div>
            <div><div style={{fontFamily:F,fontSize:8,fontWeight:700,letterSpacing:2,color:C.dim,marginBottom:4}}>RECOMMENDATION</div>
              <div style={{fontFamily:FB,fontSize:13,color:C.white,lineHeight:1.5}}>{d?.recommendation}</div></div>
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
                style={{fontFamily:F,fontWeight:700,fontSize:11,letterSpacing:1.5,padding:"7px 16px",
                  border:`1px solid ${C.border}`,borderRadius:4,background:"transparent",color:C.dim,cursor:"pointer"}}>DISMISS</button>
              {change&&!preview.error&&(
                <button onClick={onCommit}
                  style={{fontFamily:F,fontWeight:700,fontSize:11,letterSpacing:1.5,padding:"7px 16px",
                    border:"none",borderRadius:4,background:C.green,color:"#001A0A",cursor:"pointer"}}>COMMIT CHANGE</button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const QUICK_CMDS = [
  {label:"What's my exposure?",icon:"📊"},
  {label:"Cover highest risk now",icon:"🎯"},
  {label:"Who's available?",icon:"👥"},
];

function CommandBar({cmd,setCmd,runCmd,loading,inputRef}) {
  return (
    <div style={{background:C.surface,borderTop:`1px solid ${C.borderBrt}`,flexShrink:0}}>
      <div style={{padding:"6px 18px 0",display:"flex",gap:5,alignItems:"center"}}>
        <span style={{fontFamily:F,fontSize:8,fontWeight:700,letterSpacing:2,color:C.dim,flexShrink:0}}>QUICK:</span>
        {QUICK_CMDS.map(q=>(
          <button key={q.label} onClick={()=>setCmd(q.label)}
            style={{fontFamily:FB,fontSize:10,padding:"2px 8px",border:`1px solid ${C.border}`,
              borderRadius:12,cursor:"pointer",background:"transparent",color:C.dim,whiteSpace:"nowrap"}}>
            {q.icon} {q.label}
          </button>
        ))}
      </div>
      <div style={{padding:"8px 18px 12px",display:"flex",gap:12,alignItems:"center"}}>
        <div style={{flexShrink:0,textAlign:"center"}}>
          <div style={{fontFamily:F,fontSize:12,fontWeight:800,letterSpacing:3,color:C.accent,lineHeight:1}}>SORTIE</div>
          <div style={{fontFamily:F,fontSize:7,fontWeight:600,letterSpacing:2,color:C.dim,marginTop:1}}>AI</div>
        </div>
        <div style={{width:1,height:30,background:C.border,flexShrink:0}}/>
        <input ref={inputRef} value={cmd} onChange={e=>setCmd(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();runCmd();}}}
          placeholder="e.g. Who can cover United Airlines networking? · Move Ravi to Capital One · What's my exposure?"
          style={{flex:1,background:C.card,border:`1px solid ${C.borderBrt}`,borderRadius:5,
            padding:"8px 14px",fontSize:12,outline:"none",lineHeight:1.4,color:C.white,fontFamily:FB}}/>
        <button onClick={runCmd} disabled={loading||!cmd.trim()}
          style={{background:loading?C.accentDim:C.accent,color:C.white,border:"none",borderRadius:5,
            padding:"8px 18px",fontFamily:F,fontWeight:800,fontSize:12,letterSpacing:2,
            cursor:loading||!cmd.trim()?"not-allowed":"pointer",flexShrink:0,
            opacity:loading||!cmd.trim()?0.6:1}}>
          {loading?"THINKING…":"EXECUTE"}
        </button>
      </div>
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────────────────
// ── SCENARIO BUILDER ──────────────────────────────────────────────────────
function ScenarioBuilder({baseScenario, customDisruptions, customFreed, customEarly,
  onAddDisruption, onAddFreed, onAddEarly, onClear, onClose}) {
  const hasCustom = Object.keys(customDisruptions).length > 0 ||
                    Object.keys(customFreed).length > 0 ||
                    Object.keys(customEarly).length > 0;
  const groups = Object.keys(MODALITY_MAP).map(mod=>({
    mod, color:MODALITY_CLR[mod], engineers:ENGINEERS.filter(i=>i.modality===mod),
  }));
  const reasons = ["Sick","Weather","PTO","Equipment Delay"];
  const [selectedReason, setSelectedReason] = useState("Sick");
  const [earlyPid, setEarlyPid]             = useState("");
  const [earlyDays, setEarlyDays]           = useState(3);

  const getEngineerState = engineerId => {
    if (customDisruptions[engineerId]) return {type:"disrupted",reason:customDisruptions[engineerId],source:"custom"};
    if (customFreed[engineerId])       return {type:"freed",    reason:customFreed[engineerId],    source:"custom"};
    if (baseScenario.disruptions?.[engineerId]) return {type:"disrupted",reason:baseScenario.disruptions[engineerId],source:"base"};
    if (baseScenario.freedEngineers?.[engineerId]) return {type:"freed",reason:baseScenario.freedEngineers[engineerId],source:"base"};
    return null;
  };

  return (
    <div style={{position:"absolute",top:0,right:0,bottom:0,width:340,background:C.card,
      borderLeft:`1px solid ${C.borderBrt}`,zIndex:150,display:"flex",flexDirection:"column",
      boxShadow:"-4px 0 20px rgba(0,0,0,0.5)"}}>
      {/* Header */}
      <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,
        display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div>
          <div style={{fontFamily:F,fontSize:12,fontWeight:700,letterSpacing:2,color:C.accent}}>SCENARIO BUILDER</div>
          <div style={{fontFamily:FB,fontSize:10,color:C.dim,marginTop:1}}>
            Builds on: <span style={{color:C.white}}>{baseScenario.name}</span>
          </div>
        </div>
        <button onClick={onClose}
          style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:18,lineHeight:1}}>✕</button>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:12,display:"flex",flexDirection:"column",gap:10}}>
        {/* Reason selector */}
        <div style={{background:C.surface,borderRadius:6,padding:"10px 12px"}}>
          <div style={{fontFamily:F,fontSize:9,fontWeight:700,letterSpacing:2,color:C.dim,marginBottom:7}}>DISRUPTION REASON</div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {reasons.map(r=>(
              <button key={r} onClick={()=>setSelectedReason(r)}
                style={{fontFamily:F,fontSize:9,fontWeight:700,letterSpacing:1,padding:"2px 8px",
                  borderRadius:3,border:`1px solid ${selectedReason===r?C.red:C.border}`,
                  background:selectedReason===r?`${C.red}22`:"transparent",
                  color:selectedReason===r?C.red:C.dim,cursor:"pointer"}}>{r}</button>
            ))}
          </div>
        </div>

        {/* Engineers */}
        <div style={{background:C.surface,borderRadius:6,padding:"10px 12px"}}>
          <div style={{fontFamily:F,fontSize:9,fontWeight:700,letterSpacing:2,color:C.dim,marginBottom:8}}>MARK ENGINEERS</div>
          {groups.map(({mod,color,engineers:gi})=>(
            <div key={mod} style={{marginBottom:8}}>
              <div style={{fontFamily:F,fontSize:8,fontWeight:700,letterSpacing:2,color,marginBottom:4}}>{mod.toUpperCase()}</div>
              {gi.map(engineer=>{
                const state = getEngineerState(engineer.id);
                const isBase = state?.source==="base";
                const isCustom = state?.source==="custom";
                return (
                  <div key={engineer.id} style={{display:"flex",alignItems:"center",gap:6,
                    padding:"3px 0",borderBottom:`1px solid ${C.border}`,opacity:isBase?0.5:1}}>
                    <div style={{flex:1}}>
                      <span style={{fontFamily:FB,fontSize:10,color:isBase||isCustom?C.dim:C.white}}>
                        {engineer.name.split(" ")[0]}
                      </span>
                      {state&&(
                        <span style={{fontFamily:F,fontSize:8,fontWeight:700,marginLeft:5,
                          color:state.type==="freed"?C.teal:C.red,
                          background:state.type==="freed"?`${C.teal}20`:`${C.red}20`,
                          padding:"0 3px",borderRadius:2}}>
                          {state.reason}{isBase?" (base)":""}
                        </span>
                      )}
                    </div>
                    {!isBase&&(
                      isCustom?(
                        <button onClick={()=>{
                          if(customDisruptions[engineer.id]) onAddDisruption(engineer.id, null);
                          else onAddFreed(engineer.id, null);
                        }} style={{fontFamily:F,fontSize:8,fontWeight:700,padding:"1px 6px",
                          border:`1px solid ${C.border}`,borderRadius:3,
                          background:"transparent",color:C.dim,cursor:"pointer"}}>CLEAR</button>
                      ):(
                        <div style={{display:"flex",gap:3}}>
                          <button onClick={()=>onAddDisruption(engineer.id, selectedReason)}
                            style={{fontFamily:F,fontSize:8,fontWeight:700,padding:"1px 6px",
                              border:`1px solid ${C.red}55`,borderRadius:3,
                              background:`${C.red}12`,color:C.red,cursor:"pointer"}}>OUT</button>
                          <button onClick={()=>onAddFreed(engineer.id, "Site Delay")}
                            style={{fontFamily:F,fontSize:8,fontWeight:700,padding:"1px 6px",
                              border:`1px solid ${C.teal}55`,borderRadius:3,
                              background:`${C.teal}12`,color:C.teal,cursor:"pointer"}}>FREE</button>
                        </div>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Early ready project */}
        <div style={{background:C.surface,borderRadius:6,padding:"10px 12px"}}>
          <div style={{fontFamily:F,fontSize:9,fontWeight:700,letterSpacing:2,color:C.dim,marginBottom:8}}>MARK SITE READY EARLY</div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <select value={earlyPid} onChange={e=>setEarlyPid(e.target.value)}
              style={{flex:1,background:C.card,border:`1px solid ${C.border}`,borderRadius:4,
                color:C.white,fontFamily:FB,fontSize:10,padding:"4px 6px"}}>
              <option value="">Select project…</option>
              {PROJECTS.map(p=>(
                <option key={p.id} value={p.id}>{p.name.split(" ").slice(0,3).join(" ")}</option>
              ))}
            </select>
            <input type="number" value={earlyDays} onChange={e=>setEarlyDays(+e.target.value)}
              min={1} max={30}
              style={{width:52,background:C.card,border:`1px solid ${C.border}`,borderRadius:4,
                color:C.white,fontFamily:FM,fontSize:11,padding:"4px 6px",textAlign:"center"}}/>
            <span style={{fontFamily:F,fontSize:9,color:C.dim}}>days</span>
            <button onClick={()=>{if(earlyPid)onAddEarly(earlyPid,earlyDays);}}
              style={{fontFamily:F,fontSize:9,fontWeight:700,padding:"4px 10px",
                border:`1px solid ${C.green}55`,borderRadius:3,
                background:`${C.green}12`,color:C.green,cursor:"pointer"}}>APPLY</button>
          </div>
          {Object.entries(customEarly).length>0&&(
            <div style={{marginTop:7,display:"flex",flexDirection:"column",gap:3}}>
              {Object.entries(customEarly).map(([pid,days])=>{
                const p=PROJECTS.find(pr=>pr.id===pid);
                return (
                  <div key={pid} style={{display:"flex",alignItems:"center",gap:6,
                    fontFamily:FB,fontSize:10,color:C.green}}>
                    <span style={{flex:1}}>{p?.name.split(" ").slice(0,3).join(" ")} → {days}d</span>
                    <button onClick={()=>onAddEarly(pid,null)}
                      style={{fontFamily:F,fontSize:8,padding:"1px 5px",border:`1px solid ${C.border}`,
                        borderRadius:3,background:"transparent",color:C.dim,cursor:"pointer"}}>✕</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{padding:"10px 12px",borderTop:`1px solid ${C.border}`,flexShrink:0,display:"flex",gap:6}}>
        <button onClick={onClear} disabled={!hasCustom}
          style={{flex:1,fontFamily:F,fontWeight:700,fontSize:10,letterSpacing:1.5,padding:"6px 0",
            border:`1px solid ${C.border}`,borderRadius:4,
            background:"transparent",color:hasCustom?C.amber:C.dim,cursor:hasCustom?"pointer":"not-allowed",
            opacity:hasCustom?1:0.5}}>CLEAR ALL CUSTOM</button>
        <button onClick={onClose}
          style={{flex:1,fontFamily:F,fontWeight:700,fontSize:10,letterSpacing:1.5,padding:"6px 0",
            border:"none",borderRadius:4,background:C.accent,color:C.white,cursor:"pointer"}}>DONE</button>
      </div>
    </div>
  );
}

// ── EXPORT MODAL ───────────────────────────────────────────────────────────
function ExportModal({scenarioName, customActive, totalAtRisk, util, deployed,
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
    `Scenario: ${scenarioName}${customActive?" + Custom Overrides":""}`,
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
        width:580,maxWidth:"92vw",maxHeight:"82vh",display:"flex",flexDirection:"column"}}>
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

export default function Sortie() {
  useEffect(()=>{injectFonts();},[]);
  const [scenarioId,       setScenarioId]       = useState(0);
  const [phaseAssign,      setPhaseAssign]       = useState(()=>JSON.parse(JSON.stringify(BASE_PHASE_ASSIGN)));
  const [phaseComplete,    setPhaseComplete]     = useState(()=>JSON.parse(JSON.stringify(BASE_PHASE_COMPLETE)));
  const [cmd,              setCmd]               = useState("");
  const [loading,          setLoading]           = useState(false);
  const [preview,          setPreview]           = useState(null);
  const [demoOpen,         setDemoOpen]          = useState(false);
  const [auditLog,         setAuditLog]          = useState([]);
  const [auditOpen,        setAuditOpen]         = useState(false);
  const [mainView,         setMainView]          = useState("board");
  const [heatmapFilter,    setHeatmapFilter]     = useState(null);
  const [commitResult,     setCommitResult]      = useState(null);
  const [builderOpen,      setBuilderOpen]       = useState(false);
  const [exportOpen,       setExportOpen]        = useState(false);
  const [customDisruptions,setCustomDisruptions] = useState({});
  const [customFreed,      setCustomFreed]       = useState({});
  const [customEarly,      setCustomEarly]       = useState({});
  const [resetKey,         setResetKey]          = useState(0);
  const inputRef = useRef(null);

  const baseScenario = SCENARIOS.find(s=>s.id===scenarioId)||SCENARIOS[0];

  // Merge base scenario with custom overrides
  const effectiveScenario = {
    ...baseScenario,
    disruptions:    {...(baseScenario.disruptions||{}),    ...customDisruptions},
    freedEngineers: {...(baseScenario.freedEngineers||{}), ...customFreed},
    earlyProjects:  {...(baseScenario.earlyProjects||{}),  ...customEarly},
  };
  const hasCustom = Object.keys(customDisruptions).length>0 ||
                    Object.keys(customFreed).length>0 ||
                    Object.keys(customEarly).length>0;

  // Active projects (with earlyProjects override)
  const activeProjects = PROJECTS.map(p=>{
    const ov = effectiveScenario.earlyProjects?.[p.id];
    return ov!==undefined?{...p,daysLeft:ov}:p;
  });

  // Reset phase state when scenario or custom disruptions change
  useEffect(()=>{
    const newPA = JSON.parse(JSON.stringify(BASE_PHASE_ASSIGN));
    const newPC = JSON.parse(JSON.stringify(BASE_PHASE_COMPLETE));
    const allOut = [...Object.keys(effectiveScenario.disruptions||{}),...Object.keys(effectiveScenario.freedEngineers||{})];
    allOut.forEach(engineerId=>{
      Object.keys(newPA).forEach(key=>{
        newPA[key] = (newPA[key]||[]).filter(id=>id!==engineerId);
      });
    });
    setPhaseAssign(newPA);
    setPhaseComplete(newPC);
    setPreview(null);
    setCmd("");
    setCommitResult(null);
    setHeatmapFilter(null);
  },[scenarioId, resetKey]);

  const getStatus = id => engineerStatus(id, effectiveScenario, phaseAssign);
  const totalAtRisk    = calcRevAtRisk(activeProjects, phaseAssign, phaseComplete);
  const deployedCount  = ENGINEERS.filter(i=>getStatus(i.id)==="deployed").length;
  const util           = Math.round((deployedCount/ENGINEERS.length)*100);

  // Mark a phase complete
  function markPhaseComplete(projectId, phase) {
    const project = PROJECTS.find(p=>p.id===projectId);
    const needsConfirm = project.revenue >= 400000;
    if (needsConfirm && !window.confirm(`Mark ${phase} phase complete for ${project.name} ($${(project.revenue/1000).toFixed(0)}K)? This cannot be undone.`)) return;
    // Engineers stay assigned (history preserved); marking the phase complete is what advances the project.
    const freed = phaseAssign[`${projectId}-${phase}`]||[];
    setPhaseComplete(prev=>({...prev,[projectId]:[...(prev[projectId]||[]),phase]}));
    setAuditLog(prev=>[...prev,{
      time:fmtTime(), action:"PHASE COMPLETE", scenario:effectiveScenario.name,
      description:`${phase.toUpperCase()} phase marked complete on ${project.name}. ${freed.map(id=>getEngineer(id)?.name).join(", ")} freed for redeployment.`,
      revenueImpact:0, certValidation:null,
    }]);
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
      time:fmtTime(), action:"COMMITTED", scenario:effectiveScenario.name,
      description:`${engineer.name} → ${project.name} (${phase} phase). ${fmtRev(beforeRisk-afterRisk)} recovered.`,
      revenueImpact:beforeRisk-afterRisk, certValidation:`${engineer.name}: ${reqCert} ✓`,
    }]);
    setPreview(null); setCmd("");
  }

  function dismissPreview() {
    if (preview?.data?.recommendation&&!preview.error) {
      setAuditLog(prev=>[...prev,{
        time:fmtTime(),action:"DISMISSED",scenario:effectiveScenario.name,
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
      scenario:effectiveScenario.name, description:effectiveScenario.desc,
      allProjects: activeProjects.map(p=>{
        const phase = getCurrentPhase(p.id, phaseComplete);
        const assigned = (phaseAssign[`${p.id}-${phase}`]||[]).map(id=>getEngineer(id)?.name).filter(Boolean);
        const status = getPhaseStatus(p.id, phase, p, phaseAssign, phaseComplete);
        return {
          id:p.id, name:p.name, customer:CUSTOMERS[p.customer].name,
          tier:p.tier, revenue:p.revenue, daysLeft:p.daysLeft,
          currentPhase:phase, currentPhaseCert:p.phaseCerts[phase],
          currentPhaseRequired:p.phaseRequired[phase],
          currentPhaseAssigned:assigned, currentPhaseStatus:status,
          completedPhases:phaseComplete[p.id]||[],
        };
      }),
      availableEngineers: ENGINEERS.filter(i=>getStatus(i.id)==="available"||getStatus(i.id)==="freed").map(i=>({
        id:i.id, name:i.name, modality:i.modality, certs:i.certs,
        homeCity:i.city, currentLocation:getCurrentLocation(i,phaseAssign).city,
        locationSource:getCurrentLocation(i,phaseAssign).source,
        status:getStatus(i.id),
      })),
      deployedEngineers: ENGINEERS.filter(i=>getStatus(i.id)==="deployed").map(i=>{
        const loc = getCurrentLocation(i,phaseAssign);
        let curProj=null,curPhase=null;
        for(const [key,arr] of Object.entries(phaseAssign)){
          if(arr.includes(i.id)){[curProj,curPhase]=key.split("-");break;}
        }
        const proj = PROJECTS.find(p=>p.id===curProj);
        return {
          id:i.id,name:i.name,modality:i.modality,certs:i.certs,
          homeCity:i.city,currentLocation:loc.city,locationSource:loc.source,
          currentProjectId:curProj,currentProjectName:proj?.name,
          currentPhase:curPhase,currentPhaseCert:proj?.phaseCerts[curPhase],
        };
      }),
      disruptedEngineers: Object.entries(effectiveScenario.disruptions||{}).map(([id,reason])=>({
        id,name:getEngineer(id)?.name,modality:getEngineer(id)?.modality,reason,
      })),
      freedEngineers: Object.entries(effectiveScenario.freedEngineers||{}).map(([id,reason])=>({
        id,name:getEngineer(id)?.name,modality:getEngineer(id)?.modality,reason,
        note:"Available for redeployment — site stalled.",
      })),
    };

    try {
      const res = await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-haiku-4-5-20251001", max_tokens:1200,
          system:`You are Sortie, an AI workforce deployment assistant for a company that delivers and installs enterprise server infrastructure at colocation facilities across the USA. Engineers work in three sequential phases per project: Delivery (physical moving of equipment), Installation (vendor-specific racking/configuration), and Networking (network commissioning). Revenue is only recognized on full project completion (after Networking phase).

CURRENT STATE:
${JSON.stringify(ctx,null,2)}

CERTIFICATION RULE: An engineer can ONLY be assigned to a phase if their "certs" array contains the project's cert for that phase (e.g. phaseCerts.installation). Never cross skill types (Delivery/Installation/Networking).

LOCATION RULE: Use "currentLocation" not "homeCity" for travel feasibility. An engineer finishing in Dallas is closer to Houston than their home in Seattle.

PHASE BLOCKING RULE: Only the current active phase matters for revenue recovery. If a project is blocked in Networking, recommending a Delivery or Installation engineer does not recover revenue.

THREE MODES:
MODE 1 — EXPLICIT OVERRIDE: Manager names specific engineer and project. Execute it. Validate cert for the active phase. Set isBriefing:false.
MODE 2 — AI OPTIMIZATION: Match cert to active phase. Prefer available/freed engineers; recommend the highest-revenue at-risk project they can cover. If no bench engineer fits, reassign from a lower-revenue covered project to a higher-revenue at-risk one — set fromProjectId and fromPhase to the engineer's current assignment. The reassignment is immediate; do NOT reason about waiting for the source project to finish first. Accept that the source project becomes at-risk — that IS the tradeoff. Pick the swap that maximizes (target.revenue - source.revenue); ignore travel distance as a tiebreaker unless two swaps yield equal revenue recovery. CRITICAL: For MODE 2, proposedChange MUST be populated (never null) whenever any engineer in deployedEngineers holds the required cert — even if all candidates are currently deployed. Only return proposedChange:null if literally zero engineers in the entire roster have the required cert. Set isBriefing:false.
MODE 3 — BRIEFING: "exposure", "status", "what's at risk", "who's available", "briefing". Set isBriefing:true, proposedChange:null. Each briefingItem is a CONCRETE FINDING about the current state — NOT a category label or section header. The "title" IS the finding in 3-8 words. The "detail" is one full sentence with specifics — project IDs (P##), dollar amounts, engineer names, or city names pulled from CURRENT STATE. Severity goes in the severity field, never in the title text. Aim for 3-6 items ordered by revenue impact.

GOOD briefingItems (do this — title is the finding, detail has specifics, severity is set):
{ "severity":"critical", "title":"6 networking projects blocked", "detail":"P16, P18, P19, P20, P23, P25 are stalled in networking phase totaling $2.36M in queued revenue." }
{ "severity":"warning", "title":"Megan O'Brien (NET02) out sick", "detail":"Intel Lab P11 ($420K, 5 days left) loses its only assigned networking engineer with no qualified bench replacement." }
{ "severity":"info", "title":"3 engineers freed for redeployment", "detail":"INS02 (Dallas), INS07 (San Francisco), and NET08 (Las Vegas) became bench-available due to parts backorder." }

BAD briefingItems (NEVER do this — these are outline labels with empty details and severity baked into the title):
{ "severity":"info", "title":"NETWORKING BOTTLENECK — CRITICAL", "detail":"" }
{ "severity":"info", "title":"STRATEGIC OPTIONS", "detail":"" }
{ "severity":"info", "title":"ENGINEER AVAILABILITY & LOCATION", "detail":"" }

Respond ONLY with valid JSON, no markdown:
{
  "isBriefing": false,
  "analysis": "one sentence: what was asked and what you found",
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
      let parsed;
      try { parsed = JSON.parse(raw.replace(/```json|```/g,"").trim()); }
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
      display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>
      <Header scenarioId={scenarioId} atRisk={totalAtRisk} util={util}
        deployed={deployedCount} demoOpen={demoOpen} setDemoOpen={setDemoOpen}/>

      {/* View toggle */}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,
        padding:"5px 18px",display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
        {[{id:"board",l:"⊞ Project Board"},{id:"heatmap",l:"◉ Coverage Matrix"}].map(v=>(
          <button key={v.id} onClick={()=>setMainView(v.id)}
            style={{fontFamily:F,fontSize:10,fontWeight:700,letterSpacing:1.5,padding:"3px 11px",
              borderRadius:4,border:`1px solid ${mainView===v.id?C.accent:C.border}`,
              background:mainView===v.id?`${C.accent}22`:"transparent",
              color:mainView===v.id?C.accent:C.dim,cursor:"pointer"}}>
            {v.l}
          </button>
        ))}
        {/* Scenario builder button */}
        <button onClick={()=>setBuilderOpen(v=>!v)}
          style={{fontFamily:F,fontSize:10,fontWeight:700,letterSpacing:1.5,padding:"3px 11px",
            borderRadius:4,border:`1px solid ${builderOpen||hasCustom?C.accent:C.border}`,
            background:builderOpen||hasCustom?`${C.accent}22`:"transparent",
            color:builderOpen||hasCustom?C.accent:C.dim,cursor:"pointer"}}>
          ⊕ BUILD SCENARIO {hasCustom?"(custom active)":""}
        </button>
        <div style={{flex:1}}/>
        {/* Export button */}
        <button onClick={()=>setExportOpen(true)}
          style={{fontFamily:F,fontSize:10,fontWeight:700,letterSpacing:1.5,padding:"3px 11px",
            borderRadius:4,border:`1px solid ${C.border}`,
            background:"transparent",color:C.dim,cursor:"pointer"}}>
          ↗ EXPORT REPORT
        </button>
        <button onClick={()=>setAuditOpen(true)}
          style={{fontFamily:F,fontSize:10,fontWeight:700,letterSpacing:1.5,padding:"3px 11px",
            borderRadius:4,border:`1px solid ${auditLog.length>0?C.teal:C.border}`,
            background:auditLog.length>0?`${C.teal}18`:"transparent",
            color:auditLog.length>0?C.teal:C.dim,cursor:"pointer"}}>
          ◎ AUDIT {auditLog.length>0?`(${auditLog.length})`:""}
        </button>
      </div>

      {demoOpen&&<DemoPanel scenarioId={scenarioId} setScenarioId={id=>{setScenarioId(id);setCustomDisruptions({});setCustomFreed({});setCustomEarly({});setDemoOpen(false);}} onClose={()=>setDemoOpen(false)}/>}

      <div style={{display:"flex",flex:1,overflow:"hidden",position:"relative"}}>
        <Roster engineers={ENGINEERS} scenario={effectiveScenario} phaseAssign={phaseAssign} phaseComplete={phaseComplete}/>
        {mainView==="heatmap"?(
          <RiskHeatmap projects={activeProjects} phaseAssign={phaseAssign}
            phaseComplete={phaseComplete} scenario={effectiveScenario}
            onCellClick={f=>{setHeatmapFilter(f);setMainView("board");}}/>
        ):(
          <ProjectBoard projects={activeProjects} phaseAssign={phaseAssign}
            phaseComplete={phaseComplete} onMarkComplete={markPhaseComplete}
            heatmapFilter={heatmapFilter} onClearFilter={()=>setHeatmapFilter(null)}/>
        )}
        {/* Scenario builder panel (slide in from right) */}
        {builderOpen&&(
          <ScenarioBuilder
            baseScenario={baseScenario}
            customDisruptions={customDisruptions}
            customFreed={customFreed}
            customEarly={customEarly}
            onAddDisruption={(id,reason)=>{
              if(reason===null){
                setCustomDisruptions(prev=>{const n={...prev};delete n[id];return n;});
              } else {
                setCustomDisruptions(prev=>({...prev,[id]:reason}));
              }
              setResetKey(k=>k+1);
            }}
            onAddFreed={(id,reason)=>{
              if(reason===null){
                setCustomFreed(prev=>{const n={...prev};delete n[id];return n;});
              } else {
                setCustomFreed(prev=>({...prev,[id]:reason}));
              }
              setResetKey(k=>k+1);
            }}
            onAddEarly={(pid,days)=>{
              if(days===null){
                setCustomEarly(prev=>{const n={...prev};delete n[pid];return n;});
              } else {
                setCustomEarly(prev=>({...prev,[pid]:days}));
              }
            }}
            onClear={()=>{
              setCustomDisruptions({});setCustomFreed({});setCustomEarly({});
              setResetKey(k=>k+1);
            }}
            onClose={()=>setBuilderOpen(false)}/>
        )}
      </div>

      <CommandBar cmd={cmd} setCmd={setCmd} runCmd={runCmd} loading={loading} inputRef={inputRef}/>

      {preview&&<PreviewPanel preview={preview} onCommit={commitChange} onCancel={dismissPreview}
        phaseAssign={phaseAssign} phaseComplete={phaseComplete}/>}
      {commitResult&&<BeforeAfterPanel result={commitResult} onClose={()=>setCommitResult(null)}/>}
      {auditOpen&&<AuditPanel log={auditLog} onClose={()=>setAuditOpen(false)}/>}
      {exportOpen&&<ExportModal
        scenarioName={effectiveScenario.name}
        customActive={hasCustom}
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
