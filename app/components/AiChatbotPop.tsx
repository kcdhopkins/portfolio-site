"use client"

import React, { useState, useRef, useEffect } from "react"

export type Message = { role: "bot" | "user"; text: string }

type Props = {
    messages: Message[]
    onSend: (text: string) => void | Promise<void>
}

export default function AiChatbotPop({ messages, onSend }: Props): JSX.Element {
    const [message, setMessage] = useState<string>("")
    const [collapsed, setCollapsed] = useState<boolean>(false)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const endRef = useRef<HTMLDivElement | null>(null)

    const handleSend = () => {
        const trimmed = message.trim()
        if (!trimmed) return
        setMessage("")
        onSend(trimmed)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSend()
    }

    useEffect(() => {
        // scroll to bottom when messages change
        try {
            endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
        } catch (e) {
            if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [messages.length])

    // If collapsed, show a circular restore button in the same corner.
    if (collapsed) {
        return (
            <button
                onClick={() => setCollapsed(false)}
                aria-label="Open AI chat"
                title="Open AI chat"
                className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full border border-zinc-300 bg-white flex items-center justify-center shadow-2xl"
            >
                <span className="sr-only">Open AI chat</span>
                {/* circle with chat icon inside */}
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-zinc-900" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            </button>
        )
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-[340px] max-w-[90vw] rounded-[28px] border border-zinc-300 bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 border-b border-zinc-300 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-zinc-900" />
                <h2 className="text-base font-semibold text-zinc-900">AI Assistant</h2>
                <div className="ml-auto flex items-center gap-2">
                    <button
                        onClick={() => setCollapsed(true)}
                        aria-label="Minimize chat"
                        title="Minimize chat"
                        className="h-8 w-8 rounded-full flex items-center justify-center border border-zinc-200 bg-white hover:bg-zinc-50"
                    >
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-zinc-700" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M5 12h14" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex h-[420px] flex-col px-4 py-4">
                <div className="flex-1 space-y-3 overflow-y-auto pr-1" ref={containerRef}>
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                                    msg.role === "user" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-900"
                                }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={endRef} />
                </div>

                <div className="mt-4 flex items-end gap-2">
                    <div className="flex-1 rounded-2xl border border-zinc-300 bg-white px-4 py-3 shadow-sm">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                        />
                    </div>

                    <button
                        onClick={handleSend}
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-300 bg-white shadow-sm transition hover:bg-zinc-100"
                        aria-label="Send message"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-5 w-5 text-zinc-900"
                        >
                            <path d="M22 2L11 13" />
                            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

