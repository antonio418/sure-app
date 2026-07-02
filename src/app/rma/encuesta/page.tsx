"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, ArrowLeft, ArrowRight, Check, AlertCircle,
  Building, MapPin, Users, Flame, ShieldAlert, Cpu, CheckSquare, Settings,
  Globe, Search, HelpCircle, BookOpen
} from 'lucide-react';

// Estructura de textos base de la interfaz (en Español)
const BASE_UI_TEXTS = {
  title: "Planificador de Contingencia",
  step: "Paso",
  of: "de",
  back: "Anterior",
  next: "Siguiente",
  submit: "Generar Propuesta Gratuita",
  loadingTitle: "Redactando Propuesta Ejecutiva...",
  helpHeader: "Ventana de Contexto y Ayuda",
  helpIntro: "Este panel te ayuda a completar cada sección con consejos prácticos y ejemplos reales.",
  
  step1Title: "1. Datos Generales de la Comunidad/Entidad",
  clientNameLabel: "Nombre de la Comunidad, Entidad o Cliente",
  clientNamePlaceholder: "Ej. Terrazas del Ávila, Fábrica Metalúrgica Centro, Centro Médico",
  clientTypeLabel: "Tipo de Entidad",
  locationLabel: "Ubicación y Entorno",
  locationPlaceholder: "Ej. Municipio Sucre, Caracas, colinda con autopista",
  limitsLabel: "Límites y Linderos Físicos",
  limitsPlaceholder: "Norte: Calle X, Sur: Río Y, Oeste: Avenida Z",
  
  step1HelpTitle: "Sobre Datos Generales",
  step1HelpBody: "Establecer con precisión el nombre y tipo de entidad ayuda a la IA a elegir el marco normativo y los protocolos correctos (por ejemplo, los protocolos de una fábrica industrial con múltiples edificios son muy diferentes a los de un condominio residencial). Delimitar la ubicación y linderos permite identificar amenazas de entornos colindantes (como bosques, autopistas o ríos).",
  step1HelpExample: "Ejemplo: Para una urbanización residencial, 'Norte: Parque Nacional El Ávila (riesgo de incendios forestales), Sur: Distribuidor autopista (riesgo de disturbios y cierres de vías)'.",

  step2Title: "2. Población y Servicios Críticos",
  populationLabel: "Población Estimada (Familias, Empleados o Habitantes)",
  populationPlaceholder: "Ej. 125 edificios (4052 apartamentos) / 12,000 personas",
  servicesLabel: "Servicios Críticos a Proteger (Selecciona los que apliquen)",
  
  step2HelpTitle: "Sobre Población y Servicios",
  step2HelpBody: "Conocer la densidad poblacional nos ayuda a escalar los recursos de salud, camillas y logística requeridos. Identificar los servicios críticos a proteger permite a la IA diseñar protocolos para la desconexión rápida de gas, electricidad o agua en caso de terremotos o incendios, mitigando riesgos de explosiones secundarias.",
  step2HelpExample: "Ejemplo: En un edificio residencial, el 'Agua Potable / Sistema de Bombeo' y el 'Gas Doméstico Centralizado' son los servicios más vulnerables ante movimientos sísmicos.",

  step3Title: "3. Amenazas y Recursos",
  threatsLabel: "Amenazas Principales que le preocupan",
  resourcesLabel: "Recursos Materiales Disponibles",
  securityLabel: "¿Vigilancia / Seguridad Privada?",
  medicalLabel: "¿Médicos/Sicólogos/Enfermeros residentes?",

  step3HelpTitle: "Sobre Amenazas y Recursos",
  step3HelpBody: "Cada amenaza requiere una respuesta de evacuación diferente. Por ejemplo, ante inundaciones la evacuación es vertical (pisos superiores), mientras que ante sismos es hacia áreas abiertas. Saber con qué recursos cuentas (radios, plantas, extintores) y la presencia de personal médico, sicólogos o guardias de seguridad privada permite asignar roles específicos en el organigrama sin incurrir en gastos adicionales.",
  step3HelpExample: "Ejemplo: Si dispones de 'Sistemas de Radio VHF', el plan de comunicaciones priorizará estos canales autónomos si la telefonía celular colapsa.",

  step4Title: "4. Comunicación y Detalles Especiales",
  commsLabel: "Medios de comunicación prioritarios para alertas",
  detailsLabel: "Requerimientos o Detalles Especiales (Opcional)",
  detailsPlaceholder: "Ej. 'Tenemos un río cercano en el límite sur que suele desbordarse si llueve por más de 5 horas seguidas', o 'Deseamos especial énfasis en la evacuación sísmica para personas con andaderas'.",

  step4HelpTitle: "Sobre Comunicación y Detalles",
  step4HelpBody: "La comunicación es la columna vertebral de cualquier contingencia. Priorizar los canales adecuados garantiza que las alertas tempranas lleguen a todos. Cualquier detalle especial (como una quebrada propensa a inundarse o ancianos de alta vulnerabilidad) permite a la IA inyectar una sección de atención prioritaria y personalizada para tu caso.",
  step4HelpExample: "Ejemplo: En comunidades grandes, un grupo de WhatsApp actúa como canal principal, pero se debe contar con un canal acústico alternativo (como megáfonos o silbatos) y visitas presenciales de respaldo.",
  preRecordedLanguagesLabel: "¿En qué idiomas desea los mensajes pregrabados a ser usados en caso de emergencia?",
  preRecordedLanguagesPlaceholder: "Ej. Español, Inglés y Lituano..."
};

