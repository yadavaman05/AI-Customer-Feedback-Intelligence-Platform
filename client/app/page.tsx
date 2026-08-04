import Link from "next/link";
import { ArrowRight, Sparkles, MessageSquare, BarChart3, CheckCircle2 } from "lucide-react";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";


export default function Home() {
  return (
    <div className="min-h-screen bg-background text-slate-105 grid-bg font-sans overflow-x-hidden antialiased">
      {/* Glow Effects wrapper */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl animate-pulse-glow" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl" />

      {/* Landing Navbar */}
      <header className="relative z-10 border-b border-slate-900 bg-slate-950/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 font-bold text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all">
              L
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              LOOP
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        {/* Project Setup Completed Indicator */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-8 animate-pulse shadow-md shadow-emerald-500/5">
          <CheckCircle2 className="h-4 w-4" />
          Project Setup Completed
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Turn Chaos Into <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent glow-text-emerald">Intelligence</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          LOOP is the enterprise-grade AI Customer Feedback Intelligence Platform. Aggregating, categorizing, and dissecting system feedback in real-time to drive retention and strategy.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 flex items-center justify-center gap-2 group text-slate-950 font-bold">
              Enter Workspace
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 border-slate-800 hover:border-slate-700">
              Demo Portal
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Architected for Modern Product Teams
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Scale feedback collection across channels, extract semantic intelligence, and trigger immediate engineering workflows.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card hoverEffect className="p-6 border-slate-850">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Semantic AI Extraction</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Identify core issue clusters, feature requests, and support tickets automatically using state-of-the-art Natural Language Processing.
            </p>
          </Card>

          <Card hoverEffect className="p-6 border-slate-850">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/20">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Multi-channel Sync</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Ingest logs, customer emails, Slack channels, app reviews, and custom CRM tickets directly into a unified feedback viewport.
            </p>
          </Card>

          <Card hoverEffect className="p-6 border-slate-850">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/20">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Advanced Analytics</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Drill down on net promoter trends, monitor cohort-specific frustrations, and run predictive analytics on customer retention impact.
            </p>
          </Card>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/5 mix-blend-color-dodge pointer-events-none" />
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
            Start Processing Feedback Today
          </h2>
          <p className="text-sm sm:text-base text-slate-405 max-w-lg mx-auto mb-8 leading-relaxed">
            Bring clarity to your development backlog. Join top product teams leveraging LOOP to orchestrate customer-informed software strategies.
          </p>
          <Link href="/signup">
            <Button size="lg" className="px-8 text-slate-950 font-bold">
              Create Free Workspace
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/40 py-8 text-center text-xs text-slate-500">
        <p>© 2026 LOOP Inc. All rights reserved. Built for Next-generation Product Orchestration.</p>
      </footer>
    </div>
  );
}
