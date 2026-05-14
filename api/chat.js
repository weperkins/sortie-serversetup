// Simple in-memory rate limiter (resets on cold start — fine for demo scale)
const ipHits = new Map();
const WINDOW_MS     = 60_000; // 1 minute
const MAX_PER_WINDOW = 20;    // 20 requests per IP per minute

// Daily aggregate cap — soft second-layer spend guard. Sized so that, even if a
// single bad actor maxes it out every day at the per-request worst-case cost,
// monthly spend stays below ~$300 at current Haiku 4.5 pricing. Env-var override
// (DAILY_REQUEST_CAP in Vercel) lets us dial without redeploying.
//
// Caveats: counter is in-memory and resets on cold start, so this is approximate;
// Vercel may spin multiple function instances under load, each with its own
// counter. The HARD ceiling is the org-level spend cap in the Anthropic console.
const DAILY_CAP = parseInt(process.env.DAILY_REQUEST_CAP || '1200', 10);
const DAY_MS = 24 * 60 * 60 * 1000;
let dailyState = { count: 0, windowStart: Date.now() };

function checkDailyCap() {
  const now = Date.now();
  if (now - dailyState.windowStart > DAY_MS) {
    dailyState = { count: 0, windowStart: now };
  }
  dailyState.count++;
  return dailyState.count > DAILY_CAP;
}

// Vercel function config: extend the default 10s timeout. Hypothetical-reasoning
// queries with the expanded system prompt (region/airport mapping, mode routing,
// briefingItem examples) can push Haiku 4.5 past 10s on cold starts and complex
// asks like "ORD is closed for 3 days — reallocate the team". 30s is well within
// Hobby tier limits and well above observed worst-case latency.
export const config = {
  maxDuration: 30,
};

function isRateLimited(ip) {
  const now = Date.now();
  const entry = ipHits.get(ip) || { count: 0, windowStart: now };
  if (now - entry.windowStart > WINDOW_MS) {
    ipHits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count++;
  ipHits.set(ip, entry);
  return entry.count > MAX_PER_WINDOW;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  // Rate limit by IP
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests — please wait a moment.' });
  }

  // Guard: command must be non-empty and under 1200 chars
  const userMsg = req.body?.messages?.[0]?.content || '';
  if (typeof userMsg !== 'string' || userMsg.trim().length === 0) {
    return res.status(400).json({ error: 'Empty command.' });
  }
  if (userMsg.length > 1200) {
    return res.status(400).json({ error: 'Command too long for demo mode (max 1200 characters).' });
  }

  // Guard: only allow our expected model
  const allowedModels = ['claude-haiku-4-5-20251001', 'claude-haiku-4-5'];
  if (!allowedModels.includes(req.body?.model)) {
    return res.status(400).json({ error: 'Model not permitted.' });
  }

  // Daily aggregate cap — refuse before spending if we've hit the soft budget.
  // Returns 429 so the frontend's existing rate-limit error path renders cleanly.
  if (checkDailyCap()) {
    return res.status(429).json({ error: 'Daily demo usage cap reached — please try again tomorrow.' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Upstream API error', detail: err.message });
  }
}
