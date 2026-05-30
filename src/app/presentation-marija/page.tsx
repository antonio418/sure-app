"use client";

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, 
  Activity, Check, Clock, Settings, Calendar, Music
} from 'lucide-react';

// Official PROCDI Brand Color Coding:
// Midnight Tech Blue (Base Background): #0B192C
// Electric Tech Cyan (Action/Accent): #008DDA
// Slate Silver (Text/Neutral): #475569 or #64748B

const LOCAL_TRANSLATIONS: Record<string, any> = {
  lt: {
    s1_title: "Odontologijos efektyvumo ateitis Lietuvoje",
    s1_subtitle: "Marija DI: Išmanusis administracinių srautų valdymas",
    s1_desc: "Pašalinkite kasdienę administracinę trintį. Leiskite savo odontologams susitelkti į tai, ką jie daro geriausiai – gydyti pacientus ir auginti klinikos pajamas.",
    s1_badge: "MB PROCDI • AUTONOMINIS KLINIKOS VALDYMAS",
    
    s2_title: "Nematomi nuostoliai: Tuščios kėdės kaina",
    s2_card1: "Dideli fiksuoti kaštai (Personalas + Įranga)",
    s2_card2: "Neatvykimai (No-Shows) ir netikslingas planavimas",
    s2_card3: "Prarasti skubūs skambučiai savaitgaliais",
    s2_footer: "Iki 25% metinių klinikos pajamų prarandama dėl neefektyvaus laiko planavimo ir tuščių kėdžių. Jūsų išlaidos nesustoja, net kai kėdė atšąla.",
    s2_btn_fill: "UŽPILDYTI KĖDĘ (SIMULIACIJA)",
    s2_btn_empty: "Atlaisvinti kėdę",
    s2_status_empty: "KĖDĖ TUŠČIA - prarandama 150€/val.",
    s2_status_filled: "KĖDĖ UŽPILDYTA - pajamos aktyvios",
    
    s3_title: "Operacinis butelio kaklelis: Perkrauta registratūra",
    s3_col1_title: "The Daytime Waste",
    s3_col1_desc: "60% laiko švaistoma rutininiams klausimams (PSD/Ligonių kasų kompensacijos, kainoraščiai, rankinis skambučių derinimas).",
    s3_col2_title: "The Nighttime Loss",
    s3_col2_desc: "Aukštos vertės skubūs pacientai (ūmus skausmas, traumos) negauna atsakymo ir pasirenka konkurentus.",
    s3_footer: "Registratūros perdegimas kainuoja brangiai. Rankinis darbas piko valandomis riboja jūsų klinikos augimą.",
    
    s4_title: "Marija DI: Jūsų 24/7 išmanioji asistentė",
    s4_card1_title: "Always On",
    s4_card1_desc: "24/7 Autonominis veikimas. Niekada nepraleidžia skambučio ar užklausos.",
    s4_card2_title: "Filtering",
    s4_card2_desc: "Tikslus paciento poreikių įvertinimas formalia lietuvių medicinine kalba (Jūs).",
    s4_card3_title: "Action",
    s4_card3_desc: "Automatinis vizitų patvirtinimas ir dinaminis laukiančiųjų sąrašų valdymas.",
    s4_footer: "Sprendimas be IT trinties. Jokių papildomų etatų, tik maksimaliai išnaudota esama infrastruktūra.",
    
    s5_title: "Teisinis vientisumas ir MDR atitiktis",
    s5_left_title: "Griežtai draudžiama / Strictly Forbidden",
    s5_left_p1: "Medicininis Triažas",
    s5_left_p2: "Klinikinis vertinimas ir diagnozės",
    s5_left_p3: "Medicininiai patarimai",
    s5_right_title: "100% Legal & Compliant",
    s5_right_p1: "Poreikių įvertinimas",
    s5_right_p2: "Administracinių srautų valdymas",
    s5_right_p3: "Prioritetų nustatymas pagal raktinius žodžius (skausmas, trauma), skiriant žymą SKUBUS.",
    s5_footer: "Marija DI veikia griežtai laikantis ES Medicinos priemonių reglamento (MDR 2017/745) išimčių, kaip grynai administracinis įrankis.",
    
    s6_title: "Teisinis skydas: Automatizuota prisijungimo sutartis",
    s6_step1: "1. Paciento užklausa priimama.",
    s6_step2: "2. Marija DI pateikia skaitmeninę klinikos paslaugų teikimo sutartį (B2B Adhesion Contract).",
    s6_step3: "3. Pacientas patvirtina sutartį skaitmeniniu būdu.",
    s6_step4: "4. Vizitas patvirtinamas. Klinika įgyja teisinį pagrindą taikyti netesybas už neatvykimą ar vėlyvą atšaukimą.",
    s6_footer: "Teisinė apsauga ir baudų už neatvykimą taikymas – be jokių nepatogių pokalbių registratūroje.",
    s6_sign_btn: "PASIRAŠYTI SKAITMENINIU BŪDU",
    s6_signed_status: "Sutartis pasirašyta ir apsaugota",
    
    s7_title: "Investicijų grąža (ROI): Kėdės dirba 95% pajėgumu",
    s7_subtitle: "ROI Synthesis Dashboard",
    s7_card1_title: "Kėdžių užimtumas",
    s7_card1_desc: "(Sumažintas prastovų laikas, maksimalus pajėgumas).",
    s7_card2_title: "Neatvykimų sumažėjimas",
    s7_card2_desc: "(Dėl 24 val. išankstinio automatinio patvirtinimo).",
    s7_card3_title: "Tiesioginių pajamų augimas",
    s7_card3_desc: "(Fiksuojant prarastus naktinius ir savaitgalio pacientus).",
    s7_footer: "Investicija, kuri atsiperka jau su pirmaisiais per mėnesį sugrąžintais pacientais.",
    s7_calc_title: "Apskaičiuokite savo klinikos grąžą:",
    s7_calc_label: "Numatoma mėnesinė apyvarta (€):",
    music_toggle: "Fono muzika (Švelni)",
    s7_recovery_lbl: "Sutaupyta dėl neatvykimų mažinimo (-45%):",
    s7_efficiency_lbl: "Papildomos pajamos iš užpildytų tarpų (+5%):",
    s7_total_lbl: "Bendra mėnesio nauda klinikai:",
    
    s8_title: "Nulinė instaliacija: Pradėkite veikti šiandien",
    s8_card1_title: "1. 10 Minučių Integracija",
    s8_card1_desc: "Jokių sudėtingų IT sistemų keitimų. Paprastas <script> kodo įterpimas į jūsų svetainę.",
    s8_card2_title: "2. Pritaikytas Klonas",
    s8_card2_desc: "Marija DI apmokoma naudoti jūsų klinikos kainoraščius, logotipą ir PSD politikas.",
    s8_card3_title: "3. Hibridinis Veikimas",
    s8_card3_desc: "Gaukite išfiltruotus, skubius pre-registracijos prašymus tiesiai į savo el. paštą.",
    s8_footer: "Išbandykite savo klinikos interaktyvią demonstraciją jau dabar.",
    s8_contact: "Susisiekite su mumis: MB PROCDI | +370 689 41110 | antonio@procdi.com | www.procdi.com",
    
    continue: "TĘSTI",
    back: "ATGAL",
    lang_selector: "Kalba"
  },
  es: {
    s1_title: "El futuro de la eficiencia dental en Lituania",
    s1_subtitle: "Marija DI: Gestión inteligente de flujos administrativos",
    s1_desc: "Elimine la fricción administrativa diaria. Permita que sus odontólogos se concentren en lo que mejor hacen: curar pacientes y aumentar los ingresos de la clínica.",
    s1_badge: "MB PROCDI • GESTIÓN CLÍNICA AUTÓNOMA",
    
    s2_title: "Pérdidas invisibles: El costo del sillón vacío",
    s2_card1: "Altos costos fijos (Personal + Equipamiento)",
    s2_card2: "Inasistencias (No-Shows) y planificación ineficiente",
    s2_card3: "Pérdida de llamadas de urgencia los fines de semana",
    s2_footer: "Se pierde hasta el 25% de los ingresos anuales de la clínica debido a una mala gestión del tiempo y sillones vacíos. Sus costos no se detienen, incluso cuando el sillón está frío.",
    s2_btn_fill: "LLENAR SILLÓN (SIMULACIÓN)",
    s2_btn_empty: "Vaciar sillón",
    s2_status_empty: "SILLÓN VACÍO - Pérdida de 150€/hora",
    s2_status_filled: "SILLÓN LLENO - Ingresos activos",
    
    s3_title: "Cuello de botella operativo: Recepción saturada",
    s3_col1_title: "The Daytime Waste",
    s3_col1_desc: "60% del tiempo desperdiciado en tareas rutinarias (explicación de PSD/Caja de Salud, tarifas, confirmación manual de llamadas).",
    s3_col2_title: "The Nighttime Loss",
    s3_col2_desc: "Pacientes urgentes de alto valor (dolor agudo, traumas) no reciben respuesta y eligen a la competencia.",
    s3_footer: "El agotamiento de recepción cuesta caro. El trabajo manual en horas pico limita el crecimiento de su clínica.",
    
    s4_title: "Marija DI: Tu asistente inteligente 24/7",
    s4_card1_title: "Always On",
    s4_card1_desc: "Operación autónoma 24/7. Nunca pierde una llamada o consulta de paciente.",
    s4_card2_title: "Filtering",
    s4_card2_desc: "Evaluación preliminar precisa de las necesidades del paciente en lituano formal (Jūs).",
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
    s5_right_p3: "Establecimiento de prioridades según palabras clave (dolor, trauma), asignando etiqueta URGENTE.",
    s5_footer: "Marija DI opera estrictamente bajo las exenciones del Reglamento Europeo de Dispositivos Médicos (MDR 2017/745), como una herramienta meramente administrativa.",
    
    s6_title: "Escudo legal: Contrato de adhesión automatizado",
    s6_step1: "1. Se recibe la consulta del paciente.",
    s6_step2: "2. Marija DI presenta el contrato digital de prestación de servicios (B2B Adhesion Contract).",
    s6_step3: "3. El paciente firma el contrato de forma digital y segura.",
    s6_step4: "4. Cita confirmada. La clínica obtiene el respaldo legal para aplicar penalizaciones por inasistencia o cancelación tardía.",
    s6_footer: "Protección legal y aplicación de penalizaciones por no presentarse, sin conversaciones incómodas en recepción.",
    s6_sign_btn: "FIRMAR DIGITALMENTE AHORA",
    s6_signed_status: "Contrato firmado y resguardado con éxito",
    
    s7_title: "Retorno de inversión (ROI): Sillones al 95% de capacidad",
    s7_subtitle: "ROI Synthesis Dashboard",
    s7_card1_title: "Ocupación de sillones",
    s7_card1_desc: "(Reducción del tiempo muerto, máxima capacidad operativa).",
    s7_card2_title: "Reducción de ausentismo",
    s7_card2_desc: "(Gracias a la confirmación automática previa de 24 horas).",
    s7_card3_title: "Aumento de ingresos directos",
    s7_card3_desc: "(Capturando pacientes urgentes de noche y fines de semana).",
    s7_footer: "Una inversión que se recupera con los primeros pacientes rescatados al mes.",
    s7_calc_title: "Calcule el retorno de su clínica:",
    s7_calc_label: "Facturación mensual estimada (€):",
    music_toggle: "Música de fondo (Suave)",
    s7_recovery_lbl: "Ahorro por reducción de ausentismo (-45%):",
    s7_efficiency_lbl: "Ingreso extra por espacios reasignados (+5%):",
    s7_total_lbl: "Beneficio mensual total para la clínica:",
    
    s8_title: "Instalación cero: Comience hoy mismo",
    s8_card1_title: "1. 10 Minutos de Integración",
    s8_card1_desc: "Sin cambios complejos en sus sistemas de TI. Inserción sencilla de un código <script> en su web.",
    s8_card2_title: "2. Clon personalizado",
    s8_card2_desc: "Marija DI es entrenada con los precios de su clínica, su logotipo y las políticas de la caja de salud (PSD).",
    s8_card3_title: "3. Operación híbrida",
    s8_card3_desc: "Reciba las solicitudes de pre-registro filtradas y urgentes directamente en su correo electrónico.",
    s8_footer: "Pruebe la demostración interactiva de su clínica ahora mismo.",
    s8_contact: "Contacto: MB PROCDI | +370 689 41110 | antonio@procdi.com | www.procdi.com",
    
    continue: "CONTINUAR",
    back: "ATRÁS",
    lang_selector: "Idioma"
  },
  en: {
    s1_title: "The future of dental efficiency in Lithuania",
    s1_subtitle: "Marija DI: Intelligent administrative flow management",
    s1_desc: "Eliminate daily administrative friction. Allow your dentists to focus on what they do best – treating patients and growing clinic revenues.",
    s1_badge: "MB PROCDI • AUTONOMOUS CLINICAL MANAGEMENT",
    
    s2_title: "Invisible losses: The cost of the empty chair",
    s2_card1: "High fixed costs (Staff + Equipment)",
    s2_card2: "No-Shows and inefficient scheduling",
    s2_card3: "Lost urgent calls during weekends",
    s2_footer: "Up to 25% of annual clinic revenue is lost due to inefficient time planning and empty chairs. Your costs do not stop, even when the chair goes cold.",
    s2_btn_fill: "FILL CHAIR (SIMULATION)",
    s2_btn_empty: "Empty chair",
    s2_status_empty: "CHAIR EMPTY - 150€/hour lost",
    s2_status_filled: "CHAIR FILLED - Revenue active",
    
    s3_title: "Operational bottleneck: Overwhelmed reception",
    s3_col1_title: "The Daytime Waste",
    s3_col1_desc: "60% of time wasted on routine queries (PSD/state insurance, price lists, manual call coordination).",
    s3_col2_title: "The Nighttime Loss",
    s3_col2_desc: "High-value urgent patients (acute pain, trauma) receive no answer and choose competitors.",
    s3_footer: "Reception burnout is expensive. Manual work during peak hours limits your clinic's growth.",
    
    s4_title: "Marija DI: Your 24/7 smart assistant",
    s4_card1_title: "Always On",
    s4_card1_desc: "24/7 Autonomous operation. Never misses a patient call or query.",
    s4_card2_title: "Filtering",
    s4_card2_desc: "Precise preliminary patient assessment in formal Lithuanian medical language (Jūs).",
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
    s5_right_p3: "Priority setting based on keywords (pain, trauma), assigning URGENT tag.",
    s5_footer: "Marija DI operates strictly under the EU Medical Devices Regulation (MDR 2017/745) exemptions, as a purely administrative tool.",
    
    s6_title: "Legal shield: Automated adhesion agreement",
    s6_step1: "1. Patient inquiry is received.",
    s6_step2: "2. Marija DI presents the digital service agreement (B2B Adhesion Contract).",
    s6_step3: "3. Patient signs the agreement digitally and securely.",
    s6_step4: "4. Appointment confirmed. Clinic gains the legal basis to apply no-show or late cancellation fees.",
    s6_footer: "Legal protection and enforcement of no-show fees, without uncomfortable reception conversations.",
    s6_sign_btn: "SIGN DIGITALLY NOW",
    s6_signed_status: "Agreement signed and securely archived",
    
    s7_title: "Return on investment (ROI): Chairs at 95% capacity",
    s7_subtitle: "ROI Synthesis Dashboard",
    s7_card1_title: "Chair occupancy",
    s7_card1_desc: "(Reduced downtime, maximum operational capacity).",
    s7_card2_title: "No-show reduction",
    s7_card2_desc: "(Due to 24-hour automatic advance confirmation).",
    s7_card3_title: "Direct revenue growth",
    s7_card3_desc: "(Capturing lost after-hours and weekend urgent patients).",
    s7_footer: "An investment that pays for itself with the first rescued patients of the month.",
    s7_calc_title: "Calculate your clinic's monthly recovery:",
    s7_calc_label: "Estimated monthly revenue (€):",
    music_toggle: "Background Music (Soft)",
    s7_recovery_lbl: "Saved by reducing no-shows (-45%):",
    s7_efficiency_lbl: "Extra income from reassigned slots (+5%):",
    s7_total_lbl: "Total monthly benefit for the clinic:",
    
    s8_title: "Zero setup: Start operating today",
    s8_card1_title: "1. 10-Minute Integration",
    s8_card1_desc: "No complex changes to your IT systems. SImple <script> code insertion into your website.",
    s8_card2_title: "2. Customized Clone",
    s8_card2_desc: "Marija DI is trained with your clinic's fees, logo, and health insurance (PSD) policies.",
    s8_card3_title: "3. Hybrid Operations",
    s8_card3_desc: "Get pre-filtered, urgent pre-registration requests directly in your inbox.",
    s8_footer: "Try your clinic's interactive demonstration right now.",
    s8_contact: "Contact: MB PROCDI | +370 689 41110 | antonio@procdi.com | www.procdi.com",
    
    continue: "CONTINUE",
    back: "BACK",
    lang_selector: "Language"
  }
};

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
  
  // Auto-play / Audio Sync states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);
  const [isRecordingFinished, setIsRecordingFinished] = useState(false);
  
  // Ambient Music hooks
  const [musicEnabled, setMusicEnabled] = useState(false);
  const synth = React.useMemo(() => new AmbientSynth(), []);

  useEffect(() => {
    if (musicEnabled && (isPlaying || isCountingDown)) {
      synth.start();
    } else {
      synth.stop();
    }
  }, [musicEnabled, isPlaying, isCountingDown, synth]);

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
  }, [currentSlide, isPlaying, audioObj, isCountingDown]);

  // Audio Play / Sync effect - Dynamically calibrated to exact real audio track lengths
  useEffect(() => {
    if (!isPlaying || !audioObj) return;

    // Calibrate precise slide transitions and interactive state triggers to match the real durations:
    // Lithuanian (voiceover_marija_lt.mp3) slowed down by -15%: 68.31 seconds
    // Spanish (voiceover_marija.mp3) slowed down by -15%: 65.59 seconds
    const boundaries = currentLang === 'lt' ? {
      s2: 9.5,
      s2_fill: 18.0,
      s3: 26.5,
      s4: 43.5,
      s5: 52.0,
      s6: 56.0,
      s6_sign: 57.5,
      s7: 60.5,
      s8: 64.5,
      end: 68.3
    } : { // Spanish or English Fallback
      s2: 9.5,
      s2_fill: 17.0,
      s3: 25.5,
      s4: 41.5,
      s5: 49.5,
      s6: 53.5,
      s6_sign: 55.0,
      s7: 58.0,
      s8: 62.0,
      end: 65.5
    };

    const interval = setInterval(() => {
      const time = audioObj.currentTime;
      
      if (time >= 0 && time < boundaries.s2) {
        setCurrentSlide(1);
      } else if (time >= boundaries.s2 && time < boundaries.s3) {
        setCurrentSlide(2);
        // Automatically simulate filling dental chair at precisely calibrated second
        if (time >= boundaries.s2_fill) {
          setChairFilled(true);
        } else {
          setChairFilled(false);
        }
      } else if (time >= boundaries.s3 && time < boundaries.s4) {
        setCurrentSlide(3);
      } else if (time >= boundaries.s4 && time < boundaries.s5) {
        setCurrentSlide(4);
      } else if (time >= boundaries.s5 && time < boundaries.s6) {
        setCurrentSlide(5);
      } else if (time >= boundaries.s6 && time < boundaries.s7) {
        setCurrentSlide(6);
        // Automatically simulate contract digital signature at precisely calibrated second
        if (time >= boundaries.s6_sign) {
          setContractSigned(true);
        } else {
          setContractSigned(false);
        }
      } else if (time >= boundaries.s7 && time < boundaries.s8) {
        setCurrentSlide(7);
      } else if (time >= boundaries.s8) {
        setCurrentSlide(8);
      }

      // Hard stop at end of the exact audio track to prevent OBS running too long
      if (time >= boundaries.end || audioObj.ended) {
        audioObj.pause();
        setIsPlaying(false);
        setIsRecordingFinished(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, audioObj, currentLang]);

  // Clean audio on unmount
  useEffect(() => {
    return () => {
      if (audioObj) {
        audioObj.pause();
      }
    };
  }, [audioObj]);

  const togglePlay = () => {
    if (isPlaying || isCountingDown) {
      if (audioObj) {
        audioObj.pause();
      }
      setIsPlaying(false);
      setIsCountingDown(false);
    } else {
      if (audioObj) {
        audioObj.pause();
      }
      
      // Trigger a 1.5-second countdown delay to allow the user to sweep their mouse off screen!
      setIsCountingDown(true);
      setIsRecordingFinished(false);
      setCurrentSlide(1);
      setChairFilled(false);
      setContractSigned(false);
      
      setTimeout(() => {
        // Select official commercial voiceover track (LITUANO or ESPAÑOL)
        const trackSrc = currentLang === 'lt' ? '/voiceover_marija_lt.mp3' : '/voiceover_marija.mp3';
        const audio = new Audio(trackSrc);
        
        audio.play().then(() => {
          setAudioObj(audio);
          setIsPlaying(true);
          setIsCountingDown(false);
        }).catch(err => {
          console.error("Audio playback error:", err);
          setIsCountingDown(false);
        });
      }, 1500);
    }
  };

  const nextSlide = () => {
    if (isPlaying && audioObj) {
      audioObj.pause();
      setIsPlaying(false);
    }
    if (currentSlide < 8) setCurrentSlide(prev => prev + 1);
  };

  const prevSlide = () => {
    if (isPlaying && audioObj) {
      audioObj.pause();
      setIsPlaying(false);
    }
    if (currentSlide > 1) setCurrentSlide(prev => prev - 1);
  };

  const t = (key: string) => {
    return LOCAL_TRANSLATIONS[currentLang]?.[key] || LOCAL_TRANSLATIONS['en']?.[key] || key;
  };

  // ROI calculations
  const noShowSavings = Math.round(monthlyRevenue * 0.05 * 0.45); // 5% base no-show losses, 45% reduction
  const slotRecoverySavings = Math.round(monthlyRevenue * 0.05); // 5% extra efficiency
  const totalMonthlyBenefit = noShowSavings + slotRecoverySavings;

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
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#008DDA]/30 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* 1.5-second Countdown / Preparation Screen Overlay */}
      {isCountingDown && (
        <div className="absolute inset-0 bg-[#F8FAFC]/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center animate-fadeIn">
          <div className="p-12 rounded-[2.5rem] border-2 border-[#0B192C] bg-white text-center flex flex-col items-center gap-6 shadow-2xl max-w-lg">
            <div className="w-20 h-20 rounded-full border-4 border-t-transparent border-[#008DDA] animate-spin flex items-center justify-center text-[#0B192C] font-black" />
            <div className="flex flex-col gap-3">
              <h3 className="font-black text-3xl text-[#0B192C] uppercase tracking-wider">
                {currentLang === 'lt' ? 'Pasiruoškite...' : currentLang === 'es' ? '¡Prepárate!' : 'Prepare...'}
              </h3>
              <p className="text-[#008DDA] font-black text-lg leading-relaxed">
                {currentLang === 'lt' 
                  ? 'Patraukite pelės žymeklį nuo ekrano!' 
                  : currentLang === 'es' 
                    ? '¡Quita el puntero del mouse de la pantalla!' 
                    : 'Move your mouse cursor off the screen!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recording Finished Glassmorphic Overlay */}
      {isRecordingFinished && (
        <div className="absolute inset-0 bg-[#F8FAFC]/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center animate-fadeIn">
          <div className="p-12 rounded-[2.5rem] border-2 border-emerald-500 bg-white text-center flex flex-col items-center gap-6 shadow-2xl max-w-xl relative">
            <button 
              onClick={() => setIsRecordingFinished(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 text-2xl font-bold px-4 py-2 hover:bg-slate-100 rounded-full transition-all"
            >
              ✕
            </button>
            <div className="w-24 h-24 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-pulse">
              <Check className="w-14 h-14 stroke-[3.5]" />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-black text-3xl text-[#0B192C] uppercase tracking-wider">
                {currentLang === 'lt' ? 'ĮRAŠYMAS BAIGTAS!' : currentLang === 'es' ? '¡GRABACIÓN FINALIZADA!' : 'RECORDING COMPLETE!'}
              </h3>
              <p className="text-emerald-600 font-bold text-xl leading-relaxed">
                {currentLang === 'lt' 
                  ? 'Pristatymas sėkmingai baigėsi. Dabar galite sustabdyti OBS įrašymą.' 
                  : currentLang === 'es' 
                    ? 'La presentación ha concluido con éxito. Ya puedes detener la grabación en OBS.' 
                    : 'The presentation has successfully ended. You can now stop your OBS recording.'}
              </p>
            </div>
            <button 
              onClick={() => setIsRecordingFinished(false)}
              className="mt-4 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base rounded-xl transition-all uppercase tracking-widest shadow-[0_4px_12px_rgba(16,185,129,0.3)]"
            >
              {currentLang === 'lt' ? 'Uždaryti' : currentLang === 'es' ? 'Entendido' : 'Close'}
            </button>
          </div>
        </div>
      )}

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

            {/* Play/Sync Button */}
            <button 
              onClick={togglePlay}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs md:text-sm font-bold rounded-full border transition-all duration-300 tracking-wider ${isPlaying || isCountingDown ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse' : 'bg-[#0B192C] border-[#0B192C] text-white hover:bg-[#008DDA] hover:border-[#008DDA] shadow-md'}`}
            >
              {isPlaying || isCountingDown ? (
                <>
                  <div className="w-2 h-2 bg-white rounded-full animate-ping mr-1" />
                  {isCountingDown 
                    ? (currentLang === 'lt' ? 'PASIRUOŠIMAS...' : 'PREPARANDO...') 
                    : (currentLang === 'lt' ? 'GROJA (LT)' : currentLang === 'es' ? 'REPRODUCIENDO (ES)' : 'PLAYING (EN)')}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 fill-current mr-1.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  {currentLang === 'lt' ? 'GROTI IR SINCHRONIZUOTI' : currentLang === 'es' ? 'AUTO-PLAY SINCRONIZAR' : 'AUTO-PLAY SYNC'}
                </>
              )}
            </button>

            {/* Language Selector */}
            <div className="flex bg-slate-100 rounded-full p-1 border border-slate-200 shadow-inner">
              <button 
                onClick={() => {
                  if (isPlaying) togglePlay();
                  setCurrentLang('lt');
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all tracking-wider ${currentLang === 'lt' ? 'bg-[#0B192C] text-white shadow-md' : 'text-slate-600 hover:text-[#0B192C]'}`}
              >
                LT
              </button>
              <button 
                onClick={() => {
                  if (isPlaying) togglePlay();
                  setCurrentLang('es');
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all tracking-wider ${currentLang === 'es' ? 'bg-[#0B192C] text-white shadow-md' : 'text-slate-600 hover:text-[#0B192C]'}`}
              >
                ES
              </button>
              <button 
                onClick={() => {
                  if (isPlaying) togglePlay();
                  setCurrentLang('en');
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all tracking-wider ${currentLang === 'en' ? 'bg-[#0B192C] text-white shadow-md' : 'text-slate-600 hover:text-[#0B192C]'}`}
              >
                EN
              </button>
            </div>
            
            <div className="text-xs font-bold text-[#008DDA] bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-full shadow-sm tracking-wider">
              Slide {currentSlide} / 8
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

            {/* SLIDE 2: Nematomi nuostoliai */}
            {currentSlide === 2 && (
              <div className="flex-1 flex flex-col justify-between animate-fadeIn">
                <div className="text-center max-w-4xl mx-auto mb-4">
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

                    <div className="bg-[#0B192C] rounded-2xl p-5 text-center flex flex-col justify-center items-center h-36 shadow-md border-2 border-[#008DDA]">
                      <span className="text-[#00E5FF] font-black text-4xl tracking-tight drop-shadow-[0_0_10px_rgba(0,229,255,0.4)]">-25%</span>
                      <span className="text-white text-[10px] font-black uppercase tracking-widest mt-2 leading-snug">
                        {currentLang === 'lt' ? 'Pajamų praradimas' : currentLang === 'es' ? 'Pérdida de Ingresos' : 'Revenue Loss'}
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

                <div className="w-full bg-[#0B192C] text-white text-xs md:text-sm font-bold py-3 px-6 rounded-2xl text-center leading-relaxed mt-2">
                  {t('s2_footer')}
                </div>
              </div>
            )}

            {/* SLIDE 3: Perkrauta registratūra */}
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
                      <h3 className="font-extrabold text-base text-red-600 uppercase tracking-wider">
                        {t('s3_col1_title')}
                      </h3>
                      <span className="bg-red-100 text-red-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Rutininis krūvis</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <svg className="w-20 h-20 shrink-0" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E2E8F0" strokeWidth="4.5" />
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#EF4444" strokeWidth="4.5" strokeDasharray="60 40" strokeDashoffset="25" />
                        <text x="18" y="20.5" className="font-montserrat font-black text-[9px]" fill="#EF4444" textAnchor="middle">60%</text>
                      </svg>
                      <p className="text-slate-600 text-xs md:text-sm font-semibold leading-relaxed">
                        {t('s3_col1_desc')}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-56">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <h3 className="font-extrabold text-base text-[#008DDA] uppercase tracking-wider">
                        {t('s3_col2_title')}
                      </h3>
                      <span className="bg-[#008DDA]/10 text-[#008DDA] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Prarastos skubios</span>
                    </div>
                    <div className="mt-3 flex flex-col justify-center">
                      <div className="w-full bg-slate-200 h-2 rounded-full relative overflow-hidden mb-3">
                        <div className="absolute top-0 right-0 left-1/2 bg-[#008DDA] h-full rounded-full animate-pulse" />
                      </div>
                      <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-wider mb-2">
                        <span>08:00 - 20:00</span>
                        <span className="text-[#008DDA] font-black">20:00 - 08:00 & Savaitgaliai</span>
                      </div>
                      <p className="text-slate-600 text-xs md:text-sm font-semibold leading-relaxed">
                        {t('s3_col2_desc')}
                      </p>
                    </div>
                  </div>

                </div>

                <div className="w-full bg-[#008DDA]/10 border border-[#008DDA]/20 text-[#0B192C] text-xs md:text-sm font-bold py-3 px-6 rounded-2xl text-center leading-relaxed mt-2">
                  {t('s3_footer')}
                </div>
              </div>
            )}

            {/* SLIDE 4: Marija DI Asistente */}
            {currentSlide === 4 && (
              <div className="flex-1 flex flex-col justify-between animate-fadeIn">
                <div className="text-center max-w-4xl mx-auto mb-4">
                  <h2 className="text-3xl md:text-4.5xl font-black tracking-tight text-[#0B192C]">
                    {t('s4_title')}
                  </h2>
                </div>

                <div className="flex-1 flex flex-col justify-center relative py-4">
                  <div className="absolute left-1/12 right-1/12 top-[64px] h-0.5 border-t-2 border-dashed border-cyan-300 hidden md:block z-0" />

                  <div className="grid md:grid-cols-3 gap-6 relative z-10">
                    
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

            {/* SLIDE 5: Teisinis vientisumas */}
            {currentSlide === 5 && (
              <div className="flex-1 flex flex-col justify-between animate-fadeIn">
                <div className="text-center max-w-4xl mx-auto mb-4">
                  <h2 className="text-3xl md:text-4.5xl font-black tracking-tight text-[#0B192C]">
                    {t('s5_title')}
                  </h2>
                </div>

                <div className="flex-1 grid md:grid-cols-2 gap-6 items-center py-2">
                  
                  <div className="bg-red-50/40 border-2 border-red-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between h-56">
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
                    <div className="text-red-500 text-[10px] font-black uppercase tracking-widest text-right">NOT ALLOWED</div>
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
                    <div className="text-emerald-600 text-[10px] font-black uppercase tracking-widest text-right">MDR EXEMPT ADMINISTRATIVE TOOL</div>
                  </div>

                </div>

                <div className="w-full bg-[#0B192C] text-white text-xs md:text-sm font-bold py-3 px-6 rounded-2xl text-center leading-relaxed mt-2">
                  {t('s5_footer')}
                </div>
              </div>
            )}

            {/* SLIDE 6: Escudo de Contrato */}
            {currentSlide === 6 && (
              <div className="flex-1 flex flex-col justify-between animate-fadeIn">
                <div className="text-center max-w-4xl mx-auto mb-4">
                  <h2 className="text-3xl md:text-4.5xl font-black tracking-tight text-[#0B192C]">
                    {t('s6_title')}
                  </h2>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 py-2">
                  <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center h-36 flex flex-col justify-between shadow-sm relative group hover:border-[#008DDA] transition-all">
                      <span className="text-[#008DDA] font-black text-lg">01</span>
                      <p className="text-slate-700 text-[10px] md:text-xs font-bold leading-normal">{t('s6_step1')}</p>
                      <div className="absolute right-[-14px] top-1/2 -translate-y-1/2 hidden md:block text-[#008DDA] z-20 font-black text-base">▶</div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center h-36 flex flex-col justify-between shadow-sm relative group hover:border-[#008DDA] transition-all">
                      <span className="text-[#008DDA] font-black text-lg">02</span>
                      <p className="text-slate-700 text-[10px] md:text-xs font-bold leading-normal">{t('s6_step2')}</p>
                      <div className="absolute right-[-14px] top-1/2 -translate-y-1/2 hidden md:block text-[#008DDA] z-20 font-black text-base">▶</div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center h-36 flex flex-col justify-between shadow-sm relative group hover:border-[#008DDA] transition-all">
                      <span className="text-[#008DDA] font-black text-lg">03</span>
                      <p className="text-slate-700 text-[10px] md:text-xs font-bold leading-normal">{t('s6_step3')}</p>
                      <div className="absolute right-[-14px] top-1/2 -translate-y-1/2 hidden md:block text-[#008DDA] z-20 font-black text-base">▶</div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center h-36 flex flex-col justify-between shadow-sm relative group hover:border-[#008DDA] transition-all">
                      <span className="text-[#008DDA] font-black text-lg">04</span>
                      <p className="text-slate-700 text-[10px] md:text-xs font-bold leading-normal">{t('s6_step4')}</p>
                    </div>

                  </div>

                  <div className="w-72 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-sm h-56 shrink-0">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#008DDA] text-center w-full block border-b border-slate-200 pb-2">Digital Contract Seal</span>
                    
                    <div className="flex-1 flex items-center justify-center w-full mt-3">
                      {contractSigned ? (
                        <div className="flex flex-col items-center gap-3 text-emerald-600 animate-bounce">
                          <ShieldCheck className="w-12 h-12 text-emerald-500 filter drop-shadow-[0_0_10px_rgba(16,185,129,0.2)]" />
                          <span className="text-[10px] font-black uppercase tracking-wider text-center">{t('s6_signed_status')}</span>
                        </div>
                      ) : (
                        <div className="w-full h-24 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 text-[10px] md:text-xs font-black hover:border-[#008DDA] hover:text-[#008DDA] cursor-pointer transition-all shadow-inner bg-white" onClick={() => setContractSigned(true)}>
                          [ Pasirašyti skaitmeniniu būdu ]
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                <div className="w-full bg-[#008DDA]/10 border border-[#008DDA]/20 text-[#0B192C] text-xs md:text-sm font-bold py-3 px-6 rounded-2xl text-center leading-relaxed mt-2">
                  {t('s6_footer')}
                </div>
              </div>
            )}

            {/* SLIDE 7: Retorno de Inversión (ROI) */}
            {currentSlide === 7 && (
              <div className="flex-1 flex flex-col justify-between animate-fadeIn">
                <div className="text-center max-w-4xl mx-auto mb-2">
                  <h2 className="text-3xl md:text-4.5xl font-black tracking-tight text-[#0B192C] mb-0.5">
                    {t('s7_title')}
                  </h2>
                  <span className="text-xs text-[#008DDA] font-extrabold uppercase tracking-widest block">{t('s7_subtitle')}</span>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 py-2">
                  
                  <div className="w-72 p-5 rounded-2xl bg-[#0B192C] text-white border-2 border-[#008DDA] flex flex-col justify-between shadow-lg h-60 shrink-0">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#00E5FF] text-center w-full block border-b border-white/10 pb-2">Investicijų Skaičiuoklė</span>
                    
                    <div className="flex flex-col gap-2.5 my-3">
                      <label className="text-[10px] text-slate-300 font-extrabold uppercase tracking-wider">{t('s7_calc_label')}</label>
                      <input 
                        type="range" 
                        min="5000" 
                        max="50000" 
                        step="1000"
                        value={monthlyRevenue} 
                        onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                        className="w-full accent-[#008DDA] h-1.5 bg-[#050D1A] rounded-lg appearance-none cursor-pointer" 
                      />
                      <div className="text-center bg-[#050D1A] px-3 py-1.5 border border-[#00E5FF]/20 rounded-xl font-black text-xl text-[#00E5FF] drop-shadow-[0_0_10px_rgba(0,229,255,0.3)] mt-1">
                        {monthlyRevenue.toLocaleString()}€
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    
                    <div className="flex flex-col items-center text-center">
                      <div className="relative w-24 h-24 rounded-full border-4 border-slate-200 shadow-inner flex items-center justify-center bg-slate-50">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                          <circle cx="48" cy="48" r="42" className="stroke-slate-200 fill-none" strokeWidth="5" />
                          <circle cx="48" cy="48" r="42" className="stroke-[#008DDA] fill-none" strokeWidth="5" strokeDasharray="263.9" strokeDashoffset="13.2" />
                        </svg>
                        <span className="text-xl font-black text-[#0B192C]">95%</span>
                      </div>
                      <h4 className="font-extrabold text-[#0B192C] text-xs uppercase tracking-wider mt-2.5 mb-0.5">{t('s7_card1_title')}</h4>
                      <p className="text-slate-500 text-[10px] font-semibold leading-relaxed max-w-[150px]">{t('s7_card1_desc')}</p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <div className="relative w-24 h-24 rounded-full border-4 border-slate-200 shadow-inner flex items-center justify-center bg-slate-50">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                          <circle cx="48" cy="48" r="42" className="stroke-slate-200 fill-none" strokeWidth="5" />
                          <circle cx="48" cy="48" r="42" className="stroke-[#008DDA] fill-none" strokeWidth="5" strokeDasharray="263.9" strokeDashoffset="145.1" />
                        </svg>
                        <span className="text-xl font-black text-[#0B192C]">-45%</span>
                      </div>
                      <h4 className="font-extrabold text-[#0B192C] text-xs uppercase tracking-wider mt-2.5 mb-0.5">{t('s7_card2_title')}</h4>
                      <p className="text-slate-500 text-[10px] font-semibold leading-relaxed max-w-[150px]">{t('s7_card2_desc')}</p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <div className="relative w-24 h-24 rounded-full border-4 border-slate-200 shadow-inner flex items-center justify-center bg-slate-50">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                          <circle cx="48" cy="48" r="42" className="stroke-slate-200 fill-none" strokeWidth="5" />
                          <circle cx="48" cy="48" r="42" className="stroke-emerald-500 fill-none" strokeWidth="5" strokeDasharray="263.9" strokeDashoffset="250.7" />
                        </svg>
                        <span className="text-xl font-black text-emerald-600">+5%</span>
                      </div>
                      <h4 className="font-extrabold text-[#0B192C] text-xs uppercase tracking-wider mt-2.5 mb-0.5">{t('s7_card3_title')}</h4>
                      <p className="text-slate-500 text-[10px] font-semibold leading-relaxed max-w-[150px]">{t('s7_card3_desc')}</p>
                    </div>

                  </div>

                </div>

                <div className="w-full mt-2">
                  <div className="border-t-2 border-[#0B192C]/10 w-full my-2" />
                  <p className="text-[#0B192C] text-center font-black text-base md:text-lg tracking-wide uppercase leading-none">
                    {t('s7_footer')}
                  </p>
                </div>
              </div>
            )}

            {/* SLIDE 8: Cierre y Activación */}
            {currentSlide === 8 && (
              <div className="flex-1 flex flex-col justify-between animate-fadeIn">
                <div className="text-center max-w-4xl mx-auto mb-2">
                  <h2 className="text-3xl md:text-4.5xl font-black tracking-tight text-[#0B192C]">
                    {t('s8_title')}
                  </h2>
                </div>

                <div className="flex-1 flex items-center relative py-2">
                  <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-0 items-stretch border border-slate-200 rounded-3xl bg-slate-50/50 shadow-sm overflow-hidden">
                    
                    <div className="p-5 flex flex-col justify-between relative min-h-[180px]">
                      <div>
                        <h3 className="font-black text-[#008DDA] text-base md:text-lg uppercase tracking-wider mb-2">
                          {t('s8_card1_title')}
                        </h3>
                        <p className="text-slate-600 text-xs font-bold leading-relaxed pr-6">
                          {t('s8_card1_desc')}
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
                          {t('s8_card2_title')}
                        </h3>
                        <p className="text-slate-600 text-xs font-bold leading-relaxed pr-6">
                          {t('s8_card2_desc')}
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
                          {t('s8_card3_title')}
                        </h3>
                        <p className="text-slate-600 text-xs font-bold leading-relaxed">
                          {t('s8_card3_desc')}
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
                    <span className="font-black text-xs md:text-sm uppercase tracking-widest text-center md:text-left">{t('s8_footer')}</span>
                  </div>
                  <div className="flex flex-col text-center md:text-right items-center md:items-end gap-0.5 font-semibold">
                    <span className="text-[10px] text-slate-100 uppercase tracking-widest font-black">{t('s8_contact')}</span>
                    <span className="text-[8px] text-[#00E5FF] uppercase tracking-wider font-extrabold">Partizanų g. 61-806, LT-49282, Kaunas, Lithuania  |  Company code: 307515454</span>
                  </div>
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
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <button
                key={s}
                onClick={() => setCurrentSlide(s)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${currentSlide === s ? 'bg-[#008DDA] w-6 shadow-[0_0_8px_rgba(0,141,218,0.5)]' : 'bg-slate-300 hover:bg-slate-400'}`}
              />
            ))}
          </div>

          <button 
            onClick={nextSlide}
            disabled={currentSlide === 8}
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