// Lista de idiomas comunes del mundo
const WORLD_LANGUAGES = [
  { code: "es", name: "Español" },
  { code: "en", name: "English (Inglés)" },
  { code: "pt", name: "Português (Portugués)" },
  { code: "fr", name: "Français (Francés)" },
  { code: "de", name: "Deutsch (Alemán)" },
  { code: "it", name: "Italiano (Italiano)" },
  { code: "lt", name: "Lietuvių (Lituano)" },
  { code: "lv", name: "Latviešu (Letón)" },
  { code: "et", name: "Eesti (Estonio)" },
  { code: "pl", name: "Polski (Polaco)" },
  { code: "uk", name: "Українська (Ucraniano)" },
  { code: "ru", name: "Русский (Ruso)" },
  { code: "ja", name: "日本語 (Japonés)" },
  { code: "zh", name: "中文 (Chino)" },
  { code: "ar", name: "العربية (Árabe)" },
  { code: "hi", name: "हिन्दी (Hindi)" },
  { code: "sw", name: "Kiswahili (Suajili)" },
  { code: "tr", name: "Türkçe (Turco)" },
  { code: "vi", name: "Tiếng Việt (Vietnamita)" },
  { code: "th", name: "ไทย (Tailandés)" },
  { code: "ko", name: "한국어 (Coreano)" },
  { code: "nl", name: "Nederlands (Neerlandés)" },
  { code: "fi", name: "Suomi (Finlandés)" },
  { code: "sv", name: "Svenska (Sueco)" },
  { code: "no", name: "Norsk (Noruego)" },
  { code: "da", name: "Dansk (Danés)" },
  { code: "cs", name: "Čeština (Checo)" },
  { code: "hu", name: "Magyar (Húngaro)" },
  { code: "ro", name: "Română (Rumano)" },
  { code: "bg", name: "Български (Búlgaro)" },
  { code: "el", name: "Ελληνικά (Griego)" },
  { code: "he", name: "עברית (Hebreo)" },
  { code: "id", name: "Bahasa Indonesia (Indonesio)" },
  { code: "ms", name: "Bahasa Melayu (Malayo)" },
  { code: "tl", name: "Tagalog (Filipino)" },
  { code: "ga", name: "Gaeilge (Irlandés)" },
  { code: "cy", name: "Cymraeg (Galés)" },
  { code: "hr", name: "Hrvatski (Croata)" },
  { code: "sr", name: "Српски (Serbio)" },
  { code: "sl", name: "Slovenščina (Esloveno)" },
  { code: "sk", name: "Slovenčina (Eslovaco)" },
  { code: "sq", name: "Shqip (Albanés)" },
  { code: "mk", name: "Македонски (Macedonio)" },
  { code: "ka", name: "ქართული (Georgiano)" },
  { code: "hy", name: "Հայերեն (Armenio)" },
  { code: "az", name: "Azərbaycan (Azerí)" },
  { code: "kk", name: "Қазақ (Kazajo)" },
  { code: "uz", name: "Oʻzbek (Uzbeko)" },
  { code: "fa", name: "فارسی (Persa)" },
  { code: "ur", name: "اردو (Urdu)" },
  { code: "bn", name: "বাংলা (Bengalí)" },
  { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)" },
  { code: "gu", name: "ગુજરાતી (Gujarati)" },
  { code: "mr", name: "मराठी (Marathi)" },
  { code: "te", name: "తెలుగు (Telugu)" },
  { code: "ta", name: "தமிழ் (Tamil)" },
  { code: "kn", name: "ಕನ್ನಡ (Kannada)" },
  { code: "ml", name: "മലയാളം (Malayalam)" },
  { code: "si", name: "සිංහල (Cingalés)" },
  { code: "my", name: "မြန်မာ (Birmano)" },
  { code: "km", name: "ខ្មែរ (Jemer)" },
  { code: "lo", name: "ລາວ (Lao)" },
  { code: "mn", name: "Монгол (Mongol)" },
  { code: "ne", name: "नेपाली (Nepalí)" },
  { code: "am", name: "አማርኛ (Amhárico)" },
  { code: "so", name: "Soomaali (Somalí)" },
  { code: "yo", name: "Yorùbá (Yoruba)" },
  { code: "ig", name: "Asụsụ Igbo (Igbo)" },
  { code: "zu", name: "isiZulu (Zulu)" },
  { code: "af", name: "Afrikaans" },
  { code: "eu", name: "Euskara (Vasco)" },
  { code: "ca", name: "Català (Catalán)" },
  { code: "gl", name: "Galego (Gallego)" },
  { code: "eo", name: "Esperanto" },
  { code: "la", name: "Latina (Latín)" }
];

