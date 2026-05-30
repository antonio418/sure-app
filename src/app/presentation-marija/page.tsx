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
    <main className="w-screen h-screen bg-[#0B192C] text-slate-100 font-montserrat selection:bg-[#008DDA]/20 overflow-hidden flex flex-col justify-between p-8 md:p-10 relative">
      
      {/* Background radial glowing gradients matching the brand manual */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#008DDA]/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#008DDA]/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* 1.5-second Countdown / Preparation Screen Overlay */}
      {isCountingDown && (
        <div className="absolute inset-0 bg-[#0B192C]/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center animate-fadeIn">
          <div className="p-12 rounded-[2.5rem] border-2 border-[#008DDA]/50 bg-[#050D1A]/95 text-center flex flex-col items-center gap-6 shadow-[0_0_60px_rgba(0,141,218,0.4)] max-w-lg">
            <div className="w-20 h-20 rounded-full border-4 border-t-transparent border-[#00E5FF] animate-spin flex items-center justify-center text-white font-black" />
            <div className="flex flex-col gap-3">
              <h3 className="font-black text-3xl text-white uppercase tracking-wider">
                {currentLang === 'lt' ? 'Pasiruoškite...' : currentLang === 'es' ? '¡Prepárate!' : 'Prepare...'}
              </h3>
              <p className="text-[#00E5FF] font-black text-lg leading-relaxed">
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
        <div className="absolute inset-0 bg-[#0B192C]/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center animate-fadeIn">
          <div className="p-12 rounded-[2.5rem] border-2 border-emerald-500/50 bg-[#050D1A]/95 text-center flex flex-col items-center gap-6 shadow-[0_0_60px_rgba(16,185,129,0.4)] max-w-xl relative">
            <button 
              onClick={() => setIsRecordingFinished(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white text-2xl font-bold px-4 py-2 hover:bg-white/10 rounded-full transition-all"
            >
              ✕
            </button>
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-pulse">
              <Check className="w-14 h-14 stroke-[3.5]" />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-black text-3xl text-white uppercase tracking-wider">
                {currentLang === 'lt' ? 'ĮRAŠYMAS BAIGTAS!' : currentLang === 'es' ? '¡GRABACIÓN FINALIZADA!' : 'RECORDING COMPLETE!'}
              </h3>
              <p className="text-emerald-400 font-bold text-xl leading-relaxed">
                {currentLang === 'lt' 
                  ? 'Pristatymas sėkmingai baigėsi. Dabar galite sustabdyti OBS įrašymą.' 
                  : currentLang === 'es' 
                    ? 'La presentación ha concluido con éxito. Ya puedes detener la grabación en OBS.' 
                    : 'The presentation has successfully ended. You can now stop your OBS recording.'}
              </p>
            </div>
            <button 
              onClick={() => setIsRecordingFinished(false)}
              className="mt-4 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base rounded-xl transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              {currentLang === 'lt' ? 'Uždaryti' : currentLang === 'es' ? 'Entendido' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Top Bar / Slide Header - MB PROCDI Branding */}
      <header className="w-full flex justify-between items-center z-20 pb-6 border-b border-[#00E5FF]/30 relative">
        <div className="flex items-center gap-5">
          <ProcdiLogo className="w-20 h-20 shrink-0 drop-shadow-[0_0_20px_rgba(0,229,255,0.4)]" />
          <div className="flex flex-col">
            <span className="font-semibold text-3xl md:text-4xl tracking-[0.08em] text-white leading-none">
              MB PROCDI
            </span>
            <span className="text-base md:text-lg text-[#00E5FF] font-medium uppercase tracking-[0.16em] mt-2.5">
              Marija DI • Premium Clinical AI System
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          {/* Interactive Play/Sync System - LARGE AND CRISP FOR PERFECT RECORDING */}
          <button 
            onClick={togglePlay}
            className={`flex items-center gap-2.5 px-8 py-3.5 text-base md:text-lg lg:text-xl font-semibold rounded-xl border transition-all duration-300 tracking-wider ${isPlaying || isCountingDown ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_25px_rgba(16,185,129,0.6)] animate-pulse' : 'bg-[#050D1A] border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#008DDA]/20 shadow-[0_4px_16px_rgba(0,229,255,0.15)]'}`}
          >
            {isPlaying || isCountingDown ? (
              <>
                <div className="w-3 h-3 bg-white rounded-full animate-ping mr-1.5" />
                {isCountingDown 
                  ? (currentLang === 'lt' ? 'PASIRUOŠIMAS...' : 'PREPARANDO...') 
                  : (currentLang === 'lt' ? 'ATKURIAMA (LT)' : currentLang === 'es' ? 'REPRODUCIR (ES)' : 'PLAYING (EN)')}
              </>
            ) : (
              <>
                <svg className="w-5 h-5 fill-current mr-2" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                {currentLang === 'lt' ? 'ATKURTI IR SINCHRONIZUOTI' : currentLang === 'es' ? 'AUTO-PLAY SINCRONIZAR' : 'AUTO-PLAY SYNC'}
              </>
            )}
          </button>

          {/* Overhauled Language Selector: MUCH LARGER, SEMI-BOLD, EXTREMELY HIGH CONTRAST */}
          <div className="flex bg-[#050D1A]/95 backdrop-blur-md rounded-full p-2 gap-3 border-2 border-[#00E5FF]/40 shadow-2xl">
            <button 
              onClick={() => {
                if (isPlaying) togglePlay();
                setCurrentLang('lt');
              }}
              className={`px-6 py-3 text-base md:text-lg lg:text-xl font-semibold rounded-full transition-all tracking-wider ${currentLang === 'lt' ? 'bg-[#00E5FF] text-[#0B192C] shadow-[0_0_25px_rgba(0,229,255,0.75)] font-bold' : 'text-slate-200 hover:text-white hover:bg-[#00E5FF]/10'}`}
            >
              LT (Lietuvių)
            </button>
            <button 
              onClick={() => {
                if (isPlaying) togglePlay();
                setCurrentLang('es');
              }}
              className={`px-6 py-3 text-base md:text-lg lg:text-xl font-semibold rounded-full transition-all tracking-wider ${currentLang === 'es' ? 'bg-[#00E5FF] text-[#0B192C] shadow-[0_0_25px_rgba(0,229,255,0.75)] font-bold' : 'text-slate-200 hover:text-white hover:bg-[#00E5FF]/10'}`}
            >
              ES (Español)
            </button>
            <button 
              onClick={() => {
                if (isPlaying) togglePlay();
                setCurrentLang('en');
              }}
              className={`px-6 py-3 text-base md:text-lg lg:text-xl font-semibold rounded-full transition-all tracking-wider ${currentLang === 'en' ? 'bg-[#00E5FF] text-[#0B192C] shadow-[0_0_25px_rgba(0,229,255,0.75)] font-bold' : 'text-slate-200 hover:text-white hover:bg-[#00E5FF]/10'}`}
            >
              EN (English)
            </button>
          </div>
          
          <div className="text-lg md:text-xl font-semibold text-[#00E5FF] bg-[#050D1A]/95 border-2 border-[#00E5FF]/40 px-6 py-3.5 rounded-xl shadow-inner tracking-wider">
            Slide {currentSlide} / 8
          </div>
        </div>
      </header>

      {/* Main Slide Content Sandbox Area - Crisp, Large & Highly legible layouts */}
      <section className="flex-1 w-full flex items-center justify-center py-6 overflow-hidden relative z-10">
        <div className="w-full h-full flex flex-col justify-center relative">

          {/* SLIDE 1: Portada */}
          {currentSlide === 1 && (
            <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-[1.6] flex flex-col justify-center max-w-4xl">
                {/* SOLID, HIGH-CONTRAST AND SPACIOUS TOP RIBBON BADGE */}
                <span className="self-start text-[14px] md:text-[16px] font-bold uppercase tracking-[0.16em] px-6 py-3.5 rounded-2xl bg-[#008DDA] text-[#0B192C] mb-8 shadow-[0_0_25px_rgba(0,141,218,0.45)] border-2 border-[#00E5FF]/40">
                  {t('s1_badge')}
                </span>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.1] mb-6">
                  {t('s1_title')}
                </h1>
                {/* ELEGANT, SPACIOUS AND LIGHTER SUBTITLE STYLE */}
                <p className="text-2xl md:text-3.5xl font-semibold tracking-wide text-[#00E5FF] mb-8 leading-relaxed">
                  {t('s1_subtitle')}
                </p>
                <p className="text-slate-100 text-lg md:text-2xl leading-relaxed font-bold">
                  {t('s1_desc')}
                </p>
              </div>
              <div className="flex-[0.8] flex items-center justify-center">
                <div className="relative w-80 h-80 rounded-3xl bg-[#050D1A]/90 border-2 border-[#008DDA]/45 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.6)] group backdrop-blur-md">
                  <div className="absolute inset-4 rounded-2xl bg-gradient-to-br from-[#008DDA]/20 to-emerald-500/5 animate-pulse" />
                  <div className="w-56 h-56 rounded-2xl bg-[#020710] border border-[#008DDA]/30 shadow-inner flex flex-col items-center justify-center gap-6 relative z-10">
                    <Activity className="w-24 h-24 text-[#00E5FF] filter drop-shadow-[0_0_20px_rgba(0,229,255,0.45)] animate-pulse" />
                    <span className="font-extrabold text-sm text-[#00E5FF] uppercase tracking-widest">MARIJA DI ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: Costo Oculto - Silla Vacía */}
          {currentSlide === 2 && (
            <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-[1.6] flex flex-col justify-center max-w-4xl">
                <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-8 leading-tight">
                  {t('s2_title')}
                </h2>
                <div className="flex items-center gap-8 mb-8 bg-[#050D1A]/95 p-8 rounded-3xl border-2 border-[#008DDA]/45 shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
                  <div className="text-7xl md:text-8xl font-black text-[#00E5FF] tracking-tight drop-shadow-[0_0_20px_rgba(0,229,255,0.55)]">
                    25%
                  </div>
                  <div>
                    <h3 className="font-black text-white text-2xl md:text-3xl mb-2">{t('s2_metric_title')}</h3>
                    <p className="text-base md:text-xl text-slate-100 font-bold leading-relaxed">{t('s2_metric_desc')}</p>
                  </div>
                </div>
                <p className="text-slate-100 text-lg md:text-2.5xl leading-relaxed mb-8 font-bold">
                  {t('s2_fact')}
                </p>
                <div className="flex gap-5">
                  <button 
                    onClick={() => setChairFilled(true)}
                    className="px-8 py-4.5 bg-[#008DDA] hover:bg-[#00A3FF] text-white text-sm font-black rounded-xl shadow-[0_0_25px_rgba(0,141,218,0.5)] transition-all uppercase tracking-widest"
                  >
                    {t('s2_btn_fill')}
                  </button>
                  <button 
                    onClick={() => setChairFilled(false)}
                    className="px-8 py-4.5 bg-[#050D1A] hover:bg-slate-800 text-slate-100 text-sm font-black rounded-xl border border-white/30 transition-all uppercase tracking-widest"
                  >
                    {t('s2_btn_empty')}
                  </button>
                </div>
              </div>
              <div className="flex-[0.8] flex items-center justify-center">
                <div className="w-[360px] p-10 rounded-3xl bg-[#050D1A]/95 border-2 border-[#008DDA]/45 flex flex-col items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative backdrop-blur-md">
                  <div className={`w-full py-4 px-6 rounded-2xl text-center text-base font-black mb-8 transition-all duration-300 ${chairFilled ? 'bg-emerald-500/25 text-[#00E676] border border-emerald-500/50 shadow-[0_0_20px_rgba(0,230,118,0.25)]' : 'bg-red-500/25 text-[#FF4A4A] border border-red-500/50 shadow-[0_0_20px_rgba(255,74,74,0.25)] animate-pulse'}`}>
                    {chairFilled ? t('s2_status_filled') : t('s2_status_empty')}
                  </div>
                  
                  {/* SVG de Sillón Dental Interactivo */}
                  <svg className="w-64 h-64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="25" y="65" width="50" height="8" rx="4" fill="#64748B" />
                    <line x1="50" y1="65" x2="50" y2="45" stroke="#64748B" strokeWidth="6" />
                    <path 
                      d="M20,40 Q35,42 50,40 T80,35 Q85,45 80,50 T45,47 Q30,48 20,40 Z" 
                      fill={chairFilled ? "#00E676" : "#FF4A4A"} 
                      className="transition-colors duration-500" 
                      stroke="#0B192C"
                      strokeWidth="2"
                    />
                    <path 
                      d="M22,30 Q30,35 40,30 Q45,20 35,15 Q25,20 22,30 Z" 
                      fill="#475569" 
                      stroke="#0B192C"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3: Recepción Perkrauta */}
          {currentSlide === 3 && (
            <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-[1.6] flex flex-col justify-center max-w-4xl">
                <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-8 leading-tight">
                  {t('s3_title')}
                </h2>
                <div className="flex items-center gap-8 mb-8 bg-[#050D1A]/95 p-8 rounded-3xl border-2 border-[#008DDA]/45 shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
                  <div className="text-6xl md:text-7xl font-black text-[#FF4A4A] tracking-tight drop-shadow-[0_0_20px_rgba(255,74,74,0.55)]">
                    60%
                  </div>
                  <div>
                    <h3 className="font-black text-white text-2xl md:text-3xl mb-2">{t('s3_stat_title')}</h3>
                    <p className="text-base md:text-xl text-slate-100 font-bold leading-relaxed">{t('s3_stat_desc')}</p>
                  </div>
                </div>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4 text-lg md:text-2xl text-slate-100 font-bold leading-relaxed">
                    <AlertTriangle className="w-8 h-8 text-[#FF4A4A] flex-shrink-0 mt-0.5 animate-pulse" />
                    <span>{t('s3_point1')}</span>
                  </li>
                  <li className="flex items-start gap-4 text-lg md:text-2xl text-slate-100 font-bold leading-relaxed">
                    <AlertTriangle className="w-8 h-8 text-[#FF4A4A] flex-shrink-0 mt-0.5 animate-pulse" />
                    <span>{t('s3_point2')}</span>
                  </li>
                  <li className="flex items-start gap-4 text-lg md:text-2xl text-slate-100 font-bold leading-relaxed">
                    <AlertTriangle className="w-8 h-8 text-[#FF4A4A] flex-shrink-0 mt-0.5 animate-pulse" />
                    <span>{t('s3_point3')}</span>
                  </li>
                </ul>
              </div>
              <div className="flex-[0.8] flex items-center justify-center">
                <div className="w-96 p-10 rounded-3xl bg-[#050D1A]/95 border-2 border-[#008DDA]/45 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.4)] h-96 backdrop-blur-md">
                  <span className="text-xs font-black uppercase tracking-widest text-[#00E5FF] text-center w-full block border-b border-[#008DDA]/20 pb-3">{t('s3_chart_label')}</span>
                  <div className="flex-1 flex items-end justify-center gap-14 mt-8">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-24 bg-[#0B192C] border-2 border-white/30 rounded-t-2xl h-32 flex items-center justify-center text-slate-100 font-black text-lg shadow-md transition-all hover:scale-105">
                        40%
                      </div>
                      <span className="text-xs font-black text-slate-200 uppercase tracking-widest">{currentLang === 'lt' ? 'Klinika' : 'Clínica'}</span>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-24 bg-[#FF4A4A] border-2 border-[#FF8A8A] rounded-t-2xl h-48 flex items-center justify-center text-white font-black text-lg shadow-[0_0_25px_rgba(255,74,74,0.4)] animate-pulse transition-all hover:scale-105">
                        60%
                      </div>
                      <span className="text-xs font-black text-slate-200 uppercase tracking-widest">{currentLang === 'lt' ? 'Admin' : 'Admin'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 4: Marija DI Asistente */}
          {currentSlide === 4 && (
            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-10 max-w-5xl">
                <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6">
                  {t('s4_title')}
                </h2>
                <p className="text-[#00E5FF] font-black text-2xl md:text-4.5xl drop-shadow-[0_0_15px_rgba(0,229,255,0.25)]">
                  {t('s4_subtitle')}
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="p-8 rounded-3xl bg-[#050D1A]/95 border-2 border-[#008DDA]/30 hover:border-[#00E5FF]/60 transition-all flex flex-col justify-between shadow-[0_15px_40px_rgba(0,0,0,0.4)] group backdrop-blur-md">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-[#008DDA]/20 flex items-center justify-center text-[#00E5FF] mb-6 group-hover:scale-110 transition-all shadow-[0_0_15px_rgba(0,141,218,0.25)] border border-[#008DDA]/40">
                      <Clock className="w-8 h-8" />
                    </div>
                    <h3 className="font-black text-2xl text-white mb-4">{t('s4_feature1_title')}</h3>
                    <p className="text-base md:text-lg text-slate-100 font-bold leading-relaxed">{t('s4_feature1_desc')}</p>
                  </div>
                </div>
                
                <div className="p-8 rounded-3xl bg-[#050D1A]/95 border-2 border-[#008DDA]/30 hover:border-[#00E5FF]/60 transition-all flex flex-col justify-between shadow-[0_15px_40px_rgba(0,0,0,0.4)] group backdrop-blur-md">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-[#008DDA]/20 flex items-center justify-center text-[#00E5FF] mb-6 group-hover:scale-110 transition-all shadow-[0_0_15px_rgba(0,141,218,0.25)] border border-[#008DDA]/40">
                      <Calendar className="w-8 h-8" />
                    </div>
                    <h3 className="font-black text-2xl text-white mb-4">{t('s4_feature2_title')}</h3>
                    <p className="text-base md:text-lg text-slate-100 font-bold leading-relaxed">{t('s4_feature2_desc')}</p>
                  </div>
                </div>
                
                <div className="p-8 rounded-3xl bg-[#050D1A]/95 border-2 border-[#008DDA]/30 hover:border-[#00E5FF]/60 transition-all flex flex-col justify-between shadow-[0_15px_40px_rgba(0,0,0,0.4)] group backdrop-blur-md">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-[#008DDA]/20 flex items-center justify-center text-[#00E5FF] mb-6 group-hover:scale-110 transition-all shadow-[0_0_15px_rgba(0,141,218,0.25)] border border-[#008DDA]/40">
                      <Settings className="w-8 h-8" />
                    </div>
                    <h3 className="font-black text-2xl text-white mb-4">{t('s4_feature3_title')}</h3>
                    <p className="text-base md:text-lg text-slate-100 font-bold leading-relaxed">{t('s4_feature3_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 5: Seguridad Legal y MDR */}
          {currentSlide === 5 && (
            <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-[1.6] flex flex-col justify-center max-w-4xl">
                <span className="self-start text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-full bg-[#008DDA]/20 text-[#00E5FF] mb-6 border border-[#008DDA]/45 shadow-[0_0_15px_rgba(0,141,218,0.25)]">
                  {t('s5_badge')}
                </span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-tight mb-6">
                  {t('s5_header')}
                </h2>
                <p className="text-[#00E5FF] font-black text-xl md:text-2.5xl mb-8 leading-relaxed">
                  {t('s5_legal_desc')}
                </p>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4 text-lg md:text-2xl text-white font-bold leading-relaxed">
                    <CheckCircle2 className="w-8 h-8 text-[#00E5FF] flex-shrink-0 mt-0.5" />
                    <span>{t('s5_point_a')}</span>
                  </li>
                  <li className="flex items-start gap-4 text-lg md:text-2xl text-white font-bold leading-relaxed">
                    <CheckCircle2 className="w-8 h-8 text-[#00E5FF] flex-shrink-0 mt-0.5" />
                    <span>{t('s5_point_b')}</span>
                  </li>
                  <li className="flex items-start gap-4 text-lg md:text-2xl text-white font-bold leading-relaxed">
                    <CheckCircle2 className="w-8 h-8 text-[#00E5FF] flex-shrink-0 mt-0.5" />
                    <span>{t('s5_point_c')}</span>
                  </li>
                </ul>
              </div>
              <div className="flex-[0.8] flex items-center justify-center">
                <div className="w-96 p-10 rounded-3xl bg-[#050D1A]/95 border-2 border-[#008DDA]/45 flex flex-col items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.4)] h-96 gap-8 backdrop-blur-md">
                  <div className="w-28 h-28 rounded-full bg-[#008DDA]/20 border-2 border-[#008DDA]/45 flex items-center justify-center text-[#00E5FF] shadow-[0_0_35px_rgba(0,141,218,0.4)] animate-pulse">
                    <ShieldCheck className="w-16 h-16" />
                  </div>
                  <span className="text-center font-black text-white text-2xl tracking-wide">MDR 2017/745 EXEMPT</span>
                  <span className="text-center text-sm font-black text-[#00E5FF] uppercase tracking-widest leading-relaxed">100% REGULATORY SANITARY SAFE</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 6: El Escudo Contractual */}
          {currentSlide === 6 && (
            <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-[1.6] flex flex-col justify-center max-w-4xl">
                <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-4 leading-tight">
                  {t('s6_title')}
                </h2>
                <p className="text-[#00E5FF] font-black text-2xl md:text-3.5xl mb-8">
                  {t('s6_subtitle')}
                </p>
                <p className="text-slate-100 text-lg md:text-2.5xl leading-relaxed mb-8 font-bold">
                  {t('s6_desc')}
                </p>
                <ul className="space-y-6 mb-8">
                  <li className="flex items-center gap-4 text-lg md:text-2.5xl text-white font-bold">
                    <Check className="w-8 h-8 text-emerald-400 stroke-[3.5]" />
                    <span>{t('s6_benefit1')}</span>
                  </li>
                  <li className="flex items-center gap-4 text-lg md:text-2.5xl text-white font-bold">
                    <Check className="w-8 h-8 text-emerald-400 stroke-[3.5]" />
                    <span>{t('s6_benefit2')}</span>
                  </li>
                </ul>
                <button 
                  onClick={() => setContractSigned(true)}
                  className="self-start px-10 py-5 bg-[#008DDA] hover:bg-[#00A3FF] text-white text-sm font-black rounded-xl shadow-[0_0_25px_rgba(0,141,218,0.5)] transition-all uppercase tracking-widest"
                >
                  {t('s6_sign_btn')}
                </button>
              </div>
              <div className="flex-[0.8] flex items-center justify-center">
                <div className="w-96 p-10 rounded-3xl bg-[#050D1A]/95 border-2 border-[#008DDA]/45 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.4)] h-96 backdrop-blur-md">
                  <span className="text-xs font-black uppercase tracking-widest text-[#00E5FF] text-center w-full block border-b border-[#008DDA]/20 pb-3">Digital Contract Seal</span>
                  
                  <div className="flex-1 flex items-center justify-center w-full mt-4">
                    {contractSigned ? (
                      <div className="flex flex-col items-center gap-6 text-emerald-400 animate-bounce">
                        <ShieldCheck className="w-24 h-24 filter drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                        <span className="text-base font-black uppercase tracking-wider">{t('s6_signed_status')}</span>
                      </div>
                    ) : (
                      <div className="w-full h-40 border-2 border-dashed border-[#008DDA]/40 rounded-2xl flex items-center justify-center text-slate-200 text-lg font-black hover:border-[#00E5FF] hover:text-[#00E5FF] cursor-pointer transition-all shadow-inner bg-[#020710]" onClick={() => setContractSigned(true)}>
                        [ Click to sign / Pasirašyti ]
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 7: Retorno de Inversión (ROI) */}
          {currentSlide === 7 && (
            <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-[1.4] flex flex-col justify-center max-w-4xl">
                <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-8 leading-tight">
                  {t('s7_title')}
                </h2>
                <div className="bg-[#050D1A]/95 border-2 border-[#008DDA]/45 rounded-3xl p-8 shadow-[0_15px_40px_rgba(0,0,0,0.4)] mb-8 backdrop-blur-md">
                  <h3 className="font-black text-white text-xl md:text-2xl uppercase tracking-wider mb-6">{t('s7_calc_title')}</h3>
                  <div className="flex flex-col gap-4">
                    <label className="text-base text-slate-200 font-extrabold">{t('s7_calc_label')}</label>
                    <div className="flex items-center gap-8">
                      <input 
                        type="range" 
                        min="5000" 
                        max="50000" 
                        step="1000"
                        value={monthlyRevenue} 
                        onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                        className="flex-1 accent-[#008DDA] h-2 bg-[#020710] rounded-lg appearance-none cursor-pointer" 
                      />
                      <span className="text-3xl font-black text-[#00E5FF] w-36 text-right bg-[#020710] px-5 py-2.5 border-2 border-[#008DDA]/45 rounded-xl shadow-inner drop-shadow-[0_0_12px_rgba(0,229,255,0.3)]">
                        {monthlyRevenue.toLocaleString()}€
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-100 text-lg md:text-2.5xl font-bold leading-relaxed">
                  {t('s7_roi_desc')}
                </p>
              </div>
              <div className="flex-[1] flex items-center justify-center">
                <div className="w-[440px] p-8 rounded-3xl bg-[#050D1A]/95 border-2 border-[#008DDA]/45 flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)] gap-6 backdrop-blur-md">
                  <span className="text-xs font-black uppercase tracking-widest text-[#00E5FF] text-center w-full block border-b border-[#008DDA]/20 pb-3">Monthly ROI Readout</span>
                  
                  <div className="flex justify-between items-center py-4 border-b border-white/10">
                    <span className="text-base text-slate-100 font-bold">{t('s7_recovery_lbl')}</span>
                    <span className="text-xl font-black text-white">+{noShowSavings}€</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-4 border-b border-white/10">
                    <span className="text-base text-slate-100 font-bold">{t('s7_efficiency_lbl')}</span>
                    <span className="text-xl font-black text-white">+{slotRecoverySavings}€</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-5 bg-[#008DDA]/15 border-2 border-[#008DDA]/55 rounded-2xl px-6 mt-4 shadow-inner">
                    <span className="text-xs text-[#00E5FF] font-black uppercase tracking-widest">{t('s7_total_lbl')}</span>
                    <span className="text-3xl font-black text-[#00E5FF] drop-shadow-[0_0_15px_rgba(0,229,255,0.35)]">{totalMonthlyBenefit}€ / mėn.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 8: Cierre y Activación */}
          {currentSlide === 8 && (
            <div className="flex-1 flex flex-col justify-between mt-4">
              <div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-8 leading-tight">
                  {t('s8_title')}
                </h2>
                
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div className="p-8 rounded-3xl bg-[#050D1A]/95 border-2 border-[#008DDA]/30 shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all hover:shadow-md hover:border-[#00E5FF]/60 backdrop-blur-md">
                    <h3 className="font-black text-2xl text-[#00E5FF] uppercase tracking-wider mb-4">{t('s8_step1')}</h3>
                    <p className="text-base md:text-lg text-slate-100 font-bold leading-relaxed">{t('s8_step1_desc')}</p>
                  </div>
                  
                  <div className="p-8 rounded-3xl bg-[#050D1A]/95 border-2 border-[#008DDA]/30 shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all hover:shadow-md hover:border-[#00E5FF]/60 backdrop-blur-md">
                    <h3 className="font-black text-2xl text-[#00E5FF] uppercase tracking-wider mb-4">{t('s8_step2')}</h3>
                    <p className="text-base md:text-lg text-slate-100 font-bold leading-relaxed">{t('s8_step2_desc')}</p>
                  </div>
                  
                  <div className="p-8 rounded-3xl bg-[#050D1A]/95 border-2 border-[#008DDA]/30 shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all hover:shadow-md hover:border-[#00E5FF]/60 backdrop-blur-md">
                    <h3 className="font-black text-2xl text-[#00E5FF] uppercase tracking-wider mb-4">{t('s8_step3')}</h3>
                    <p className="text-base md:text-lg text-slate-100 font-bold leading-relaxed">{t('s8_step3_desc')}</p>
                  </div>
                </div>
              </div>
              
              <div className="w-full py-8 px-10 bg-[#050D1A] text-white rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 border-2 border-[#008DDA]/45 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-5">
                  <ShieldCheck className="w-10 h-10 text-[#00E5FF] animate-pulse" />
                  <span className="font-black text-lg md:text-xl uppercase tracking-widest text-white leading-relaxed">{t('s8_contact')}</span>
                </div>
                <div className="flex flex-col text-right items-end gap-2">
                  <span className="text-[12px] text-slate-100 font-black tracking-widest uppercase">MB PROCDI  |  Company code: 307515454</span>
                  <span className="text-[10px] text-[#008DDA] font-extrabold tracking-widest uppercase">Partizanų g. 61-806, LT-49282, Kaunas, Lithuania  |  +370 68941110</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Nav Controls Bar - Placed at the bottom inside viewport padding */}
      <footer className="w-full flex justify-between items-center border-t border-[#008DDA]/30 pt-4 z-20 relative">
        <button 
          onClick={prevSlide}
          disabled={currentSlide === 1}
          className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-100 hover:text-[#00E5FF] transition-colors disabled:opacity-30 disabled:hover:text-slate-300"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('back')}
        </button>

        {/* Indicator dots */}
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <button
              key={s}
              onClick={() => setCurrentSlide(s)}
              className={`w-3.5 h-3.5 rounded-full transition-all ${currentSlide === s ? 'bg-[#008DDA] w-8 shadow-[0_0_10px_rgba(0,141,218,0.6)]' : 'bg-slate-700 hover:bg-slate-600'}`}
            />
          ))}
        </div>

        <button 
          onClick={nextSlide}
          disabled={currentSlide === 8}
          className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-100 hover:text-[#00E5FF] transition-colors disabled:opacity-30 disabled:hover:text-slate-300"
        >
          {t('continue')}
          <ArrowRight className="w-5 h-5" />
        </button>
      </footer>

    </main>
  );
}
