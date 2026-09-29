/**
 * Quick Gemini connectivity check (same SDK as Next.js).
 * Usage: node scripts/test-gemini.mjs
 * Loads GOOGLE_API_KEY from .env.local if present (no extra deps).
 */
import { readFileSync, existsSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const backendDir = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const envPath = resolve(backendDir, ".env")
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const value = line.trim()
    if (!value || value.startsWith("#")) continue
    const separator = value.indexOf("=")
    if (separator > 0) process.env[value.slice(0, separator).trim()] ||= value.slice(separator + 1).trim().replace(/^['\"]|['\"]$/g, "")
  }
}

const key = process.env.GOOGLE_API_KEY
if (!key) {
  console.error("Missing GOOGLE_API_KEY. Set it in backend/.env or the environment.")
  process.exit(1)
}

const modelsToTry = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.5-pro",
]



async function main() {
  let lastErr = null
  let sawQuota = false
  for (const modelName of modelsToTry) {
    try {
      console.log(`Trying model: ${modelName} …`)
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: "Reply with one word: pong" }] }] }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error?.message || `HTTP ${response.status}`)
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ""
      console.log(`OK — ${modelName} responded: ${text.slice(0, 200)}`)
      process.exit(0)
    } catch (e) {
      lastErr = e
      const msg = e?.message || String(e)
      if (msg.includes("429") || msg.includes("quota") || msg.includes("Quota")) {
        sawQuota = true
        console.warn(`  ${modelName}: rate limit / quota (key is accepted by Google).`)
      } else {
        console.warn(`  ${modelName} failed:`, msg.split("\n")[0])
      }
    }
  }
  if (sawQuota) {
    console.log(
      "\nResult: GOOGLE_API_KEY is valid. Google returned quota / rate limits (not an auth error).\n" +
        "Wait a minute and retry, reduce calls, or enable billing in Google AI Studio / Cloud console.\n" +
        "See: https://ai.google.dev/gemini-api/docs/rate-limits\n\n" +
        "The script tries several supported Gemini model names."
    )
    process.exit(0)
  }
  console.error("All models failed. Last error:", lastErr?.message || lastErr)
  process.exit(1)
}

main()
