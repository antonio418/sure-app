import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function SingleUseDisclaimer() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 py-20 px-6 font-open-sans selection:bg-emerald-500/30">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-500 hover:text-emerald-400 font-bold mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al Inicio
        </Link>
        
        <h1 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">Single-Use Intelligence Disclaimer</h1>
        <p className="text-slate-400 mb-12">Applicable to Pay-As-You-Go Forensic Reports</p>

        <div className="space-y-8 text-lg leading-relaxed">
          
          <p>
            By utilizing the Pay-As-You-Go forensic analysis service provided by SURE Forensics ("SURE"), the Client explicitly acknowledges and accepts the following operational and legal parameters:
          </p>

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-emerald-500 mb-4 uppercase tracking-widest">1. Autonomous Generation</h2>
            <p>
              The B2B Risk Certificate is generated autonomously by Artificial Intelligence algorithms utilizing semantic analysis and probability models. It is an operational intelligence tool designed to highlight anomalies and structural risks.
            </p>
          </section>

          <section className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-bold text-red-400 uppercase tracking-widest">2. No Financial Liability</h2>
            </div>
            <p>
              SURE Forensics is not a licensed financial advisor, legal counsel, or regulatory body. The intelligence provided does not constitute legally binding advice or a directive to execute or abort any transaction. <strong>The final decision to proceed with any commercial engagement rests entirely with the Client.</strong> SURE assumes zero liability for any direct or indirect financial losses, reputational damage, or legal disputes resulting from the Client's business decisions.
            </p>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-emerald-500 mb-4 uppercase tracking-widest">3. Data Privacy (Zero Retention)</h2>
            <p>
              Documents submitted for analysis are strictly processed via secure API protocols and are <strong>not</strong> used to train or improve public AI models. All original documents uploaded by the Client will be permanently destroyed from SURE's operational servers within 30 days of report delivery to ensure maximum corporate confidentiality.
            </p>
          </section>

          <p className="text-sm text-slate-500 mt-12 text-center">
            If you represent a corporate entity requiring a comprehensive Master Service Agreement (MSA) and Mutual Non-Disclosure Agreement (NDA), please upgrade to a corporate tier.
          </p>

        </div>
      </div>
    </div>
  );
}
