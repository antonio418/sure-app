"use client";

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, 
  Activity, Check, Clock, Settings, Calendar, Music, BookOpen, ExternalLink, FileText, Play, Square
} from 'lucide-react';

// Official PROCDI Brand Color Coding:
// Midnight Tech Blue (Base Background): #0B192C
// Electric Tech Cyan (Action/Accent): #008DDA
// Slate Silver (Text/Neutral): #475569 or #64748B

const LOCAL_TRANSLATIONS: Record<string, any> = {
  lt: {
    s1_badge: "MB PROCDI • AUTONOMINIS KLINIKOS VALDYMAS",
    s1_title: "Odontologijos efektyvumo ateitis Lietuvoje",
    s1_subtitle: "Marija DI: Išmanusis administracinių srautų valdymas",
    s1_desc: "Pašalinkite kasdienę administracinę trintį. Leiskite savo odontologams susitelkti į tai, ką jie daro geriausiai – gydyti pacientus ir auginti klinikos pajamas.",
    
    s2_title: "Nematomi nuostoliai: Tuščios kėdės kaina",
    s2_card1: "Dideli fiksuoti kaštai (Personalas + Įranga)",
    s2_card2: "Neatvykimai (No-Shows) ir netikslingas planavimas",
    s2_card3: "Prarasti skubūs skambučiai savaitgaliais",
    s2_footer: "Odontologijoje neatvykimų dažnis paprastai svyruoja nuo 10% iki 30% (priklausomai nuo šalies ir specializacijos). Kiekvienas praleistas vizitas – tai negrįžtamai prarastos pajamos ir sutrikdytas tvarkaraštis.",
    s2_source: "Šaltinis: rev. lit. (Arini, PIMSY 2025); SCIMUS 2025. Žr. skaidrę „Šaltiniai“.",
    s2_btn_fill: "UŽPILDYTI KĖDĘ (SIMULIACIJA)",
    s2_btn_empty: "Atlaisvinti kėdę",
    s2_status_empty: "KĖDĖ TUŠČIA - prarandama 150€/val.",
    s2_status_filled: "KĖDĖ UŽPILDYTA - pajamos aktyvios",
    
    s3_title: "Operacinis butelio kaklelis: Perkrauta registratūra",
    s3_col1_title: "30–49%",
    s3_col1_desc: "rezervacijų atliekama NE klinikos darbo valandomis. Atsiliepiant tik telefonu, ši paklausa prarandama.",
    s3_col2_title: "63%",
    s3_col2_desc: "skubių odontologinių situacijų įvyksta ne darbo metu. Aukštos vertės pacientai negauna atsakymo ir renkasi konkurentus.",
    s3_footer: "Registratūros perdegimas kainuoja brangiai. Rankinis darbas piko valandomis riboja jūsų klinikos augimą.",
    s3_source: "Šaltiniai: Porton Health 2024; Resonate AI; Klara (Mayo Clinic).",
    
    s4_title: "Marija DI: Jūsų 24/7 išmanioji asistentė",
    s4_card1_title: "Always On",
    s4_card1_desc: "24/7 autonominis veikimas. Niekada nepraleidžia skambučio ar užklausos.",
    s4_card2_title: "Filtering",
    s4_card2_desc: "Tikslus paciento nurodyto poreikio registravimas formalia lietuvių kalba.",
    s4_card3_title: "Action",
    s4_card3_desc: "Automatinis vizitų patvirtinimas ir dinaminis laukiančiųjų sąrašų valdymas.",
    s4_footer: "Sprendimas be IT trinties. Jokių papildomų etatų, tik maksimaliai išnaudota esama infrastruktūra.",
    
    s5_title: "Teisinis vientisumas ir MDR atitiktis",
    s5_left_title: "Griežtai draudžiama / Strictly Forbidden",
    s5_left_p1: "Medicininis Triažas",
    s5_left_p2: "Klinikinis vertinimas ir diagnozės",
    s5_left_p3: "Medicininiai patarimai",
    s5_right_title: "100% Legal & Compliant",
    s5_right_p1: "Paciento poreikių registravimas",
    s5_right_p2: "Administracinių srautų valdymas",
    s5_right_p3: "Paciento nurodytos vizito priežasties administracinis perdavimas klinikai (be klinikinio vertinimo)",
    s5_footer: "Marija DI veikia griežtai laikantis ES Medicinos priemonių reglamento (MDR 2017/745) išimčių, kaip grynai administracinis įrankis.",
    
    s6_title: "Strateginis pagrindas: ES institucinė kryptis",
    s6_quote: "„Dirbtinis intelektas gali sumažinti administracinę naštą sveikatos priežiūros specialistams, palaikyti administracinius procesus ir pagerinti paslaugų teikimą.“",
    s6_author: "— Europos Komisija, „Apply AI“ strategija (2025 m. spalis)",
    s6_card1_title: "Politinis prioritetas",
    s6_card1_desc: "ES mobilizuoja ~1 mlrd. € DI diegimui, įskaitant sveikatos sektorių (2024–2029).",
    s6_card2_title: "Marija DI atitinka kryptį",
    s6_card2_desc: "Tiksliai administracinė funkcija – be klinikinio vertinimo, kaip rekomenduoja ES.",
    s6_card3_title: "Ne rizika, o standartas",
    s6_card3_desc: "94% ES sveikatos teikėjų jau naudoja ar planuoja diegti DI sprendimus.",
    s6_footer: "Šaltinis: Europos Komisija, „Apply AI“ strategija, COM(2025) 723, 2025 m. spalio 8 d. (EUR-Lex). Žr. skaidrę „Šaltiniai“.",

    s7_title: "Teisinis pagrindas: skaidrus paciento sutikimas",
    s7_step1: "1. Paciento užklausa priimama.",
    s7_step2: "2. Marija DI pateikia pacientui klinikos vizitų registravimo sąlygas ir privatumo pranešimą.",
    s7_step3: "3. Pacientas patvirtina sąlygas skaitmeniniu būdu.",
    s7_step4: "4. Vizitas patvirtinamas. Klinika turi dokumentuotą pagrindą taikyti aiškią atšaukimo politiką.",
    s7_footer: "Aiški atšaukimo politika ir dokumentuotas sutikimas – be jokių nepatogių pokalbių registratūroje.",
    s7_signed_status: "Sąlygos patvirtintos skaitmeniniu būdu",
    s7_sign_btn: "PATVIRTINTI SĄLYGAS Paciento vardu",
    
    s8_title: "Investicijų grąža (ROI): Pagrįsti, įrodymais paremti rodikliai",
    s8_card1_title: "Neatvykimų sumažėjimas",
    s8_card1_desc: "Automatiniai priminimai (vidutiniškai –34%; SMS 23–40%).",
    s8_card2_title: "Daugiau užregistruotų vizitų",
    s8_card2_desc: "Internetinė registracija vs. tik telefonas.",
    s8_card3_title: "Operacijų optimizavimas",
    s8_card3_desc: "DI automatizuoja ir optimizuoja operacijas, įskaitant pacientų planavimą (EBPO / EK).",
    s8_source: "Šaltiniai: sisteminė apžvalga (34%); Am. J. Medicine; Healthgrades; EBPO / Europos Komisija.",
    s8_footer: "Investicija, paremta tikrais Europos rinkos duomenimis – ne pažadais.",

    s9_title: "Nulinė instaliacija: Pradėkite veikti šiandien",
    s9_card1_title: "1. 10 Minučių Integracija",
    s9_card1_desc: "Jokių sudėtingų IT sistemų keitimų. Paprastas <script> kodo įterpimas į jūsų svetainę.",
    s9_card2_title: "2. Pritaikytas Klonas",
    s9_card2_desc: "Marija DI apmokoma naudoti jūsų klinikos kainoraščius, logotipą ir PSD politikas.",
    s9_card3_title: "3. Hibridinis Veikimas",
    s9_card3_desc: "Gaukite išfiltruotus, skubius pre-registracijos prašymus tiesiai į savo el. paštą.",
    s9_footer: "Išbandykite savo klinikos interaktyvią demonstraciją jau dabar.",
    s9_contact: "Susisiekite su mumis: MB PROCDI | +370 689 41110 | antonio@procdi.com | www.procdi.com",
    
    s10_title: "Šaltiniai ir metodinė pastaba",
    s10_footer: "Pastaba: skaičiai pateikti kaip įrodymais paremti intervalai, o ne kaip garantuoti rezultatai. Šaltiniai prioritetine tvarka: ES / EEE. Šis dokumentas nėra teisinė konsultacija.",
    
    continue: "TĘSTI",
    back: "ATGAL",
    lang_selector: "Kalba"
  },
  es: {
    s1_badge: "MB PROCDI • GESTIÓN CLÍNICA AUTÓNOMA",
    s1_title: "El futuro de la eficiencia dental en Lituania",
    s1_subtitle: "Marija DI: Gestión inteligente de flujos administrativos",
    s1_desc: "Elimine la fricción administrativa diaria. Permita que sus odontólogos se concentren en lo que mejor hacen: curar pacientes y aumentar los ingresos de la clínica.",
    
    s2_title: "Pérdidas invisibles: El costo del sillón vacío",
    s2_card1: "Altos costos fijos (Personal + Equipamiento)",
    s2_card2: "Inasistencias (No-Shows) y planificación ineficiente",
    s2_card3: "Pérdida de llamadas de urgencia los fines de semana",
    s2_footer: "Se pierde hasta el 25% de los ingresos anuales de la clínica debido a una mala gestión del tiempo y sillones vacíos. Sus costos no se detienen, incluso cuando el sillón está frío.",
    s2_source: "Fuente: rev. lit. (Arini, PIMSY 2025); SCIMUS 2025. Ver diapositiva \"Fuentes\".",
    s2_btn_fill: "LLENAR SILLÓN (SIMULACIÓN)",
    s2_btn_empty: "Vaciar sillón",
    s2_status_empty: "SILLÓN VACÍO - Pérdida de 150€/hora",
    s2_status_filled: "SILLÓN LLENO - Ingresos activos",
    
    s3_title: "Cuello de botella operativo: Recepción saturada",
    s3_col1_title: "30–49%",
    s3_col1_desc: "de reservas se realizan FUERA del horario de atención clínica. Al responder solo por teléfono, esta demanda se pierde.",
    s3_col2_title: "63%",
    s3_col2_desc: "de las urgencias odontológicas ocurren fuera de horario. Los pacientes de alto valor no reciben respuesta y eligen a la competencia.",
    s3_footer: "El agotamiento de recepción cuesta caro. El trabajo manual en horas pico limita el crecimiento de su clínica.",
    s3_source: "Fuentes: Porton Health 2024; Resonate AI; Klara (Mayo Clinic).",
    
    s4_title: "Marija DI: Tu asistente inteligente 24/7",
    s4_card1_title: "Always On",
    s4_card1_desc: "Operación autónoma 24/7. Nunca pierde una llamada o consulta de paciente.",
    s4_card2_title: "Filtering",
    s4_card2_desc: "Registro preciso del motivo de visita indicado por el paciente en lituano formal (Jūs).",
    s4_card3_title: "Action",
    s4_card3_desc: "Confirmación automática de citas y gestión dinámica de listas de espera.",
    s4_footer: "Solución sin fricción de TI. Sin personal adicional, solo el máximo aprovechamiento de la infraestructura existente.",
    
    s5_title: "Integridad legal y conformidad MDR",
    s5_left_title: "Strictly Forbidden / Griežtai draudžiama",
    s5_left_p1: "Triaje médico",
    s5_left_p2: "Evaluación clínica y diagnósticos",
    s5_left_p3: "Consejos y asesoramiento médico",
    s5_right_title: "100% Legal & Compliant",
    s5_right_p1: "Evaluación preliminar de necesidades",
    s5_right_p2: "Gestión de flujos administrativos",
    s5_right_p3: "Registro administrativo del motivo de visita indicado por el paciente y traslado a la clínica.",
    s5_footer: "Marija DI opera estrictamente bajo las exenciones del Reglamento Europeo de Dispositivos Médicos (MDR 2017/745), como una herramienta meramente administrativa.",
    
    s6_title: "Marco Estratégico: Directiva institucional de la UE",
    s6_quote: "“La Inteligencia Artificial puede reducir la carga administrativa de los profesionales sanitarios, apoyar los procesos administrativos y mejorar la prestación de servicios.”",
    s6_author: "— Comisión Europea, Estrategia \"Apply AI\" (Octubre de 2025)",
    s6_card1_title: "Prioridad Política",
    s6_card1_desc: "La UE moviliza ~1.000 millones de € para el despliegue de IA, incluido el sector salud (2024-2029).",
    s6_card2_title: "Marija DI se alinea",
    s6_card2_desc: "Función estrictamente administrativa, sin evaluación clínica automática, tal como recomienda la UE.",
    s6_card3_title: "Estándar sectorial",
    s6_card3_desc: "El 94% de los proveedores de salud de la UE ya utilizan o planean implementar soluciones de IA.",
    s6_footer: "Fuente: Comisión Europea, Estrategia \"Apply AI\", COM(2025) 723, 8 de octubre de 2025 (EUR-Lex). Ver diapositiva \"Fuentes\".",

    s7_title: "Base jurídica: consentimiento transparente del paciente",
    s7_step1: "1. Se recibe la consulta del paciente.",
    s7_step2: "2. Marija DI presenta al paciente las condiciones de registro de visitas y el aviso de privacidad.",
    s7_step3: "3. El paciente confirma las condiciones de forma digital.",
    s7_step4: "4. Cita confirmada. La clínica tiene base documentada para aplicar una política clara de cancelación.",
    s7_footer: "Política clara de cancelación y consentimiento documentado, sin conversaciones incómodas en recepción.",
    s7_signed_status: "Condiciones firmadas y resguardadas con éxito",
    s7_sign_btn: "CONFIRMAR CONDICIONES (Simular firma)",
    
    s8_title: "Retorno de inversión (ROI): Indicadores validados por evidencia",
    s8_card1_title: "Reducción de ausentismo",
    s8_card1_desc: "Recordatorios automáticos (promedio del –34%; SMS del 23% al 40%).",
    s8_card2_title: "Más reservas de citas",
    s8_card2_desc: "Registro online de citas las 24 horas vs. solo atención telefónica.",
    s8_card3_title: "Optimización operativa",
    s8_card3_desc: "La IA automatiza tareas repetitivas y planifica agendas de forma eficiente (OCDE / CE).",
    s8_source: "Fuentes: revisión sistemática (34%); Am. J. Medicine; Healthgrades; OCDE / Comisión Europea.",
    s8_footer: "Una inversión respaldada por datos reales del mercado europeo, no por promesas.",

    s9_title: "Instalación cero: Comience hoy mismo",
    s9_card1_title: "1. 10 Minutos de Integración",
    s9_card1_desc: "Sin cambios complejos en sus sistemas de TI. Inserción sencilla de un código <script> en su web.",
    s9_card2_title: "2. Clon personalizado",
    s9_card2_desc: "Marija DI es entrenada con los precios de su clínica, su logotipo y las políticas de la caja de salud (PSD).",
    s9_card3_title: "3. Operación híbrida",
    s9_card3_desc: "Reciba las solicitudes de pre-registro filtradas y urgentes directamente en su correo electrónico.",
    s9_footer: "Pruebe la demostración interactiva de su clínica ahora mismo.",
    s9_contact: "Contacto: MB PROCDI | +370 689 41110 | antonio@procdi.com | www.procdi.com",
    
    s10_title: "Fuentes y nota metodológica",
    s10_footer: "Nota: las cifras se presentan como rangos empíricos sustentados por evidencia, no como garantías. Fuentes priorizadas: UE / EEE. Este documento no constituye asesoramiento legal.",
    
    continue: "CONTINUAR",
    back: "ATRÁS",
    lang_selector: "Idioma"
  },
  en: {
    s1_badge: "MB PROCDI • AUTONOMOUS CLINICAL MANAGEMENT",
    s1_title: "The future of dental efficiency in Lithuania",
    s1_subtitle: "Marija DI: Intelligent administrative flow management",
    s1_desc: "Eliminate daily administrative friction. Allow your dentists to focus on what they do best – treating patients and growing clinic revenues.",
    
    s2_title: "Invisible losses: The cost of the empty chair",
    s2_card1: "High fixed costs (Staff + Equipment)",
    s2_card2: "No-Shows and inefficient scheduling",
    s2_card3: "Lost urgent calls during weekends",
    s2_footer: "Up to 25% of annual clinic revenue is lost due to inefficient time planning and empty chairs. Your costs do not stop, even when the chair goes cold.",
    s2_source: "Source: rev. lit. (Arini, PIMSY 2025); SCIMUS 2025. See \"Sources\" slide.",
    s2_btn_fill: "FILL CHAIR (SIMULATION)",
    s2_btn_empty: "Empty chair",
    s2_status_empty: "CHAIR EMPTY - 150€/hour lost",
    s2_status_filled: "CHAIR FILLED - Revenue active",
    
    s3_title: "Operational bottleneck: Overwhelmed reception",
    s3_col1_title: "30–49%",
    s3_col1_desc: "of bookings are made OUTSIDE clinic operating hours. When relying only on phone calls, this demand is lost.",
    s3_col2_title: "63%",
    s3_col2_desc: "of urgent dental situations happen after hours. High-value patients receive no answer and choose competitors.",
    s3_footer: "Reception burnout is expensive. Manual work during peak hours limits your clinic's growth.",
    s3_source: "Sources: Porton Health 2024; Resonate AI; Klara (Mayo Clinic).",
    
    s4_title: "Marija DI: Your 24/7 smart assistant",
    s4_card1_title: "Always On",
    s4_card1_desc: "24/7 Autonomous operation. Never misses a patient call or query.",
    s4_card2_title: "Filtering",
    s4_card2_desc: "Precise recording of the patient's visit reason in formal Lithuanian language (Jūs).",
    s4_card3_title: "Action",
    s4_card3_desc: "Automatic appointment confirmation and dynamic waitlist management.",
    s4_footer: "Zero-friction IT solution. No additional headcount, only maximum utilization of existing infrastructure.",
    
    s5_title: "Legal integrity and MDR compliance",
    s5_left_title: "Strictly Forbidden / Griežtai draudžiama",
    s5_left_p1: "Medical triage",
    s5_left_p2: "Clinical evaluation and diagnoses",
    s5_left_p3: "Medical advice or consulting",
    s5_right_title: "100% Legal & Compliant",
    s5_right_p1: "Preliminary assessment of needs",
    s5_right_p2: "Administrative flow management",
    s5_right_p3: "Administrative registration of the visit reason indicated by the patient and transmission to the clinic.",
    s5_footer: "Marija DI operates strictly under the EU Medical Devices Regulation (MDR 2017/745) exemptions, as a purely administrative tool.",
    
    s6_title: "Strategic Framework: EU Institutional Direction",
    s6_quote: "“Artificial Intelligence can reduce the administrative burden on healthcare professionals, support administrative processes, and improve service delivery.”",
    s6_author: "— European Commission, \"Apply AI\" Strategy (October 2025)",
    s6_card1_title: "Political Priority",
    s6_card1_desc: "The EU is mobilizing ~1 billion € for AI deployment, including the health sector (2024-2029).",
    s6_card2_title: "Marija DI aligns",
    s6_card2_desc: "Strictly administrative function, without automatic clinical evaluation, as recommended by the EU.",
    s6_card3_title: "Industry Standard",
    s6_card3_desc: "94% of EU healthcare providers already use or plan to deploy AI solutions.",
    s6_footer: "Source: European Commission, \"Apply AI\" Strategy, COM(2025) 723, October 8, 2025 (EUR-Lex). See \"Sources\" slide.",

    s7_title: "Legal basis: transparent patient consent",
    s7_step1: "1. Patient inquiry is received.",
    s7_step2: "2. Marija DI presents to the patient the visit registration conditions and privacy notice.",
    s7_step3: "3. Patient signs the agreement digitally and securely.",
    s7_step4: "4. Appointment confirmed. Clinic has a documented basis to apply a clear cancellation policy.",
    s7_footer: "Clear cancellation policy and documented consent, without uncomfortable reception conversations.",
    s7_signed_status: "Agreement signed and securely archived",
    s7_sign_btn: "SIGN DIGITALLY NOW",
    
    s8_title: "Return on investment (ROI): Evidence-backed indicators",
    s8_card1_title: "Reduction of no-shows",
    s8_card1_desc: "Automatic reminders (average of –34%; SMS 23% to 40%).",
    s8_card2_title: "More appointment bookings",
    s8_card2_desc: "24/7 online scheduling vs. phone-only reception desk.",
    s8_card3_title: "Operations optimization",
    s8_card3_desc: "AI automates routine tasks and schedules patient flows efficiently (OECD / EC).",
    s8_source: "Sources: systematic review (34%); Am. J. Medicine; Healthgrades; OECD / European Commission.",
    s8_footer: "An investment backed by actual European market data, not by empty promises.",

    s9_title: "Zero setup: Start operating today",
    s9_card1_title: "1. 10-Minute Integration",
    s9_card1_desc: "No complex changes to your IT systems. SImple <script> code insertion into your website.",
    s9_card2_title: "2. Customized Clone",
    s9_card2_desc: "Marija DI is trained with your clinic's fees, logo, and health insurance (PSD) policies.",
    s9_card3_title: "3. Hybrid Operations",
    s9_card3_desc: "Get pre-filtered, urgent pre-registration requests directly in your inbox.",
    s9_footer: "Try your clinic's interactive demonstration right now.",
    s9_contact: "Contact: MB PROCDI | +370 689 41110 | antonio@procdi.com | www.procdi.com",
    
    s10_title: "Sources and methodological note",
    s10_footer: "Note: figures are presented as empirical evidence-backed ranges, not as guarantees. Prioritized sources: EU / EEA. This document does not constitute legal advice.",
    
    continue: "CONTINUE",
    back: "BACK",
    lang_selector: "Language"
  }
};

