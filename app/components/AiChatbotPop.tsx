"use client"

import React, { useState, useRef, useEffect } from "react"

export type Message = { role: "bot" | "user"; text: string }

type Props = {
    messages: Message[]
    onSend: (text: string) => void | Promise<void>
    isSending?: boolean
}

export default function AiChatbotPop({ messages, onSend, isSending = false }: Props): React.ReactElement {
    const [message, setMessage] = useState<string>("")
    // start minimized, then automatically open after 5 seconds
    const [collapsed, setCollapsed] = useState<boolean>(true)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const endRef = useRef<HTMLDivElement | null>(null)

    const trimmed = message.trim()

    const handleSend = () => {
        if (!trimmed || isSending) return
        setMessage("")
        onSend(trimmed)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSend()
    }

    useEffect(() => {
        // scroll to bottom when messages change (or the typing indicator appears)
        try {
            endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
        } catch (e) {
            if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [messages.length, isSending])

    // Auto-open chat 5s after mount if it's still collapsed
    useEffect(() => {
        const timer = setTimeout(() => {
            setCollapsed(false)
        }, 5000)
        return () => clearTimeout(timer)
    }, [])

    // If collapsed, show a circular restore button in the same corner.
    if (collapsed) {
        return (
            <button
                onClick={() => setCollapsed(false)}
                aria-label="Open AI chat"
                title="Open AI chat"
                className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5 hover:shadow-cyan-500/50"
            >
                <span className="sr-only">Open AI chat</span>
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                </span>
                {/* circle with chat icon inside */}
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-slate-950" fill="none" stroke="currentColor" strokeWidth={1.75}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            </button>
        )
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-[340px] max-w-[90vw] overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950/95 shadow-2xl shadow-black/50 backdrop-blur">
            <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-bold text-slate-950">
                    AI
                </span>
                <div className="min-w-0">
                    <h2 className="text-sm font-semibold text-slate-100">AI Assistant</h2>
                    <p className="truncate text-xs text-slate-500">Ask about Keyairius&rsquo; experience</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <button
                        onClick={() => setCollapsed(true)}
                        aria-label="Minimize chat"
                        title="Minimize chat"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition hover:border-cyan-400 hover:text-cyan-300"
                    >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
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
                                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${msg.role === "user"
                                        ? "bg-gradient-to-r from-blue-500 to-cyan-400 font-medium text-slate-950"
                                        : "bg-slate-800/80 text-slate-100"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isSending && (
                        <div className="flex justify-start">
                            <div className="flex items-center gap-1 rounded-2xl bg-slate-800/80 px-4 py-3">
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                            </div>
                        </div>
                    )}
                    <div ref={endRef} />
                </div>

                <div className="mt-4 flex items-end gap-2">
                    <div className="flex-1 rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 transition focus-within:border-cyan-400">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                        />
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!trimmed || isSending}
                        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 shadow-sm transition hover:shadow-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none"
                        aria-label="Send message"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5 text-slate-950"
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
