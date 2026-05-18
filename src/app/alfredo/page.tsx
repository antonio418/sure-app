'use client';
import { useState, useEffect } from 'react';
import { Activity, Users, Send, Flame, Terminal, CheckCircle2, Bot, Target, Mail } from 'lucide-react';
import Link from 'next/link';

// Fake live logs to simulate Alfredo working
const logs = [
  { time: '14:20:01', msg: 'Iniciando búsqueda avanzada: "Director de TI" OR "CEO" + "Logística" + "España"' },
  { time: '14:20:05', msg: 'Escaneando 12 perfiles corporativos en la red...' },
  { time: '14:20:12', msg: 'Prospecto encontrado: Elena R. (Director of IT en M*** Logistics)' },
  { time: '14:20:15', msg: 'Extrayendo correo electrónico público vía API de Hunter...' },
  { time: '14:20:18', msg: 'Correo encontrado: elena.r***@m***.es (Confianza: 98%)' },
  { time: '14:20:25', msg: 'Iniciando escaneo automático de DNS y registros TXT del dominio m***.es...' },
  { time: '14:20:28', msg: '¡Vulnerabilidad detectada! Falta registro DMARC.' },
  { time: '14:20:30', msg: 'Redactando correo personalizado (Enfoque: Nueva regla de Google y vulnerabilidad)' },
  { time: '14:20:35', msg: 'Correo enviado. Prospecto añadido a campaña: "Auditoría DNS Q2"' },
  { time: '14:20:40', msg: 'Pausando por 30s para respetar los límites de la bandeja de salida...' },
];

