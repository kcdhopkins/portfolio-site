import OpenAI from "openai"
import { readFile } from "fs/promises"
import path from "path"

export const runtime = "nodejs"

function getClient() {
    if (!process.env.OPENAI_API_KEY) return null
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

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

        const result = await handleRequestWithPrompt(String(finalPrompt))
        return new Response(JSON.stringify({ text: result.text, output_text: result.text, raw: result.raw, sent_prompt: finalPrompt }), { status: 200, headers: { "Content-Type": "application/json" } })
    } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error("/api/chatbot POST error:", err)
        return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } })
    }
}

