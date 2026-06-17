"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/ui/LanguageSelector';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  ShieldCheck, ArrowLeft, Upload, FileText, CheckCircle2, 
  AlertTriangle, Trash2, ArrowRight, Loader2, HelpCircle,
  Eye, Copy, Check, X
} from 'lucide-react';

// Local translations mapping for self-contained language adaptability
const localTranslations: Record<string, Record<string, string>> = {
  es: {
    title: 'SURE RMA — Procesador de Documentos',
    subtitle: 'Auditoría documental y mitigación de riesgos transaccionales con inteligencia artificial.',
    toggleLabel: 'Seleccione el Modo de Auditoría',
    modeSingle: 'Auditar Caso Único (Multi-documento)',
    modeComparative: 'Comparación de Escenarios (Base vs. Propuesta)',
    singleDescription: 'Auditoría de Caso Único: Use este modo cuando desee evaluar la integridad y viabilidad de una sola entidad, transacción, objeto o escenario. Puede subir múltiples documentos del mismo caso, proveedor o asunto (ej. actas de constitución, solvencia financiera y contratos de un mismo proyecto). El sistema los analizará en conjunto para emitir un único reporte de riesgo integral, como por ejemplo un reporte de Due Diligence.',
    comparativeDescription: 'Comparación de Escenarios: Use este modo para comparar, contrastar contenidos frente a los requisitos (Documentos que Ud. ya cargó en la sección izquierda). Suba la información que se quiere verificar tal como: ofertas, cartas o cualquier otro documento. El sistema buscará diferencias lógicas, exclusiones de alcance, desviaciones técnicas entre otras posibilidades automáticamente.',
    refColTitle: 'ARCHIVOS A SER USADOS COMO REFERENCIA',
    refColDesc: 'Cargue aquí los documentos que serán la base de comparación Ej. Pliego de licitación, Normas, Procedimientos, Leyes, etc.',
    evalColTitle: 'ARCHIVOS PARA SER COMPARADOS CON LA REFERENCIA',
    evalColDesc: 'Cargue aquí aquellos documentos que Ud quiere comparar contra los documentos que cargó en la ventana izquierda (Referencia)',
    dropzoneTitle: 'Arrastra y suelta tus archivos aquí, o haz clic para buscarlos',
    dropzoneDesc: 'Formatos soportados: PDF, Word (.docx), Excel (.xlsx), PowerPoint (.pptx), RTF y TXT',
    confirmTitle: '⚠️ Confirmación de Cambio de Modo',
    confirmMessage: 'Ud está cambiando de opción, la información que ha cargado hasta ahora será desechada ¿Desechar Si/no?',
    btnYes: 'Sí, desechar',
    btnNo: 'No, cancelar',
    btnStartAudit: 'Iniciar Auditoría de Caso Único',
    btnStartComparison: 'Procesar Comparación de Escenarios',
    parsedLabel: 'Markdown Convertido',
    parsingLabel: 'Convirtiendo a Markdown...',
    noFilesYet: 'No se han subido archivos',
    backToHub: 'Volver al Hub',
    processingSuccess: '¡Procesamiento Completado!',
    processingMessage: 'Los documentos han sido convertidos a Markdown y el informe de riesgo ha sido generado.',
    totalFiles: 'Archivos totales:',
    btnPreview: 'Ver Markdown',
    previewTitle: 'Vista Previa del Documento Convertido',
    tabFormatted: 'Formateado',
    tabRaw: 'Markdown Puro',
    btnCopy: 'Copiar',
    copied: '¡Copiado!',
    btnBack: 'Cerrar',
    statusError: 'Error al procesar'
  },
  en: {
    title: 'SURE RMA — Document Processor',
    subtitle: 'Document auditing and transactional risk mitigation powered by AI.',
    toggleLabel: 'Select Audit Mode',
    modeSingle: 'Single Case Audit (Multi-document)',
    modeComparative: 'Scenario Comparison (Base vs. Proposal)',
    singleDescription: 'Single Case Audit: Use this mode to evaluate the integrity and viability of a single entity, transaction, object, or scenario. You can upload multiple documents belonging to the same case, supplier, or matter (e.g., deeds of incorporation, financial records, and contracts). The system will analyze them together to issue a single consolidated risk report, as for example a Due Diligence report.',
    comparativeDescription: 'Scenario Comparison: Use this mode to compare and contrast contents against the requirements (documents uploaded on the left side). Upload the information to be verified, such as offers, letters, or other documents. The system will automatically detect logical differences, scope exclusions, and technical deviations.',
    refColTitle: 'DOCUMENTS TO BE USED AS REFERENCE',
    refColDesc: 'Upload here the documents that will serve as the comparison baseline, e.g., Bidding terms, Standards, Procedures, Laws, etc.',
    evalColTitle: 'DOCUMENTS TO BE COMPARED AGAINST REFERENCE',
    evalColDesc: 'Upload here the documents you want to compare against the reference documents loaded in the left panel (Reference)',
    dropzoneTitle: 'Drag and drop your files here, or click to browse',
    dropzoneDesc: 'Supported formats: PDF, Word (.docx), Excel (.xlsx), PowerPoint (.pptx), RTF, and TXT',
    confirmTitle: '⚠️ Confirm Mode Change',
    confirmMessage: 'You are switching options. The information uploaded so far will be discarded. Discard and switch Yes/No?',
    btnYes: 'Yes, discard',
    btnNo: 'No, cancel',
    btnStartAudit: 'Start Single Case Audit',
    btnStartComparison: 'Process Scenario Comparison',
    parsedLabel: 'Markdown Parsed',
    parsingLabel: 'Converting to Markdown...',
    noFilesYet: 'No files uploaded yet',
    backToHub: 'Back to Hub',
    processingSuccess: 'Processing Completed!',
    processingMessage: 'Documents have been successfully converted to Markdown and the risk report has been generated.',
    totalFiles: 'Total files:',
    btnPreview: 'View Markdown',
    previewTitle: 'Converted Document Preview',
    tabFormatted: 'Formatted',
    tabRaw: 'Raw Markdown',
    btnCopy: 'Copy',
    copied: 'Copied!',
    btnBack: 'Close',
    statusError: 'Failed to parse'
  }
};

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: 'uploading' | 'parsing' | 'success' | 'error';
  markdown?: string;
  error?: string;
}