export default function AlfredoDashboard() {
  const [visibleLogs, setVisibleLogs] = useState<typeof logs>([]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setVisibleLogs(prev => [...prev, logs[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 2500); // Add a log every 2.5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#020817] text-white font-sans selection:bg-emerald-500/30">
      {/* Top Navbar */}
      <nav className="border-b border-slate-800/60 bg-[#020817]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                <Bot className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white flex items-center gap-2 font-montserrat">
                ALFREDO <span className="text-slate-600 font-normal">|</span> <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> ONLINE</span>
              </span>
            </div>
            <div className="flex gap-6">
              <button className="text-sm font-medium text-white border-b-2 border-emerald-500 pb-[21px] mt-[22px]">Dashboard</button>
              <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Campañas</button>
              <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Base de Datos</button>
              <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Configuración</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 font-montserrat">Campaña: Auditoría DNS Q2</h1>
            <p className="text-slate-400 text-sm">Alfredo está navegando la web y prospectando directores B2B automáticamente.</p>
          </div>
          <button className="bg-white text-black px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-200 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <Target className="w-4 h-4" /> Pausar Alfredo
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* KPI 1 */}
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <h3 className="text-slate-400 font-medium mb-1 relative z-10 text-sm uppercase tracking-wider">Prospectos Hallados</h3>
            <p className="text-4xl font-bold text-white relative z-10 font-montserrat">1,204</p>
          </div>

          {/* KPI 2 */}
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <Send className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <h3 className="text-slate-400 font-medium mb-1 relative z-10 text-sm uppercase tracking-wider">Correos Enviados</h3>
            <p className="text-4xl font-bold text-white relative z-10 font-montserrat">856</p>
          </div>

          {/* KPI 3 */}
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm ring-1 ring-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.05)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="p-2.5 bg-orange-500/10 rounded-xl border border-orange-500/20">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
              <span className="text-xs font-bold text-orange-400 bg-orange-400/10 px-2 py-1 rounded-md border border-orange-400/20 uppercase tracking-wide">+3 Hoy</span>
            </div>
            <h3 className="text-slate-400 font-medium mb-1 relative z-10 text-sm uppercase tracking-wider">Leads Calientes (Cierres)</h3>
            <p className="text-4xl font-bold text-white relative z-10 font-montserrat">14</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Live Console */}
          <div className="lg:col-span-2 flex flex-col">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-montserrat uppercase tracking-wide text-sm">
              <Terminal className="w-4 h-4 text-emerald-400" />
              El Cerebro de Alfredo (Tiempo Real)
            </h2>
            <div className="flex-1 bg-[#0a0a0a] rounded-2xl border border-slate-800/80 p-5 font-mono text-[13px] h-[400px] overflow-y-auto shadow-2xl relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a] pointer-events-none opacity-80 h-full w-full z-10"></div>
              
              <div className="text-slate-500 mb-5 border-b border-slate-800/60 pb-3 leading-relaxed">
                <span className="text-emerald-500/50">-- SURE ALFREDO AI ENGINE v2.1 --</span><br/>
                <span className="text-emerald-500/50">-- Conectado al Módulo de Inteligencia LLM --</span><br/>
                <span className="text-emerald-500/50">-- Iniciando secuencia de captura y análisis... --</span>
              </div>
              
              <div className="space-y-3 pb-20 relative z-0">
                {visibleLogs.map((log, index) => {
                  if (!log) return null;
                  return (
                    <div key={index} className="flex gap-4">
                      <span className="text-slate-600 shrink-0 select-none">[{log.time}]</span>
                      <span className={`text-slate-300 leading-relaxed ${log.msg.includes('Prospecto encontrado') ? 'text-blue-400 font-medium' : ''} ${log.msg.includes('Correo enviado') ? 'text-emerald-400 font-medium' : ''} ${log.msg.includes('Pausando') ? 'text-slate-500 italic' : ''} ${log.msg.includes('¡Vulnerabilidad') ? 'text-orange-400 font-medium' : ''}`}>
                        {log.msg}
                      </span>
                    </div>
                  );
                })}
                {visibleLogs.length < logs.length && (
                  <div className="flex gap-4 animate-pulse">
                    <span className="text-slate-600" suppressHydrationWarning>[{new Date().toLocaleTimeString('en-US', { hour12: false })}]</span>
                    <span className="text-emerald-500 flex items-center gap-2">Procesando red neuronal<span className="flex gap-0.5"><span className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce"></span><span className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce delay-75"></span><span className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce delay-150"></span></span></span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Hot Leads Inbox */}
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-montserrat uppercase tracking-wide text-sm">
              <Flame className="w-4 h-4 text-orange-400" />
              Buzón de Leads Listos
            </h2>
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl overflow-hidden flex-1 flex flex-col backdrop-blur-sm">
              
              {/* Lead 1 */}
              <div className="p-5 border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-white group-hover:text-orange-400 transition-colors">Elena R.</h4>
                  <span className="text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Hace 2 min</span>
                </div>
                <p className="text-xs text-slate-400 mb-3 font-medium">Director of IT at M*** Logistics</p>
                <div className="bg-[#0a0a0a] p-3.5 rounded-xl border border-slate-800/80 text-[13px] text-slate-300 relative shadow-inner">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-l-xl"></div>
                  "Hola Alfredo, muy interesante el análisis sobre nuestros DNS. Efectivamente hemos tenido correos devueltos. ¿Podemos tener una llamada mañana?"
                </div>
              </div>

              {/* Lead 2 */}
              <div className="p-5 border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-white group-hover:text-orange-400 transition-colors">Marco S.</h4>
                  <span className="text-[10px] uppercase font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">Hace 2 horas</span>
                </div>
                <p className="text-xs text-slate-400 mb-3 font-medium">CFO at T*** Solutions</p>
                <div className="bg-[#0a0a0a] p-3.5 rounded-xl border border-slate-800/80 text-[13px] text-slate-300 relative shadow-inner">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-l-xl"></div>
                  "Gracias por la alerta. Sí estamos buscando una auditoría de este tipo para evitar el fraude de facturas. Te paso con mi asistente para agendar."
                </div>
              </div>

              {/* Eliminated the "View all leads" button for the promotional demo */}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
