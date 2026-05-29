import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import { Communicate } from 'edge-tts-ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Guiones oficiales de 75 segundos optimizados
const SCRIPTS = {
    dns: {
        title: "SURE DNS - Seguridad de Correo B2B (Español)",
        voice: "es-MX-JorgeNeural",
        text: "Ocurre en milisegundos. El correo electrónico corporativo es el canal donde se ejecuta hoy el noventa por ciento de las estafas y desvíos financieros B2B globales. Pero el colapso real es legal. Si su dominio carece de seguridad DNS estándar y sufre una suplantación de identidad, la jurisprudencia responsabiliza civilmente a su empresa. El banco queda liberado. Los firewalls tradicionales no cubren la suplantación de dominio exterior. DMARC ausente es una falla de arquitectura a nivel industria que expone directamente su capital en cada transacción. Frente a este vacío fiduciario, el motor de inteligencia de SURE actúa de inmediato. Roberto mapea la procedencia de servidores externos, mientras Moisés valida los metadatos de sus contratos de pago. El fraude rara vez inicia en sus servidores; inicia en los de sus proveedores bulk. SURE audita pasivamente todo su canal transaccional externo para bloquear desvíos bancarios. Ciberdefensa fiduciaria a costo de fricción cero. Solo setenta dólares de pago único por dominio. Solicite hoy mismo una auditoría de vulnerabilidad DNS externa sin costo en alfredo arroba sureforensic punto com. SURE."
    },
    rma: {
        title: "SURE RMA - Mitigación de Riesgo en Commodities (Español)",
        voice: "es-MX-JorgeNeural",
        text: "En la compra de commodities bulk, las pérdidas no ocurren en el mar; ocurren en su escritorio. Inconsistencias documentales imperceptibles drenan silenciosamente el cinco por ciento de su valor transaccional. La inspección tradicional llega demasiado tarde. Valida la cantidad física en el puerto, pero ignora firmas manipuladas, inconsistencias de contratos y patrones de fraude antes de la carga. SURE RMA reescribe las rules. A través del blindaje Quad-Shield, evaluamos instantáneamente el cumplimiento legal de Roberto, la validez contractual de Moisés, y los parámetros físicos de Alcides. Sin instalaciones de software. Un Reporte Transaccional de Riesgo en solo siete minutos, por exactamente cincuenta dólares la transacción. Su equipo solo envía el documento por e-mail. Si ocurre una pérdida fiduciaria millonaria por firmas falsas que un análisis autónomo de cincuenta dólares pudo detectar en minutos, la junta directiva asume negligencia personal. Pruébenos sin riesgo. Envíenos un negocio fallido o muerto del año dos mil veintiséis y haremos una auditoría forense ciega y gratuita para mostrarle exactamente dónde estuvo el fraude. SURE RMA. Contacto en alfredo arroba sureforensic punto com."
    },
    marija: {
        title: "Marija DI - Automatización Dental Lituania (Español)",
        voice: "es-ES-AlvaroNeural",
        text: "En la odontología moderna, cada minuto cuenta. Presentamos Marija DI de MB PROCDI: el motor de automatización inteligente diseñado específicamente para eliminar de raíz el costo de la silla vacía en su clínica. El recurso más costoso de su consultorio no son los materiales ni la tecnología; son los minutos con el sillón vacío. Mientras el reloj avanza, las citas canceladas o no-show drenan silenciosamente su rentabilidad diaria. Estadísticamente, el ausentismo y las reprogramaciones tardías provocan hasta un veinticinco por ciento de ineficiencia en las horas del consultorio, evaporando miles de euros en utilidades al final de su balance anual. Mientras tanto, su recepción lucha contra el colapso administrativo. El personal pasa la mayor parte del día resolviendo urgencias manuales y llamadas perdidas. El diagnóstico es claro: el sesenta por ciento del tiempo del personal se consume en tareas administrativas manuales, restándole tiempo valioso a la atención presencial del paciente. Marija DI transforma el caos en orden. Sin cambiar de software, opera veinticuatro siete de forma cien por ciento pasiva, confirmando agendas, reprogramando espacios vacíos y enviando contratos digitales de adhesión legal en Lituania. Recupere el control de su agenda médica, reduzca el ausentismo hasta en un cuarenta y cinco por ciento y maximice la facturación. Únase a las clínicas líderes en Lituania. Contáctenos hoy en antonio arroba procdi punto com para una prueba sin costo."
    },
    marija_lt: {
        title: "Marija DI - Dantų Klinikos Automatizavimas (Lietuvių)",
        voice: "lt-LT-OnaNeural",
        text: "Šiuolaikinėje odontologijoje svarbi kiekviena minutė. Pristatome Marija DI iš MB PROCDI – išmanųjį administracinį sprendimą, skirtą visiškai pašalinti tuščios kėdės išlaidas jūsų klinikoje. Brangiausias jūsų klinikos išteklius – ne medžiagos ar technologijos, o minutės, kai kėdė lieka tuščia. Laikui bėgant, neatvykimai ar pavėluoti vizitų perkėlimai tyliai naikina jūsų kasdienį pelningumą. Statistiškai neatvykimai ir pavėluoti perkėlimai sukelia iki dvidešimt penkių procentų kėdės valandų neefektyvumą, kasmet sudegindami tūkstančius eurų jūsų balanse. Tuo tarpu jūsų registratūra kovoja su administraciniu perkrovimu. Darbuotojai didžiąją dienos dalį praleidžia spręsdami rutininius klausimus ir rankiniu būdu patvirtindami vizitus. Diagnozė aiški: šešiasdešimt procentų darbuotojų laiko sunaudojama rankinėms administracinėms užduotims, atimant brangų laiką iš tiesioginio pacientų aptarnavimo. Marija DI paverčia chaosą tvarka. Nekeisdama jūsų programinės įrangos, ji veikia dvidešimt keturias valandas per parą, visiškai pasyviai – automatiškai patvirtina vizitus, užpildo atsilaisvinusias vietas ir siunčia skaitmenines sutartis pasirašymui Lietuvoje. Susigrąžinkite savo klinikos tvarkaraščio kontrolę, sumažinkite neatvykimų skaičių iki keturiasdešimt penkių procentų ir užpildykite kėdes iki devyniasdešimt penkių procentų. Susisiekite šiandien adresu antonio eta procdi taškas com nemokamai demonstracijai."
    }
};