export default function SurveyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Procesando datos diagnósticos...");
  const [error, setError] = useState<string | null>(null);

  // Multilingüe
  const [selectedLanguage, setSelectedLanguage] = useState("Español");
  const [langSearch, setLangSearch] = useState("");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [uiTexts, setUiTexts] = useState(BASE_UI_TEXTS);
  const [translatingUi, setTranslatingUi] = useState(false);

  // Form State
  const [clientName, setClientName] = useState("");
  const [clientType, setClientType] = useState("Urbanización Residencial (Condominio / Edificios)");
  const [clientTypeCustom, setClientTypeCustom] = useState(""); // Tipo de entidad personalizado
  const [location, setLocation] = useState("");
  const [limits, setLimits] = useState("");
  const [population, setPopulation] = useState("");
  const [threats, setThreats] = useState<string[]>([]);
  const [resources, setResources] = useState<string[]>([]);
  const [comms, setComms] = useState<string[]>(["WhatsApp"]);
  const [criticalServices, setCriticalServices] = useState<string[]>([]);
  const [securityPrivate, setSecurityPrivate] = useState(false);
  const [medicalResidents, setMedicalResidents] = useState(false);
  const [specialDetails, setSpecialDetails] = useState("");
  const [preRecordedCommsLanguages, setPreRecordedCommsLanguages] = useState("");

  // Opciones editables por el cliente
  const [servicesList, setServicesList] = useState([
    "Electricidad / Tableros", 
    "Gas (Doméstico/Centralizado)", 
    "Agua Potable / Bombeo", 
    "Telecomunicaciones / Internet", 
    "Sistemas Contra Incendios", 
    "Generadores de Respaldo"
  ]);
  const [customService, setCustomService] = useState("");
  const handleAddService = () => {
    if (customService.trim() && !servicesList.includes(customService.trim())) {
      setServicesList(prev => [...prev, customService.trim()]);
      setCriticalServices(prev => [...prev, customService.trim()]);
      setCustomService("");
    }
  };

  const [threatsList, setThreatsList] = useState([
    "Sismos / Terremotos", 
    "Inundaciones / Desbordes", 
    "Incendios Forestales / Estructurales", 
    "Disturbios / Intrusión", 
    "Cortes de Servicios", 
    "Robos y Secuestros"
  ]);
  const [customThreat, setCustomThreat] = useState("");
  const handleAddThreat = () => {
    if (customThreat.trim() && !threatsList.includes(customThreat.trim())) {
      setThreatsList(prev => [...prev, customThreat.trim()]);
      setThreats(prev => [...prev, customThreat.trim()]);
      setCustomThreat("");
    }
  };

  const [resourcesList, setResourcesList] = useState([
    "Extintores", 
    "Generador / Planta Eléctrica", 
    "Sistemas de Radio VHF / UHF", 
    "Megáfonos / Sirenas / Silbatos", 
    "Botiquín Médico Central", 
    "Tanques de Reserva de Agua"
  ]);
  const [customResource, setCustomResource] = useState("");
  const handleAddResource = () => {
    if (customResource.trim() && !resourcesList.includes(customResource.trim())) {
      setResourcesList(prev => [...prev, customResource.trim()]);
      setResources(prev => [...prev, customResource.trim()]);
      setCustomResource("");
    }
  };

  const stepsCount = 4;

  const loadingMessages = [
    "Analizando focos de riesgo geográficos...",
    "Estructurando la zonificación y los linderos...",
    "Definiendo los canales de comunicación redundantes...",
    "Configurando los roles y brigadas por especialidad...",
    "Redactando las acciones ante alertas Amarilla, Naranja y Roja...",
    "Generando propuesta comercial y listado de entregables...",
    "Guardando datos en Supabase..."
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      let idx = 0;
      interval = setInterval(() => {
        setLoadingMessage(loadingMessages[idx % loadingMessages.length]);
        idx++;
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Manejar el cambio de idioma dinámico
  const handleLanguageChange = async (langName: string) => {
    setSelectedLanguage(langName);
    setShowLangDropdown(false);
    
    if (langName === "Español") {
      setUiTexts(BASE_UI_TEXTS);
      return;
    }

    try {
      setTranslatingUi(true);
      setError(null);
      
      const response = await fetch('/api/rma/translate-ui', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: langName,
          uiData: BASE_UI_TEXTS
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al traducir la interfaz.');
      }

      setUiTexts(data.translatedUi);
    } catch (err: any) {
      console.error(err);
      setError(`No se pudo traducir la interfaz al ${langName}. Se mantendrá en Español.`);
      setSelectedLanguage("Español");
      setUiTexts(BASE_UI_TEXTS);
    } finally {
      setTranslatingUi(false);
    }
  };

  const toggleThreat = (threat: string) => {
    setThreats(prev => prev.includes(threat) ? prev.filter(t => t !== threat) : [...prev, threat]);
  };

  const toggleResource = (resource: string) => {
    setResources(prev => prev.includes(resource) ? prev.filter(r => r !== resource) : [...prev, resource]);
  };

  const toggleService = (service: string) => {
    setCriticalServices(prev => prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]);
  };

  const toggleComm = (comm: string) => {
    setComms(prev => prev.includes(comm) ? prev.filter(c => c !== comm) : [...prev, comm]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setError("Por favor, ingresa el nombre de la comunidad o entidad.");
      setStep(1);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/rma/generate-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: clientName,
          client_type: clientType === "Otro" ? clientTypeCustom : clientType,
          language: selectedLanguage,
          survey_responses: {
            location,
            limits,
            population,
            threats,
            resources,
            comms,
            critical_services: criticalServices,
            security_private: securityPrivate,
            medical_residents: medicalResidents,
            special_details: specialDetails,
            pre_recorded_languages: preRecordedCommsLanguages
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error al generar la propuesta.');
      }

      router.push(`/rma/plan/${data.planId}`);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error de conexión con el servidor.');
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !clientName.trim()) {
      setError("Por favor, ingresa el nombre de la comunidad o entidad.");
      return;
    }
    setError(null);
    setStep(prev => Math.min(prev + 1, stepsCount));
  };

  const prevStep = () => {
    setError(null);
    setStep(prev => Math.max(prev - 1, 1));
  };

  const filteredLanguages = WORLD_LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(langSearch.toLowerCase())
  );

  return (
    <main className="flex flex-col min-h-screen bg-[#050a15] text-[#cbd5e1] font-open-sans overflow-x-hidden selection:bg-[#00e5ff]/30">
      
      {/* Navbar */}
      <nav className="w-full px-6 py-5 flex justify-between items-center bg-[#0a1128]/80 backdrop-blur-md border-b border-white/5 fixed top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/rma" className="flex items-center gap-3">
            <Image src="/logo-sure.png" alt="SURE Logo" width={32} height={32} className="object-contain" priority />
            <span className="font-montserrat font-black text-xl tracking-widest uppercase text-white">
              SURE<span className="text-emerald-500">.</span>
            </span>
          </Link>
          <span className="text-xs bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            RMA AI
          </span>
        </div>
        
        {/* Selector de Idioma Universal */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-white/10 hover:border-[#00e5ff] transition-all text-xs font-bold text-white cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#00e5ff]" />
              <span>{selectedLanguage}</span>
            </button>
            
            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-800 border border-white/10 shadow-2xl p-2 z-50">
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute top-2.5 left-2.5" />
                  <input
                    type="text"
                    className="w-full bg-[#050a15] border border-white/5 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00e5ff]"
                    placeholder="Buscar idioma..."
                    value={langSearch}
                    onChange={(e) => setLangSearch(e.target.value)}
                  />
                </div>
                <div className="max-h-48 overflow-y-auto custom-scrollbar flex flex-col gap-0.5">
                  {filteredLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                        selectedLanguage === lang.name ? 'bg-[#00e5ff]/10 text-[#00e5ff] font-bold' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <Link href="/rma" className="text-sm flex items-center gap-2 hover:text-[#00e5ff] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <section className="flex-grow pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="max-w-6xl w-full">

          {translatingUi ? (
            /* Pantalla de carga para la traducción del formulario */
            <div className="bg-[#0a1128]/80 border border-[#00e5ff]/20 p-12 rounded-3xl text-center shadow-2xl flex flex-col items-center glass my-8">
              <Globe className="w-12 h-12 text-[#00e5ff] animate-spin mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Traduciendo interfaz...</h2>
              <p className="text-slate-400 text-xs">Cargando etiquetas y ventana de contexto en {selectedLanguage}...</p>
            </div>
          ) : loading ? (
            /* Pantalla de Carga de IA */
            <div className="bg-[#0a1128]/80 border border-[#00e5ff]/20 p-12 rounded-3xl text-center shadow-2xl flex flex-col items-center glass my-8">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-[#00e5ff]/10 border-t-[#00e5ff] animate-spin"></div>
                <div className="absolute inset-3 rounded-full border-4 border-emerald-500/10 border-b-emerald-400 animate-spin [animation-duration:1.5s]"></div>
                <Cpu className="w-8 h-8 text-[#00e5ff] absolute inset-0 m-auto animate-pulse" />
              </div>
              <h2 className="text-2xl font-black text-white mb-4 tracking-tight">{uiTexts.loadingTitle}</h2>
              <p className="text-slate-400 text-sm max-w-md">{loadingMessage}</p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-8 max-w-xs">
                <div className="bg-gradient-to-r from-[#00e5ff] to-emerald-500 h-full w-4/5 rounded-full animate-pulse"></div>
              </div>
            </div>
          ) : (
            /* Vista Principal Dividida (Split Screen) */
            <div className="flex flex-col lg:flex-row gap-8 items-start my-8">
              
              {/* Columna Izquierda: Formulario (60%) */}
              <div className="w-full lg:w-[60%] bg-[#0a1128]/60 border border-white/5 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden glass flex flex-col justify-between min-h-[500px]">
                
                {/* Cabecera / Progreso */}
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                  <div>
                    <h1 className="text-xl font-black text-white tracking-tight">{uiTexts.title}</h1>
                    <p className="text-xs text-slate-400 mt-1">{uiTexts.step} {step} {uiTexts.of} {stepsCount}</p>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: stepsCount }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          step > i ? 'bg-[#00e5ff] w-6' : step === i + 1 ? 'bg-emerald-500 w-4' : 'bg-slate-700 w-1.5'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex-grow flex flex-col justify-between">
                  
                  {/* PASO 1: Datos Generales */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <Building className="w-4 h-4 text-[#00e5ff]" /> {uiTexts.step1Title}
                      </h2>
                      
                      <div className="grid gap-1.5">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{uiTexts.clientNameLabel}</label>
                        <input 
                          type="text"
                          className="w-full bg-[#050a15] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00e5ff] focus:outline-none transition-colors"
                          placeholder={uiTexts.clientNamePlaceholder}
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid gap-1.5">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{uiTexts.clientTypeLabel}</label>
                        <select 
                          className="w-full bg-[#050a15] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00e5ff] focus:outline-none transition-colors cursor-pointer"
                          value={clientType}
                          onChange={(e) => setClientType(e.target.value)}
                        >
                          <option value="Urbanización Residencial (Condominio / Edificios)">Urbanización Residencial (Condominio / Edificios)</option>
                          <option value="Comunidad Abierta (Sector / Barrio / Urbanización de Casas)">Comunidad Abierta (Sector / Barrio / Urbanización de Casas)</option>
                          <option value="Industria / Fábrica / Empresa">Industria / Fábrica / Empresa</option>
                          <option value="Municipio / Ciudad / Parroquia">Municipio / Ciudad / Parroquia</option>
                          <option value="Centro Comercial o Negocio de Alta Confluencia">Centro Comercial o Negocio de Alta Confluencia</option>
                          <option value="Otro">Otro</option>
                        </select>

                        {clientType === "Otro" && (
                          <div className="mt-2 grid gap-1.5 animate-fadeIn">
                            <label className="text-[10px] text-[#00e5ff] font-bold uppercase tracking-wider">Describe el Tipo de Entidad / Uso</label>
                            <input 
                              type="text"
                              className="w-full bg-[#050a15] border border-[#00e5ff]/30 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#00e5ff] focus:outline-none transition-colors"
                              placeholder="Ej. Hospital, Club Social, Colegio, Campamento..."
                              value={clientTypeCustom}
                              onChange={(e) => setClientTypeCustom(e.target.value)}
                              required
                            />
                          </div>
                        )}
                      </div>

                      <div className="grid gap-1.5">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{uiTexts.locationLabel}</label>
                        <input 
                          type="text"
                          className="w-full bg-[#050a15] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00e5ff] focus:outline-none transition-colors"
                          placeholder={uiTexts.locationPlaceholder}
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>

                      <div className="grid gap-1.5">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{uiTexts.limitsLabel}</label>
                        <input 
                          type="text"
                          className="w-full bg-[#050a15] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00e5ff] focus:outline-none transition-colors"
                          placeholder={uiTexts.limitsPlaceholder}
                          value={limits}
                          onChange={(e) => setLimits(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* PASO 2: Población y Servicios */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#00e5ff]" /> {uiTexts.step2Title}
                      </h2>

                      <div className="grid gap-1.5">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{uiTexts.populationLabel}</label>
                        <input 
                          type="text"
                          className="w-full bg-[#050a15] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00e5ff] focus:outline-none transition-colors"
                          placeholder={uiTexts.populationPlaceholder}
                          value={population}
                          onChange={(e) => setPopulation(e.target.value)}
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{uiTexts.servicesLabel}</label>
                        <div className="grid grid-cols-2 gap-2">
                          {servicesList.map((service) => (
                            <button
                              key={service}
                              type="button"
                              onClick={() => toggleService(service)}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                                criticalServices.includes(service) 
                                  ? 'bg-emerald-500/10 border-emerald-500 text-white font-bold' 
                                  : 'bg-[#050a15] border-white/5 text-slate-400 hover:border-white/10'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center ${criticalServices.includes(service) ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-white/20'}`}>
                                {criticalServices.includes(service) && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="truncate">{service}</span>
                            </button>
                          ))}
                        </div>

                        {/* Agregar servicio personalizado */}
                        <div className="flex gap-2 mt-2">
                          <input 
                            type="text"
                            placeholder="Otro servicio crítico..."
                            className="flex-grow bg-[#050a15] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00e5ff]"
                            value={customService}
                            onChange={(e) => setCustomService(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={handleAddService}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition-colors cursor-pointer"
                          >
                            + Añadir
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PASO 3: Amenazas y Recursos */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <Flame className="w-4 h-4 text-[#00e5ff]" /> {uiTexts.step3Title}
                      </h2>

                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{uiTexts.threatsLabel}</label>
                        <div className="grid grid-cols-2 gap-2">
                          {threatsList.map((threat) => (
                            <button
                              key={threat}
                              type="button"
                              onClick={() => toggleThreat(threat)}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                                threats.includes(threat) 
                                  ? 'bg-[#00e5ff]/10 border-[#00e5ff] text-white font-bold' 
                                  : 'bg-[#050a15] border-white/5 text-slate-400 hover:border-white/10'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center ${threats.includes(threat) ? 'bg-[#00e5ff] border-[#00e5ff] text-black' : 'border-white/20'}`}>
                                {threats.includes(threat) && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="truncate">{threat}</span>
                            </button>
                          ))}
                        </div>

                        {/* Agregar amenaza personalizada */}
                        <div className="flex gap-2 mt-2">
                          <input 
                            type="text"
                            placeholder="Otra amenaza..."
                            className="flex-grow bg-[#050a15] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00e5ff]"
                            value={customThreat}
                            onChange={(e) => setCustomThreat(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={handleAddThreat}
                            className="px-4 py-2 bg-[#00e5ff] text-black text-xs font-bold rounded-xl transition-colors cursor-pointer"
                          >
                            + Añadir
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{uiTexts.resourcesLabel}</label>
                        <div className="grid grid-cols-2 gap-2">
                          {resourcesList.map((resource) => (
                            <button
                              key={resource}
                              type="button"
                              onClick={() => toggleResource(resource)}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                                resources.includes(resource) 
                                  ? 'bg-purple-500/10 border-purple-500 text-white font-bold' 
                                  : 'bg-[#050a15] border-white/5 text-slate-400 hover:border-white/10'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center ${resources.includes(resource) ? 'bg-purple-500 border-purple-500 text-white' : 'border-white/20'}`}>
                                {resources.includes(resource) && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="truncate">{resource}</span>
                            </button>
                          ))}
                        </div>

                        {/* Agregar recurso personalizado */}
                        <div className="flex gap-2 mt-2">
                          <input 
                            type="text"
                            placeholder="Otro recurso disponible..."
                            className="flex-grow bg-[#050a15] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00e5ff]"
                            value={customResource}
                            onChange={(e) => setCustomResource(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={handleAddResource}
                            className="px-4 py-2 bg-[#00e5ff] text-black text-xs font-bold rounded-xl transition-colors cursor-pointer"
                          >
                            + Añadir
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-1">
                        <button
                          type="button"
                          onClick={() => setSecurityPrivate(!securityPrivate)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs transition-all cursor-pointer ${
                            securityPrivate 
                              ? 'bg-emerald-500/10 border-emerald-500 text-white font-bold' 
                              : 'bg-[#050a15] border-white/5 text-slate-400 hover:border-white/10'
                          }`}
                        >
                          <span className="truncate">{uiTexts.securityLabel}</span>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${securityPrivate ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-white/20'} flex-shrink-0 ml-2`}>
                            {securityPrivate && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setMedicalResidents(!medicalResidents)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs transition-all cursor-pointer ${
                            medicalResidents 
                              ? 'bg-emerald-500/10 border-emerald-500 text-white font-bold' 
                              : 'bg-[#050a15] border-white/5 text-slate-400 hover:border-white/10'
                          }`}
                        >
                          <span className="truncate">{uiTexts.medicalLabel}</span>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${medicalResidents ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-white/20'} flex-shrink-0 ml-2`}>
                            {medicalResidents && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PASO 4: Canales de Comunicación y Detalles */}
                  {step === 4 && (
                    <div className="space-y-5">
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <Settings className="w-4 h-4 text-[#00e5ff]" /> {uiTexts.step4Title}
                      </h2>

                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{uiTexts.commsLabel}</label>
                        <div className="grid grid-cols-3 gap-2">
                          {["WhatsApp / Messenger", "Mensajería SMS", "Llamadas telefónicas", "Radios VHF / UHF", "Megáfonos / Silbatos", "Visita presencial"].map((comm) => (
                            <button
                              key={comm}
                              type="button"
                              onClick={() => toggleComm(comm)}
                              className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center text-[10px] transition-all cursor-pointer ${
                                comms.includes(comm) 
                                  ? 'bg-[#00e5ff]/10 border-[#00e5ff] text-white font-bold' 
                                  : 'bg-[#050a15] border-white/5 text-slate-400 hover:border-white/10'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${comms.includes(comm) ? 'bg-[#00e5ff] border-[#00e5ff] text-black' : 'border-white/20'} mb-1`}>
                                {comms.includes(comm) && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                              <span className="truncate w-full">{comm}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-1.5">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{uiTexts.preRecordedLanguagesLabel}</label>
                        <input 
                          type="text"
                          className="w-full bg-[#050a15] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00e5ff] focus:outline-none transition-colors"
                          placeholder={uiTexts.preRecordedLanguagesPlaceholder}
                          value={preRecordedCommsLanguages}
                          onChange={(e) => setPreRecordedCommsLanguages(e.target.value)}
                        />
                      </div>

                      <div className="grid gap-1.5">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{uiTexts.detailsLabel}</label>
                        <textarea 
                          className="w-full bg-[#050a15] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00e5ff] focus:outline-none transition-colors h-24 resize-none"
                          placeholder={uiTexts.detailsPlaceholder}
                          value={specialDetails}
                          onChange={(e) => setSpecialDetails(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Controles de Navegación */}
                  <div className="mt-8 pt-6 border-t border-white/5 flex justify-between gap-4">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-5 py-3 bg-slate-800 text-white text-xs font-bold rounded-xl border border-white/5 hover:bg-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        {uiTexts.back}
                      </button>
                    ) : (
                      <div />
                    )}

                    {step < stepsCount ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black text-xs font-black rounded-xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        {uiTexts.next} <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-[#00e5ff] to-cyan-500 text-black text-xs font-black rounded-xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                      >
                        {uiTexts.submit} <ShieldCheck className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                </form>
              </div>

              {/* Columna Derecha: Ventana de Contexto (40%) */}
              <div className="w-full lg:w-[40%] bg-[#0a1128]/80 border border-[#00e5ff]/10 p-8 rounded-3xl shadow-xl glass lg:sticky lg:top-32 self-start min-h-[450px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
                    <BookOpen className="w-5 h-5 text-[#00e5ff]" />
                    <h2 className="text-sm font-bold text-white uppercase tracking-widest">{uiTexts.helpHeader}</h2>
                  </div>
                  
                  {step === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-black text-white">{uiTexts.step1HelpTitle}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed font-light">{uiTexts.step1HelpBody}</p>
                      <div className="p-4 rounded-xl bg-[#00e5ff]/5 border border-[#00e5ff]/20 text-xs text-slate-300 leading-relaxed font-mono">
                        {uiTexts.step1HelpExample}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-black text-white">{uiTexts.step2HelpTitle}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed font-light">{uiTexts.step2HelpBody}</p>
                      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-slate-300 leading-relaxed font-mono">
                        {uiTexts.step2HelpExample}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-black text-white">{uiTexts.step3HelpTitle}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed font-light">{uiTexts.step3HelpBody}</p>
                      <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 text-xs text-slate-300 leading-relaxed font-mono">
                        {uiTexts.step3HelpExample}
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-black text-white">{uiTexts.step4HelpTitle}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed font-light">{uiTexts.step4HelpBody}</p>
                      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-slate-300 leading-relaxed font-mono">
                        {uiTexts.step4HelpExample}
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 flex items-center gap-1.5 border-t border-white/5 pt-4 mt-6">
                  <HelpCircle className="w-3.5 h-3.5 text-[#00e5ff]" />
                  <span>{uiTexts.helpIntro}</span>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-xs text-slate-500 border-t border-white/5 bg-[#0a1128]/40">
        &copy; {new Date().getFullYear()} SURE Risk Mitigation Architecture (RMA). Todos los derechos reservados.
      </footer>
    </main>
  );
}
