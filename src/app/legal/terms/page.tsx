import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 py-20 px-6 font-open-sans selection:bg-emerald-500/30">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-500 hover:text-emerald-400 font-bold mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al Inicio
        </Link>
        
        <h1 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">Master Forensic Service Agreement</h1>
        <p className="text-slate-400 mb-12">Última actualización: Mayo 2026</p>

        <div className="space-y-12 text-lg leading-relaxed">
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Scope of Services</h2>
            <p>
              SURE Forensics agrees to provide an autonomous multi-agent intelligence analysis (RMA) on the documents submitted by the Client. The resulting output is a "B2B Risk Certificate" detailing potential anomalies, contractual asymmetries, and technical inconsistencies.
            </p>
          </section>

          <section className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="w-8 h-8 text-red-500" />
              <h2 className="text-2xl font-bold text-red-400">2. Limitation of Liability and "Good Faith" Disclaimer</h2>
            </div>
            <p className="mb-4">
              The B2B Risk Certificate is generated autonomously in "Good Faith" by artificial intelligence algorithms based on network data cross-referencing, semantic analysis, and probability matrices. SURE Forensics is an <strong>Operational Intelligence Provider, not a licensed financial advisor, legal counsel, or regulatory body.</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The analysis may contain false positives or false negatives.</li>
              <li>The Intelligence Dossier does not constitute legally binding advice, a punitive judgment, or an instruction to execute or abort a financial transaction.</li>
              <li className="text-white font-bold">The final decision to proceed with any commercial transaction, wire transfer, or contract signing rests 100% with the Client.</li>
              <li>Under no circumstances shall SURE Forensics, its founders, or affiliates be held liable for any direct, indirect, incidental, or consequential financial losses, lost profits, or legal disputes arising from the Client's transactions, regardless of the findings presented in the Intelligence Dossier.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Processing and Confidentiality (Zero Retention Policy)</h2>
            <p>
              The Client acknowledges and agrees that the forensic analysis is performed utilizing advanced Artificial Intelligence (AI) models via secure API connections. To guarantee data privacy:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Zero Training Policy:</strong> SURE contractually ensures through its API providers that the Client’s Confidential Information is not used to train, fine-tune, or improve public AI models.</li>
              <li><strong>Data Destruction:</strong> All original documents submitted by the Client will be permanently deleted from SURE's operational servers within 30 days following the delivery of the final Intelligence Dossier.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Service Level Agreement (SLA)</h2>
            <p>
              Upon receipt of the full documentation and confirmation of payment, SURE Forensics will deliver the final Intelligence Dossier to the registered email within 24 to 48 business hours.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Governing Law</h2>
            <p>
              This Agreement shall be governed by the laws of Lithuania and the European Union, without regard to its conflict of law provisions.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
