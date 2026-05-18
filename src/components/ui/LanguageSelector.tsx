"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { languageNames, Language } from "@/lib/translations";
import { ChevronDown } from "lucide-react";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = languageNames[language];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-emerald-500/15 border-2 border-emerald-500/50 hover:bg-emerald-500/30 hover:border-emerald-400 text-white px-5 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] text-base font-black transform hover:scale-105"
      >
        <span className="text-xl leading-none">{currentLang.flag}</span>
        <span className="tracking-widest uppercase">{language}</span>
        <ChevronDown className="w-5 h-5 text-emerald-300" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-slate-900 border border-[var(--color-sure-accent)]/30 rounded-xl shadow-[0_0_30px_rgba(0,191,255,0.15)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col py-1">
            {(Object.keys(languageNames) as Language[]).map((code) => (
              <button
                key={code}
                onClick={() => {
                  setLanguage(code);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left hover:bg-[var(--color-sure-accent)]/10 ${
                  language === code ? "text-[var(--color-sure-accent)] font-bold bg-white/5" : "text-slate-300"
                }`}
              >
                <span className="text-base">{languageNames[code].flag}</span>
                <span>{languageNames[code].name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
