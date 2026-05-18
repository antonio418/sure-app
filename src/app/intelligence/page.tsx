"use client";

import Link from 'next/link';
import { ArrowLeft, PlayCircle, BarChart3, ShieldAlert } from 'lucide-react';

export default function IntelligenceHub() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-16">
        <div className="flex items-center gap-4">
          <ShieldAlert className="w-8 h-8 text-emerald-500" />
          <h1 className="text-2xl font-black tracking-widest">SURE INTELLIGENCE HUB</h1>
        </div>
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Return Home
        </Link>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Videos Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <PlayCircle className="w-6 h-6 text-emerald-500" />
            <h2 className="text-xl font-bold uppercase tracking-wider">Educational Resources</h2>
          </div>
          
          <div className="space-y-6">
            <div className="aspect-video bg-black rounded-xl border border-slate-800 flex items-center justify-center">
               <p className="text-slate-500 font-mono text-sm">[ Higgsfield Video Container 1 ]</p>
            </div>
            <div className="aspect-video bg-black rounded-xl border border-slate-800 flex items-center justify-center">
               <p className="text-slate-500 font-mono text-sm">[ Higgsfield Video Container 2 ]</p>
            </div>
          </div>
        </section>

        {/* Analytics Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="w-6 h-6 text-emerald-500" />
            <h2 className="text-xl font-bold uppercase tracking-wider">Live Survey Analytics</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/20">
              <p className="text-4xl font-black text-emerald-500 mb-2">94%</p>
              <p className="text-sm text-slate-400">Domains found vulnerable to spoofing upon first audit.</p>
            </div>
            <div className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/20">
              <p className="text-4xl font-black text-emerald-500 mb-2">&lt; 5m</p>
              <p className="text-sm text-slate-400">Average time to secure DNS using SURE.</p>
            </div>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
             <h3 className="text-lg font-bold mb-4">Recent Institutional Audits</h3>
             <ul className="space-y-3 text-sm text-slate-300">
               <li className="flex justify-between border-b border-slate-800 pb-2">
                 <span>Ministry Infrastructure</span>
                 <span className="text-emerald-500 font-mono">SECURED</span>
               </li>
               <li className="flex justify-between border-b border-slate-800 pb-2">
                 <span>Logistics Corp DE</span>
                 <span className="text-emerald-500 font-mono">SECURED</span>
               </li>
               <li className="flex justify-between pb-2">
                 <span>Global Importers LLC</span>
                 <span className="text-emerald-500 font-mono">SECURED</span>
               </li>
             </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