const DENTAL_REFERENCES = [
  {
    author: "Europos Komisija",
    title: "„Apply AI“ strategija COM(2025) 723 (administracinė našta, paslaugų teikimas)",
    link: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52025DC0723"
  },
  {
    author: "Europos Komisija",
    title: "DI sveikatos priežiūroje (94% teikėjų)",
    link: "https://digital-strategy.ec.europa.eu/en/library/study-artificial-intelligence-healthcare-dissects-digital-health-technologies-europe"
  },
  {
    author: "Europos Komisija",
    title: "DI ir MDR / AI Act",
    link: "https://health.ec.europa.eu/ehealth-digital-health-and-care/artificial-intelligence-healthcare_en"
  },
  {
    author: "PSO Europa",
    title: "DI parengtis ES sveikatos sistemose (2024–2025)",
    link: "https://who.int/europe/publications/i/item/WHO-EURO-2026-12707-52481-81471"
  },
  {
    author: "EBPO (OECD)",
    title: "DI sveikatos sektoriuje (operacijų automatizavimas, pacientų planavimas)",
    link: "https://www.oecd.org/en/publications/progress-in-implementing-the-european-union-coordinated-plan-on-artificial-intelligence-volume-2_3ac96d41-en.html"
  },
  {
    author: "Eurostat",
    title: "Nepatenkinti odontologijos poreikiai ES (2024 m. duomenys)",
    link: "https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20250829-2"
  },
  {
    author: "The American Journal of Medicine",
    title: "Priminimų sistemos (RCT)",
    link: "https://amjmed.com/article/S0002-9343(10)00108-7/fulltext"
  },
  {
    author: "Klara",
    title: "SMS priminimai mažina neatvykimus ~38%; Healthgrades +24%",
    link: "https://klara.com/blog/text-message-appointment-reminders-reduce-no-shows-by-38"
  },
  {
    author: "Porton Health",
    title: "~49% rezervacijų ne darbo valandomis",
    link: "https://portonhealth.com/when-do-patients-prefer-online-appointments"
  },
  {
    author: "Resonate AI",
    title: "63% skubių situacijų ne darbo metu; 168 val./sav.",
    link: "https://resonateapp.com/resources/dental-patient-appointment-booking-statistics"
  },
  {
    author: "PMC",
    title: "Neatvykimai odontologijoje (Suomija, 2,5 mln. vizitų registras)",
    link: "https://ncbi.nlm.nih.gov/pmc/articles/PMC1253508/"
  }
];

