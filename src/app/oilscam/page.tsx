'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  ShieldAlert, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Cpu, 
  Search, 
  Scale, 
  Check, 
  Copy, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Globe,
  Lock,
  Zap,
  HelpCircle,
  FileSignature
} from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/translations';

const RMAPdfGenerator = dynamic(
  () => import('@/components/pdf/RMAPdfGenerator'),
  { ssr: false, loading: () => <div className="text-xs text-slate-400">Loading PDF engine...</div> }
);

const AgentStatusNode = ({ id, name, role, status, icon: Icon }: any) => {
  const isRunning = status === 'running';
  const isSuccess = status === 'success';

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-500 ${
      isRunning ? 'border-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.25)] animate-pulse' :
      isSuccess ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]' :
      'border-slate-800 bg-slate-900/60'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
          isRunning ? 'border-red-500/50 text-red-400' :
          isSuccess ? 'border-emerald-500/50 text-emerald-400' :
          'border-slate-800 text-slate-500'
        }`}>
          {isRunning ? <Loader2 className="w-5 h-5 animate-spin" /> : 
           isSuccess ? <CheckCircle2 className="w-5 h-5" /> : 
           <Icon className="w-5 h-5" />}
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-slate-500">NODE: {id}</div>
          <div className={`text-[9px] font-mono font-bold uppercase ${
            isRunning ? 'text-red-400' :
            isSuccess ? 'text-emerald-400' : 'text-slate-600'
          }`}>
            {isRunning ? 'Auditing...' : isSuccess ? 'Finished' : 'Standby'}
          </div>
        </div>
      </div>
      <div>
        <h4 className={`text-sm font-bold ${isRunning || isSuccess ? 'text-white' : 'text-slate-400'}`}>{name}</h4>
        <p className="text-[9px] text-slate-500 uppercase tracking-wider">{role}</p>
      </div>
    </div>
  );
};

export default function OilScamAlertPage() {
  const { language, setLanguage } = useLanguage();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [reportLanguage, setReportLanguage] = useState('en');
  const [userContext, setUserContext] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [betaCode, setBetaCode] = useState('');
  const [isBetaActive, setIsBetaActive] = useState(true); // Default to free beta mode for viral launch

  // Force English by default on mounting /oilscam
  useEffect(() => {
    setLanguage('en');
    setReportLanguage('en');
  }, []);

  const [status, setStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [finalReport, setFinalReport] = useState<any | null>(null);
  const [rawReport, setRawReport] = useState<string | null>(null);
  const [parseError, setParseError] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [agentStatus, setAgentStatus] = useState<Record<string, 'idle'|'running'|'success'|'error'>>({
    roberto: 'idle', moises: 'idle', alcides: 'idle', consolidator: 'idle'
  });

  const addLog = (msg: string) => setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleCopy = () => {
    if (rawReport) {
      navigator.clipboard.writeText(rawReport);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLoadDemo = () => {
    setLogs([
      `[${new Date().toLocaleTimeString()}] Initializing OilScam Alert Digital Sieve...`,
      `[${new Date().toLocaleTimeString()}] Access granted for: DEMO ACCESS PORTAL`,
      `[${new Date().toLocaleTimeString()}] Retrieving sample document 'LLP_R******L_SCO_FAKE.pdf' from archives...`,
      `[${new Date().toLocaleTimeString()}] ROBERTO (Document Integrity) -> Analysis complete. 6 critical discrepancies logged.`,
      `[${new Date().toLocaleTimeString()}] MOISÉS (Coherence Auditor) -> Analysis complete. 4 physical impossibilities found.`,
      `[${new Date().toLocaleTimeString()}] ALCIDES (Sanctions Specialist) -> Analysis complete. Direct Russian ESPO sanctions risk flagged.`,
      `[${new Date().toLocaleTimeString()}] CONSOLIDATOR -> Forensic Transactional Certificate generated successfully!`
    ]);
    setAgentStatus({
      roberto: 'success',
      moises: 'success',
      alcides: 'success',
      consolidator: 'success'
    });
    setRawReport(`EXECUTIVE RECOMMENDATIONS:\nEXECUTIVE CONSOLIDATOR DETERMINATION — IRREVERSIBLE RISK TREND IDENTIFIED. All three subordinate agents (ROBERTO, MOISÉS, and ALCIDES) have issued independent REJECT determinations. Their findings are not contradictory — they are mutually reinforcing across every analytical dimension...\n\nANOMALIES DETECTED:\n01. Residential Apartment as Corporate Headquarters...\n02. ESPO Crude Oil Origin Misrepresentation...\n03. JP54 Fictitious Fuel Offer...`);
    setFinalReport({
      companyName: 'LLP R******L ("R******L COMPANY" LLP) [ANONYMIZED]',
      riskScore: 96,
      dateGenerated: new Date().toLocaleDateString(),
      recommendations: `EXECUTIVE CONSOLIDATOR DETERMINATION — IRREVERSIBLE RISK TREND IDENTIFIED. All three subordinate agents (ROBERTO, MOISÉS, and ALCIDES) have issued independent REJECT determinations. Their findings are not contradictory — they are mutually reinforcing across every analytical dimension: identity, contractual structure, chemical/technical integrity, pricing, and geopolitical/sanctions compliance. No positive KYC element from any agent is sufficient to offset the critical findings below. We estimate that it is not possible to reverse the risk trend found regarding the eligibility of this supplier.

