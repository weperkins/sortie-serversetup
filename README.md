# Sortie · Server Setup

AI-powered workforce deployment intelligence for enterprise server installations.

A portfolio demonstration of an AI-assisted decision engine for specialized field operations. The scenario: a fictional company that delivers, installs, and commissions enterprise server infrastructure at colocation data centers for large enterprise customers. The tool manages a team of specialized engineers across a pipeline of multi-phase projects (Delivery → Installation → Networking), surfacing revenue risk and providing AI-assisted reassignment recommendations.

**Live demo:** https://sortie-serversetup.vercel.app

## Tech Stack

- React 18 + Vite
- Vercel serverless API proxy (`api/chat.js`) with rate limiting and input guards
- Claude Haiku 4.5 via the Anthropic Messages API

## Local Development

```bash
npm install
vercel dev    # localhost:3000, AI proxy works
```

For UI-only development without the AI:

```bash
npm run dev   # localhost:5173, AI calls will fail (proxy not running on Vite)
```

## Environment Variables

Create `.env.local` (see `.env.example`):

```
ANTHROPIC_API_KEY=sk-ant-...
```

For the deployed site, set the same variable in the Vercel dashboard under **Settings → Environment Variables**.

## Deployment

Push to GitHub. Vercel auto-redeploys on push.

## Demo Script

Open in **PEAK DEMAND** scenario, then walk through:

1. Switch to **Coverage Matrix** to see the networking bottleneck
2. Click the red Networking cell to filter the project board
3. Type *"What's my exposure?"* for a phase-aware briefing
4. Type *"Who can cover United Airlines networking?"* for a reassignment recommendation with cert match, travel band, and tradeoff
5. **COMMIT** to see the Before/After revenue panel and audit trail

## Notes

All project data is fictional. Enterprise customer names are used as realistic deployment examples only and do not represent actual customer relationships.