async function generateVoiceover(name, config) {
    const outputFile = path.join(__dirname, `voiceover_${name}.mp3`);
    console.log(`\n[+] Generando voz neural para: ${config.title}`);
    console.log(`    Voz: ${config.voice}`);
    console.log(`    Archivo de salida: ${outputFile}`);

    try {
        const comm = new Communicate(config.text, { voice: config.voice });
        const fileStream = fs.createWriteStream(outputFile);

        for await (const chunk of comm.stream()) {
            if (chunk.type === "audio") {
                fileStream.write(chunk.data);
            }
        }

        fileStream.end();
        console.log(`    ¡Éxito! Guardado correctamente.`);
    } catch (err) {
        console.error(`    [!] Error al generar voz: ${err.message}`);
    }
}

async function start() {
    // Check command line arguments first
    const arg = process.argv[2]?.trim().toLowerCase();
    
    if (arg) {
        if (arg === "dns") {
            await generateVoiceover("dns", SCRIPTS.dns);
        } else if (arg === "rma") {
            await generateVoiceover("rma", SCRIPTS.rma);
        } else if (arg === "marija") {
            await generateVoiceover("marija", SCRIPTS.marija);
        } else if (arg === "marija_lt") {
            await generateVoiceover("marija_lt", SCRIPTS.marija_lt);
        } else if (arg === "all") {
            await generateVoiceover("dns", SCRIPTS.dns);
            await generateVoiceover("rma", SCRIPTS.rma);
            await generateVoiceover("marija", SCRIPTS.marija);
            await generateVoiceover("marija_lt", SCRIPTS.marija_lt);
        } else {
            console.log(`[!] Argumento desconocido: "${arg}". Intente con: dns, rma, marija, marija_lt o all.`);
        }
        return;
    }

    console.log("=".repeat(70));
    console.log("     SURE & PROCDI - GENERADOR LOCAL DE LOCUCIONES (NODE.JS)    ");
    console.log("=".repeat(70));
    console.log("Este script genera los archivos de audio MP3 comerciales exactos de 75s");
    printMenu();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('\nSelecciona una opción (1-6): ', async (choice) => {
        choice = choice.trim();
        if (choice === "1") {
            await generateVoiceover("dns", SCRIPTS.dns);
        } else if (choice === "2") {
            await generateVoiceover("rma", SCRIPTS.rma);
        } else if (choice === "3") {
            await generateVoiceover("marija", SCRIPTS.marija);
        } else if (choice === "4") {
            await generateVoiceover("marija_lt", SCRIPTS.marija_lt);
        } else if (choice === "5") {
            await generateVoiceover("dns", SCRIPTS.dns);
            await generateVoiceover("rma", SCRIPTS.rma);
            await generateVoiceover("marija", SCRIPTS.marija);
            await generateVoiceover("marija_lt", SCRIPTS.marija_lt);
        } else {
            console.log("Salida del programa.");
        }
        rl.close();
    });
}

function printMenu() {
    console.log("[1] Generar audio para SURE DNS (Español)");
    console.log("[2] Generar audio para SURE RMA (Español)");
    console.log("[3] Generar audio para Marija DI (Español)");
    console.log("[4] Generar audio para Marija DI en LITUANO (lt-LT)");
    console.log("[5] Generar TODOS los audios comerciales");
    console.log("[6] Salir");
}

start();
