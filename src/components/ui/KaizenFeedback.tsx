"use client";

import React, { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface KaizenFeedbackProps {
  domainAnalyzed?: string;
  title?: string;
  subtitle?: string;
  question1?: string;
  question2?: string;
  question3?: string;
}

export default function KaizenFeedback({ 
  domainAnalyzed = 'General',
  title = 'Ayúdanos a Mejorar',
  subtitle = 'Por favor, califica tu experiencia del 1 (Malo) al 5 (Excelente).',
  question1 = '¿Qué tan fácil fue usar este asistente?',
  question2 = '¿La IA identificó correctamente los botones?',
  question3 = '¿Qué tanto valor aporta este diagnóstico a tu negocio?'
}: KaizenFeedbackProps) {
  const [ease, setEase] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [value, setValue] = useState<number>(0);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (ease === 0 || accuracy === 0 || value === 0) {
      alert("Por favor, responde a todas las preguntas con una puntuación del 1 al 5.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/dns-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: domainAnalyzed,
          ease,
          accuracy,
          value,
          comments
        })
      });

      if (!response.ok) throw new Error('Error al enviar');
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      alert('Hubo un error enviando tu feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-12 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center animate-in fade-in zoom-in duration-500">
        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-emerald-400 mb-1">¡Gracias por tu Feedback!</h3>
        <p className="text-emerald-300/80">Tu opinión nos ayuda a mejorar continuamente mediante Kaizen.</p>
      </div>
    );
  }

  const RatingRow = ({ label, valueState, setter }: { label: string, valueState: number, setter: (val: number) => void }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
      <span className="text-slate-300 font-medium">{label}</span>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => setter(num)}
            className={`w-10 h-10 rounded-full font-bold transition-all \${
              valueState === num 
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] scale-110' 
                : 'bg-black/50 text-slate-400 border border-white/10 hover:border-blue-400/50 hover:text-blue-400'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 p-8 rounded-2xl bg-slate-900/50 border border-white/10 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-8">
      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-3">
          Kaizen · Mejora Continua
        </span>
        <h3 className="text-2xl font-bold font-montserrat">{title}</h3>
        <p className="text-slate-400 text-sm mt-2">{subtitle}</p>
      </div>

      <div className="space-y-4 mb-6">
        <RatingRow label={question1} valueState={ease} setter={setEase} />
        <RatingRow label={question2} valueState={accuracy} setter={setAccuracy} />
        <RatingRow label={question3} valueState={value} setter={setValue} />
      </div>

      <div className="mb-6">
        <textarea
          placeholder="Comentarios adicionales (opcional)..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none h-24"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting || ease === 0 || accuracy === 0 || value === 0}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] flex justify-center items-center gap-2"
      >
        {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Enviando...</> : 'Enviar Feedback'}
      </button>
    </div>
  );
}
