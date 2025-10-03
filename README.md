# Fantasy Story Generator

A React + TypeScript + Vite app that generates short fantasy stories using OpenRouter models.

## Local Development

- Requirements: Node 18+, npm
- Install dependencies: `npm install`
- Create `.env` with your local key (not committed):
  - `VITE_OPENROUTER_API_KEY=your_key_here`
- Start dev server: `npm run dev`

## Free Hosting (no key leak)

The app uses a backend proxy in production so your OpenRouter API key is never exposed to the browser.

### Deploy on Cloudflare Pages + Functions (Workers)

1. Push this repo to GitHub.
2. In Cloudflare, create a Pages project from your repo.
3. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Functions:
   - Ensure the `functions/` directory is included (this repo has `functions/api/generate.ts`).
   - Cloudflare automatically deploys it to `/api/generate`.
5. Environment variables:
   - Add `OPENROUTER_API_KEY` with your OpenRouter key in Pages → Settings → Environment Variables.
6. Deploy. In production, the frontend calls `/api/generate` which forwards to OpenRouter using your secret.

### How it stays private

- In production, the browser sends prompts to `/api/generate` only.
- The serverless function uses `process.env.OPENROUTER_API_KEY` (managed in Vercel) to talk to OpenRouter.
- No client-side key is shipped in your build, so your key is safe.

## Notes

- In development, the app calls OpenRouter directly using `.env` for convenience.
- In production (Pages/Workers), it switches to the `/api/generate` proxy automatically.