// Premium SVG Component for MB PROCDI Isometric 3D Technology Cube Logo
const ProcdiLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="procdiGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Left Face (Midnight Tech / Cobalt Blue core) */}
    <polygon 
      points="15,35 50,52 50,90 15,73" 
      fill="#050D1A" 
      stroke="#008DDA" 
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    
    {/* Right Face (Midnight Tech / Cobalt Blue core) */}
    <polygon 
      points="50,52 85,35 85,73 50,90" 
      fill="#030A14" 
      stroke="#008DDA" 
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    
    {/* Top Face */}
    <polygon 
      points="50,15 85,35 50,52 15,35" 
      fill="#0B192C" 
      stroke="#008DDA" 
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    
    {/* Isometric Tech Filaments/Engravings */}
    <line x1="50" y1="23" x2="68" y2="31" stroke="#008DDA" strokeWidth="1.5" strokeDasharray="3 1.5" />
    <line x1="50" y1="23" x2="32" y2="31" stroke="#008DDA" strokeWidth="1.5" strokeDasharray="3 1.5" />
    <line x1="50" y1="44" x2="50" y2="23" stroke="#008DDA" strokeWidth="1.5" />
    
    {/* Glowing Nodes representing AI endpoints */}
    <circle cx="50" cy="15" r="4" fill="#008DDA" filter="url(#procdiGlow)" />
    <circle cx="85" cy="35" r="4" fill="#008DDA" filter="url(#procdiGlow)" />
    <circle cx="15" cy="35" r="4" fill="#008DDA" filter="url(#procdiGlow)" />
    <circle cx="50" cy="52" r="4" fill="#008DDA" filter="url(#procdiGlow)" />
    <circle cx="50" cy="90" r="4" fill="#008DDA" filter="url(#procdiGlow)" />
    <circle cx="15" cy="73" r="2.5" fill="#008DDA" />
    <circle cx="85" cy="73" r="2.5" fill="#008DDA" />
  </svg>
);

