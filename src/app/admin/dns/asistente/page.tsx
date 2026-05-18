"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, ArrowLeft, Loader2, Info } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/ui/LanguageSelector';
import KaizenFeedback from '@/components/ui/KaizenFeedback';

export default function DNSAssistantPage() {
  const { t } = useLanguage();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [domain, setDomain] = useState('');
  const [diagnostic, setDiagnostic] = useState<any>(null);
  const [checkingDns, setCheckingDns] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // Escuchar el evento de pegar (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.items) {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
              setMimeType(blob.type);
              const reader = new FileReader();
              reader.onload = (event) => {
                if (event.target?.result) {
                  setImageSrc(event.target.result as string);
                  setResult(null); // Reset previous result
                }
              };
              reader.readAsDataURL(blob);
            }
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const checkDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    setCheckingDns(true);
    setDiagnostic(null);
    try {
      const response = await fetch('/api/dns-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error verificando dominio');
      setDiagnostic(data);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setCheckingDns(false);
    }
  };

  const processImage = async () => {
    if (!imageSrc) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/dns-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageBase64: imageSrc, 
          mimeType,
          context: {
            mission: diagnostic?.recommendedMission || 'Find DNS',
            domain: diagnostic?.domain || domain
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error procesando imagen');
      
      setResult(data);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para renderizar el recuadro sobre la imagen
  const renderBoundingBox = () => {
    if (!result || !result.found || !result.box_2d || !imageRef.current) return null;

    // Gemini retorna coordenadas [ymin, xmin, ymax, xmax] en una escala de 0 a 1000
    const [ymin, xmin, ymax, xmax] = result.box_2d;
    
    // Obtenemos las dimensiones reales de la imagen mostrada en pantalla
    const { width, height } = imageRef.current.getBoundingClientRect();

    // Convertimos la escala 1000 a pixeles reales
    const top = (ymin / 1000) * height;
    const left = (xmin / 1000) * width;
    const boxHeight = ((ymax - ymin) / 1000) * height;
    const boxWidth = ((xmax - xmin) / 1000) * width;

    return (
      <div 
        className="absolute border-4 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)] z-10 animate-pulse bg-red-500/20"
        style={{
          top: `${top}px`,
          left: `${left}px`,
          width: `${boxWidth}px`,
          height: `${boxHeight}px`
        }}
      >
        {/* Flecha indicadora encima de la caja */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
           <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">CLIC AQUÍ</div>
           <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-red-500"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050810] text-white font-sans flex flex-col relative overflow-hidden">
      {/* Premium Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

      <nav className="w-full px-8 py-5 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md z-10">
        <Link href="/admin/dns" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> {t('dns.back')}
        </Link>
        <h1 className="text-xl font-bold font-montserrat tracking-[0.2em] uppercase bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          {t('dns.title')}
        </h1>
        <div className="flex items-center">
           <LanguageSelector />
        </div>
      </nav>

      <div className="flex-1 max-w-5xl w-full mx-auto p-8 flex flex-col items-center z-10">
        
        {/* Fase 1: Diagnóstico de Dominio */}
        {!diagnostic && (
          <div className="text-center max-w-2xl mt-16 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6 uppercase tracking-wider">
               {t('dns.step1_badge')}
            </div>
            <h2 className="text-4xl font-bold mb-6 font-montserrat">{t('dns.step1_title')}</h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              {t('dns.step1_desc')}
            </p>
            <form onSubmit={checkDomain} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input 
                type="text" 
                placeholder={t('dns.placeholder')} 
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                required
              />
              <button 
                type="submit"
                disabled={checkingDns || !domain}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2"
              >
                {checkingDns ? <><Loader2 className="w-5 h-5 animate-spin" /> {t('dns.scanning')}</> : t('dns.scan_btn')}
              </button>
            </form>
          </div>
        )}

        {/* Fase 2: Instrucciones Visuales (Si ya hay diagnóstico pero no hay imagen) */}
        {diagnostic && !imageSrc && (
          <div className="w-full max-w-3xl mt-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Banner de Estado Premium */}
            <div className={`mb-10 p-8 rounded-2xl border backdrop-blur-sm shadow-2xl relative overflow-hidden ${diagnostic.recommendedMission === 'All Clear' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
              {/* Subtle background glow based on status */}
              <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -z-10 ${diagnostic.recommendedMission === 'All Clear' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`} />
              
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-2xl font-bold flex items-center gap-3 font-montserrat">
                   <Info className={`w-6 h-6 ${diagnostic.recommendedMission === 'All Clear' ? 'text-emerald-400' : 'text-rose-400'}`} /> 
                   {t('dns.diag_title')}: <span className="text-white">{diagnostic.domain}</span>
                 </h3>
                 <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${diagnostic.recommendedMission === 'All Clear' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>
                    {diagnostic.recommendedMission}
                 </span>
              </div>

              {diagnostic.issues && diagnostic.issues.length > 0 ? (
                <div className="bg-black/40 rounded-xl p-5 border border-white/5">
                   <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">{t('dns.risks')}</h4>
                   <ul className="space-y-3">
                     {diagnostic.issues.map((issue: string, idx: number) => (
                       <li key={idx} className={`flex items-start gap-3 ${issue.includes('CRITICAL') ? 'text-rose-300' : 'text-slate-300'}`}>
                         <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${issue.includes('CRITICAL') ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'bg-slate-500'}`} />
                         <span className="leading-relaxed">{issue}</span>
                       </li>
                     ))}
                   </ul>
                </div>
              ) : (
                <p className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400">✓</span>
                  {t('dns.all_clear')}
                </p>
              )}
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold mb-6 uppercase tracking-wider">
                 {t('dns.step2_badge')}
              </div>
              <h2 className="text-3xl font-bold mb-4 font-montserrat">{t('dns.step2_title')}</h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
                {t('dns.step2_desc').split('Ctrl+V')[0]}<kbd className="bg-white/10 border border-white/20 px-2 py-1 rounded mx-1 font-mono text-indigo-300 shadow-sm">Ctrl + V</kbd>{t('dns.step2_desc').split('Ctrl+V')[1] || ''}
              </p>
            </div>
          </div>
        )}

        {/* Zona de Imagen */}
        {imageSrc && (
          <div className="w-full flex flex-col items-center">
            
            {/* Mensaje de la IA */}
            {result && (
              <div className={`w-full max-w-3xl p-8 rounded-2xl mb-8 border backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-top-4 ${result.found ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-indigo-900/20 border-indigo-500/30'}`}>
                 <div className="flex items-start gap-4">
                   <div className={`p-3 rounded-xl shrink-0 ${result.found ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                     <Info className="w-6 h-6" />
                   </div>
                   <div>
                     <h3 className={`text-xl font-bold mb-3 font-montserrat tracking-wide ${result.found ? 'text-emerald-400' : 'text-indigo-400'}`}>
                       {result.found ? t('dns.next_step') : t('dns.analysis_done')}
                     </h3>
                     <p className="text-white text-lg leading-relaxed">{result.instruction}</p>
                     
                     <div className="mt-5 pt-5 border-t border-white/10">
                       <p className="text-sm text-slate-400 flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                         {t('dns.paste_next').split('Ctrl+V')[0]}<kbd className="bg-white/10 border border-white/20 px-1 py-0.5 rounded font-mono text-slate-300">Ctrl+V</kbd>{t('dns.paste_next').split('Ctrl+V')[1] || ''}
                       </p>
                     </div>
                   </div>
                 </div>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-4 mb-8">
               <button 
                 onClick={processImage}
                 disabled={loading}
                 className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-3 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> {t('dns.btn_processing')}</> : <><Camera className="w-5 h-5" /> {t('dns.btn_process')}</>}
               </button>
               <button 
                 onClick={() => { setImageSrc(null); setResult(null); }}
                 className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3.5 rounded-xl font-semibold transition-colors"
               >
                 {t('dns.btn_clear')}
               </button>
            </div>

            {/* Imagen Renderizada con Recuadro */}
            <div className="relative max-w-full rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-black">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img 
                 ref={imageRef}
                 src={imageSrc} 
                 alt="Screenshot del usuario" 
                 className="max-w-full h-auto max-h-[70vh] opacity-90"
                 onLoad={() => {
                    // Forzar re-renderizado si ya había un resultado para ajustar la caja a las dimensiones reales
                    if (result) setResult({...result});
                 }}
               />
               {renderBoundingBox()}
            </div>
             
             {/* Kaizen Feedback */}
             {result && (
               <div className="w-full mt-12 mb-8">
                 <KaizenFeedback domainAnalyzed={diagnostic.domain} />
               </div>
             )}
             
          </div>
        )}

      </div>
    </div>
  );
}
