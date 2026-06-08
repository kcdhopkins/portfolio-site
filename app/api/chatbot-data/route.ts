import { readFile } from "fs/promises"
import path from "path"

export const runtime = "nodejs"

export async function GET() {
    try {
        const p = path.join(process.cwd(), "chatbot_data", "chatbot_prompt.txt")
        const content = await readFile(p, "utf8")

        return new Response(JSON.stringify({ prompt: content }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        })
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error("/api/chatbot-data error:", err)
        return new Response(JSON.stringify({ error: String(err) }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        })
    }
}