// Ambient Audio Synthesizer playing soft clinical relaxation music loops in F Major
class AmbientSynth {
  private ctx: any = null;
  private oscillators: any[] = [];
  private gainNodes: any[] = [];
  private mainGain: any = null;
  private filter: any = null;
  private isPlaying = false;
  private chordInterval: any = null;

  start() {
    if (typeof window === 'undefined' || this.isPlaying) return;
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.isPlaying = true;

      // Lowpass filter to keep sound warm and relaxing (no harsh highs)
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(250, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(1, this.ctx.currentTime);

      this.mainGain = this.ctx.createGain();
      this.mainGain.gain.setValueAtTime(0.04, this.ctx.currentTime); // Soft 4% volume

      this.filter.connect(this.mainGain);
      this.mainGain.connect(this.ctx.destination);

      // Relaxing clinical chord progression: Fmaj7 -> Cmaj7 -> Am7 -> Gsus4
      const chords = [
        [174.61, 220.00, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
        [130.81, 196.00, 261.63, 329.63], // Cmaj7 (C3, G3, C4, E4)
        [110.00, 164.81, 220.00, 261.63], // Am7 (A2, E3, A3, C4)
        [146.83, 196.00, 293.66, 392.00]  // Gsus4 (D3, G3, D4, G4)
      ];

      let chordIndex = 0;
      const playChord = () => {
        if (!this.isPlaying || !this.ctx) return;
        
        this.oscillators.forEach(osc => {
          try { osc.stop(); } catch(e) {}
        });
        this.oscillators = [];
        this.gainNodes = [];

        const now = this.ctx.currentTime;
        const freqs = chords[chordIndex];
        chordIndex = (chordIndex + 1) % chords.length;

        freqs.forEach(freq => {
          if (!this.ctx || !this.filter) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine'; // Super-soft sine waveform
          osc.frequency.setValueAtTime(freq, now);

          // Very slow, dreamy ambient attack and release envelopes
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.25, now + 2); // 2s attack
          gain.gain.setValueAtTime(0.25, now + 6);
          gain.gain.linearRampToValueAtTime(0, now + 8); // 2s release

          osc.connect(gain);
          gain.connect(this.filter);

          osc.start(now);
          osc.stop(now + 8.1);

          this.oscillators.push(osc);
          this.gainNodes.push(gain);
        });
      };

      playChord();
      this.chordInterval = setInterval(playChord, 8000);

    } catch (e) {
      console.error("Web Audio API error:", e);
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.chordInterval) {
      clearInterval(this.chordInterval);
      this.chordInterval = null;
    }
    this.oscillators.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    this.oscillators = [];
    if (this.ctx) {
      try { this.ctx.close(); } catch(e) {}
      this.ctx = null;
    }
  }
}

