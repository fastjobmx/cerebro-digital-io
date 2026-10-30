/**
 * Runtime environment validation.
 * Fails fast in dev if required VITE_* vars are misconfigured.
 */

const REQUIRED_VARS = [
  // Add keys that MUST be present at runtime (e.g. 'VITE_API_URL').
  // Currently empty: all VITE_* vars have safe defaults in site.ts.
] as const

export function validateEnv(): void {
  if (import.meta.env.PROD) return // Skip in production; defaults handle missing vars

  const missing: string[] = []
  for (const key of REQUIRED_VARS) {
    if (!import.meta.env[key]) missing.push(key)
  }

  if (missing.length > 0) {
    console.error(
      `[cerebro] Missing required env vars: ${missing.join(', ')}. ` +
        'Check .env and restart the dev server.',
    )
  }

  // Warn if AI is enabled but no backend key hint exists (server-side only, so just informational)
  if (import.meta.env.VITE_AI_ENABLED === 'true') {
    console.info('[cerebro] AI mode enabled — ensure /api/chat is deployed with ANTHROPIC_API_KEY.')
  }
}