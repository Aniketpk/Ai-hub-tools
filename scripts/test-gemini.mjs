/**
 * Quick Gemini connectivity check (same SDK as Next.js).
 * Usage: node scripts/test-gemini.mjs
 * Loads GOOGLE_API_KEY from .env.local if present (no extra deps).
 */
import { readFileSync, existsSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { GoogleGenerativeAI } from "@google/generative-ai"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")
const envPath = resolve(root, ".env.local")

function loadEnvLocal() {
  if (!existsSync(envPath)) return
  const text = readFileSync(envPath, "utf8")
  for (const line of text.split("\n")) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const i = t.indexOf("=")
    if (i === -1) continue
    const key = t.slice(0, i).trim()
    let val = t.slice(i + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
}

loadEnvLocal()

const key = process.env.GOOGLE_API_KEY
if (!key) {
  console.error("Missing GOOGLE_API_KEY. Add it to .env.local in the project root.")
  process.exit(1)
}

const modelsToTry = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.5-pro",
]

const genAI = new GoogleGenerativeAI(key)

async function main() {
  let lastErr = null
  let sawQuota = false
  for (const modelName of modelsToTry) {
    try {
      console.log(`Trying model: ${modelName} …`)
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await model.generateContent("Reply with one word: pong")
      const text = (await result.response).text().trim()
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
        "(Two similar lines above are normal: the script tries gemini-2.0-flash-lite, then gemini-2.0-flash.)"
    )
    process.exit(0)
  }
  console.error("All models failed. Last error:", lastErr?.message || lastErr)
  process.exit(1)
}

main()
