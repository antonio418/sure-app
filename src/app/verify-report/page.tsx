'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

type Result =
  | { state: 'idle' }
  | { state: 'checking' }
  | { state: 'found'; reportId: string; issuedAt: string; variant?: string }
  | { state: 'notfound' }
  | { state: 'error' };

async function sha256Hex(file: File): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function VerifyReportPage() {
  const { language } = useLanguage();
  const es = language === 'es';
  const [result, setResult] = useState<Result>({ state: 'idle' });
  const [fingerprint, setFingerprint] = useState('');

  const tx = es
    ? {
        title: 'Verificar un informe SURE',
        intro: 'Sube el PDF original tal como lo descargaste. El archivo no sale de tu navegador: solo se calcula su huella y se compara con el registro de SURE.',
        pick: 'Seleccionar PDF',
        checking: 'Comprobando...',
        found: 'Archivo reconocido. SURE emitio este archivo exacto.',
        reportId: 'Numero de informe',
        issued: 'Fecha de emision',
        redacted: 'Version anonimizada',
        notfound: 'No reconocido. Este archivo no coincide con ningun informe registrado por SURE. Puede haber sido modificado, re-guardado con otro programa o no haber sido emitido por SURE.',
        error: 'No se pudo completar la verificacion. Intentalo de nuevo.',
        fp: 'Huella SHA-256 del archivo',
        limits: 'Esta verificacion confirma que el archivo no ha sido alterado desde su emision. No evalua la exactitud del analisis, que se rige por el Acuerdo de Servicios.',
      }
    : {
        title: 'Verify a SURE report',
        intro: 'Upload the original PDF exactly as you downloaded it. The file never leaves your browser: only its fingerprint is calculated and compared with the SURE registry.',
        pick: 'Select PDF',
        checking: 'Checking...',
        found: 'File recognised. SURE issued this exact file.',
        reportId: 'Report number',
        issued: 'Issue date',
        redacted: 'Anonymised version',
        notfound: 'Not recognised. This file does not match any report registered by SURE. It may have been modified, re-saved with another program, or not issued by SURE.',
        error: 'The check could not be completed. Please try again.',
        fp: 'File SHA-256 fingerprint',
        limits: 'This check confirms the file has not been altered since issue. It does not assess the accuracy of the analysis, which is governed by the Services Agreement.',
      };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult({ state: 'checking' });
    try {
      const hash = await sha256Hex(file);
      setFingerprint(hash);
      const res = await fetch('/api/reports/verify?sha256=' + hash);
      if (!res.ok) throw new Error('verify failed');
      const data = await res.json();
      if (data.found) {
        setResult({ state: 'found', reportId: data.reportId, issuedAt: data.issuedAt, variant: data.variant });
      } else {
        setResult({ state: 'notfound' });
      }
    } catch {
      setResult({ state: 'error' });
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-3">{tx.title}</h1>
        <p className="text-sm text-slate-400 mb-6">{tx.intro}</p>
        <label className="block w-full text-center py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold uppercase tracking-widest cursor-pointer">
          {tx.pick}
          <input type="file" accept="application/pdf,.pdf" className="hidden" onChange={onFile} />
        </label>

        <div className="mt-6 text-sm">
          {result.state === 'checking' && <p className="text-slate-400">{tx.checking}</p>}
          {result.state === 'found' && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4">
              <p className="font-bold text-emerald-300 mb-2">{tx.found}</p>
              <p>{tx.reportId}: <span className="font-mono">{result.reportId}</span></p>
              <p>{tx.issued}: {new Date(result.issuedAt).toLocaleString()}</p>
              {result.variant === 'redacted' && <p>{tx.redacted}</p>}
            </div>
          )}
          {result.state === 'notfound' && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-200">{tx.notfound}</div>
          )}
          {result.state === 'error' && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-200">{tx.error}</div>
          )}
          {fingerprint && (
            <p className="mt-4 text-xs text-slate-500 break-all">{tx.fp}: <span className="font-mono">{fingerprint}</span></p>
          )}
        </div>
        <p className="mt-6 text-xs text-slate-500">{tx.limits}</p>
      </div>
    </main>
  );
}
