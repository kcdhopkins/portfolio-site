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
                            // navigate
                            router.push(parsed.href)
                            return
                        }
                    }
                }
            } catch (e) {
                // ignore JSON parse errors and fall back to showing full reply
            }

            setMessages((prev) => [...prev, { role: "bot", text: String(reply) }])
        } catch (err) {
            console.error("Error generating AI response:", err)
            setMessages((prev) => [...prev, { role: "bot", text: "Sorry, I couldn't get a response right now." }])
        }
    }

    return (
        <div className="chabot-root">
            <AiChatbotPop messages={messages} onSend={handleSend} />
        </div>
    )
}
