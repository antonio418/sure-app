"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  ShieldCheck, ArrowLeft, Printer, FileText, Download, 
  ChevronRight, Calendar, AlertTriangle, CheckSquare,
  Lock, CreditCard, Upload, RefreshCw, Eye, CheckCircle2, Info, Globe, Check
} from 'lucide-react';

interface ContingencyPlan {
  id: string;
  client_name: string;
  client_type: string;
  survey_responses: any;
  generated_plan_md: string;
  created_at: string;
}

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const elementId = React.useId().replace(/:/g, '');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let isMounted = true;
    
    const renderChart = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          themeVariables: {
            background: '#0a1128',
            primaryColor: '#00e5ff',
            secondaryColor: '#10b981',
            lineColor: '#cbd5e1',
          }
        });
        
        const cleanChart = chart
          .trim()
          .replace(/\\n/g, '\n')
          .replace(/\\"/g, '"');
          
        const { svg: renderedSvg } = await mermaid.render(
          `mermaid-${elementId}`,
          cleanChart
        );
        
        if (isMounted) {
          setSvg(renderedSvg);
          setError(false);
        }
      } catch (err) {
        console.error("Mermaid parsing error:", err);
        if (isMounted) {
          setError(true);
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart, elementId]);

  if (error) {
    return (
      <pre className="text-xs text-red-400 bg-red-950/20 p-4 rounded-xl border border-red-500/20 overflow-x-auto font-mono max-w-full">
        {chart}
      </pre>
    );
  }

  if (!svg) {
    return (
      <div className="flex items-center justify-center p-8 bg-slate-900/50 rounded-xl animate-pulse my-4">
        <div className="text-xs text-slate-400">Renderizando organigrama...</div>
      </div>
    );
  }

  return (
    <div 
      className="mermaid-chart overflow-x-auto flex justify-center py-4 bg-[#0a1128]/50 p-6 rounded-2xl border border-white/5 my-6 max-w-full print:bg-white print:border-none"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default function PlanPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const planId = resolvedParams.id;
  const [plan, setPlan] = useState<ContingencyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingFullPlan, setGeneratingFullPlan] = useState(false);
  const [generatingMessage, setGeneratingMessage] = useState("Redactando plan completo...");
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("all");
  const [signatureSigned, setSignatureSigned] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Carga de archivo
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchPlan();
  }, [planId]);

  async function fetchPlan() {
    try {
      setLoading(true);
      const { data, error: dbError } = await supabase
        .from('contingency_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (dbError) {
        throw dbError;
      }

      setPlan(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'No se pudo cargar el plan de contingencia.');
    } finally {
      setLoading(false);
    }
  }

  // Simulación de pagos y actualización de estados
  const handleUpdateStatus = async (newStatus: string, layoutUrl?: string) => {
    try {
      setPaymentLoading(true);
      const response = await fetch('/api/rma/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          status: newStatus,
          layout_url: layoutUrl
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar el estado del plan.');
      }

      // Volver a cargar el plan
      await fetchPlan();
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  // Simular pago del anticipo de $500 (Pasa de 'proposal' a 'review')
  const handlePayDeposit = async () => {
    if (!signatureSigned) {
      alert("Por favor, acepta los términos y firma digitalmente el acuerdo de adhesión antes de proceder.");
      return;
    }
    await handleUpdateStatus('review');
  };

  // Subir plano y redactar el plan completo
  const handleFileUploadAndGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      // Si no selecciona un plano, podemos usar una simulación con un plano ficticio
      alert("Por favor selecciona un archivo de plano para subir.");
      return;
    }

    try {
      setUploadingFile(true);
      setGeneratingFullPlan(true);
      setGeneratingMessage("Subiendo plano a Supabase Storage...");

      // Intentar subir a Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${planId}_layout.${fileExt}`;
      const filePath = `layouts/${fileName}`;

      // Nota: Si el bucket no existe o falla por permisos, simulamos un éxito usando un placeholder público
      let publicUrl = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200'; // Imagen de mapa técnica

      try {
        const { error: uploadError } = await supabase.storage
          .from('contingency_plans_assets')
          .upload(filePath, selectedFile, { upsert: true });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('contingency_plans_assets')
            .getPublicUrl(filePath);
          publicUrl = urlData.publicUrl;
        }
      } catch (storageError) {
        console.warn("Storage upload failed, falling back to mock URL:", storageError);
      }

      setGeneratingMessage("Traduciendo respuestas e iniciando redacción por IA (Claude)...");

      // Llamar a la API de generación completa
      const response = await fetch('/api/rma/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          language: plan?.survey_responses?.language || 'Español',
          layout_url: publicUrl
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al generar el plan de contingencia.');
      }

      // Recargar
      await fetchPlan();

    } catch (err: any) {
      console.error(err);
      alert(`Error al generar el plan: ${err.message}`);
    } finally {
      setUploadingFile(false);
      setGeneratingFullPlan(false);
    }
  };

  // Simulación rápida de generación sin subir archivo (para testing directo)
  const handleGenerateWithoutMap = async () => {
    try {
      setGeneratingFullPlan(true);
      setGeneratingMessage("Redactando plan completo mediante IA...");
      
      const response = await fetch('/api/rma/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          language: plan?.survey_responses?.language || 'Español'
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al generar el plan de contingencia.');
      }

      await fetchPlan();
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setGeneratingFullPlan(false);
    }
  };

  // Simular pago del saldo de $1,500 (Pasa de 'review' a 'paid')
  const handlePayBalance = async () => {
    await handleUpdateStatus('paid');
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to split markdown sections for the tab switcher
  const getPlanSections = () => {
    if (!plan?.generated_plan_md) return [];
    const text = plan.generated_plan_md;
    const regex = /^##\s+(.+)$/gm;
    const sections = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      sections.push(match[1]);
    }
    return sections;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050a15] text-white flex flex-col items-center justify-center">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-[#00e5ff]/10 border-t-[#00e5ff] animate-spin"></div>
        </div>
        <p className="text-slate-400 text-sm">Cargando...</p>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-[#050a15] text-white flex flex-col items-center justify-center px-6">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-2xl font-black mb-2">Error de Carga</h1>
        <p className="text-slate-400 text-sm mb-6 text-center max-w-md">{error || 'El plan de contingencia especificado no existe o ha sido eliminado.'}</p>
        <Link href="/rma" className="px-6 py-3 bg-[#1e293b] border border-white/5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a RMA
        </Link>
      </div>
    );
  }

  const currentStatus = plan.survey_responses?.status || 'proposal';
  const sections = getPlanSections();

  return (
    <main className="min-h-screen bg-[#050a15] text-[#cbd5e1] font-open-sans flex flex-col selection:bg-[#00e5ff]/30">
      
      {/* Header - Se oculta al imprimir */}
      <header className="w-full px-6 py-5 bg-[#0a1128]/80 backdrop-blur-md border-b border-white/5 fixed top-0 z-50 flex justify-between items-center print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/rma" className="flex items-center gap-3">
            <Image src="/logo-sure.png" alt="SURE Logo" width={32} height={32} className="object-contain" priority />
            <span className="font-montserrat font-black text-xl tracking-widest uppercase text-white">
              SURE<span className="text-emerald-500">.</span>
            </span>
          </Link>
          <span className={`text-[10px] border font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            currentStatus === 'paid' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' :
            currentStatus === 'review' ? 'bg-amber-500/10 border-amber-500 text-amber-400' :
            'bg-[#00e5ff]/10 border-[#00e5ff]/30 text-[#00e5ff]'
          }`}>
            {currentStatus === 'paid' ? 'Entregado' : currentStatus === 'review' ? 'Borrador' : 'Propuesta'}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {currentStatus === 'paid' ? (
            <button 
              onClick={handlePrint}
              className="px-5 py-2.5 bg-[#00e5ff] text-black font-black rounded-xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.2)] text-xs uppercase tracking-wider"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" /> Imprimir / PDF
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-800/40 border border-white/5 px-4 py-2 rounded-xl">
              <Lock className="w-3.5 h-3.5 text-amber-400" /> Descargas bloqueadas
            </div>
          )}
          <Link href="/rma" className="text-sm text-slate-400 hover:text-white transition-colors">
            Cerrar
          </Link>
        </div>
      </header>

      {/* Pantalla de carga para la IA */}
      {generatingFullPlan && (
        <div className="fixed inset-0 bg-[#050a15]/95 z-[100] flex flex-col items-center justify-center p-6">
          <Globe className="w-16 h-16 text-[#00e5ff] animate-spin mb-6" />
          <h2 className="text-2xl font-black text-white mb-2">Redactando Plan de Contingencia Completo</h2>
          <p className="text-slate-400 text-sm text-center max-w-md animate-pulse">{generatingMessage}</p>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-grow pt-32 pb-20 px-6 max-w-7xl w-full mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar de Navegación - Se oculta al imprimir */}
        <aside className="w-full lg:w-72 flex-shrink-0 print:hidden lg:sticky lg:top-32 lg:h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
          <div className="bg-[#0a1128]/60 border border-white/5 p-6 rounded-2xl glass space-y-6">
            <div>
              <h2 className="text-[10px] text-[#00e5ff] font-bold uppercase tracking-widest mb-1">Cliente</h2>
              <h3 className="text-lg font-black text-white leading-tight truncate">{plan.client_name}</h3>
              <p className="text-xs text-slate-400 mt-1">{plan.client_type}</p>
            </div>

            {/* Lista de Entregables */}
            <div className="border-t border-white/5 pt-4">
              <h4 className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-[#00e5ff]" /> Entregables del Plan
              </h4>
              <ul className="text-xs text-slate-400 space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>0.- Planilla de Requerimientos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>1.- Instructivo General</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>2.- Plan de Implementación</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>3.- Formatos y Plantillas (3.1 - 3.6)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>4.- Repositorio de Información</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>5.- Plan Kaizen y Mejora Continua</span>
                </li>
              </ul>
            </div>

            {/* Secciones del Documento */}
            {currentStatus !== 'proposal' && sections.length > 0 && (
              <div className="border-t border-white/5 pt-4">
                <h4 className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">Secciones del Documento</h4>
                <nav className="flex flex-col gap-1.5">
                  <button
                    onClick={() => setActiveSection("all")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      activeSection === "all" ? 'bg-[#00e5ff]/10 text-[#00e5ff] font-bold border-l-2 border-[#00e5ff]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>Ver Todo</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  {sections.map((sect, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveSection(sect);
                        const id = sect.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                        const el = document.getElementById(id);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-between truncate cursor-pointer"
                    >
                      <span className="truncate">{sect}</span>
                      <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                    </button>
                  ))}
                </nav>
              </div>
            )}

            <div className="border-t border-white/5 pt-4 text-center">
              <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Generado: {new Date(plan.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </aside>

        {/* Plan Body Area */}
        <div className="flex-grow flex flex-col gap-8 w-full">
          
          {/* ESTADO 1: PROPUESTA (IMPACO / SIN ANTICIPO) */}
          {currentStatus === 'proposal' && (
            <div className="w-full space-y-8">
              
              {/* Propuesta Económica y Firma */}
              <div className="bg-[#0a1128]/80 border border-[#00e5ff]/20 p-8 rounded-3xl shadow-xl glass">
                <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#00e5ff]" /> 1. Propuesta de Implementación y Activación
                </h2>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  Para proceder con la redacción completa y personalizada del Plan de Contingencia, es necesario formalizar el acuerdo de adhesión y realizar el pago del anticipo de seguridad.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-[#050a15] p-5 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inversión de Puesta en Marcha</span>
                    <h3 className="text-3xl font-black text-white mt-1">$2,000 USD</h3>
                    <ul className="text-xs text-slate-400 mt-4 space-y-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" /> $500 de anticipo a la firma digital
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" /> $1,500 al finalizar la aprobación
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" /> Incluye 2 meses de soporte gratuito
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[#050a15] p-5 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-bold text-[#00e5ff] uppercase tracking-widest">Servicio Opcional</span>
                    <h3 className="text-xl font-black text-white mt-1">Asesoría en Vivo en Sitio</h3>
                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                      Coordinación de visitas presenciales para inspección física, adiestramiento in-situ y simulacros en vivo. Cotización personalizada bajo la aceptación de condiciones de prestación de servicios.
                    </p>
                  </div>
                </div>

                {/* Firma de Acuerdo */}
                <div className="border-t border-white/5 pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      id="sign-check" 
                      className="mt-1 w-4 h-4 accent-[#00e5ff]"
                      checked={signatureSigned}
                      onChange={(e) => setSignatureSigned(e.target.checked)}
                    />
                    <label htmlFor="sign-check" className="text-xs text-slate-300 leading-relaxed cursor-pointer select-none">
                      Acepto formalmente las condiciones de prestación de servicios y firmo digitalmente este acuerdo de adhesión para el inicio del Plan de Contingencia.
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button 
                      onClick={handlePayDeposit}
                      disabled={paymentLoading || !signatureSigned}
                      className="px-6 py-3.5 bg-gradient-to-r from-[#00e5ff] to-cyan-500 text-black font-black uppercase tracking-widest text-xs rounded-xl hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,229,255,0.25)] flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {paymentLoading ? 'Procesando...' : 'Firmar y Pagar Anticipo ($500 USD)'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Renders Propuesta No-Spoiler */}
              <article className="bg-[#0a1128]/30 border border-white/5 p-8 md:p-12 rounded-3xl shadow-xl relative glass select-none">
                <div className="absolute inset-0 bg-[#050a15]/5 pointer-events-none z-10" />
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {plan.generated_plan_md}
                  </ReactMarkdown>
                </div>
              </article>
            </div>
          )}

          {/* ESTADO 2: BORRADOR DE REVISIÓN (ANTICIPO $500 PAGADO) */}
          {currentStatus === 'review' && (
            <div className="w-full space-y-8">
              
              {/* Panel de Carga de Planos */}
              <div className="bg-[#0a1128]/80 border border-amber-500/30 p-8 rounded-3xl shadow-xl glass relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none" />
                
                <h2 className="text-xl font-black text-white mb-3 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-amber-400" /> Cargar Plano de las Instalaciones
                </h2>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  ¡Anticipo de $500 recibido! Para generar tu Plan de Contingencia completo con rutas de evacuación específicas, sube un plano técnico de distribución de áreas (fábrica, edificios, etc.).
                </p>

                <form onSubmit={handleFileUploadAndGenerate} className="flex flex-col sm:flex-row gap-4 items-center">
                  <input 
                    type="file" 
                    accept="image/*,.pdf"
                    className="w-full sm:w-auto bg-[#050a15] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      type="submit"
                      disabled={uploadingFile}
                      className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-black text-xs uppercase tracking-wider rounded-xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" /> Subir y Generar Plan
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerateWithoutMap}
                      className="px-5 py-3 bg-slate-800 border border-white/5 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      Generar sin Plano
                    </button>
                  </div>
                </form>
              </div>

              {/* Botón de Aprobación y Pago de Saldo */}
              <div className="bg-[#0a1128]/80 border border-[#00e5ff]/20 p-8 rounded-3xl shadow-xl glass flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-emerald-400" /> Revisión y Aprobación del Plan
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Lee el borrador de contingencia a continuación. Si estás conforme con el resultado, aprueba el plan para proceder al pago del saldo final de $1,500 y habilitar la descarga completa.
                  </p>
                </div>
                <button
                  onClick={handlePayBalance}
                  disabled={paymentLoading}
                  className="px-6 py-3.5 bg-gradient-to-r from-[#00e5ff] to-cyan-500 text-black font-black uppercase tracking-widest text-xs rounded-xl hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,229,255,0.25)] flex items-center gap-2 cursor-pointer text-center"
                >
                  <CheckCircle2 className="w-4 h-4" /> Aprobar y Pagar Saldo ($1,500 USD)
                </button>
              </div>

              {/* Visor de Plan Completo (Bloqueado) */}
              <article className="bg-[#0a1128]/30 border border-white/5 p-8 md:p-12 rounded-3xl shadow-xl relative glass select-none">
                <div className="absolute inset-0 bg-[#050a15]/5 pointer-events-none z-10" />
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: (props) => <h1 {...props} className="text-3xl font-black text-white border-b border-white/10 pb-3 mb-6" />,
                      h2: (props) => <h2 {...props} className="text-2xl font-black text-white mt-10 mb-4" />,
                      h3: (props) => <h3 {...props} className="text-xl font-bold text-white mt-6 mb-3" />,
                      table: (props) => <div className="overflow-x-auto my-6"><table {...props} className="min-w-full divide-y divide-white/10" /></div>,
                      th: (props) => <th {...props} className="bg-white/5 px-4 py-3 text-left text-xs font-bold text-white uppercase" />,
                      td: (props) => <td {...props} className="px-4 py-3 text-sm text-slate-300 border-t border-white/5" />,
                      pre: (props) => {
                        const className = (props.children as any)?.props?.className || '';
                        if (className.includes('language-mermaid')) {
                          const code = (props.children as any)?.props?.children || '';
                          return (
                            <div className="my-6">
                              <span className="text-[10px] uppercase font-bold tracking-widest text-[#00e5ff] block mb-2">Diagrama de Organización</span>
                              <Mermaid chart={code} />
                            </div>
                          );
                        }
                        return <pre {...props} className="bg-[#050a15] p-4 rounded-xl border border-white/5 overflow-x-auto" />;
                      }
                    }}
                  >
                    {plan.generated_plan_md}
                  </ReactMarkdown>
                </div>
              </article>
            </div>
          )}

          {/* ESTADO 3: PLAN ENTREGADO (SALDO $1,500 PAGADO) */}
          {currentStatus === 'paid' && (
            <div className="w-full space-y-6">
              
              {/* Notificación de Éxito */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-3xl shadow-xl flex items-start gap-4 glass print:hidden">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0 mt-0.5 animate-bounce" />
                <div>
                  <h3 className="text-lg font-black text-white">¡Plan de Contingencia Entregado!</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    El plan final ha sido desbloqueado. Ahora puedes imprimir el documento completo o guardarlo como PDF usando el botón del encabezado. Cuentas con 2 meses de soporte técnico y Kaizen activo sin costo.
                  </p>
                </div>
              </div>

              {/* Visor de Plan Completo (Desbloqueado) */}
              <article className="bg-[#0a1128]/30 border border-white/5 p-8 md:p-12 rounded-3xl shadow-xl glass print:border-none print:bg-white print:p-0 print:shadow-none print:glass-none">
                <div className="prose prose-invert max-w-none print:prose-light">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({node, ...props}) => {
                        const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
                        return <h1 id={id} {...props} className="text-3xl font-black text-white border-b border-white/10 pb-3 mb-6 print:text-black print:border-black/20" />;
                      },
                      h2: ({node, ...props}) => {
                        const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
                        return <h2 id={id} {...props} className="text-2xl font-black text-white mt-10 mb-4 print:text-black" />;
                      },
                      h3: ({node, ...props}) => {
                        const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
                        return <h3 id={id} {...props} className="text-xl font-bold text-white mt-6 mb-3 print:text-black" />;
                      },
                      table: ({node, ...props}) => (
                        <div className="overflow-x-auto my-6 border border-white/5 rounded-xl print:border-black/10">
                          <table {...props} className="min-w-full divide-y divide-white/10 print:divide-black/20" />
                        </div>
                      ),
                      th: ({node, ...props}) => (
                        <th {...props} className="bg-white/5 px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider print:bg-black/5 print:text-black" />
                      ),
                      td: ({node, ...props}) => (
                        <td {...props} className="px-4 py-3 text-sm text-slate-300 border-t border-white/5 print:text-black print:border-black/10" />
                      ),
                      pre: ({node, ...props}) => {
                        const className = (props.children as any)?.props?.className || '';
                        if (className.includes('language-mermaid')) {
                          const code = (props.children as any)?.props?.children || '';
                          return (
                            <div className="my-6 overflow-x-auto">
                              <span className="text-[10px] uppercase font-bold tracking-widest text-[#00e5ff] block mb-3 print:text-black">Diagrama de Organización</span>
                              <Mermaid chart={code} />
                            </div>
                          );
                        }
                        return <pre {...props} className="bg-[#050a15] p-4 rounded-xl border border-white/5 overflow-x-auto print:bg-black/5 print:text-black" />;
                      },
                      blockquote: ({node, ...props}) => {
                        const content = props.children?.toString() || '';
                        let alertStyle = 'border-l-4 border-[#00e5ff] bg-[#00e5ff]/5 text-slate-300';
                        let alertTitle = 'NOTA';
                        
                        if (content.includes('[!IMPORTANT]')) {
                          alertStyle = 'border-l-4 border-emerald-500 bg-emerald-500/5 text-slate-300';
                          alertTitle = 'IMPORTANTE';
                        } else if (content.includes('[!WARNING]') || content.includes('[!CAUTION]')) {
                          alertStyle = 'border-l-4 border-amber-500 bg-amber-500/5 text-slate-300';
                          alertTitle = 'ADVERTENCIA';
                        }

                        return (
                          <div className={`p-4 rounded-r-xl my-6 print:bg-black/5 print:border-black ${alertStyle}`}>
                            <span className="text-[10px] font-bold tracking-wider uppercase block mb-1 print:text-black">{alertTitle}</span>
                            <div className="text-sm leading-relaxed print:text-black">
                              {React.Children.map(props.children, child => {
                                if (typeof child === 'string') {
                                  return child.replace(/\[!(IMPORTANT|WARNING|CAUTION|NOTE)\]/g, '').trim();
                                }
                                return child;
                              })}
                            </div>
                          </div>
                        );
                      }
                    }}
                  >
                    {plan.generated_plan_md}
                  </ReactMarkdown>
                </div>
              </article>
            </div>
          )}

        </div>

      </div>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-xs text-slate-500 border-t border-white/5 bg-[#0a1128]/40 print:hidden">
        &copy; {new Date().getFullYear()} SURE Risk Mitigation Architecture (RMA). Todos los derechos reservados.
      </footer>
    </main>
  );
}
