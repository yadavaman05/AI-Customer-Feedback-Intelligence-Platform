"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/page-header";
import Card from "@/components/ui/card";

import Button from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { Send, Sparkles, MessageSquare } from "lucide-react";
import { ChatMessage } from "@/types/feedback";

export default function AskLoopPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "m-1",
            sender: "loop",
            text: "Hello! I am LOOP AI. Ask me anything about your product feedback. For example: 'What are the main complaints about the billing page?' or 'How is our mobile performance?'",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            sender: "user",
            text: inputValue,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, userMessage]);
        const query = inputValue.toLowerCase();
        setInputValue("");
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            let responseText = "";
            if (query.includes("billing") || query.includes("complaint") || query.includes("error")) {
                responseText = "According to recent feedback, the billing page has a 500 error when downloading invoice PDFs. This was reported by Alice Vance (alice@vancetech.io) and is flagged as a high-severity bug.";
            } else if (query.includes("performance") || query.includes("slow") || query.includes("mobile")) {
                responseText = "Mobile users are reporting page widget script load times taking up to 4.2 seconds. This is causing friction for mobile onboarding.";
            } else if (query.includes("webhook") || query.includes("slack") || query.includes("teams")) {
                responseText = "Sophie Dupont requested custom MS Teams webhooks integration, as they are migrating away from Slack. This is categorized as a feature request with a confidence rating of 89%.";
            } else {
                responseText = "I see 1,248 feedback items in your sandbox workspace. 21.4% has negative sentiment, mostly centering on bugs in the billing flow and mobile performance. How else can I assist you?";
            }

            const loopResponse: ChatMessage = {
                id: `msg-${Date.now() + 1}`,
                sender: "loop",
                text: responseText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            setMessages((prev) => [...prev, loopResponse]);
            setIsTyping(false);
        }, 1200);
    };

    return (
        <div className="space-y-6 flex flex-col h-[calc(100vh-8.5rem)] md:h-[calc(100vh-10rem)]">
            <PageHeader
                title="Ask LOOP AI"
                description="Query aggregated feedback and sentiment trends in plain English."
                className="mb-0 pb-4"
            />

            {/* Chat workspace container */}
            <Card className="flex-1 flex flex-col min-h-0 border-slate-800 bg-slate-950/20 overflow-hidden">
                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                    {messages.map((message) => {
                        const isLoop = message.sender === "loop";
                        return (
                            <div
                                key={message.id}
                                className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${isLoop ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                            >
                                {/* Avatar Icon */}
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center border text-xs shrink-0 ${isLoop
                                    ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/20 animate-pulse-glow"
                                    : "bg-slate-900 text-slate-350 border-slate-800"
                                    }`}>
                                    {isLoop ? <Sparkles className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                                </div>

                                {/* MessageBox */}
                                <div className="space-y-1">
                                    <div className={`rounded-xl px-4 py-2.5 text-xs md:text-sm leading-relaxed border ${isLoop
                                        ? "bg-slate-950/80 border-slate-900 text-slate-200"
                                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                                        }`}>
                                        {message.text}
                                    </div>
                                    <span className="text-4xs text-slate-500 block px-1">
                                        {message.timestamp}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {/* Typing state */}
                    {isTyping && (
                        <div className="flex gap-3 max-w-[70%] mr-auto items-center">
                            <div className="h-8 w-8 rounded-lg flex items-center justify-center border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse shrink-0">
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <div className="bg-slate-950/80 border border-slate-900 rounded-xl px-4 py-2.5 flex items-center gap-2">
                                <Spinner size="sm" className="h-3 w-3" />
                                <span className="text-xs text-slate-400 font-medium">LOOP is searching feedback database...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Form Footer */}
                <div className="p-4 border-t border-slate-900 bg-slate-950/60">
                    <form onSubmit={handleSend} className="flex gap-3">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask about high priority bugs or weekly sentiment reviews..."
                            disabled={isTyping}
                            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-all font-sans"
                        />
                        <Button type="submit" disabled={isTyping || !inputValue.trim()} size="icon" className="shrink-0 text-slate-950">
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                    <div className="flex items-center gap-1.5 text-4xs text-slate-500 mt-2.5 px-1 font-mono">
                        <Sparkles className="h-3 w-3 text-emerald-500" />
                        POWERED BY OFFLINE SIMULATION. BACKEND CONNECTIVITY IS OFF.
                    </div>
                </div>
            </Card>
        </div>
    );
}
