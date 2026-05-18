"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ShieldAlert, Upload, Cpu, FileText, CheckCircle2, AlertTriangle, Loader2, Network, ShieldCheck, Search, Scale } from 'lucide-react';
import dynamic from 'next/dynamic';

const AgentNode = ({ id, name, role, status, icon: Icon }: any) => {
  const isRunning = status === 'running';
  const isSuccess = status === 'success';

  return (
    <div className={`p-4 rounded-xl border relative overflow-hidden transition-all duration-500 ${
      isRunning ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.3)]' :
      isSuccess ? 'border-emerald-500 bg-emerald-500/10' :
      'border-white/10 bg-black/40'
    }`}>
      {isRunning && <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/30 blur-2xl animate-pulse"></div>}
      <div className="flex items-start justify-between mb-2">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
          isRunning ? 'border-purple-500/50 text-purple-400' :
          isSuccess ? 'border-emerald-500/50 text-emerald-400' :
          'border-white/10 text-slate-500'
        }`}>
          {isRunning ? <Loader2 className="w-5 h-5 animate-spin" /> : 
           isSuccess ? <CheckCircle2 className="w-5 h-5" /> : 
           <Icon className="w-5 h-5" />}
        </div>
        <div className="text-right">
          <div className="text-xs font-mono text-slate-500">NODE: {id}</div>
          <div className={`text-[10px] font-mono font-bold uppercase ${
            isRunning ? 'text-purple-400 animate-pulse' :
            isSuccess ? 'text-emerald-400' : 'text-slate-600'
          }`}>
            {isRunning ? 'Processing...' : isSuccess ? 'Verified' : 'Standby'}
          </div>
        </div>
      </div>
      <div>
        <h4 className={`text-sm font-bold ${isRunning || isSuccess ? 'text-white' : 'text-slate-400'}`}>{name}</h4>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{role}</p>
      </div>
    </div>
  );
};

const RMAPdfGenerator = dynamic(
  () => import('@/components/pdf/RMAPdfGenerator'),
  { ssr: false, loading: () => <div className="text-sm text-slate-400">Preparando motor PDF...</div> }
);

const telemetryDict = {
  uploading: { en: "Initiating encryption and file upload to secure vault...", es: "Iniciando cifrado y subida de archivos al vault seguro...", pt: "Iniciando criptografia e upload de arquivos...", ru: "Начало шифрования и загрузки файлов..." },
  upload_error: { en: "Error uploading {file}: {msg}", es: "Error subiendo {file}: {msg}", pt: "Erro ao enviar {file}: {msg}", ru: "Ошибка загрузки {file}: {msg}" },
  deploy_parallel: { en: "Initiating SEQUENTIAL deployment of the 3 subordinate agents...", es: "Iniciando despliegue SECUENCIAL de los 3 agentes subordinados...", pt: "Iniciando implantação SEQUENCIAL dos 3 agentes subordinados...", ru: "Запуск ПОСЛЕДОВАТЕЛЬНОГО развертывания 3 агентов..." },
  agent_success: { en: "Agent {name} successfully completed its scan.", es: "Agente {name} finalizó con éxito su escaneo.", pt: "Agente {name} concluiu a verificação com sucesso.", ru: "Агент {name} успешно завершил сканирование." },
  deploy_consolidator: { en: "Initiating deployment of Agent: Executive Consolidator...", es: "Iniciando despliegue de Agente: Consolidador Ejecutivo...", pt: "Iniciando implantação do Agente: Consolidador Executivo...", ru: "Запуск развертывания Агента: Исполнительный Консолидатор..." },
  consolidator_success: { en: "Agent Executive Consolidator successfully completed.", es: "Agente Consolidador Ejecutivo finalizó con éxito.", pt: "Agente Consolidador Executivo concluído com sucesso.", ru: "Агент Исполнительный Консолидатор успешно завершен." },
  ready: { en: "Consolidated Forensic Report Ready for Download.", es: "Reporte Forense Consolidado y Listo para Descarga.", pt: "Relatório Forense Consolidado Pronto para Download.", ru: "Сводный криминалистический отчет готов к загрузке." },
  json_error: { en: "Critical Error: Consolidator did not return valid JSON.", es: "Error grave: El consolidador no devolvió un JSON válido.", pt: "Erro Crítico: O consolidador não retornou um JSON válido.", ru: "Критическая ошибка: Консолидатор не вернул допустимый JSON." },
  sys_fail: { en: "SYSTEM FAILURE: {msg}", es: "FALLO DEL SISTEMA: {msg}", pt: "FALHA NO SISTEMA: {msg}", ru: "СИСТЕМНЫЙ СБОЙ: {msg}" },
  waiting: { en: "Waiting for analysis initialization...", es: "Esperando inicialización del análisis...", pt: "Aguardando inicialização da análise...", ru: "Ожидание инициализации анализа..." }
};

export default function RMAPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [context, setContext] = useState('');
  const [language, setLanguage] = useState('en');
  const [status, setStatus] = useState<string>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [finalReport, setFinalReport] = useState<any | null>(null);
  const [agentStatus, setAgentStatus] = useState<Record<string, 'idle'|'running'|'success'|'error'>>({
    roberto: 'idle', moises: 'idle', alcides: 'idle', consolidator: 'idle'
  });

  const resetForm = () => {
    setFiles([]);
    setContext('');
    setStatus('idle');
    setProgress(0);
    setLogs([]);
    setFinalReport(null);
    setAgentStatus({ roberto: 'idle', moises: 'idle', alcides: 'idle', consolidator: 'idle' });
  };

  const addLog = (msg: string) => setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const t = (key: keyof typeof telemetryDict, vars?: Record<string, string>) => {
    let text = (telemetryDict[key] as any)[language] || telemetryDict[key].en;
    if (vars) {
      Object.keys(vars).forEach(v => {
        text = text.replace(`{${v}}`, vars[v]);
      });
    }
    return text;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const uploadFiles = async () => {
    addLog(t('uploading'));
    const uploadedPaths = [];
    for (const file of files) {
      const filePath = `${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from('temp_dossiers').upload(filePath, file);
      if (error) {
         addLog(t('upload_error', { file: file.name, msg: error.message }));
         throw error;
      }
      uploadedPaths.push(filePath);
    }
    return uploadedPaths;
  };

  const runAnalysis = async () => {
    if (files.length === 0 && !context) {
      alert("You must upload at least one document or provide a context.");
      return;
    }

    try {
      setStatus('running');
      setProgress(10);
      setFinalReport(null);
      setLogs([]);

      let uploadedPaths: string[] = [];
      if (files.length > 0) {
        uploadedPaths = await uploadFiles();
      }

      setProgress(20);
      
      const subordinateAgents = ['roberto', 'moises', 'alcides'];
      const subordinateNames = ['Roberto (Due Diligence & Compliance)', 'Moisés (Contractual & Legal)', 'Alcides (Técnico & Químico)'];
      
      addLog(t('deploy_parallel'));

      const fetchAgent = async (agent: string, name: string) => {
        setAgentStatus(prev => ({ ...prev, [agent]: 'running' }));
        const formData = new FormData();
        uploadedPaths.forEach(path => formData.append('filePath', path));
        formData.append('agent', agent);
        formData.append('targetLanguage', language);
        if (context) formData.append('userContext', context);

        const response = await fetch('/api/analyze', { method: 'POST', body: formData });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `El agente ${name} reportó un error crítico.`);
        
        setAgentStatus(prev => ({ ...prev, [agent]: 'success' }));
        addLog(t('agent_success', { name }));
        return `\n\n--- REPORTE DE ${name.toUpperCase()} ---\n${data.report}`;
      };

      // Ejecutar los 3 agentes secuencialmente para evitar Timeouts de 60s en Vercel y Rate Limits de Anthropic
      const subordinateReports = [];
      for (let i = 0; i < subordinateAgents.length; i++) {
        const report = await fetchAgent(subordinateAgents[i], subordinateNames[i]);
        subordinateReports.push(report);
      }

      setProgress(60);
      const allReports = subordinateReports.join('\n');

      addLog(t('deploy_consolidator'));
      setAgentStatus(prev => ({ ...prev, consolidator: 'running' }));

      const consolidatorFormData = new FormData();
      uploadedPaths.forEach(path => consolidatorFormData.append('filePath', path));
      consolidatorFormData.append('agent', 'consolidator');
      consolidatorFormData.append('targetLanguage', language);
      if (context) consolidatorFormData.append('userContext', context);
      consolidatorFormData.append('previousReports', allReports);

      const consolidatorResponse = await fetch('/api/analyze', { method: 'POST', body: consolidatorFormData });
      const consolidatorData = await consolidatorResponse.json();
      
      if (!consolidatorResponse.ok) throw new Error(consolidatorData.error || `El Consolidador reportó un error crítico.`);
      
      setProgress(90);
      setAgentStatus(prev => ({ ...prev, consolidator: 'success' }));
      addLog(t('consolidator_success'));
      
      try {
         let jsonStr = consolidatorData.report;
         if (jsonStr.includes('```json')) {
           jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
         } else if (jsonStr.includes('```')) {
           jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
         }
         
         const parsedReport = JSON.parse(jsonStr) as any;
         parsedReport.dateGenerated = new Date().toLocaleDateString();
         setFinalReport(parsedReport);
         addLog(t('ready'));
      } catch (e) {
         addLog(t('json_error'));
         console.error(e, consolidatorData.report);
      }

      setProgress(100);
      setStatus('success');

    } catch (err: any) {
      setStatus('error');
      addLog(t('sys_fail', { msg: err.message }));
    }
  };

  return (
    <div className="min-h-screen bg-[#050a14] text-white font-sans p-8 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-5xl mb-8 flex justify-between items-center border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
            <Cpu className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-montserrat uppercase tracking-widest text-white">RMA Reports</h1>
            <p className="text-purple-400 text-sm font-mono tracking-wider">Internal Command Center</p>
          </div>
        </div>
        <a href="/admin" className="px-6 py-2 border border-white/20 rounded-full hover:bg-white/5 transition-colors text-sm font-bold">
          Back to Hub
        </a>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Panel de Control */}
        <div className="glass p-8 rounded-2xl border border-white/10 relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <ShieldAlert className="text-purple-400" /> New Forensic Analysis
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-300 mb-2">Final Report Language</label>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors text-white"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="pt">Portuguese</option>
              <option value="ru">Russian</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-300 mb-2">Intelligence Context (Optional)</label>
            <textarea 
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full h-24 bg-black/50 border border-white/10 rounded-xl p-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors placeholder:text-slate-600"
              placeholder="Ex: This individual contacted me via LinkedIn offering Russian petroleum products. I suspect it's a scammer."
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-300 mb-2">Documentary Evidence (PDF, JPG)</label>
            <label className="w-full h-32 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-500/5 transition-colors">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-sm text-slate-300 font-bold">Upload Documents</span>
              <span className="text-xs text-slate-500 mt-1">{files.length > 0 ? `${files.length} file(s) selected` : 'SCO, Mandates, Passports, etc.'}</span>
              <input type="file" multiple className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
            </label>
          </div>

          <button 
            onClick={runAnalysis}
            disabled={status === 'running'}
            className="w-full py-4 bg-purple-500 hover:bg-purple-400 text-white font-extrabold uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          >
            {status === 'running' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Cpu className="w-5 h-5" />}
            {status === 'running' ? 'EXECUTING NEURAL NETWORK...' : 'RUN FORENSIC SCAN'}
          </button>

        </div>

        {/* Panel de Nodos Visuales y Telemetría */}
        <div className="flex flex-col gap-6">
          <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Network className="w-4 h-4 text-purple-400" /> Agent Swarm Deployment
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <AgentNode id="ROB-9X" name="Roberto" role="Due Diligence" status={agentStatus.roberto} icon={Search} />
              <AgentNode id="MOI-2B" name="Moisés" role="Legal" status={agentStatus.moises} icon={Scale} />
              <AgentNode id="ALC-7V" name="Alcides" role="Tech & Chem" status={agentStatus.alcides} icon={Cpu} />
              <AgentNode id="EXE-1A" name="Consolidator" role="Consolidator" status={agentStatus.consolidator} icon={ShieldCheck} />
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden mb-4 border border-white/5">
               <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>

            {/* Compact Terminal Logs */}
            <div className="bg-black/80 rounded-xl border border-white/5 p-3 font-mono text-[10px] h-32 overflow-y-auto">
               {logs.length === 0 && <span className="text-slate-600">{t('waiting')}</span>}
               {logs.map((log, i) => (
                 <div key={i} className="mb-1 text-slate-400">
                   <span className="text-purple-400">{'>'}</span> {log}
                 </div>
               ))}
            </div>
          </div>

          {/* Área de Descarga */}
          {finalReport && (
            <div className="glass p-6 rounded-2xl border border-green-500/30 bg-green-500/10 flex flex-col items-center justify-center text-center">
               <CheckCircle2 className="w-12 h-12 text-green-400 mb-3" />
               <h3 className="text-xl font-bold text-white mb-2">Analysis Completed</h3>
               <p className="text-sm text-slate-300 mb-6">The Official PDF with the forensic report (RMA) has been generated and signed by the AI.</p>
               
               <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                 <RMAPdfGenerator finalReport={finalReport} language={language} />
                 <RMAPdfGenerator 
                   finalReport={finalReport} 
                   redactOnTheFly={true}
                   buttonText="REDACT FOR MARKETING"
                   buttonColor="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600"
                   language={language}
                 />
               </div>
               
               <button 
                  onClick={resetForm} 
                  className="mt-6 px-6 py-2 border border-white/20 text-slate-300 text-sm font-bold rounded-full hover:bg-white/10 transition-colors"
               >
                  Start New Scan
               </button>
            </div>
          )}

          {status === 'error' && (
             <div className="glass p-6 rounded-2xl border border-red-500/30 bg-red-500/10 flex flex-col items-center justify-center text-center">
               <AlertTriangle className="w-12 h-12 text-red-400 mb-3" />
               <h3 className="text-xl font-bold text-white mb-2">Execution Error</h3>
               <p className="text-sm text-slate-300">A problem occurred during the scan. Please check the telemetry console.</p>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
