import OpenAI from "openai"
import { readFile } from "fs/promises"
import path from "path"

export const runtime = "nodejs"

function getClient() {
    if (!process.env.OPENAI_API_KEY) return null
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

// Simple in-memory rate limiter to reduce runaway API costs.
// Notes: in-memory only (resets on process restart). For production
// use a shared store (Redis) or API gateway limits.
const rateLimitStore = new Map<string, { count: number; windowStart: number; lastRequest: number }>()
const MAX_PER_MINUTE = 10 // max requests per IP per minute
const COOLDOWN_MS = 1500 // minimum ms between consecutive requests from same IP
const MAX_PROMPT_CHARS = 20000 // max characters allowed in the final prompt

async function handleRequestWithPrompt(prompt: string) {
    const client = getClient()
    if (!client) throw new Error("OPENAI_API_KEY not set")

    const response = await client.responses.create({ model: "gpt-4o-mini", input: prompt })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyResp: any = response
    const text = anyResp.output_text ?? (anyResp.output?.[0]?.content?.map((c: any) => c.text).join("") ?? null)
    return { text: text ?? JSON.stringify(response), raw: response }
}

export async function GET() {
    try {
        const result = await handleRequestWithPrompt("Write a short haiku about AI.")
        return new Response(JSON.stringify({ text: result.text, output_text: result.text, raw: result.raw }), { status: 200, headers: { "Content-Type": "application/json" } })
    } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error("/api/chatbot GET error:", err)
        return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } })
    }
}

export async function POST(request: Request) {
    try {
        // Basic rate-limiting by IP to limit cost exposure
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown"
        const now = Date.now()
        let entry = rateLimitStore.get(ip)
        if (!entry) entry = { count: 0, windowStart: now, lastRequest: 0 }
        // reset per-minute window
        if (now - entry.windowStart > 60_000) {
            entry.count = 0
            entry.windowStart = now
        }
        // enforce cooldown between requests
        if (now - entry.lastRequest < COOLDOWN_MS) {
            const retryMs = COOLDOWN_MS - (now - entry.lastRequest)
            return new Response(JSON.stringify({ error: "Too many requests - slow down", retry_after_ms: retryMs }), { status: 429, headers: { "Content-Type": "application/json", "Retry-After": String(Math.ceil(retryMs / 1000)) } })
        }

        if (entry.count >= MAX_PER_MINUTE) {
            const retryAfterSec = Math.ceil((60_000 - (now - entry.windowStart)) / 1000)
            return new Response(JSON.stringify({ error: "Rate limit exceeded", retry_after_seconds: retryAfterSec }), { status: 429, headers: { "Content-Type": "application/json", "Retry-After": String(retryAfterSec) } })
        }

        // record this request
        entry.count += 1
        entry.lastRequest = now
        rateLimitStore.set(ip, entry)

        const client = getClient()
        if (!client) return new Response(JSON.stringify({ error: "OPENAI_API_KEY not set" }), { status: 500, headers: { "Content-Type": "application/json" } })

        const body = await request.json().catch(() => ({}))
        const prompt = body.prompt ?? body.message ?? "Hello"

        // By default, prepend the canonical chatbot prompt file so requests
        // include the website/resume context. Set `usePromptFile: false` in
        // the POST body to skip this behavior.
        let promptFileContent = ""
        try {
            const p = path.join(process.cwd(), "chatbot_data", "chatbot_prompt.txt")
            promptFileContent = await readFile(p, "utf8")
        } catch (e) {
            // ignore if file missing; we still proceed with the provided prompt
        }

        const finalPrompt = (body.usePromptFile === false)
            ? String(prompt)
            : `${promptFileContent ? promptFileContent + "\n\n" : ""}${String(prompt)}`

        // guard prompt size to avoid huge token usage
        if (String(finalPrompt).length > MAX_PROMPT_CHARS) {
            return new Response(JSON.stringify({ error: "Prompt too long", max_chars: MAX_PROMPT_CHARS }), { status: 400, headers: { "Content-Type": "application/json" } })
        }

        const result = await handleRequestWithPrompt(String(finalPrompt))
        return new Response(JSON.stringify({ text: result.text, output_text: result.text, raw: result.raw, sent_prompt: finalPrompt }), { status: 200, headers: { "Content-Type": "application/json" } })
    } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error("/api/chatbot POST error:", err)
        return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } })
    }
}

