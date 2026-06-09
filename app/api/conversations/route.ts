import { getDb } from "../../../lib/mongodb"
import { ObjectId } from "mongodb"

export const runtime = "nodejs"

type IncomingMessage = { role: "bot" | "user"; text: string }
type MessagePair = { bot: string; user: string; timestamp?: Date | string }

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    let id: string = body.id
    const raw = body.messages

    if (!raw || raw.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided" }), { status: 400, headers: { "Content-Type": "application/json" } })
    }

    const db = await getDb()
    const col = db.collection("conversations")

    const pairs: MessagePair[] = []

    // If client sent pairs {bot,user}, use directly
    if (Array.isArray(raw) && raw.length > 0 && raw[0] && typeof raw[0] === "object" && (raw[0].bot !== undefined || raw[0].user !== undefined)) {
      for (const p of raw) {
        pairs.push({ bot: p.bot ?? "", user: p.user ?? "", timestamp: p.timestamp ?? new Date() })
      }
    } else {
      // Otherwise expect interleaved messages [{role:user,text},{role:bot,text}, ...]
      const msgs: IncomingMessage[] = Array.isArray(raw) ? raw : []
      for (let i = 0; i < msgs.length; i += 2) {
        const userMsg = msgs[i]
        const botMsg = msgs[i + 1]
        if (!userMsg || !botMsg) continue
        const userText = userMsg.role === "user" ? userMsg.text : ""
        const botText = botMsg.role === "bot" ? botMsg.text : ""
        pairs.push({ bot: botText, user: userText, timestamp: new Date() })
      }
    }

    if (pairs.length === 0) {
      return new Response(JSON.stringify({ error: "No valid message pairs provided" }), { status: 400, headers: { "Content-Type": "application/json" } })
    }

    const toInsert = pairs.map((p) => ({ bot: p.bot, user: p.user, timestamp: p.timestamp instanceof Date ? p.timestamp : (p.timestamp ? new Date(p.timestamp) : new Date()) }))

    // If client provided an id, try to update the matching document (prefer _id)
    if (id) {
      let filter: any
      try {
        filter = { _id: new ObjectId(id) }
      } catch (e) {
        filter = { id }
      }

      // Upsert so we create the conversation if the provided id doesn't match an existing doc
      const update = { $push: { messages: { $each: toInsert } }, $setOnInsert: { createdAt: new Date(), id } }
      const res = await col.updateOne(filter, update, { upsert: true })
      // debug: log update result
      // eslint-disable-next-line no-console
      console.debug("/api/conversations updateOne result:", res)
      const doc = await col.findOne(filter)
      return new Response(JSON.stringify({ id, conversation: doc }), { status: 200, headers: { "Content-Type": "application/json" } })
    }

    // No id provided: create a new conversation document and return its _id
    const insertRes = await col.insertOne({ messages: toInsert, createdAt: new Date() })
    // debug log insert result
    // eslint-disable-next-line no-console
    console.debug("/api/conversations insertedId:", insertRes.insertedId)
    // Ensure we query by ObjectId string to avoid type mismatches
    let doc = null
    try {
      doc = await col.findOne({ _id: new ObjectId(String(insertRes.insertedId)) })
    } catch (e) {
      // fallback: try using insertedId directly
      // eslint-disable-next-line no-console
      console.debug("/api/conversations findOne fallback, error:", e)
      doc = await col.findOne({ _id: insertRes.insertedId })
    }
    // debug log found doc
    // eslint-disable-next-line no-console
    console.debug("/api/conversations found doc:", doc)
    return new Response(JSON.stringify({ id: String(insertRes.insertedId), conversation: doc }), { status: 200, headers: { "Content-Type": "application/json" } })
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error("/api/conversations POST error:", err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } })
  }
}