export default function PresentationMarija() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [currentLang, setCurrentLang] = useState('lt'); // Default to Lithuanian
  
  // Interactive states
  const [chairFilled, setChairFilled] = useState(false);
  const [contractSigned, setContractSigned] = useState(false);
  const [monthlyRevenue, setMonthlyRevenue] = useState(15000);
  
  // Clean Autoplay Video Mode states (No Voiceover)
  const [autoplayActive, setAutoplayActive] = useState(false);
  const [autoplayTimeLeft, setAutoplayTimeLeft] = useState(8); // 8 seconds per slide
  
  // Ambient Music hooks
  const [musicEnabled, setMusicEnabled] = useState(false);
  const synth = React.useMemo(() => new AmbientSynth(), []);

  useEffect(() => {
    if (musicEnabled) {
      synth.start();
    } else {
      synth.stop();
    }
  }, [musicEnabled, synth]);

  useEffect(() => {
    return () => {
      synth.stop();
    };
  }, [synth]);

  // Navigation key listeners for clinical presentation mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, autoplayActive]);

  // Automatic clean slide progression in Autoplay Video Mode
  useEffect(() => {
    if (!autoplayActive) return;

    const interval = setInterval(() => {
      setAutoplayTimeLeft((prev) => {
        if (prev <= 1) {
          // Advance slide
          setCurrentSlide((slide) => {
            if (slide >= 10) {
              setAutoplayActive(false);
              return 1;
            }
            return slide + 1;
          });
          return 8; // Reset countdown
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoplayActive]);

  // Handle slide change specific interactive triggers
  useEffect(() => {
    if (currentSlide === 2) {
      // Auto fill chair in slide 2 after a small delay
      const t = setTimeout(() => setChairFilled(true), 2500);
      return () => clearTimeout(t);
    } else if (currentSlide === 7) {
      // Auto sign in slide 7 after a small delay
      const t = setTimeout(() => setContractSigned(true), 3500);
      return () => clearTimeout(t);
    }
  }, [currentSlide]);

  const toggleAutoplay = () => {
    if (autoplayActive) {
      setAutoplayActive(false);
    } else {
      setCurrentSlide(1);
      setChairFilled(false);
      setContractSigned(false);
      setAutoplayTimeLeft(8);
      setAutoplayActive(true);
    }
  };

  const nextSlide = () => {
    if (autoplayActive) setAutoplayActive(false);
    if (currentSlide < 10) setCurrentSlide(prev => prev + 1);
  };

  const prevSlide = () => {
    if (autoplayActive) setAutoplayActive(false);
    if (currentSlide > 1) setCurrentSlide(prev => prev - 1);
  };

  const t = (key: string) => {
    return LOCAL_TRANSLATIONS[currentLang]?.[key] || LOCAL_TRANSLATIONS['en']?.[key] || key;
  };

  return (
    <main className="w-screen h-screen bg-[#F8FAFC] text-[#0B192C] font-montserrat selection:bg-[#008DDA]/10 overflow-hidden flex flex-col justify-between p-6 relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
        .font-montserrat {
          font-family: 'Montserrat', sans-serif !important;
        }
        @keyframes ecgPulse {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-ecgPulse {
          stroke-dasharray: 1000;
          animation: ecgPulse 8s linear infinite;
        }
      `}</style>
      
      {/* Soft radial tech glows in Light Mode */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#008DDA]/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#008DDA]/35 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Slide Inner Card Frame with cyber corner notch styling */}
      <div className="flex-1 w-full bg-white rounded-[2rem] border-2 border-[#0B192C] p-8 flex flex-col justify-between relative shadow-[0_16px_48px_rgba(15,23,42,0.06)] overflow-hidden z-10">
        
        {/* Cyber Tech Corner Brackets */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#008DDA] rounded-tl-xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#008DDA] rounded-tr-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#008DDA] rounded-bl-xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#008DDA] rounded-br-xl pointer-events-none" />

        {/* Top Bar / Slide Header - Premium Light Theme */}
        <header className="w-full flex justify-between items-center z-20 pb-4 border-b border-[#0B192C]/10 relative">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center justify-center border border-slate-200 bg-white rounded-xl p-2 w-16 h-16 shadow-sm shrink-0">
              <ProcdiLogo className="w-10 h-10 shrink-0" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-[0.06em] text-[#0B192C] leading-none">
                  PRÓCDI
                </span>
                <span className="text-[10px] text-white bg-[#008DDA] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  MB PROCDI
                </span>
              </div>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-[0.12em] mt-1">
                Marija DI • Premium Clinical AI System
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Background Music Toggle */}
            <button 
              onClick={() => setMusicEnabled(!musicEnabled)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-bold rounded-full border transition-all duration-300 tracking-wider ${musicEnabled ? 'bg-cyan-100 border-cyan-300 text-[#008DDA] shadow-[0_0_12px_rgba(0,141,218,0.2)] animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'}`}
            >
              <Music className={`w-4 h-4 ${musicEnabled ? 'animate-spin' : ''}`} />
              <span>{t('music_toggle')}</span>
            </button>

            {/* Play/Sync Autoplay Video Mode Button */}
            <button 
              onClick={toggleAutoplay}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs md:text-sm font-bold rounded-full border transition-all duration-300 tracking-wider ${autoplayActive ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-[#0B192C] border-[#0B192C] text-white hover:bg-[#008DDA] hover:border-[#008DDA] shadow-md'}`}
            >
              {autoplayActive ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current mr-1" />
                  <span>{currentLang === 'lt' ? `AUTOMATINIS REŽIMAS (${autoplayTimeLeft}s)` : `AUTO-PLAY ACTIVE (${autoplayTimeLeft}s)`}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current mr-1" />
                  <span>{currentLang === 'lt' ? 'AUTOMATINIS REŽIMAS (OBS)' : 'AUTO-PLAY VIDEO MODE'}</span>
                </>
              )}
            </button>

            {/* Language Selector */}
            <div className="flex bg-slate-100 rounded-full p-1 border border-slate-200 shadow-inner">
              <button 
                onClick={() => setCurrentLang('lt')}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all tracking-wider ${currentLang === 'lt' ? 'bg-[#0B192C] text-white shadow-md' : 'text-slate-600 hover:text-[#0B192C]'}`}
              >
                LT
              </button>
              <button 
                onClick={() => setCurrentLang('es')}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all tracking-wider ${currentLang === 'es' ? 'bg-[#0B192C] text-white shadow-md' : 'text-slate-600 hover:text-[#0B192C]'}`}
              >
                ES
              </button>
              <button 
                onClick={() => setCurrentLang('en')}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all tracking-wider ${currentLang === 'en' ? 'bg-[#0B192C] text-white shadow-md' : 'text-slate-600 hover:text-[#0B192C]'}`}
              >
                EN
              </button>
            </div>
            
            <div className="text-xs font-bold text-[#008DDA] bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-full shadow-sm tracking-wider">
              Slide {currentSlide} / 10
            </div>
          </div>
        </header>

        {/* Main Slide Content Sandbox Area */}
        <section className="flex-1 w-full flex items-center justify-center py-4 overflow-hidden relative z-10">
          <div className="w-full h-full flex flex-col justify-center relative">

            {/* SLIDE 1: Portada */}
            {currentSlide === 1 && (
              <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-8 animate-fadeIn">
                <div className="flex-[1.5] flex flex-col justify-center max-w-3xl">
                  <span className="self-start text-[11px] md:text-[12px] font-black uppercase tracking-[0.14em] px-4 py-2 rounded-full bg-[#008DDA]/10 border border-[#008DDA]/30 text-[#008DDA] mb-6 shadow-sm">
                    {t('s1_badge')}
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#0B192C] leading-[1.15] mb-4">
                    {t('s1_title')}
                  </h1>
                  <p className="text-xl md:text-2xl font-bold tracking-wide text-[#008DDA] mb-6 leading-relaxed">
                    {t('s1_subtitle')}
                  </p>
                  <p className="text-slate-600 text-base md:text-lg leading-relaxed font-semibold">
                    {t('s1_desc')}
                  </p>
                </div>
                <div className="flex-[0.9] flex items-center justify-center">
                  <div className="relative w-72 h-72 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-md p-6 overflow-hidden">
                    <div className="w-full flex flex-col items-center gap-4">
                      <svg className="w-full h-32" viewBox="0 0 200 100" fill="none">
                        <path d="M0 10H200M0 20H200M0 30H200M0 40H200M0 50H200M0 60H200M0 70H200M0 80H200M0 90H200" stroke="#E2E8F0" strokeWidth="0.5" />
                        <path d="M20 0V100M40 0V100M60 0V100M80 0V100M100 0V100M120 0V100M140 0V100M160 0V100M180 0V100" stroke="#E2E8F0" strokeWidth="0.5" />
                        <path 
                          d="M0 50 L60 50 L70 30 L80 70 L90 50 L100 50 L105 20 L110 80 L115 50 L125 50 L130 45 L135 55 L140 50 L200 50" 
                          stroke="#008DDA" 
                          strokeWidth="3.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="animate-ecgPulse"
                        />
                      </svg>
                      <div className="flex items-center gap-2 mt-2 bg-emerald-100 border border-emerald-300 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                        MARIJA DI ACTIVE
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 2: Nematomi nuostoliai: Tuščios kėdės kaina */}
            {currentSlide === 2 && (
              <div className="flex-1 flex flex-col justify-between animate-fadeIn">
                <div className="text-center max-w-4xl mx-auto mb-2">
                  <h2 className="text-3xl md:text-4.5xl font-black tracking-tight text-[#0B192C] leading-tight">
                    {t('s2_title')}
                  </h2>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 py-2">
                  <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    
                    <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 shadow-sm hover:border-[#008DDA] transition-all flex flex-col justify-between h-36 relative">
                      <div className="text-[#008DDA] font-bold text-xs uppercase tracking-widest border-b border-slate-200 pb-2">Dideli Kaštai</div>
                      <p className="text-slate-700 text-xs md:text-sm font-bold mt-2 leading-relaxed">{t('s2_card1')}</p>
                      <div className="self-end text-slate-300"><Clock className="w-5 h-5" /></div>
                    </div>

                    <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 shadow-sm hover:border-[#008DDA] transition-all flex flex-col justify-between h-36 relative">
                      <div className="text-[#008DDA] font-bold text-xs uppercase tracking-widest border-b border-slate-200 pb-2">No-Shows</div>
                      <p className="text-slate-700 text-xs md:text-sm font-bold mt-2 leading-relaxed">{t('s2_card2')}</p>
                      <div className="self-end text-slate-300"><AlertTriangle className="w-5 h-5" /></div>
                    </div>

                    <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 shadow-sm hover:border-[#008DDA] transition-all flex flex-col justify-between h-36 relative">
                      <div className="text-[#008DDA] font-bold text-xs uppercase tracking-widest border-b border-slate-200 pb-2">Prarasti Skubūs</div>
                      <p className="text-slate-700 text-xs md:text-sm font-bold mt-2 leading-relaxed">{t('s2_card3')}</p>
                      <div className="self-end text-slate-300"><Calendar className="w-5 h-5" /></div>
                    </div>

                    <div className="bg-[#008DDA] rounded-2xl p-5 text-center flex flex-col justify-center items-center h-36 shadow-md border-2 border-[#008DDA] relative overflow-hidden group">
                      <span className="text-white font-black text-4xl tracking-tight drop-shadow-md">10-30%</span>
                      <span className="text-white text-[10px] font-black uppercase tracking-widest mt-2 leading-snug">
                        {currentLang === 'lt' ? 'Nuostoliai' : currentLang === 'es' ? 'Pérdidas' : 'Losses'}
                      </span>
                    </div>

                  </div>

                  <div className="w-60 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-between shadow-sm h-60 shrink-0">
                    <div className={`w-full py-1.5 px-3 rounded-xl text-center text-[10px] font-black transition-all duration-300 ${chairFilled ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-red-100 text-red-700 border border-red-300 animate-pulse'}`}>
                      {chairFilled ? t('s2_status_filled') : t('s2_status_empty')}
                    </div>
                    
                    <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="25" y="65" width="50" height="6" rx="3" fill="#94A3B8" />
                      <line x1="50" y1="65" x2="50" y2="45" stroke="#94A3B8" strokeWidth="4" />
                      <path 
                        d="M20,40 Q35,42 50,40 T80,35 Q85,45 80,50 T45,47 Q30,48 20,40 Z" 
                        fill={chairFilled ? "#10B981" : "#EF4444"} 
                        className="transition-colors duration-500" 
                        stroke="#0B192C"
                        strokeWidth="1.5"
                      />
                      <path 
                        d="M22,30 Q30,35 40,30 Q45,20 35,15 Q25,20 22,30 Z" 
                        fill="#64748B" 
                        stroke="#0B192C"
                        strokeWidth="1.5"
                      />
                    </svg>

                    <div className="flex gap-2 w-full justify-center">
                      <button onClick={() => setChairFilled(true)} className="px-3 py-1 bg-[#008DDA] text-white text-[9px] font-black rounded-lg transition-all uppercase tracking-wider">Fill</button>
                      <button onClick={() => setChairFilled(false)} className="px-3 py-1 bg-slate-200 text-slate-700 text-[9px] font-black rounded-lg transition-all uppercase tracking-wider">Empty</button>
                    </div>
                  </div>
                </div>

                <div className="w-full flex flex-col gap-1 mt-2">
                  <div className="w-full bg-[#0B192C] text-white text-xs md:text-sm font-semibold py-3 px-6 rounded-2xl text-center leading-relaxed">
                    {t('s2_footer')}
                  </div>
                  <div className="text-[10px] text-slate-500 font-extrabold uppercase text-left pl-2">
                    {t('s2_source')}
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 3: Operacinis butelio kaklelis: Perkrauta registratūra */}
            {currentSlide === 3 && (
              <div className="flex-1 flex flex-col justify-between animate-fadeIn">
                <div className="text-center max-w-4xl mx-auto mb-4">
                  <h2 className="text-3xl md:text-4.5xl font-black tracking-tight text-[#0B192C]">
                    {t('s3_title')}
                  </h2>
                </div>

                <div className="flex-1 grid md:grid-cols-2 gap-6 items-center py-2">
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-56">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <h3 className="font-black text-2xl text-[#008DDA] uppercase tracking-wider">
                        {t('s3_col1_title')}
                      </h3>
                      <span className="bg-red-100 text-red-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                        {currentLang === 'lt' ? 'Rutina' : currentLang === 'es' ? 'Rutina' : 'Routine'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <Clock className="w-16 h-16 text-[#008DDA] shrink-0 stroke-[2.5]" />
                      <p className="text-slate-600 text-xs md:text-sm font-semibold leading-relaxed">
                        {t('s3_col1_desc')}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-56">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <h3 className="font-black text-2xl text-[#008DDA] uppercase tracking-wider">
                        {t('s3_col2_title')}
                      </h3>
                      <span className="bg-[#008DDA]/10 text-[#008DDA] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                        {currentLang === 'lt' ? 'Skubūs' : currentLang === 'es' ? 'Urgentes' : 'Urgent'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                        <AlertTriangle className="w-8 h-8 animate-pulse" />
                      </div>
                      <p className="text-slate-600 text-xs md:text-sm font-semibold leading-relaxed">
                        {t('s3_col2_desc')}
                      </p>
                    </div>
                  </div>

                </div>

                <div className="w-full flex flex-col gap-1 mt-2">
                  <div className="w-full bg-[#0B192C] text-white text-xs md:text-sm font-bold py-3 px-6 rounded-2xl text-center leading-relaxed">
                    {t('s3_footer')}
                  </div>
                  <div className="text-[10px] text-slate-500 font-extrabold uppercase text-left pl-2">
                    {t('s3_source')}
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 4: Marija DI: Jūsų 24/7 išmanioji asistentė */}
            {currentSlide === 4 && (
              <div className="flex-1 flex flex-col justify-between animate-fadeIn">
                <div className="text-center max-w-4xl mx-auto mb-4">
                  <h2 className="text-3xl md:text-4.5xl font-black tracking-tight text-[#0B192C]">
                    {t('s4_title')}
                  </h2>
                </div>

                <div className="flex-1 flex flex-col justify-center relative py-4">
                  {/* Step Connector Line */}
                  <div className="absolute left-[15%] right-[15%] top-[50px] md:top-[64px] h-0.5 border-t-2 border-dashed border-[#008DDA]/50 hidden md:block z-0" />

                  <div className="grid md:grid-cols-3 gap-8 relative z-10">
                    
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-full bg-white border-4 border-[#008DDA] shadow-md flex items-center justify-center text-[#008DDA] mb-3 hover:scale-105 transition-all">
                        <Clock className="w-8 h-8" />
                      </div>
                      <h3 className="font-extrabold text-[#0B192C] text-base uppercase tracking-wider mb-1">{t('s4_card1_title')}</h3>
                      <p className="text-slate-600 text-xs font-semibold leading-relaxed max-w-xs">{t('s4_card1_desc')}</p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-full bg-white border-4 border-[#008DDA] shadow-md flex items-center justify-center text-[#008DDA] mb-3 hover:scale-105 transition-all">
                        <Activity className="w-8 h-8" />
                      </div>
                      <h3 className="font-extrabold text-[#0B192C] text-base uppercase tracking-wider mb-1">{t('s4_card2_title')}</h3>
                      <p className="text-slate-600 text-xs font-semibold leading-relaxed max-w-xs">{t('s4_card2_desc')}</p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-full bg-white border-4 border-[#008DDA] shadow-md flex items-center justify-center text-[#008DDA] mb-3 hover:scale-105 transition-all">
                        <Settings className="w-8 h-8" />
                      </div>
                      <h3 className="font-extrabold text-[#0B192C] text-base uppercase tracking-wider mb-1">{t('s4_card3_title')}</h3>
                      <p className="text-slate-600 text-xs font-semibold leading-relaxed max-w-xs">{t('s4_card3_desc')}</p>
                    </div>

                  </div>
                </div>

                <div className="w-full bg-[#0B192C] text-white text-xs md:text-sm font-bold py-3 px-6 rounded-2xl text-center leading-relaxed mt-2">
                  {t('s4_footer')}
                </div>
              </div>
            )}

            {/* SLIDE 5: Teisinis vientisumas ir MDR atitiktis */}
            {currentSlide === 5 && (
              <div className="flex-1 flex flex-col justify-between animate-fadeIn">
                <div className="text-center max-w-4xl mx-auto mb-4">
                  <h2 className="text-3xl md:text-4.5xl font-black tracking-tight text-[#0B192C]">
                    {t('s5_title')}
                  </h2>
                </div>

                <div className="flex-1 grid md:grid-cols-2 gap-6 items-center py-2">
                  
                  <div className="bg-red-50/30 border-2 border-red-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between h-56">
                    <div className="flex justify-between items-center border-b border-red-200 pb-2">
                      <h3 className="font-extrabold text-sm md:text-base text-red-600 uppercase tracking-wider flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                        {t('s5_left_title')}
                      </h3>
                    </div>
                    <ul className="space-y-2 my-3">
                      <li className="flex items-center gap-2 text-slate-700 text-xs md:text-sm font-bold">
                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                        {t('s5_left_p1')}
                      </li>
                      <li className="flex items-center gap-2 text-slate-700 text-xs md:text-sm font-bold">
                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                        {t('s5_left_p2')}
                      </li>
                      <li className="flex items-center gap-2 text-slate-700 text-xs md:text-sm font-bold">
                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                        {t('s5_left_p3')}
                      </li>
                    </ul>
                    <div className="text-red-500 text-[10px] font-black uppercase tracking-widest text-right">GRIEŽTAI DRAUDŽIAMA</div>
                  </div>

                  <div className="bg-emerald-50/20 border-2 border-emerald-400 rounded-3xl p-5 shadow-sm flex flex-col justify-between h-56">
                    <div className="flex justify-between items-center border-b border-emerald-200 pb-2">
                      <h3 className="font-extrabold text-sm md:text-base text-emerald-700 uppercase tracking-wider flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        {t('s5_right_title')}
                      </h3>
                    </div>
                    <ul className="space-y-2 my-3">
                      <li className="flex items-center gap-2 text-slate-700 text-xs md:text-sm font-bold">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                        {t('s5_right_p1')}
                      </li>
                      <li className="flex items-center gap-2 text-slate-700 text-xs md:text-sm font-bold">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                        {t('s5_right_p2')}
                      </li>
                      <li className="flex items-center gap-2 text-slate-700 text-xs md:text-sm font-bold">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                        {t('s5_right_p3')}
                      </li>
                    </ul>
                    <div className="text-emerald-600 text-[10px] font-black uppercase tracking-widest text-right">100% LEGALUS IR ATITINKANTIS REIKALAVIMUS</div>
                  </div>

                </div>

                <div className="w-full bg-[#0B192C] text-white text-xs md:text-sm font-bold py-3 px-6 rounded-2xl text-center leading-relaxed mt-2">
                  {t('s5_footer')}
                </div>
              </div>
            )}

            {/* SLIDE 6: Strateginis pagrindas: ES institucinė kryptis */}
            {currentSlide === 6 && (
              <div className="flex-1 flex flex-col justify-between animate-fadeIn">
                <div className="text-center max-w-4xl mx-auto mb-2">
                  <h2 className="text-3xl md:text-4.5xl font-black tracking-tight text-[#0B192C]">
                    {t('s6_title')}
                  </h2>
                </div>

                {/* European Quote Banner */}
                <div className="bg-slate-50 border-l-4 border-[#008DDA] rounded-r-2xl p-4 my-2 max-w-5xl mx-auto shadow-sm relative">
                  <span className="text-[#008DDA] text-5xl font-serif absolute left-2 top-0 pointer-events-none opacity-20">“</span>
                  <p className="text-[#0B192C] text-sm md:text-base font-bold italic pl-6 leading-relaxed">
                    {t('s6_quote')}
                  </p>
                  <p className="text-[#008DDA] text-right font-black text-xs uppercase tracking-wider mt-2">
                    {t('s6_author')}
                  </p>
                </div>

                <div className="flex-1 grid md:grid-cols-3 gap-4 items-center py-2">
                  
                  <div className="bg-[#0B192C] text-white border border-[#008DDA]/20 rounded-2xl p-4 shadow-sm h-36 flex flex-col justify-between">
                    <h3 className="font-extrabold text-[#00E5FF] text-xs uppercase tracking-widest border-b border-white/10 pb-1.5">
                      {t('s6_card1_title')}
                    </h3>
                    <p className="text-slate-200 text-xs font-semibold leading-relaxed">
                      {t('s6_card1_desc')}
                    </p>
                  </div>

                  <div className="bg-[#0B192C] text-white border border-[#008DDA]/20 rounded-2xl p-4 shadow-sm h-36 flex flex-col justify-between">
                    <h3 className="font-extrabold text-[#00E5FF] text-xs uppercase tracking-widest border-b border-white/10 pb-1.5">
                      {t('s6_card2_title')}
                    </h3>
                    <p className="text-slate-200 text-xs font-semibold leading-relaxed">
                      {t('s6_card2_desc')}
                    </p>
                  </div>

                  <div className="bg-[#0B192C] text-white border border-[#008DDA]/20 rounded-2xl p-4 shadow-sm h-36 flex flex-col justify-between">
                    <h3 className="font-extrabold text-[#00E5FF] text-xs uppercase tracking-widest border-b border-white/10 pb-1.5">
                      {t('s6_card3_title')}
                    </h3>
                    <p className="text-slate-200 text-xs font-semibold leading-relaxed">
                      {t('s6_card3_desc')}
                    </p>
                  </div>

                </div>

                <div className="text-[10px] text-slate-500 font-extrabold uppercase text-left pl-2 mt-2">
                  {t('s6_footer')}
                </div>
              </div>
            )}

            {/* SLIDE 7: Teisinis pagrindas: skaidrus paciento sutikimas */}
            {currentSlide === 7 && (
              <div className="flex-1 flex flex-col justify-between animate-fadeIn">
                <div className="text-center max-w-4xl mx-auto mb-4">
                  <h2 className="text-3xl md:text-4.5xl font-black tracking-tight text-[#0B192C]">
                    {t('s7_title')}
                  </h2>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 py-2">
                  <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center h-40 flex flex-col justify-between shadow-sm relative group hover:border-[#008DDA] transition-all">
                      <span className="text-[#008DDA] font-black text-2xl">1</span>
                      <p className="text-slate-700 text-[10px] md:text-xs font-bold leading-normal">{t('s7_step1')}</p>
                      <div className="absolute right-[-14px] top-1/2 -translate-y-1/2 hidden md:block text-[#008DDA] z-20 font-black text-base">▶</div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center h-40 flex flex-col justify-between shadow-sm relative group hover:border-[#008DDA] transition-all">
                      <span className="text-[#008DDA] font-black text-2xl">2</span>
                      <p className="text-slate-700 text-[10px] md:text-xs font-bold leading-normal">{t('s7_step2')}</p>
                      <div className="absolute right-[-14px] top-1/2 -translate-y-1/2 hidden md:block text-[#008DDA] z-20 font-black text-base">▶</div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center h-40 flex flex-col justify-between shadow-sm relative group hover:border-[#008DDA] transition-all">
                      <span className="text-[#008DDA] font-black text-2xl">3</span>
                      <p className="text-slate-700 text-[10px] md:text-xs font-bold leading-normal">{t('s7_step3')}</p>
                      <div className="absolute right-[-14px] top-1/2 -translate-y-1/2 hidden md:block text-[#008DDA] z-20 font-black text-base">▶</div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center h-40 flex flex-col justify-between shadow-sm relative group hover:border-[#008DDA] transition-all">
                      <span className="text-[#008DDA] font-black text-2xl">4</span>
                      <p className="text-slate-700 text-[10px] md:text-xs font-bold leading-normal">{t('s7_step4')}</p>
                    </div>

                  </div>

                  <div className="w-72 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-sm h-56 shrink-0">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#008DDA] text-center w-full block border-b border-slate-200 pb-2">Digital Consent Seal</span>
                    
                    <div className="flex-1 flex items-center justify-center w-full mt-3">
                      {contractSigned ? (
                        <div className="flex flex-col items-center gap-3 text-emerald-600 animate-bounce">
                          <ShieldCheck className="w-12 h-12 text-emerald-500 filter drop-shadow-[0_0_10px_rgba(16,185,129,0.2)]" />
                          <span className="text-[10px] font-black uppercase tracking-wider text-center">{t('s7_signed_status')}</span>
                        </div>
                      ) : (
                        <div className="w-full h-24 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 text-[10px] md:text-xs font-black hover:border-[#008DDA] hover:text-[#008DDA] cursor-pointer transition-all shadow-inner bg-white text-center px-4" onClick={() => setContractSigned(true)}>
                          [ {t('s7_sign_btn')} ]
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                <div className="w-full bg-[#008DDA]/10 border border-[#008DDA]/20 text-[#0B192C] text-xs md:text-sm font-bold py-3.5 px-6 rounded-2xl text-center leading-relaxed mt-2">
                  {t('s7_footer')}
                </div>
              </div>
            )}

            {/* SLIDE 8: Investicijų grąža (ROI): Pagrįsti, įrodymais paremti rodikliai */}
            {currentSlide === 8 && (
              <div className="flex-1 flex flex-col justify-between animate-fadeIn">
                <div className="text-center max-w-4xl mx-auto mb-2">
                  <h2 className="text-3xl md:text-4.5xl font-black tracking-tight text-[#0B192C] mb-0.5">
                    {t('s8_title')}
                  </h2>
                </div>

                <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 py-2">
                  
                  <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between items-center text-center shadow-sm min-h-[220px]">
                      <div className="w-20 h-20 rounded-full bg-[#0B192C] flex items-center justify-center text-white border-2 border-[#008DDA] shadow-md">
                        <span className="text-2xl font-black text-[#00E5FF]">-34%</span>
                      </div>
                      <h4 className="font-extrabold text-[#0B192C] text-sm uppercase tracking-wider mt-3 mb-1">{t('s8_card1_title')}</h4>
                      <p className="text-slate-500 text-xs font-semibold leading-relaxed max-w-[190px]">{t('s8_card1_desc')}</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between items-center text-center shadow-sm min-h-[220px]">
                      <div className="w-20 h-20 rounded-full bg-[#0B192C] flex items-center justify-center text-white border-2 border-[#008DDA] shadow-md">
                        <span className="text-2xl font-black text-[#00E5FF]">+24%</span>
                      </div>
                      <h4 className="font-extrabold text-[#0B192C] text-sm uppercase tracking-wider mt-3 mb-1">{t('s8_card2_title')}</h4>
                      <p className="text-slate-500 text-xs font-semibold leading-relaxed max-w-[190px]">{t('s8_card2_desc')}</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between items-center text-center shadow-sm min-h-[220px]">
                      <div className="w-20 h-20 rounded-full bg-[#0B192C] flex items-center justify-center text-white border-2 border-[#008DDA] shadow-md">
                        <Settings className="w-8 h-8 text-[#00E5FF] stroke-[2.5] animate-spin" style={{ animationDuration: '6s' }} />
                      </div>
                      <h4 className="font-extrabold text-[#0B192C] text-sm uppercase tracking-wider mt-3 mb-1">{t('s8_card3_title')}</h4>
                      <p className="text-slate-500 text-xs font-semibold leading-relaxed max-w-[190px]">{t('s8_card3_desc')}</p>
                    </div>

                  </div>

                </div>

                <div className="w-full flex flex-col gap-1 mt-2">
                  <div className="w-full bg-[#0B192C] text-white text-xs md:text-sm font-bold py-3 px-6 rounded-2xl text-center leading-relaxed">
                    {t('s8_footer')}
                  </div>
                  <div className="text-[10px] text-slate-500 font-extrabold uppercase text-left pl-2">
                    {t('s8_source')}
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 9: Nulinė instaliacija: Pradėkite veikti šiandien */}
            {currentSlide === 9 && (
              <div className="flex-1 flex flex-col justify-between animate-fadeIn">
                <div className="text-center max-w-4xl mx-auto mb-2">
                  <h2 className="text-3xl md:text-4.5xl font-black tracking-tight text-[#0B192C]">
                    {t('s9_title')}
                  </h2>
                </div>

                <div className="flex-1 flex items-center relative py-2">
                  <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-0 items-stretch border border-slate-200 rounded-3xl bg-slate-50/50 shadow-sm overflow-hidden">
                    
                    <div className="p-5 flex flex-col justify-between relative min-h-[180px]">
                      <div>
                        <h3 className="font-black text-[#008DDA] text-base md:text-lg uppercase tracking-wider mb-2">
                          {t('s9_card1_title')}
                        </h3>
                        <p className="text-slate-600 text-xs font-bold leading-relaxed pr-6">
                          {t('s9_card1_desc')}
                        </p>
                      </div>
                      <div className="self-end mt-2 bg-white border border-slate-200 p-2 rounded-full shadow-sm text-[#008DDA] z-10 shrink-0">
                        <svg className="w-5 h-5 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                        </svg>
                      </div>
                      
                      <div className="absolute right-0 top-0 bottom-0 w-[40px] flex items-center justify-center pointer-events-none hidden md:flex">
                        <div className="h-[75%] border-r-2 border-cyan-300" />
                        <span className="absolute bg-[#F8FAFC] border-2 border-cyan-300 rounded-lg p-0.5 text-[#008DDA] font-black text-[10px] z-20">≫</span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col justify-between relative min-h-[180px]">
                      <div className="md:pl-6">
                        <h3 className="font-black text-[#008DDA] text-base md:text-lg uppercase tracking-wider mb-2">
                          {t('s9_card2_title')}
                        </h3>
                        <p className="text-slate-600 text-xs font-bold leading-relaxed pr-6">
                          {t('s9_card2_desc')}
                        </p>
                      </div>
                      <div className="self-end mt-2 bg-white border border-slate-200 p-2 rounded-full shadow-sm text-[#008DDA] z-10 shrink-0">
                        <svg className="w-5 h-5 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v16.481m3-16.481v16.481m-9-16.481h15m-15 15h15" />
                        </svg>
                      </div>
                      
                      <div className="absolute right-0 top-0 bottom-0 w-[40px] flex items-center justify-center pointer-events-none hidden md:flex">
                        <div className="h-[75%] border-r-2 border-cyan-300" />
                        <span className="absolute bg-[#F8FAFC] border-2 border-cyan-300 rounded-lg p-0.5 text-[#008DDA] font-black text-[10px] z-20">≫</span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col justify-between relative min-h-[180px] md:pl-8">
                      <div>
                        <h3 className="font-black text-[#008DDA] text-base md:text-lg uppercase tracking-wider mb-2">
                          {t('s9_card3_title')}
                        </h3>
                        <p className="text-slate-600 text-xs font-bold leading-relaxed">
                          {t('s9_card3_desc')}
                        </p>
                      </div>
                      <div className="self-end mt-2 bg-white border border-slate-200 p-2 rounded-full shadow-sm text-[#008DDA] z-10 shrink-0">
                        <svg className="w-5 h-5 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="w-full py-4 px-6 bg-[#0B192C] text-white rounded-2xl flex flex-col md:flex-row justify-between items-center gap-3 shadow-md border-2 border-[#008DDA] mt-2">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-7 h-7 text-[#00E5FF] animate-pulse" />
                    <span className="font-black text-xs md:text-sm uppercase tracking-widest text-center md:text-left">{t('s9_footer')}</span>
                  </div>
                  <div className="flex flex-col text-center md:text-right items-center md:items-end gap-0.5 font-semibold">
                    <span className="text-[10px] text-slate-100 uppercase tracking-widest font-black">{t('s9_contact')}</span>
                    <span className="text-[8px] text-[#00E5FF] uppercase tracking-wider font-extrabold">Partizanų g. 61-806, LT-49282, Kaunas, Lithuania  |  Company code: 307515454</span>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 10: Šaltiniai ir metodinė pastaba (References) */}
            {currentSlide === 10 && (
              <div className="flex-1 flex flex-col justify-between animate-fadeIn">
                <div className="flex items-center gap-3 border-b border-[#0B192C]/10 pb-3 mb-2 shrink-0">
                  <BookOpen className="w-7 h-7 text-[#008DDA] stroke-[2.5]" />
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#0B192C]">
                    {t('s10_title')}
                  </h2>
                </div>

                {/* References List Container - Two columns, high density, premium layout */}
                <div className="flex-1 overflow-y-auto pr-2 max-h-[360px] my-1">
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                    {DENTAL_REFERENCES.map((ref, idx) => (
                      <div key={idx} className="flex gap-2.5 p-2 bg-slate-50 hover:bg-[#008DDA]/5 rounded-xl border border-slate-200/60 transition-all text-xs font-semibold leading-normal relative group">
                        <span className="text-[10px] bg-[#0B192C]/5 text-[#0B192C]/70 px-2 py-0.5 rounded-md font-bold self-start h-5 w-7 text-center">{idx + 1}</span>
                        <div className="flex-1 flex flex-col justify-between">
                          <p className="text-[#0B192C] font-bold">
                            <span className="text-[#008DDA] font-black uppercase text-[10px] mr-1.5 tracking-wider">{ref.author}:</span>
                            {ref.title}
                          </p>
                          <a 
                            href={ref.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[10px] text-[#008DDA] hover:underline flex items-center gap-1 font-bold mt-1 max-w-full break-all truncate"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            {ref.link}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full bg-[#0B192C] text-slate-200 text-[10px] md:text-xs font-bold py-3 px-6 rounded-2xl text-center leading-relaxed mt-2 shrink-0">
                  {t('s10_footer')}
                </div>
              </div>
            )}

          </div>
        </section>

        {/* Nav Controls Bar */}
        <footer className="w-full flex justify-between items-center border-t border-[#0B192C]/10 pt-3.5 z-20 relative">
          <button 
            onClick={prevSlide}
            disabled={currentSlide === 1}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#0B192C] hover:text-[#008DDA] transition-colors disabled:opacity-30 disabled:hover:text-[#0B192C]"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('back')}
          </button>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setAutoplayActive(false);
                  setCurrentSlide(s);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${currentSlide === s ? 'bg-[#008DDA] w-6 shadow-[0_0_8px_rgba(0,141,218,0.5)]' : 'bg-slate-300 hover:bg-slate-400'}`}
              />
            ))}
          </div>

          <button 
            onClick={nextSlide}
            disabled={currentSlide === 10}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#0B192C] hover:text-[#008DDA] transition-colors disabled:opacity-30 disabled:hover:text-[#0B192C]"
          >
            {t('continue')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </footer>

      </div>
    </main>
  );
}
