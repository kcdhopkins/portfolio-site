export const runtime = "nodejs"

export async function GET() {
  try {
    const hasMongoPassword = !!process.env.MONGODB_PASSWORD
    const hasMongoTemplate = !!process.env.MONGODB_URI_TEMPLATE
    const hasOpenAI = !!process.env.OPENAI_API_KEY
    return new Response(JSON.stringify({ hasMongoPassword, hasMongoTemplate, hasOpenAI }), { status: 200, headers: { "Content-Type": "application/json" } })
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error("/api/_env-check error:", e)
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { "Content-Type": "application/json" } })
  }
}
