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
  Lock, CreditCard, Upload, RefreshCw, Eye, CheckCircle2, Info, Globe, Check,
  FileSpreadsheet, Presentation
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
      if (typeof window !== 'undefined' && data) {
        document.title = `SURE RMA - Plan de Contingencia - ${data.client_name}`;
      }
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

  // Helper to download Word files (.doc format which is fully editable in MS Word)
  const downloadWordTemplate = (title: string, headers: string[], rows: string[][]) => {
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #0f172a; text-align: center; font-size: 18px; margin-bottom: 5px; }
          h2 { color: #475569; text-align: center; font-size: 12px; margin-bottom: 20px; font-weight: normal; }
          p { font-size: 11px; margin: 3px 0; color: #334155; }
          table { border-collapse: collapse; width: 100%; margin-top: 15px; }
          th, td { border: 1px solid #cbd5e1; padding: 6px 10px; font-size: 11px; text-align: left; }
          th { background-color: #f1f5f9; font-weight: bold; color: #0f172a; }
        </style>
      </head>
      <body>
        <h1>SURE RMA - PLAN DE CONTINGENCIA</h1>
        <h2>${title.toUpperCase()}</h2>
        <p><strong>Comunidad/Entidad:</strong> ${plan?.client_name}</p>
        <p><strong>Tipo de Entidad:</strong> ${plan?.client_type}</p>
        <p><strong>Fecha de Emisión:</strong> ${new Date(plan?.created_at || '').toLocaleDateString()}</p>
        <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 15px 0;" />
        <table>
          <thead>
            <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
        <br />
        <p style="font-size: 9px; color: #94a3b8; text-align: center; margin-top: 40px;">Documento oficial generado por SURE RMA AI. Todos los derechos reservados.</p>
      </body>
      </html>
    `;
    // Prepend UTF-8 BOM to guarantee proper character rendering in Microsoft Word
    const blob = new Blob(['\ufeff' + html], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_${plan?.client_name.replace(/\s+/g, '_')}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper to download Excel templates as clean CSV files (to avoid Excel format/extension warning alerts)
  const downloadExcelTemplate = (title: string, headers: string[], rows: string[][]) => {
    const csvRows = [];
    
    // Add title header
    csvRows.push([`SURE RMA - ${title.toUpperCase()}`]);
    csvRows.push([`Cliente: ${plan?.client_name}`]);
    csvRows.push([`Fecha: ${new Date(plan?.created_at || '').toLocaleDateString()}`]);
    csvRows.push([]); // Spacing
    
    // Add headers
    csvRows.push(headers);
    
    // Add rows
    rows.forEach(row => {
      csvRows.push(row);
    });
    
    // Convert to CSV string, escaping quotes and wrapping values in quotes
    const csvString = 'sep=,\n' + csvRows.map(row => 
      row.map(cell => {
        const escaped = String(cell).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    ).join('\n');
    
    // Prepend UTF-8 BOM so Excel decodes accents correctly (e.g. é, ó)
    const blob = new Blob(['\ufeff' + csvString], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_${plan?.client_name.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper to download PowerPoint vector graphic converted to a native PPTX file
  const downloadPPTXTemplate = () => {
    // Load pptxgenjs dynamically
    import('pptxgenjs').then(({ default: pptxgen }) => {
      try {
        const pres = new pptxgen();
        
        // Define standard widescreen size explicitly to guarantee 13.33 x 7.5 inches layout
        pres.defineLayout({ name: 'STANDARD_16_9', width: 13.33, height: 7.5 });
        pres.layout = 'STANDARD_16_9';
        
        const slide = pres.addSlide();
        
        // Correct background property for full-slide background fill
        slide.background = { fill: '0a1128' };
        
        // Add Title
        slide.addText("ORGANIGRAMA DE RESPUESTA ANTE EMERGENCIAS", {
          x: 1.0,
          y: 0.4,
          w: 11.33,
          h: 0.4,
          fontSize: 18,
          bold: true,
          color: '00E5FF',
          fontFace: 'Arial'
        });
        
        // Add Subtitle
        slide.addText(`Cliente: ${plan?.client_name} | Documento oficial SURE RMA`, {
          x: 1.0,
          y: 0.8,
          w: 11.33,
          h: 0.2,
          fontSize: 9,
          color: '94A3B8',
          fontFace: 'Arial'
        });

        // ----------------- TIER 1: DIRECCIÓN GENERAL -----------------
        slide.addText(`DIRECCIÓN GENERAL\n${plan?.client_name || 'Kauno Elektronika'}\nAutoridad Máxima del PDC`, {
          shape: 'rect',
          x: 5.06,
          y: 1.1,
          w: 3.2,
          h: 0.6,
          fill: { color: '1a1a2e' },
          line: { color: 'e94560', width: 2 },
          color: 'FFFFFF',
          align: 'center',
          valign: 'middle',
          fontSize: 8,
          bold: true,
          fontFace: 'Arial'
        });

        // ----------------- TIER 2: COORDINADOR GENERAL -----------------
        slide.addText("⭐ COORDINADOR GENERAL\nComando de Emergencias\n(+ 2 Suplentes)", {
          shape: 'rect',
          x: 5.06,
          y: 1.9,
          w: 3.2,
          h: 0.6,
          fill: { color: '16213e' },
          line: { color: '0f3460', width: 2 },
          color: 'FFFFFF',
          align: 'center',
          valign: 'middle',
          fontSize: 8,
          bold: true,
          fontFace: 'Arial'
        });

        // ----------------- TIER 3: COORDINADORES DE ÁREA -----------------
        // C - Seguridad (Center X = 2.2)
        slide.addText("🔒 COORD. DE SEGURIDAD\nControl Perimetral e Intrusión\n(+ 2 Suplentes)", {
          shape: 'rect',
          x: 1.0,
          y: 2.9,
          w: 2.4,
          h: 0.6,
          fill: { color: '0f3460' },
          line: { color: 'e94560', width: 1.5 },
          color: 'FFFFFF',
          align: 'center',
          valign: 'middle',
          fontSize: 7.5,
          bold: true,
          fontFace: 'Arial'
        });

        // D - Médico (Center X = 5.17)
        slide.addText("🏥 COORD. MÉDICO\nPrimeros Auxilios Fís. y Psic.\n(+ 2 Suplentes)", {
          shape: 'rect',
          x: 3.97,
          y: 2.9,
          w: 2.4,
          h: 0.6,
          fill: { color: '0f3460' },
          line: { color: 'e94560', width: 1.5 },
          color: 'FFFFFF',
          align: 'center',
          valign: 'middle',
          fontSize: 7.5,
          bold: true,
          fontFace: 'Arial'
        });

        // E - Logística (Center X = 8.14)
        slide.addText("📦 COORD. DE LOGÍSTICA\nServicios Críticos y Suministros\n(+ 2 Suplentes)", {
          shape: 'rect',
          x: 6.94,
          y: 2.9,
          w: 2.4,
          h: 0.6,
          fill: { color: '0f3460' },
          line: { color: 'e94560', width: 1.5 },
          color: 'FFFFFF',
          align: 'center',
          valign: 'middle',
          fontSize: 7.5,
          bold: true,
          fontFace: 'Arial'
        });

        // F - Defensa Civil (Center X = 11.11)
        slide.addText("🚨 COORD. DEFENSA CIVIL\nRescate y Evacuación\n(+ 2 Suplentes)", {
          shape: 'rect',
          x: 9.91,
          y: 2.9,
          w: 2.4,
          h: 0.6,
          fill: { color: '0f3460' },
          line: { color: 'e94560', width: 1.5 },
          color: 'FFFFFF',
          align: 'center',
          valign: 'middle',
          fontSize: 7.5,
          bold: true,
          fontFace: 'Arial'
        });

        // ----------------- TIER 4: BRIGADAS Y ENLACES -----------------
        const tier4 = [
          { text: "👮 Brigada de Seguridad\nPrivada y Accesos", x: 1.0, w: 1.1 },
          { text: "📞 Enlace con Policía\nCoordinación Externa", x: 2.27, w: 1.1 },
          { text: "🩺 Brigada de Primeros\nAuxilios Físicos", x: 3.54, w: 1.1 },
          { text: "🧠 Apoyo Psicológico\nPost-Evento", x: 4.81, w: 1.1 },
          { text: "⚡ Brigada de Servicios\nGas, Electricidad y Agua", x: 6.08, w: 1.1 },
          { text: "🔧 Brigada Mantenimiento\nGenerador y Críticos", x: 7.35, w: 1.1 },
          { text: "🚨 Guías de Evacuación\nZonas A, B, C y D", x: 8.62, w: 1.1 },
          { text: "🔥 Brigada Contra\nIncendios (Extintores)", x: 9.89, w: 1.1 },
          { text: "🚒 Enlace con Bomberos\nCoordinación Externa", x: 11.16, w: 1.1 }
        ];

        tier4.forEach(item => {
          slide.addText(item.text, {
            shape: 'rect',
            x: item.x,
            y: 3.9,
            w: item.w,
            h: 0.6,
            fill: { color: '1a1a2e' },
            line: { color: '555555', width: 1 },
            color: 'CCCCCC',
            align: 'center',
            valign: 'middle',
            fontSize: 6.5,
            fontFace: 'Arial'
          });
        });

        // ----------------- CONNECTOR LINES -----------------
        // Line from Tier 1 to Tier 2
        slide.addShape('line', { x: 6.66, y: 1.7, w: 0, h: 0.2, line: { color: 'cbd5e1', width: 1.5 } });
        
        // Line from Tier 2 down
        slide.addShape('line', { x: 6.66, y: 2.5, w: 0, h: 0.2, line: { color: 'cbd5e1', width: 1.5 } });
        
        // Tier 3 Horizontal line
        slide.addShape('line', { x: 2.2, y: 2.7, w: 8.91, h: 0, line: { color: 'cbd5e1', width: 1.5 } });
        
        // Tier 3 Vertical drop lines
        slide.addShape('line', { x: 2.2, y: 2.7, w: 0, h: 0.2, line: { color: 'cbd5e1', width: 1.5 } });
        slide.addShape('line', { x: 5.17, y: 2.7, w: 0, h: 0.2, line: { color: 'cbd5e1', width: 1.5 } });
        slide.addShape('line', { x: 8.14, y: 2.7, w: 0, h: 0.2, line: { color: 'cbd5e1', width: 1.5 } });
        slide.addShape('line', { x: 11.11, y: 2.7, w: 0, h: 0.2, line: { color: 'cbd5e1', width: 1.5 } });

        // Tier 3 to Tier 4 drop lines
        // Column C
        slide.addShape('line', { x: 2.2, y: 3.5, w: 0, h: 0.2, line: { color: 'cbd5e1', width: 1.2 } });
        slide.addShape('line', { x: 1.55, y: 3.7, w: 1.27, h: 0, line: { color: 'cbd5e1', width: 1.2 } });
        slide.addShape('line', { x: 1.55, y: 3.7, w: 0, h: 0.2, line: { color: 'cbd5e1', width: 1.2 } });
        slide.addShape('line', { x: 2.82, y: 3.7, w: 0, h: 0.2, line: { color: 'cbd5e1', width: 1.2 } });

        // Column D
        slide.addShape('line', { x: 5.17, y: 3.5, w: 0, h: 0.2, line: { color: 'cbd5e1', width: 1.2 } });
        slide.addShape('line', { x: 4.09, y: 3.7, w: 1.27, h: 0, line: { color: 'cbd5e1', width: 1.2 } });
        slide.addShape('line', { x: 4.09, y: 3.7, w: 0, h: 0.2, line: { color: 'cbd5e1', width: 1.2 } });
        slide.addShape('line', { x: 5.36, y: 3.7, w: 0, h: 0.2, line: { color: 'cbd5e1', width: 1.2 } });

        // Column E
        slide.addShape('line', { x: 8.14, y: 3.5, w: 0, h: 0.2, line: { color: 'cbd5e1', width: 1.2 } });
        slide.addShape('line', { x: 6.63, y: 3.7, w: 1.27, h: 0, line: { color: 'cbd5e1', width: 1.2 } });
        slide.addShape('line', { x: 6.63, y: 3.7, w: 0, h: 0.2, line: { color: 'cbd5e1', width: 1.2 } });
        slide.addShape('line', { x: 7.9, y: 3.7, w: 0, h: 0.2, line: { color: 'cbd5e1', width: 1.2 } });

        // Column F
        slide.addShape('line', { x: 11.11, y: 3.5, w: 0, h: 0.2, line: { color: 'cbd5e1', width: 1.2 } });
        slide.addShape('line', { x: 9.17, y: 3.7, w: 2.54, h: 0, line: { color: 'cbd5e1', width: 1.2 } });
        slide.addShape('line', { x: 9.17, y: 3.7, w: 0, h: 0.2, line: { color: 'cbd5e1', width: 1.2 } });
        slide.addShape('line', { x: 10.44, y: 3.7, w: 0, h: 0.2, line: { color: 'cbd5e1', width: 1.2 } });
        slide.addShape('line', { x: 11.71, y: 3.7, w: 0, h: 0.2, line: { color: 'cbd5e1', width: 1.2 } });

        // Save the PPTX presentation
        pres.writeFile({ fileName: `Organigrama_Contingencia_${plan?.client_name.replace(/\s+/g, '_')}.pptx` });
      } catch (err) {
        console.error("PPTX generation failed:", err);
        alert("Ocurrió un error al generar la presentación. Intenta de nuevo.");
      }
    });
  };

  // Formats Templates Data
  const handleDownloadFormat3_1 = () => {
    downloadWordTemplate("Formato 3.1 - Directorio de Coordinadores y Suplentes", 
      ["Rol de Emergencia", "Nombre del Titular", "Suplente Oficial 1", "Suplente Oficial 2", "Teléfono de Contacto", "Canal de Radio / Frecuencia"],
      [
        ["Coordinador General (Comando)", "[Escribir Nombre del Titular]", "[Escribir Suplente 1]", "[Escribir Suplente 2]", "[Escribir Teléfono]", "Canal 1 (Seguridad)"],
        ["Coordinador de Seguridad", "[Escribir Nombre del Titular]", "[Escribir Suplente 1]", "[Escribir Suplente 2]", "[Escribir Teléfono]", "Canal 2 (Operaciones)"],
        ["Coordinador Médico / Salud", "[Escribir Nombre del Titular]", "[Escribir Suplente 1]", "[Escribir Suplente 2]", "[Escribir Teléfono]", "Canal 3 (Salud)"],
        ["Coordinador de Logística y Suministros", "[Escribir Nombre del Titular]", "[Escribir Suplente 1]", "[Escribir Suplente 2]", "[Escribir Teléfono]", "Canal 4 (Soporte)"],
        ["Coordinador de Defensa Civil / Rescate", "[Escribir Nombre del Titular]", "[Escribir Suplente 1]", "[Escribir Suplente 2]", "[Escribir Teléfono]", "Canal 5 (Rescate)"]
      ]
    );
  };

  const handleDownloadFormat3_2 = () => {
    downloadExcelTemplate("Formato 3.2 - Matriz de Responsabilidades",
      ["Actividad / Tarea Crítica", "Coordinador General", "Coordinador Seguridad", "Coordinador Médico", "Coordinador Logística", "Coordinador Defensa Civil"],
      [
        ["Activar Alerta Amarilla/Naranja/Roja", "Aprobación Final", "Apoyo / Ejecución", "Informado", "Consultado", "Apoyo"],
        ["Establecer Puesto de Mando Unificado", "Dirección General", "Apoyo Logístico", "Apoyo", "Ejecución Física", "Apoyo"],
        ["Coordinar evacuación o resguardo vertical", "Supervisión", "Apoyo Perimetral", "Evaluación Médica", "Apoyo", "Ejecución de Ruta"],
        ["Atención a lesionados y primeros auxilios", "Informado", "Resguardo de Área", "Ejecución Directa", "Suministro Médico", "Apoyo / Traslado"],
        ["Desconexión de servicios (Gas, Electricidad)", "Autorización", "Apoyo", "Apoyo", "Ejecución Técnica", "Apoyo"],
        ["Llamado a cuerpos de socorro externos", "Aprobación", "Ejecución de Enlace", "Apoyo", "Apoyo", "Apoyo"]
      ]
    );
  };

  const handleDownloadFormat3_3 = () => {
    downloadWordTemplate("Formato 3.3 - Mensajes Pre-redactados para Emergencias",
      ["Nivel de Alerta", "Canal de Difusión", "Plantilla de Mensaje Oficial Editable"],
      [
        ["Alerta Amarilla (Fase Preventiva)", "WhatsApp / SMS / Canales Internos", `"[SURE] AVISO PREVENTIVO: Se ha activado el Nivel de Alerta Amarilla para las instalaciones de ${plan?.client_name} debido a [Indicar Amenaza, ej. lluvias fuertes]. Manténgase informado mediante canales oficiales."`],
        ["Alerta Naranja (Fase de Preparación)", "WhatsApp / Megáfonos / Sirenas", `"[SURE] INSTRUCCIÓN DE PREPARACIÓN: Alerta Naranja activada por [Indicar Amenaza]. Verifique sus suministros de emergencia, suspenda labores no esenciales y prepare su evacuación."`],
        ["Alerta Roja (Fase de Evacuación)", "Todos los Canales Coexistentes", `"[SURE] EVACUACIÓN INMEDIATA: Alerta Roja activada por [Indicar Amenaza]. Proceda de inmediato a evacuar las áreas siguiendo las rutas hacia el Punto de Encuentro Oficial [Ubicación]."`]
      ]
    );
  };

  const handleDownloadFormat3_4 = () => {
    downloadExcelTemplate("Formato 3.4 - Hoja de Inventario de Bienes y Recursos Críticos",
      ["Recurso / Bien Crítico", "Ubicación Física", "Cantidad", "Estado de Operatividad", "Fecha Última Inspección", "Responsable de Mantenimiento"],
      [
        ["Extintores PQS/CO2 (Multiuso)", "[Escribir Ubicación, ej. Pasillo Central]", "[Cantidad]", "[Operativo / Requiere Recarga]", "[Fecha]", "[Nombre del Responsable]"],
        ["Generador de Respaldo / Planta Eléctrica", "[Escribir Ubicación, ej. Patio de Servicio]", "[Cantidad]", "[Operativo / Requiere Combustible]", "[Fecha]", "[Nombre del Responsable]"],
        ["Radios de Frecuencia VHF / UHF", "[Escribir Ubicación, ej. Garita Principal]", "[Cantidad]", "[Operativo / Cargado]", "[Fecha]", "[Nombre del Responsable]"],
        ["Megáfonos, Sirenas y Silbatos", "[Escribir Ubicación, ej. Oficina de Logística]", "[Cantidad]", "[Operativo / Con Baterías]", "[Fecha]", "[Nombre del Responsable]"],
        ["Botiquines de Emergencia y Trauma", "[Escribir Ubicación, ej. Enfermería/Recepción]", "[Cantidad]", "[Completo / Productos Vigentes]", "[Fecha]", "[Nombre del Responsable]"],
        ["Tanques de Reserva de Agua Potable", "[Escribir Ubicación, ej. Azotea / Subterráneo]", "[Capacidad en Litros]", "[Lleno / Inspeccionado]", "[Fecha]", "[Nombre del Responsable]"]
      ]
    );
  };

  const handleDownloadFormat3_5 = () => {
    downloadWordTemplate("Formato 3.5 - Formato de Informe de Evento Post-Incidente",
      ["Campo del Reporte de Emergencia", "Detalle / Información Registrada"],
      [
        ["Fecha y Hora Exacta del Evento", "[Escribir Fecha y Hora de inicio del Incidente]"],
        ["Tipo de Amenaza / Evento Ocurrido", "[Escribir Tipo de Incidente, ej. Fuego, Sismo, Inundación]"],
        ["Descripción Cronológica de los Hechos", "[Describir línea de tiempo desde la alerta hasta el control del evento]"],
        ["Afectaciones / Daños Materiales Identificados", "[Detallar daños en infraestructura y maquinaria]"],
        ["Lesionados, Afectados o Evacuados", "[Indicar cantidad de personas heridas, trasladadas o afectadas]"],
        ["Acciones Inmediatas de Respuesta Tomadas", "[Describir labores realizadas por las brigadas internas]"],
        ["Firmas de Conformidad y Cierre", "Coordinador de Emergencias: ____________________   Representante Legal: ____________________"]
      ]
    );
  };

  const handleDownloadFormat3_6 = () => {
    downloadWordTemplate("Formato 3.6 - Formato de Minuta de Reunión (MoM)",
      ["Punto de Agenda / Discusión", "Acuerdos Alcanzados y Acciones", "Responsable Asignado", "Fecha Límite Compromiso"],
      [
        ["Revisión de Simulacro y Tiempos de Respuesta", "[Escribir observaciones y puntos de mejora del simulacro]", "[Nombre del Responsable]", "[Fecha Límite]"],
        ["Actualización de Directorio de Coordinadores", "[Asignación de suplentes oficiales y teléfonos]", "[Nombre del Responsable]", "[Fecha Límite]"],
        ["Inspección de Válvulas de Corte Rápido (Gas/Agua)", "[Verificación física de llaves y tableros principales]", "[Nombre del Responsable]", "[Fecha Límite]"],
        ["Mantenimiento de Planta Eléctrica y Radios", "[Fecha programada para cambio de aceite y baterías]", "[Nombre del Responsable]", "[Fecha Límite]"]
      ]
    );
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
      
      {/* Estilos para impresión nativa de alta calidad (Corrige el texto oscuro sobre fondo blanco y tablas) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body, main, article, p, span, h1, h2, h3, h4, h5, h6, li, td, th, div, blockquote, table, tr {
            background: white !important;
            color: #000000 !important;
          }
          header, aside, button, .print\\:hidden {
            display: none !important;
          }
          .mermaid-chart svg {
            filter: invert(1) !important;
          }
          /* Asegurar que las tablas tengan bordes legibles en papel */
          table, th, td {
            border: 1px solid #ddd !important;
            border-collapse: collapse !important;
          }
        }
      ` }} />

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

            {/* Descargar Formatos Editables */}
            <div className="border-t border-white/5 pt-4">
              <h4 className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-[#00e5ff]" /> Descargar Editables
              </h4>
              {currentStatus === 'paid' ? (
                <div className="space-y-1.5">
                  <button 
                    onClick={handleDownloadFormat3_1}
                    className="w-full text-left px-3 py-2 bg-white/5 hover:bg-[#00e5ff]/10 text-slate-300 hover:text-[#00e5ff] rounded-lg text-[11px] transition-all flex items-center justify-between cursor-pointer border border-white/5 hover:border-[#00e5ff]/20"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <FileText className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span className="truncate">Formato 3.1 (Word)</span>
                    </span>
                    <Download className="w-3 h-3 flex-shrink-0" />
                  </button>
                  <button 
                    onClick={handleDownloadFormat3_2}
                    className="w-full text-left px-3 py-2 bg-white/5 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 rounded-lg text-[11px] transition-all flex items-center justify-between cursor-pointer border border-white/5 hover:border-emerald-500/20"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">Formato 3.2 (Excel)</span>
                    </span>
                    <Download className="w-3 h-3 flex-shrink-0" />
                  </button>
                  <button 
                    onClick={handleDownloadFormat3_3}
                    className="w-full text-left px-3 py-2 bg-white/5 hover:bg-[#00e5ff]/10 text-slate-300 hover:text-[#00e5ff] rounded-lg text-[11px] transition-all flex items-center justify-between cursor-pointer border border-white/5 hover:border-[#00e5ff]/20"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <FileText className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span className="truncate">Formato 3.3 (Word)</span>
                    </span>
                    <Download className="w-3 h-3 flex-shrink-0" />
                  </button>
                  <button 
                    onClick={handleDownloadFormat3_4}
                    className="w-full text-left px-3 py-2 bg-white/5 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 rounded-lg text-[11px] transition-all flex items-center justify-between cursor-pointer border border-white/5 hover:border-emerald-500/20"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">Formato 3.4 (Excel)</span>
                    </span>
                    <Download className="w-3 h-3 flex-shrink-0" />
                  </button>
                  <button 
                    onClick={handleDownloadFormat3_5}
                    className="w-full text-left px-3 py-2 bg-white/5 hover:bg-[#00e5ff]/10 text-slate-300 hover:text-[#00e5ff] rounded-lg text-[11px] transition-all flex items-center justify-between cursor-pointer border border-white/5 hover:border-[#00e5ff]/20"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <FileText className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span className="truncate">Formato 3.5 (Word)</span>
                    </span>
                    <Download className="w-3 h-3 flex-shrink-0" />
                  </button>
                  <button 
                    onClick={handleDownloadFormat3_6}
                    className="w-full text-left px-3 py-2 bg-white/5 hover:bg-[#00e5ff]/10 text-slate-300 hover:text-[#00e5ff] rounded-lg text-[11px] transition-all flex items-center justify-between cursor-pointer border border-white/5 hover:border-[#00e5ff]/20"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <FileText className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span className="truncate">Formato 3.6 (Word)</span>
                    </span>
                    <Download className="w-3 h-3 flex-shrink-0" />
                  </button>
                  <button 
                    onClick={downloadPPTXTemplate}
                    className="w-full text-left px-3 py-2 bg-white/5 hover:bg-amber-500/10 text-slate-300 hover:text-amber-400 rounded-lg text-[11px] transition-all flex items-center justify-between cursor-pointer border border-white/5 hover:border-amber-500/20"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <Presentation className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span className="truncate">Organigrama (PPTX)</span>
                    </span>
                    <Download className="w-3 h-3 flex-shrink-0" />
                  </button>
                  <p className="text-[10px] text-amber-400/90 mt-2 bg-amber-500/5 border border-amber-500/10 p-2 rounded-lg leading-relaxed">
                    💡 <strong>Tip para Organigrama:</strong> Inserta el archivo descargado en PowerPoint y haz clic derecho {"→"} <em>"Convertir a Forma"</em> para editar los cuadros y líneas directamente en tu diapositiva.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 opacity-50">
                  <div className="w-full px-3 py-2 bg-white/5 text-slate-400 rounded-lg text-[11px] flex items-center justify-between">
                    <span className="flex items-center gap-1.5 truncate">
                      <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">Formatos de Relleno (Word)</span>
                    </span>
                    <Lock className="w-3 h-3 text-amber-400/70" />
                  </div>
                  <div className="w-full px-3 py-2 bg-white/5 text-slate-400 rounded-lg text-[11px] flex items-center justify-between">
                    <span className="flex items-center gap-1.5 truncate">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">Matrices Operativas (Excel)</span>
                    </span>
                    <Lock className="w-3 h-3 text-amber-400/70" />
                  </div>
                  <div className="w-full px-3 py-2 bg-white/5 text-slate-400 rounded-lg text-[11px] flex items-center justify-between">
                    <span className="flex items-center gap-1.5 truncate">
                      <Presentation className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">Organigrama (PPTX)</span>
                    </span>
                    <Lock className="w-3 h-3 text-amber-400/70" />
                  </div>
                  <p className="text-[9px] text-amber-400/80 mt-2 text-center">
                    🔒 Aprueba el plan y paga el saldo para descargar.
                  </p>
                </div>
              )}
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
