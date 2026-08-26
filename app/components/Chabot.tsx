"use client"

import React, { JSX, useEffect, useState } from "react"
import AiChatbotPop, { Message } from "./AiChatbotPop"
import { useRouter } from "next/navigation"

export default function Chabot(): JSX.Element {
    const router = useRouter()
    const [promptText, setPromptText] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([
        { role: "bot", text: "Hello, is there anything I can help you with related to Keyairius?" },
    ])
    const [isSending, setIsSending] = useState<boolean>(false)

    // Return stored user id if present, otherwise null. Server will create id on first POST.
    function getOrCreateUserId(): string | null {
        try {
            const id = localStorage.getItem("kj_user_id")
            return id ?? null
        } catch (e) {
            return null
        }
    }

    async function saveMessagesToDb(id: string | null, msgs: Message[] | any) {
        try {
            let body: any = {}
            if (id) body.id = id

            // If msgs looks like an array of role/text messages, convert to paired format
            if (Array.isArray(msgs) && msgs.length >= 2 && msgs[0].role && msgs[1].role) {
                const userMsg = msgs.find((m: any) => m.role === "user")
                const botMsg = msgs.find((m: any) => m.role === "bot")
                const pair = { bot: botMsg?.text ?? "", user: userMsg?.text ?? "", timestamp: new Date().toISOString() }
                body.messages = [pair]
            } else if (Array.isArray(msgs) && msgs.length > 0 && msgs[0].bot !== undefined) {
                // already paired array
                body.messages = msgs
            } else if (msgs && msgs.bot !== undefined) {
                body.messages = [msgs]
            } else {
                body.messages = []
            }

            // debug: log outgoing conversation POST
            // eslint-disable-next-line no-console
            console.debug("POST /api/conversations ->", body)
            const res = await fetch("/api/conversations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })

            const text = await res.text().catch(() => "")
            let data: any = {}
            try {
                data = text ? JSON.parse(text) : {}
            } catch (e) {
                data = { raw: text }
            }
            // debug: log response
            // eslint-disable-next-line no-console
            console.debug("/api/conversations response ->", res.status, data)

            if (!res.ok) {
                // surface server error to client console
                // eslint-disable-next-line no-console
                console.error("/api/conversations returned error:", res.status, data)
                return
            }
            // Prefer storing the database _id if returned (canonical DB identifier)
            const dbId = data?.conversation?._id ?? data?.id
            if (dbId) {
                try {
                    localStorage.setItem("kj_user_id", String(dbId))
                } catch (e) {
                    // ignore storage errors
                }
            }
        } catch (e) {
            // ignore DB errors for now
            console.error("Failed saving conversation:", e)
        }
    }

    async function handleSend(userText: string) {
        // build a transcript including prior messages and the new user message
        const transcriptParts: string[] = []
        if (promptText) transcriptParts.push(promptText)
        messages.forEach((m) => {
            const speaker = m.role === "user" ? "User" : "Assistant"
            transcriptParts.push(`${speaker}: ${m.text}`)
        })
        transcriptParts.push(`User: ${userText}`)
        transcriptParts.push("Assistant:")

        // append user message to UI immediately
        setMessages((prev) => [...prev, { role: "user", text: userText }])
        setIsSending(true)

        try {
            const body = { prompt: transcriptParts.join("\n\n") }

            const res = await fetch("/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })

            const data = await res.json()
            // prefer `text` field returned by route
            let reply = data?.text ?? data?.output_text ?? JSON.stringify(data)

            // Try to parse a leading JSON action on the first line.
            // Expected action shape: {"action":"navigate","href":"/about"}
            try {
                const textStr = String(reply)
                const lines = textStr.split("\n")
                const first = lines[0].trim()
                if (first.startsWith("{")) {
                    const parsed = JSON.parse(first)
                    if (parsed?.action === "navigate" && typeof parsed.href === "string") {
                        // whitelist allowed internal routes
                        const allowed = ["/", "/about", "/technology"]
                        if (allowed.includes(parsed.href)) {
                            // remove the JSON line from assistant text
                            const remaining = lines.slice(1).join("\n").trim()
                            const botText = remaining || `Opening ${parsed.href}`
                            setMessages((prev) => [...prev, { role: "bot", text: botText }])
                            // persist the two newest messages (user + assistant)
                            const id = getOrCreateUserId()
                            await saveMessagesToDb(id, [
                                { role: "user", text: userText },
                                { role: "bot", text: botText },
                            ])
                            // navigate
                            router.push(parsed.href)
                            return
                        }
                    }
                }
            } catch (e) {
                // ignore JSON parse errors and fall back to showing full reply
            }

            const replyText = String(reply)
            setMessages((prev) => [...prev, { role: "bot", text: replyText }])

            // persist the new user + bot pair to DB
            try {
                const id = getOrCreateUserId()
                await saveMessagesToDb(id, [
                    { role: "user", text: userText },
                    { role: "bot", text: replyText },
                ])
            } catch (e) {
                // swallow
            }
        } catch (err) {
            console.error("Error generating AI response:", err)
            setMessages((prev) => [...prev, { role: "bot", text: "Sorry, I couldn't get a response right now." }])
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="chabot-root">
            <AiChatbotPop messages={messages} onSend={handleSend} isSending={isSending} />
        </div>
    )
}