ACTIONABLE STEPS (for reference and due diligence record purposes only — engagement is not recommended):
1. DO NOT TRANSFER ANY FUNDS under any payment term described in this document (MT103, TT Wire, or otherwise). The 2%/5%/10% advance deposit structures across all three transaction procedures require irreversible SWIFT wire transfers to seller-nominated accounts before cargo verification. This is the primary financial extraction mechanism.
2. DO NOT SIGN any ICPO, SPA, CI, NCNDA, or IMFPA with this entity without a prior, independent legal opinion.
3. ESPO CRUDE EXCLUSION: ESPO is a Russian pipeline crude grade. Labeling it as 'Kazakhstan origin' constitutes a factual misrepresentation exposing you to secondary sanctions under OFAC and EU regulations.
4. JP54 EXCLUSION: Immediately exclude JP54 ('Colonial Grade 54') from any discussion. It is a fictitious product designation used in advance-fee commodity schemes.
5. TECHNICAL SPECIFICATION AUDIT: The spec sheets contain multiple critical errors (physically impossible values, wrong units, fabricated names 'Mathane' and 'Putanes') indicating they were not generated by a qualified laboratory.`,
      anomalies: [
        {
          title: "Residential Apartment as Corporate Headquarters",
          description: "The registered operational address of LLP R******L across all 15 pages is '[REDACTED STREET ADDRESS], Balkhash, Kazakhstan' — a residential apartment unit. A company claiming the capacity to export up to 3,000,000 barrels/month of crude oil from a residential address represents a structural credibility inconsistency of the highest order."
        },
        {
          title: "ESPO Crude Oil: Critical Origin Misrepresentation & Sanctions Exposure",
          description: "The document offers 'ESPO CRUDE OIL' with 'ORIGIN: KAZAKHSTAN.' ESPO is a Russian pipeline crude grade exclusively transported via the Transneft system. Kazakhstan has no physical connection to it. Any party transacting this product may face severe secondary sanctions liability under OFAC and EU."
        },
        {
          title: "JP54 ('Colonial Grade 54'): Fictitious Commercial Product",
          description: "The offer includes 'JET FUEL AVIATION KEROSENE COLONIAL GRADE 54 (JP54).' JP54 is not a standardized or commercially traded civilian aviation fuel. It is universally recognized in petroleum fraud investigation literature as a fictitious product designation used in advance-fee schemes."
        },
        {
          title: "D6 Virgin Fuel Oil: Non-Standardized Product at Physically Impossible Volumes",
          description: "'D6 Virgin Fuel Oil' does not correspond to any recognized ISO/ASTM standard. The offered quantity of up to 800,000,000 gallons per month (approx. 19,000,000 barrels) is equivalent to a top-10 global producer volume, at physically and economically impossible sub-cost pricing."
        },
        {
          title: "Advance Payment Mechanism (2%/5%/10% Deposits) Before Verification",
          description: "The buyer is required to transfer irreversible MT103 wire deposits before cargo verification. This includes a 10% payment to a 'seller-nominated escrow company' that is entirely controlled by the seller. This is the primary financial extraction mechanism in petroleum fraud typologies."
        },
        {
          title: "Implausible Aggregate Supply Volumes Across Nine Products Simultaneously",
          description: "The document simultaneously claims the capacity to supply up to 3,000,000 BBL/month of Jet A-1, ESPO Crude, and JP54, along with 800,000,000 gallons/month of D6 and huge volumes of Mazut, LPG, and LNG. This aggregate volume exceeds the total export capacity of multiple national exporters combined."
        },
        {
          title: "Below-Market Pricing Across All Products (Bait Pricing Pattern)",
          description: "All products are offered at prices significantly below prevailing market benchmarks (e.g. ESPO crude at $46–52/BBL CIF vs. $65–75/BBL market spot). This is a behavioral manipulation tactic designed to bypass corporate due diligence controls."
        },
        {
          title: "EN590 Specification: Three Major Technical Non-Compliances",
          description: "The specification sheet contains physical impossibilities: (1) Summer CFPP value declared as +50.0°C (legal max is +5.0°C); (2) Oxidation Stability declared as 460 g/m³ (legal max is 25 g/m³, showing a copy-paste error from lubricity parameters); (3) Polycyclic Aromatic Hydrocarbons at 11.0% m/m (legal max is 8.0% m/m)."
        },
        {
          title: "Jet A-1 Specification: Four Fundamental Technical Errors",
          description: "Contains critical specification errors: (1) Flash Point declared as 'Max 42°C' instead of Min 38°C; (2) Smoke Point declared in 'Mj/Lkg' instead of mm; (3) Net Specific Energy declared as 'Min 19 Mm' instead of Min 42.8 MJ/kg; (4) Density unit declared as 'Kg/m²' (a surface unit) instead of Kg/m³."
        },
        {
          title: "LPG Specification: Describes Natural Gas, Mismatched Parameters",
          description: "Declares a minimum methane content of 85.0 Mol%, describing pipeline-quality natural gas (LNG), not Liquefied Petroleum Gas (which must contain >90% propane/butanes). Additionally lists fabricated chemical names 'MATHANE' and 'PUTANES' instead of methane and butanes."
        },
        {
          title: "Page 14 Critical Mislabeling: Petcoke Parameters Mislabeled as ESPO Crude",
          description: "The table lists a 'Real Density of 2.10 g/cm³' ( crude oil density is ~0.85; 2.10 matches calcined coke) along with moisture, ash, and particle size distributions over 8mm. This petcoke datasheet mislabeled as ESPO crude indicates a severe document assembly failure."
        },
        {
          title: "Loading Port Listed as 'TBA' Across All Nine Products",
          description: "Lists 'TBA' (To Be Announced) as the loading port for all nine products. In legitimate CIF trading, the loading terminal is a legally required element to calculate freight, insurance, and transit. Its absence prevents any logistics validation."
        },
        {
          title: "Director Name Discrepancy & Unverifiable Executive Identity",
          description: "Spells the General Director's surname as 'M*********' in the signature block and 'M*********' in the body text [REDACTED]. Furthermore, no public profile, company registry, or industry directory corroborates the existence or track record of this individual."
        },
        {
          title: "Document Template Assembly Failure & Duplicate Pages",
          description: "Pages 2 and 3 are verbatim duplicates of each other. Volatile parameters, petcoke tables, and density units are transposed across multiple sections, confirming a document assembled from pre-existing fraudulent templates."
        }
      ]
    });
    setProgress(100);
    setStatus('success');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone || files.length === 0) {
      setErrorMessage("Please fill all required fields and upload at least one document.");
      return;
    }
    if (!acceptedTerms) {
      setErrorMessage("You must accept the terms of the digital review.");
      return;
    }

    try {
      setStatus('uploading');
      setErrorMessage('');
      setLogs([]);
      addLog("Initializing OilScam Alert Digital Sieve...");

      // 1. Check Beta Access code if required (or simple validation)
      if (isBetaActive && betaCode.trim() && betaCode.toUpperCase() !== 'OILFREE26') {
        throw new Error("Invalid Beta Access Code. Please use 'OILFREE26' for free promotional scanning.");
      }

      const safeEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
      const safePhone = phone.replace(/[^a-zA-Z0-9+]/g, '');
      
      addLog("Uploading petroleum document to secure analytical vault...");
      const uploadedPaths: string[] = [];
      for (const file of files) {
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `oilscam_${safeEmail}_TEL_${safePhone}/${Date.now()}_${cleanFileName}`;
        const { error } = await supabase.storage.from('temp_dossiers').upload(filePath, file);
        if (error) throw error;
        uploadedPaths.push(filePath);
      }

      setStatus('analyzing');
      setProgress(10);
      addLog("Documents secured. Booting specialized analytical AI sub-agents...");

      // Pipeline of subordinate agents
      const subordinateAgents = ['roberto', 'moises', 'alcides'];
      const subordinateNames = ['ROBERTO', 'MOISÉS', 'ALCIDES'];
      const subordinateRoles = ['Document Integrity Agent', 'Coherence & Logic Auditor', 'Relationship & Context Mapping'];

      const fetchAgent = async (agent: string, name: string, role: string) => {
        setAgentStatus(prev => ({ ...prev, [agent]: 'running' }));
        addLog(`Deploying ${name} (${role}) to verify anomalies...`);

        const formData = new FormData();
        uploadedPaths.forEach(path => formData.append('filePath', path));
        formData.append('agent', agent);
        formData.append('targetLanguage', reportLanguage);
        
        // Feed custom oil-scam focus instruction in user context
        const oilScamFocus = `OIL SCAM AUDIT PROTOCOL: Focus strictly on verifying petroleum-specific fraud anomalies. Validate tank storage coordination documents, verify seller email domain registration status, flag Russian refinery sanction violations, check for shell bank intermediates, and cross-reference standard EN590/Jet A1 escrow procedures. ` + userContext;
        formData.append('userContext', oilScamFocus);
        
        const response = await fetch('/api/analyze', { method: 'POST', body: formData });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `Agent ${name} encountered an analysis exception.`);
        
        setAgentStatus(prev => ({ ...prev, [agent]: 'success' }));
        addLog(`Analysis complete for agent: ${name}`);
        return `\n\n--- REPORT BY ${name} (${role}) ---\n${data.report}`;
      };

      const subordinateReports = [];
      for (let i = 0; i < subordinateAgents.length; i++) {
        const report = await fetchAgent(subordinateAgents[i], subordinateNames[i], subordinateRoles[i]);
        subordinateReports.push(report);
        setProgress(20 + (i * 20)); // 20% -> 40% -> 60%
      }

      setProgress(75);
      addLog("Consolidating subordinate insights. Executing Executive Risk Synthesis...");
      setAgentStatus(prev => ({ ...prev, consolidator: 'running' }));

      const consolidatorFormData = new FormData();
      uploadedPaths.forEach(path => consolidatorFormData.append('filePath', path));
      consolidatorFormData.append('agent', 'consolidator');
      consolidatorFormData.append('targetLanguage', reportLanguage);
      consolidatorFormData.append('previousReports', subordinateReports.join('\n'));
      consolidatorFormData.append('email', email);
      
      const consolidatorResponse = await fetch('/api/analyze', { method: 'POST', body: consolidatorFormData });
      const consolidatorData = await consolidatorResponse.json();
      
      if (!consolidatorResponse.ok) throw new Error(consolidatorData.error || `Consolidator agent failed to compile certificate.`);
      
      setAgentStatus(prev => ({ ...prev, consolidator: 'success' }));
      addLog(`Forensic Certificate compiled and dispatched to: ${email}`);
      setProgress(90);

      if (consolidatorData.report) {
        setRawReport(consolidatorData.report);
      }

      // Try parsing JSON out of consolidator report
      try {
        const jsonMatch = consolidatorData.report.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          parsed.dateGenerated = new Date().toLocaleDateString();
          setFinalReport(parsed);
          setParseError(false);
        } else {
          throw new Error("No JSON boundaries found");
        }
      } catch (e) {
        addLog("Warning: PDF formatting slightly degraded, showing structured text report instead.");
        setParseError(true);
        setFinalReport(null);
      }

      setProgress(100);
      setStatus('success');

    } catch (error: any) {
      console.error("Analysis Failure:", error);
      setErrorMessage(error.message || "Connection timed out during heavy document processing.");
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex flex-col items-center justify-between font-open-sans relative selection:bg-red-500/20 selection:text-red-300">
      
      {/* Background Glowing Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-red-600/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[160px]" />
      </div>

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10 border-b border-white/5 bg-[#090d16]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)]">
            🛡️
          </div>
          <span className="font-montserrat font-black text-lg tracking-widest uppercase text-white">
            OILSCAM <span className="text-red-500">ALERT</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider font-bold text-[10px] hidden sm:flex">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span> Live Scanner
          </span>
          
          <div className="relative flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Lang:</span>
            <select
              value={language}
              onChange={(e) => {
                const lang = e.target.value as Language;
                setLanguage(lang);
                setReportLanguage(lang);
              }}
              className="bg-transparent text-xs text-white font-bold focus:outline-none cursor-pointer border-none pr-1"
            >
              <option value="en" className="bg-slate-950 text-white">🇺🇸 EN</option>
              <option value="es" className="bg-slate-950 text-white">🇪🇸 ES</option>
              <option value="fr" className="bg-slate-950 text-white">🇫🇷 FR</option>
              <option value="de" className="bg-slate-950 text-white">🇩🇪 DE</option>
              <option value="pt" className="bg-slate-950 text-white">🇧🇷 PT</option>
              <option value="zh" className="bg-slate-950 text-white">🇨🇳 ZH</option>
              <option value="ru" className="bg-slate-950 text-white">🇷🇺 RU</option>
              <option value="ar" className="bg-slate-950 text-white">🇦🇪 AR</option>
              <option value="hi" className="bg-slate-950 text-white">🇮🇳 HI</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-6 py-12 flex-grow flex flex-col items-center justify-center z-10">
        
        {status === 'analyzing' || status === 'success' ? (
          /* ========================================================
             PROCESSING & SUCCESS STATE VIEW
             ======================================================== */
          <div className="w-full max-w-4xl bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
            
            {status === 'analyzing' && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs text-center font-bold mb-6 animate-pulse flex items-center justify-center gap-2">
                <AlertTriangle size={16} /> PLEASE STAY ON THIS PAGE. Processing large petroleum PDFs requires intense AI calculations (Up to 3 minutes).
              </div>
            )}

            <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-6">
              <div>
                <h2 className="text-xl font-black text-white">Forensic Document Scan in Progress</h2>
                <p className="text-slate-400 text-xs mt-1">Multi-Agent framework actively verifying coordinates, compliance and integrity.</p>
              </div>
              <span className="text-2xl">⚡</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <AgentStatusNode id="ROB-9X" name="ROBERTO" role="Document Integrity" status={agentStatus.roberto} icon={Search} />
              <AgentStatusNode id="MOI-2B" name="MOISÉS" role="Coherence & Logic" status={agentStatus.moises} icon={Scale} />
              <AgentStatusNode id="ALC-7V" name="ALCIDES" role="Context Mapping" status={agentStatus.alcides} icon={Cpu} />
              <AgentStatusNode id="EXE-1A" name="CONSOLIDATOR" role="Executive Certificate" status={agentStatus.consolidator} icon={CheckCircle2} />
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-xs text-slate-400 font-bold mb-2">
                <span>Progress Matrix</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-red-500 to-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            {/* Simulated Live Console logs */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-[10px] h-32 overflow-y-auto shadow-inner text-slate-400">
              {logs.map((log, i) => (
                <div key={i} className="mb-1">
                  <span className="text-red-500 font-bold">{`>`}</span> {log}
                </div>
              ))}
            </div>

            {status === 'success' && (
              <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col items-center w-full">
                
                {finalReport ? (
                  /* Renders beautiful visual report if JSON parsed successfully */
                  <div className="w-full bg-slate-950/60 border border-white/5 rounded-2xl p-6 md:p-8 text-left relative overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 mb-6 gap-4">
                      <div>
                        <span className="text-[10px] bg-red-500/10 border border-red-500/30 text-red-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          Forensic Result
                        </span>
                        <h3 className="text-2xl font-black text-white mt-2">
                          {finalReport.companyName || 'Audited Transaction'}
                        </h3>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">Risk Matrix Score</span>
                        <span className={`text-3xl font-black ${
                          finalReport.riskScore > 60 ? 'text-red-500' :
                          finalReport.riskScore > 30 ? 'text-amber-500' : 'text-emerald-500'
                        }`}>
                          {finalReport.riskScore}/100
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8">
                      <h4 className="font-bold text-slate-200 text-sm mb-2 flex items-center gap-1.5">
                        💡 Executive Recommendations
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed white-space-pre-line">
                        {finalReport.recommendations}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-black text-white text-xs uppercase tracking-wider border-b border-slate-800 pb-2 mb-4">
                        🚨 Structural Findings & Anomalies
                      </h4>
                      
                      {finalReport.anomalies && finalReport.anomalies.length > 0 ? (
                        <div className="space-y-3">
                          {finalReport.anomalies.map((anom: any, idx: number) => (
                            <div key={idx} className="bg-slate-900/60 border border-slate-800/80 border-l-4 border-l-red-500 p-4 rounded-r-xl">
                              <h5 className="font-bold text-white text-sm flex items-center gap-2">
                                <span className="text-xs text-slate-500 font-mono">{(idx + 1).toString().padStart(2, '0')}</span>
                                {anom.title}
                              </h5>
                              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                {anom.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 p-5 rounded-xl text-center text-xs font-bold">
                          ✅ No significant commercial oil scam anomalies detected in this document.
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-800 pt-6 mt-6">
                      <p className="text-[10px] text-slate-500">
                        Scan completed on {finalReport.dateGenerated}. Certified by SURE.
                      </p>
                      <RMAPdfGenerator finalReport={finalReport} language={reportLanguage} />
                    </div>
                  </div>
                ) : (
                  /* Renders plain structured text transcript if JSON fails to parse */
                  <div className="w-full bg-slate-950/60 border border-white/5 rounded-2xl p-6 text-left">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-white">Forensic Risk Certificate (Text)</h3>
                      <button 
                        onClick={handleCopy}
                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                          copied ? 'bg-emerald-500 text-black' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Text</>}
                      </button>
                    </div>
                    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 font-mono text-[10px] text-slate-300 leading-relaxed max-h-[350px] overflow-y-auto whitespace-pre-wrap select-all shadow-inner">
                      {rawReport || "Analysis finished. Formatting report..."}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex flex-col items-center">
                  <button 
                    onClick={() => {
                      setStatus('idle');
                      setFiles([]);
                    }}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider border border-white/5 cursor-pointer"
                  >
                    Scan Another Offer
                  </button>
                </div>

              </div>
            )}

          </div>
        ) : (
          /* ========================================================
             INITIAL INTRO & FORM UPLOADER VIEW
             ======================================================== */
          <div className="w-full grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Description Column */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                <ShieldAlert size={14} /> Stop Oil Scams Instantly
              </span>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                Audit Your Oil Offers in <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-500">
                  Real Time with AI.
                </span>
              </h2>
              
              <p className="text-base text-slate-400 max-w-2xl font-light leading-relaxed">
                Commodity trading is plagued by shell companies, forged tank letters, and hijacked refinery domains. Drop your PDF offers (SCO, FCO, ICPO, CIS) into our automated digital sieve to verify anomalies before signing anything.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleLoadDemo}
                  className="px-6 py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(239,68,68,0.1)] flex items-center gap-2 cursor-pointer group"
                >
                  <Search size={14} className="group-hover:scale-110 transition-transform" />
                  🔍 View Live Sample Report: LLP R******L (Risk Score: 96/100)
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-red-400 flex-shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.05)]">
                    <Search size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Rotterdam & Houston Tanks</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Automatically cross-references tank storage coordinates for fake lease documents.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-red-400 flex-shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.05)]">
                    <Globe size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Domain Registry Audit</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Flags sender domains registered within 6 months to spot spoofed refineries.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-red-400 flex-shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.05)]">
                    <FileSignature size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Signee Identity Verification</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Scans signature registries, corporate registrations, and blacklist databases.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-red-400 flex-shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.05)]">
                    <Zap size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">4-Agent Forensic Matrix</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Harnesses multi-agent synthesis to compile a unified Risk Certificate.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Uploader Card Column */}
            <div className="lg:col-span-5">
              <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative">
                
                {/* Free Beta Badge */}
                <div className="absolute top-4 right-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider animate-pulse">
                  Free Beta Access
                </div>

                <h3 className="font-display font-bold text-lg text-white mb-6">Verify Your Petroleum Offer</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {isBetaActive && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl mb-4 text-xs text-emerald-300">
                      <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                        Promo Access Code
                      </label>
                      <input 
                        type="text" 
                        value={betaCode}
                        onChange={(e) => setBetaCode(e.target.value)}
                        placeholder="OILFREE26"
                        className="w-full bg-slate-900 border border-emerald-500/30 rounded-xl px-3 py-2 text-white font-mono font-bold tracking-wider uppercase focus:outline-none"
                      />
                      <span className="text-[9px] text-slate-500 mt-1 block">Default promo code is active for unlimited free validation scans.</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Corporate Email *</label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="trader@company.com"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Contact Phone *</label>
                      <input 
                        type="tel" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+370 600 00000"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Company Name (Optional)</label>
                      <input 
                        type="text" 
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Refinery Broker Ltd"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Report Language</label>
                      <select
                        value={reportLanguage}
                        onChange={(e) => {
                          const lang = e.target.value as Language;
                          setReportLanguage(lang);
                          setLanguage(lang);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
                      >
                        <option value="en">🇺🇸 English</option>
                        <option value="es">🇪🇸 Español</option>
                        <option value="fr">🇫🇷 Français</option>
                        <option value="de">🇩🇪 Deutsch</option>
                        <option value="pt">🇧🇷 Português</option>
                        <option value="zh">🇨🇳 中文</option>
                        <option value="ru">🇷🇺 Русский</option>
                        <option value="ar">🇦🇪 العربية</option>
                        <option value="hi">🇮🇳 हिन्दी</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Drop Petroleum Offer PDF *</label>
                    <div className="border-2 border-dashed border-slate-800 rounded-2xl p-6 text-center hover:bg-slate-900/50 transition-colors cursor-pointer relative">
                      <input 
                        type="file" 
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                      />
                      <UploadCloud className="w-8 h-8 text-red-500 mx-auto mb-2" />
                      <p className="text-xs font-bold mb-0.5">Drag & Drop PDF file</p>
                      <p className="text-[10px] text-slate-500">SCO, FCO, CIS, or lease letters up to 10MB</p>
                    </div>
                    
                    {files.length > 0 && (
                      <div className="mt-3">
                        {files.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 text-xs">
                            <FileText className="w-4 h-4 text-red-400" />
                            <span className="truncate flex-1">{f.name}</span>
                            <span className="text-[10px] text-slate-500">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex items-start gap-2.5">
                    <input 
                      type="checkbox" 
                      id="oil-terms" 
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 w-3.5 h-3.5 rounded border-slate-800 bg-slate-900 text-red-500 focus:ring-red-500 cursor-pointer"
                    />
                    <label htmlFor="oil-terms" className="text-[11px] text-slate-400 cursor-pointer select-none leading-relaxed">
                      I agree to submit this document for automated cryptographic audit under SURE protocols.
                    </label>
                  </div>

                  {errorMessage && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl flex items-start gap-2 text-xs">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <p>{errorMessage}</p>
                    </div>
                  )}

                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={files.length === 0 || !email || !phone || !acceptedTerms}
                      className={`w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${
                        files.length === 0 || !email || !phone || !acceptedTerms
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white shadow-[0_0_20px_rgba(239,68,68,0.35)]'
                      }`}
                    >
                      <Search size={14} /> Scan Offer For Scams
                    </button>
                  </div>

                </form>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 border-t border-white/5 bg-[#05080f]/90 text-center z-10">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
          &copy; {new Date().getFullYear()} OilScam Alert & SURE Infrastructure Intelligence. All rights reserved.
        </p>
      </footer>

    </div>
  );
}
