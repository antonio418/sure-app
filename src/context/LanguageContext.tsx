"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "@/lib/translations";
import { uiTranslations } from "@/lib/uiTranslations";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedCode = localStorage.getItem("sure_language") as Language;
    if (savedCode && translations[savedCode]) {
      setLanguageState(savedCode);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("sure_language", lang);
  };

  const t = (path: string) => {
    const keys = path.split('.');
    
    // Custom merge to look in both translations and uiTranslations
    let current: any = undefined;
    if (keys[0] === 'ui') {
      current = uiTranslations[language];
    } else {
      current = translations[language];
    }

    if (!current) {
      if (keys[0] === 'ui') current = uiTranslations['en'];
      else current = translations['en'];
    }

    for (const key of keys) {
      if (current[key] === undefined) {
        console.warn(`Translation missing for key: ${path} in language: ${language}`);
        return path;
      }
      current = current[key];
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
