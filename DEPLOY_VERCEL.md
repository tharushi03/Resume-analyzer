Vercel Deployment Guide
----------------------

Quick steps to deploy this static site to Vercel with a secure AI proxy:

1. Create a Vercel account and a new project connected to this repository.

2. Add server environment variables in the Vercel project settings:
   - `OPENAI_API_KEY` — your OpenAI API key (only if using OpenAI)
   - `GOOGLE_API_KEY` — Google API key (if using Google provider)
   - `HUGGINGFACE_API_KEY` — HuggingFace token (if using HF provider)

3. Configure `config.js` for production run (client-side):
   - Set `AI_CONFIG.ENABLED` to `true` if you want AI enabled.
   - Leave `AI_CONFIG.API_KEY` blank (do NOT put real keys in client files).
   - Set `AI_CONFIG.USE_PROXY` to `true`.
   - Confirm `AI_CONFIG.PROXY_ENDPOINT` is `/api/ai-proxy` (default).

4. Deploy to Vercel. The client will call `/api/ai-proxy` serverless function,
   which forwards requests to the provider using the secret key stored in
   Vercel environment variables. This prevents exposing your API key.

Notes & security
- Do NOT commit real API keys to this repo.
- For local development you can create a `config.local.js` (gitignored)
  that overrides `AI_CONFIG.API_KEY` for quick testing.
- The proxy supports OpenAI, Google Gemini and HuggingFace; ensure the
  corresponding env var is set for the provider you plan to use.

Optional improvements
- Add rate-limiting / auth to `/api/ai-proxy` for production safety.
- Add usage logging and request validation in the proxy.