export default function DocumentProcessorPage() {
  const { language } = useLanguage();
  
  // Safe fallback to Spanish if language not found in local dictionary
  const activeLang = localTranslations[language] ? language : 'es';
  const lt = localTranslations[activeLang];

  const [selectedMode, setSelectedMode] = useState<'single' | 'comparative'>('single');
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [targetMode, setTargetMode] = useState<'single' | 'comparative' | null>(null);

  // Separate file states
  const [filesSingle, setFilesSingle] = useState<UploadedFile[]>([]);
  const [filesRef, setFilesRef] = useState<UploadedFile[]>([]);
  const [filesEval, setFilesEval] = useState<UploadedFile[]>([]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSuccess, setProcessingSuccess] = useState(false);

  // Preview state for the Markdown modal
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [previewTab, setPreviewTab] = useState<'formatted' | 'raw'>('formatted');
  const [copiedFileId, setCopiedFileId] = useState<string | null>(null);

  // Input refs for clicking to upload
  const inputSingleRef = useRef<HTMLInputElement>(null);
  const inputRefRef = useRef<HTMLInputElement>(null);
  const inputEvalRef = useRef<HTMLInputElement>(null);

  // Helper to format file size
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Check if any files are currently loaded in any section
  const hasUploadedFiles = (): boolean => {
    return filesSingle.length > 0 || filesRef.length > 0 || filesEval.length > 0;
  };

  // Attempt to switch mode
  const handleModeChange = (mode: 'single' | 'comparative') => {
    if (mode === selectedMode) return;
    
    if (hasUploadedFiles()) {
      setTargetMode(mode);
      setShowWarningModal(true);
    } else {
      setSelectedMode(mode);
      setProcessingSuccess(false);
    }
  };

  // Confirm mode switch (discard files)
  const confirmModeSwitch = () => {
    setFilesSingle([]);
    setFilesRef([]);
    setFilesEval([]);
    setProcessingSuccess(false);
    if (targetMode) {
      setSelectedMode(targetMode);
    }
    setShowWarningModal(false);
    setTargetMode(null);
  };

  // Cancel mode switch
  const cancelModeSwitch = () => {
    setShowWarningModal(false);
    setTargetMode(null);
  };

  // Call Next.js API to convert each file to Markdown
  const addFilesToState = async (
    newFileList: FileList, 
    setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>
  ) => {
    const arr = Array.from(newFileList);
    
    for (const file of arr) {
      const fileId = Math.random().toString(36).substring(2, 9);
      
      const initialFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: formatBytes(file.size),
        status: 'uploading'
      };

      setFiles(prev => [...prev, initialFile]);

      try {
        const formData = new FormData();
        formData.append('file', file);

        setFiles(prev => prev.map(item => item.id === fileId ? { ...item, status: 'parsing' } : item));

        const response = await fetch('/api/documents/convert', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || `Error HTTP ${response.status}`);
        }

        const data = await response.json();
        
        setFiles(prev => prev.map(item => 
          item.id === fileId 
            ? { ...item, status: 'success', markdown: data.markdown } 
            : item
        ));
      } catch (error: any) {
        console.error("Error al convertir documento:", error);
        setFiles(prev => prev.map(item => 
          item.id === fileId 
            ? { ...item, status: 'error', error: error.message || 'Error al procesar el archivo.' } 
            : item
        ));
      }
    }
  };

  // Copy Markdown to Clipboard
  const handleCopyMarkdown = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFileId(id);
    setTimeout(() => setCopiedFileId(null), 2000);
  };

  // Start the final audit process (simulation)
  const runFullAudit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setProcessingSuccess(true);
    }, 3000);
  };

  return (
    <main className="flex flex-col min-h-screen bg-[#0B192C] text-slate-100 selection:bg-emerald-500/30 font-sans overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="w-full px-6 py-5 flex justify-between items-center fixed top-0 z-40 bg-[#0B192C]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <Link href="/rma" className="flex items-center gap-3">
            <Image src="/logo-sure.png" alt="SURE Logo" width={32} height={32} className="object-contain" priority />
            <span className="font-bold text-xl tracking-widest uppercase">
              SURE<span className="text-emerald-500">.</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <LanguageSelector />
          <Link href="/rma" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/5">
            <ArrowLeft className="w-4 h-4" /> {lt.backToHub}
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 pt-32 pb-16 flex flex-col items-center">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <ShieldCheck className="w-4 h-4" />
            SURE RMA FORENSICS
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            {lt.title}
          </h1>
          <p className="text-slate-200 text-base md:text-lg font-bold">
            {lt.subtitle}
          </p>
        </div>

        {/* Toggle Mode Switcher */}
        <div className="w-full max-w-2xl bg-slate-900/60 backdrop-blur-md border border-white/5 p-2 rounded-2xl flex gap-2 mb-12">
          <button
            onClick={() => handleModeChange('single')}
            className={`flex-1 py-3 px-4 rounded-xl text-base font-extrabold transition-all duration-300 ${
              selectedMode === 'single'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {lt.modeSingle}
          </button>
          <button
            onClick={() => handleModeChange('comparative')}
            className={`flex-1 py-3 px-4 rounded-xl text-base font-extrabold transition-all duration-300 ${
              selectedMode === 'comparative'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {lt.modeComparative}
          </button>
        </div>

        {/* Workspace cards */}
        <div className="w-full grid grid-cols-1 gap-8 mb-12">
          
          {/* ================= OPTION 1: AUDITAR CASO ÚNICO ================= */}
          {selectedMode === 'single' && (
            <div className="w-full bg-[#152338]/60 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-2xl transition-all duration-500">
              
              {/* Highlighted explanation text - Med-size and prominent */}
              <div className="text-slate-200 text-lg md:text-xl mb-8 leading-relaxed font-medium bg-[#1A2C46]/50 p-6 rounded-2xl border border-white/5 shadow-inner">
                {lt.singleDescription}
              </div>

              {/* Drag and Drop Zone */}
              <div 
                onClick={() => inputSingleRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] transition-all duration-300 rounded-2xl p-14 text-center cursor-pointer flex flex-col items-center justify-center group"
              >
                <input 
                  type="file" 
                  ref={inputSingleRef} 
                  multiple 
                  className="hidden" 
                  onChange={(e) => e.target.files && addFilesToState(e.target.files, setFilesSingle)}
                />
                <div className="w-20 h-20 bg-slate-800/80 border border-slate-700 group-hover:border-emerald-500/30 group-hover:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-all duration-300 mb-4 shadow-lg">
                  <Upload className="w-9 h-9" />
                </div>
                <h3 className="font-bold text-white mb-2 text-xl md:text-2xl">{lt.dropzoneTitle}</h3>
                <p className="text-sm md:text-base text-slate-400 max-w-md">{lt.dropzoneDesc}</p>
              </div>

              {/* Files List with dynamic Markdown parsing states */}
              {filesSingle.length > 0 && (
                <div className="mt-8 space-y-3">
                  <h4 className="text-base font-black uppercase tracking-wider text-slate-300 mb-4 flex justify-between">
                    <span>{lt.totalFiles} {filesSingle.length}</span>
                    <button onClick={() => setFilesSingle([])} className="text-rose-400 hover:text-rose-300 flex items-center gap-1.5 text-sm font-extrabold">
                      <Trash2 className="w-4 h-4" /> limpiar
                    </button>
                  </h4>
                  {filesSingle.map(file => (
                    <div key={file.id} className="flex justify-between items-center bg-slate-900/50 border border-white/5 rounded-xl p-4 transition-all duration-300">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-base font-extrabold text-white max-w-xs md:max-w-md truncate">{file.name}</p>
                          <p className="text-sm font-bold text-slate-400">{file.size}</p>
                          {file.status === 'error' && file.error && (
                            <p className="text-sm font-semibold text-rose-400 mt-1 max-w-xs md:max-w-md truncate">{file.error}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {file.status === 'uploading' && (
                          <span className="text-sm font-extrabold text-slate-300 flex items-center gap-1.5">
                            <Loader2 className="w-4 h-4 animate-spin text-blue-400" /> Subiendo...
                          </span>
                        )}
                        {file.status === 'parsing' && (
                          <span className="text-sm font-extrabold text-slate-300 flex items-center gap-1.5">
                            <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> {lt.parsingLabel}
                          </span>
                        )}
                        {file.status === 'success' && (
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-extrabold">
                              <CheckCircle2 className="w-4 h-4" /> {lt.parsedLabel}
                            </span>
                            <button
                              onClick={() => {
                                setPreviewFile(file);
                                setPreviewTab('formatted');
                              }}
                              className="px-4 py-2 bg-[#1A2C46] border border-white/10 hover:border-emerald-500/40 text-white hover:text-emerald-400 rounded-lg text-sm font-black transition-all duration-300 flex items-center gap-1.5"
                            >
                              <Eye className="w-4 h-4" /> {lt.btnPreview}
                            </button>
                          </div>
                        )}
                        {file.status === 'error' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-extrabold">
                            <AlertTriangle className="w-4 h-4" /> {lt.statusError}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= OPTION 2: COMPARACIÓN DE ESCENARIOS ================= */}
          {selectedMode === 'comparative' && (
            <div className="w-full bg-[#152338]/60 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-2xl transition-all duration-500">
              
              {/* Highlighted explanation text - Med-size and prominent */}
              <div className="text-slate-200 text-lg md:text-xl mb-8 leading-relaxed font-medium bg-[#1A2C46]/50 p-6 rounded-2xl border border-white/5 shadow-inner">
                {lt.comparativeDescription}
              </div>

              {/* Grid with central vertical gradient line */}
              <div className="flex flex-col md:flex-row gap-8 relative">
                
                {/* Column 1: Reference Documents */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="mb-6">
                    <h3 className="text-emerald-400 font-extrabold tracking-wide text-lg md:text-xl mb-3">
                      {lt.refColTitle}
                    </h3>
                    <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-4">
                      {lt.refColDesc}
                    </p>
                  </div>

                  <div 
                    onClick={() => inputRefRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] transition-all duration-300 rounded-2xl p-10 text-center cursor-pointer flex flex-col items-center justify-center group mb-6"
                  >
                    <input 
                      type="file" 
                      ref={inputRefRef} 
                      multiple 
                      className="hidden" 
                      onChange={(e) => e.target.files && addFilesToState(e.target.files, setFilesRef)}
                    />
                    <div className="w-16 h-16 bg-slate-800/80 border border-slate-700 group-hover:border-emerald-500/30 group-hover:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-all duration-300 mb-4 shadow-lg">
                      <Upload className="w-7 h-7" />
                    </div>
                    <h4 className="font-bold text-white mb-2 text-base md:text-lg">{lt.dropzoneTitle}</h4>
                    <p className="text-sm text-slate-400 max-w-xs">{lt.dropzoneDesc}</p>
                  </div>

                  {/* Reference Files List */}
                  {filesRef.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm font-black text-slate-300 mb-2">
                        <span>{lt.totalFiles} {filesRef.length}</span>
                        <button onClick={() => setFilesRef([])} className="text-rose-400 hover:text-rose-300 flex items-center gap-1.5 text-xs md:text-sm font-extrabold">
                          <Trash2 className="w-3.5 h-3.5" /> limpiar
                        </button>
                      </div>
                      {filesRef.map(file => (
                        <div key={file.id} className="flex justify-between items-center bg-slate-900/50 border border-white/5 rounded-xl p-3 transition-all duration-300">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm md:text-base font-extrabold text-white truncate max-w-[120px] md:max-w-[160px]">{file.name}</p>
                              <p className="text-xs font-bold text-slate-400">{file.size}</p>
                              {file.status === 'error' && file.error && (
                                <p className="text-xs font-semibold text-rose-400 truncate max-w-[120px]" title={file.error}>{file.error}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {file.status === 'uploading' && (
                              <span className="text-xs md:text-sm font-extrabold text-slate-300 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin text-blue-400" /> Subiendo</span>
                            )}
                            {file.status === 'parsing' && (
                              <span className="text-xs md:text-sm font-extrabold text-slate-300 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin text-amber-400" /> {lt.parsingLabel}</span>
                            )}
                            {file.status === 'success' && (
                              <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold">
                                  <CheckCircle2 className="w-3 h-3" /> {lt.parsedLabel}
                                </span>
                                <button
                                  onClick={() => {
                                    setPreviewFile(file);
                                    setPreviewTab('formatted');
                                  }}
                                  className="px-2 py-0.5 bg-[#1A2C46] border border-white/10 hover:border-emerald-500/40 text-white hover:text-emerald-400 rounded text-xs md:text-sm font-black transition-all duration-300"
                                >
                                  {lt.btnPreview}
                                </button>
                              </div>
                            )}
                            {file.status === 'error' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-extrabold">
                                <AlertTriangle className="w-3 h-3" /> {lt.statusError}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Clear vertical gradient separation line */}
                <div className="hidden md:block w-[1px] bg-gradient-to-b from-transparent via-slate-700 to-transparent min-h-[380px] self-stretch mx-4"></div>

                {/* Column 2: Documents to Evaluate */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="mb-6">
                    <h3 className="text-emerald-400 font-extrabold tracking-wide text-lg md:text-xl mb-3">
                      {lt.evalColTitle}
                    </h3>
                    <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-4">
                      {lt.evalColDesc}
                    </p>
                  </div>

                  <div 
                    onClick={() => inputEvalRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] transition-all duration-300 rounded-2xl p-10 text-center cursor-pointer flex flex-col items-center justify-center group mb-6"
                  >
                    <input 
                      type="file" 
                      ref={inputEvalRef} 
                      multiple 
                      className="hidden" 
                      onChange={(e) => e.target.files && addFilesToState(e.target.files, setFilesEval)}
                    />
                    <div className="w-16 h-16 bg-slate-800/80 border border-slate-700 group-hover:border-emerald-500/30 group-hover:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-all duration-300 mb-4 shadow-lg">
                      <Upload className="w-7 h-7" />
                    </div>
                    <h4 className="font-bold text-white mb-2 text-base md:text-lg">{lt.dropzoneTitle}</h4>
                    <p className="text-sm text-slate-400 max-w-xs">{lt.dropzoneDesc}</p>
                  </div>

                  {/* Evaluated Files List */}
                  {filesEval.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm font-black text-slate-300 mb-2">
                        <span>{lt.totalFiles} {filesEval.length}</span>
                        <button onClick={() => setFilesEval([])} className="text-rose-400 hover:text-rose-300 flex items-center gap-1.5 text-xs md:text-sm font-extrabold">
                          <Trash2 className="w-3.5 h-3.5" /> limpiar
                        </button>
                      </div>
                      {filesEval.map(file => (
                        <div key={file.id} className="flex justify-between items-center bg-slate-900/50 border border-white/5 rounded-xl p-3 transition-all duration-300">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm md:text-base font-extrabold text-white truncate max-w-[120px] md:max-w-[160px]">{file.name}</p>
                              <p className="text-xs font-bold text-slate-400">{file.size}</p>
                              {file.status === 'error' && file.error && (
                                <p className="text-xs font-semibold text-rose-400 truncate max-w-[120px]" title={file.error}>{file.error}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {file.status === 'uploading' && (
                              <span className="text-xs md:text-sm font-extrabold text-slate-300 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin text-blue-400" /> Subiendo</span>
                            )}
                            {file.status === 'parsing' && (
                              <span className="text-xs md:text-sm font-extrabold text-slate-300 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin text-amber-400" /> {lt.parsingLabel}</span>
                            )}
                            {file.status === 'success' && (
                              <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold">
                                  <CheckCircle2 className="w-3 h-3" /> {lt.parsedLabel}
                                </span>
                                <button
                                  onClick={() => {
                                    setPreviewFile(file);
                                    setPreviewTab('formatted');
                                  }}
                                  className="px-2 py-0.5 bg-[#1A2C46] border border-white/10 hover:border-emerald-500/40 text-white hover:text-emerald-400 rounded text-xs md:text-sm font-black transition-all duration-300"
                                >
                                  {lt.btnPreview}
                                </button>
                              </div>
                            )}
                            {file.status === 'error' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-extrabold">
                                <AlertTriangle className="w-3 h-3" /> {lt.statusError}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Action button at the bottom */}
        {((selectedMode === 'single' && filesSingle.length > 0) || 
          (selectedMode === 'comparative' && filesRef.length > 0 && filesEval.length > 0)) && !processingSuccess && (
          <button
            onClick={runFullAudit}
            disabled={isProcessing}
            className="px-10 py-5 rounded-xl font-black text-lg md:text-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-xl shadow-emerald-500/20 flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <span>{selectedMode === 'single' ? lt.btnStartAudit : lt.btnStartComparison}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        )}

        {/* Processing Success Alert Block */}
        {processingSuccess && (
          <div className="w-full max-w-2xl bg-emerald-950/20 border border-emerald-500/30 rounded-3xl p-6 text-center shadow-lg animate-fade-in">
            <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-4 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{lt.processingSuccess}</h3>
            <p className="text-sm text-slate-400 mb-6">{lt.processingMessage}</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => {
                  setProcessingSuccess(false);
                  setFilesSingle([]);
                  setFilesRef([]);
                  setFilesEval([]);
                }}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all duration-300"
              >
                Nuevo Análisis
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ================= OPTION SWITCH WARNING MODAL ================= */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-[#152338] border border-white/10 max-w-md w-full rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400 mb-4 border-b border-white/5 pb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-black text-lg">{lt.confirmTitle}</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {lt.confirmMessage}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelModeSwitch}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all duration-300"
              >
                {lt.btnNo}
              </button>
              <button
                onClick={confirmModeSwitch}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/20 transition-all duration-300"
              >
                {lt.btnYes}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MARKDOWN PREVIEW MODAL DRAWER ================= */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-end p-0 animate-fade-in transition-all duration-500">
          <div className="bg-[#0D1B2E] border-l border-white/10 w-full max-w-4xl h-full flex flex-col shadow-2xl">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-[#152338]">
              <div className="min-w-0">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">{lt.previewTitle}</span>
                <h3 className="text-lg font-bold text-white truncate max-w-xl" title={previewFile.name}>{previewFile.name}</h3>
              </div>
              <button 
                onClick={() => setPreviewFile(null)}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-header with Tabs & Controls */}
            <div className="px-6 py-3 border-b border-white/5 bg-[#112035] flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewTab('formatted')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                    previewTab === 'formatted'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lt.tabFormatted}
                </button>
                <button
                  onClick={() => setPreviewTab('raw')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                    previewTab === 'raw'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lt.tabRaw}
                </button>
              </div>

              {previewFile.markdown && (
                <button
                  onClick={() => handleCopyMarkdown(previewFile.markdown || '', previewFile.id)}
                  className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all duration-300"
                >
                  {copiedFileId === previewFile.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">{lt.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{lt.btnCopy}</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Modal Body / Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {previewFile.markdown ? (
                previewTab === 'formatted' ? (
                  <div className="prose prose-invert max-w-none text-slate-300 prose-headings:text-white prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-strong:text-white prose-a:text-emerald-400 prose-code:text-emerald-300 prose-pre:bg-slate-950/80 prose-table:border prose-table:border-white/10 prose-th:bg-[#1A2C46] prose-th:text-white prose-th:px-4 prose-th:py-2 prose-td:border-t prose-td:border-white/5 prose-td:px-4 prose-td:py-2">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {previewFile.markdown}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <pre className="font-mono text-xs text-emerald-400 bg-slate-950 p-6 rounded-2xl overflow-x-auto whitespace-pre-wrap leading-relaxed border border-white/5 shadow-inner select-text">
                    {previewFile.markdown}
                  </pre>
                )
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                  <AlertTriangle className="w-8 h-8 text-amber-500/50" />
                  <p className="text-sm">No hay contenido Markdown disponible.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/10 bg-[#152338] flex justify-end">
              <button
                onClick={() => setPreviewFile(null)}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all duration-300"
              >
                {lt.btnBack}
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
