"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaGraduationCap } from "react-icons/fa6";
import { X, Send, Loader2 } from "lucide-react";
import { chatAPI } from "../../../../../lib/chatApi";

type Message = { role: "bot" | "user"; content: string };

// ─── Markdown → HTML renderer (no external deps) ─────────────────────────────
function renderMarkdown(text: string): string {
    const lines = text.split("\n");
    const html: string[] = [];
    let inList = false;
    let inOrderedList = false;

    const closeOpenLists = () => {
        if (inList)        { html.push("</ul>"); inList = false; }
        if (inOrderedList) { html.push("</ol>"); inOrderedList = false; }
    };

    const inlineFormat = (line: string) =>
        line
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.+?)\*/g,     "<em>$1</em>")
            .replace(/_(.+?)_/g,       "<em>$1</em>")
            .replace(/`(.+?)`/g,       '<code class="bg-gray-100 text-slate-800 px-1 py-0.5 rounded text-[12px] font-mono">$1</code>');

    for (const raw of lines) {
        const line = raw.trimEnd();

        if (/^---+$/.test(line.trim())) {
            closeOpenLists();
            html.push('<hr class="border-gray-200 my-1" />');
            continue;
        }

        const h1 = line.match(/^#\s+(.+)/);
        const h2 = line.match(/^##\s+(.+)/);
        const h3 = line.match(/^###\s+(.+)/);
        if (h3) { closeOpenLists(); html.push(`<p class="font-medium text-[12.5px] mt-1.5 mb-0.5">${inlineFormat(h3[1])}</p>`); continue; }
        if (h2) { closeOpenLists(); html.push(`<p class="font-semibold text-[13px] mt-2 mb-0.5">${inlineFormat(h2[1])}</p>`); continue; }
        if (h1) { closeOpenLists(); html.push(`<p class="font-bold text-[14px] mt-2 mb-0.5">${inlineFormat(h1[1])}</p>`); continue; }

        const bullet = line.match(/^[\*\-]\s+(.+)/);
        if (bullet) {
            if (inOrderedList) { html.push("</ol>"); inOrderedList = false; }
            if (!inList) { html.push('<ul class="list-none space-y-0.5 ml-0 my-1">'); inList = true; }
            html.push(`<li class="flex gap-1.5 items-start"><span class="text-slate-400 mt-0.5 shrink-0">•</span><span>${inlineFormat(bullet[1])}</span></li>`);
            continue;
        }

        const numbered = line.match(/^(\d+)\.\s+(.+)/);
        if (numbered) {
            if (inList) { html.push("</ul>"); inList = false; }
            if (!inOrderedList) { html.push('<ol class="list-none space-y-0.5 ml-0 my-1">'); inOrderedList = true; }
            html.push(`<li class="flex gap-1.5 items-start"><span class="text-slate-500 font-medium shrink-0 min-w-[16px]">${numbered[1]}.</span><span>${inlineFormat(numbered[2])}</span></li>`);
            continue;
        }

        if (line.trim() === "") {
            closeOpenLists();
            html.push('<div class="h-1.5"></div>');
            continue;
        }

        closeOpenLists();
        html.push(`<p class="leading-relaxed">${inlineFormat(line)}</p>`);
    }

    closeOpenLists();
    return html.join("");
}
// ─────────────────────────────────────────────────────────────────────────────

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "bot", content: "Hello! I am your AI assistant. I can help you with campus rules, outpass policies, your academic schedule, and navigating the university. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | undefined>(undefined);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setIsLoading(true);
        try {
            const data = await chatAPI.sendMessage(userMsg, sessionId);
            setMessages(prev => [...prev, { role: "bot", content: data.answer }]);
            if (data.sessionId && !sessionId) setSessionId(data.sessionId);
        } catch (err: any) {
            setMessages(prev => [...prev, { role: "bot", content: `Error: ${err.message || "Network error. Is the chat-service running?"}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") { e.preventDefault(); handleSend(); }
    };

    return (
        <>
            {/* Trigger Button */}
            <div className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center">
                {!isOpen && (
                    <>
                        <div className="absolute h-full w-full animate-ping rounded-[18px] bg-black opacity-20 dark:bg-white" style={{ animationDuration: '3s' }} />
                        <div className="absolute h-[115%] w-[115%] animate-pulse rounded-[20px] bg-gray-400 opacity-20 dark:bg-gray-300" style={{ animationDuration: '3s', animationDelay: '1s' }} />
                    </>
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative z-10 flex h-full w-full items-center justify-center rounded-[18px] bg-black text-white shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-gray-800 transition-all duration-300 hover:scale-105 active:scale-95 dark:bg-white dark:text-black dark:border-gray-200"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <FaGraduationCap className="h-7 w-7 drop-shadow-sm" />}
                </button>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-28 right-8 z-50 flex h-[550px] w-[380px] origin-bottom-right flex-col overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:border-zinc-800 dark:bg-zinc-950 animate-in zoom-in-95 fade-in-0 slide-in-from-bottom-5">

                    {/* Header */}
                    <div className="flex items-center justify-between bg-black px-6 py-5 text-white dark:bg-white dark:text-black">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white/10 dark:bg-black/10 backdrop-blur-md">
                                <FaGraduationCap className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold tracking-wide">Bridget</h3>
                                <p className="text-xs text-gray-400 dark:text-gray-500">AI Campus Assistant</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="rounded-full bg-white/10 dark:bg-black/10 p-2 hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto bg-gray-50 p-5 dark:bg-zinc-900/50 flex flex-col gap-3">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[88%] rounded-[20px] px-4 py-3 text-[13px] shadow-sm border ${
                                    msg.role === "user"
                                        ? "rounded-tr-sm bg-black text-white border-black dark:bg-white dark:text-black dark:border-white leading-relaxed"
                                        : "rounded-tl-sm bg-white text-gray-800 border-gray-100 dark:bg-zinc-900 dark:text-gray-200 dark:border-zinc-800"
                                }`}>
                                    {msg.role === "user"
                                        ? msg.content
                                        : <div
                                            className="space-y-0"
                                            dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                                          />
                                    }
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex w-full justify-start">
                                <div className="rounded-[20px] rounded-tl-sm bg-white px-4 py-3 shadow-sm border border-gray-100 dark:bg-zinc-900 dark:border-zinc-800 flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                    <span className="text-[12px] text-gray-400">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                                placeholder="Ask me anything..."
                                className="w-full rounded-[16px] bg-gray-100 py-3.5 pl-5 pr-12 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-black transition-all dark:bg-zinc-900 dark:text-white dark:focus:bg-zinc-800 dark:focus:ring-white border border-transparent focus:border-gray-300 dark:focus:border-zinc-700 disabled:opacity-50"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-[12px] bg-black text-white dark:bg-white dark:text-black transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                            >
                                <Send className="h-4 w-4 ml-0.5" />
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </>
    );
}
