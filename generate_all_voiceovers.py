import os
import sys
import subprocess
import asyncio

# Ensure edge-tts is installed
try:
    import edge_tts
except ImportError:
    print("Instalando la librería de voz neural de alta calidad de Microsoft (edge-tts)...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "edge-tts"])
    import edge_tts

# Guiones oficiales de 75 segundos optimizados
SCRIPTS = {
    "dns": {
        "title": "SURE DNS - Seguridad de Correo B2B (Español)",
        "voice": "es-MX-JorgeNeural",
        "text": """Ocurre en milisegundos. El correo electrónico corporativo es el canal donde se ejecuta hoy el noventa por ciento de las estafas y desvíos financieros B2B globales. Pero el colapso real es legal. Si su dominio carece de seguridad DNS estándar y sufre una suplantación de identidad, la jurisprudencia responsabiliza civilmente a su empresa. El banco queda liberado. Los firewalls tradicionales no cubren la suplantación de dominio exterior. DMARC ausente es una falla de arquitectura a nivel industria que expone directamente su capital en cada transacción. Frente a este vacío fiduciario, el motor de inteligencia de SURE actúa de inmediato. Roberto mapea la procedencia de servidores externos, mientras Moisés valida los metadatos de sus contratos de pago. El fraude rara vez inicia en sus servidores; inicia en los de sus proveedores bulk. SURE audita pasivamente todo su canal transaccional externo para bloquear desvíos bancarios. Ciberdefensa fiduciaria a costo de fricción cero. Solo setenta dólares de pago único por dominio. Solicite hoy mismo una auditoría de vulnerabilidad DNS externa sin costo en alfredo arroba sureforensic punto com. SURE."""
    },
    "rma": {
        "title": "SURE RMA - Mitigación de Riesgo en Commodities (Español)",
        "voice": "es-MX-JorgeNeural",
        "text": """En la compra de commodities bulk, las pérdidas no ocurren en el mar; ocurren en su escritorio. Inconsistencias documentales imperceptibles drenan silenciosamente el cinco por ciento de su valor transaccional. La inspección tradicional llega demasiado tarde. Valida la cantidad física en el puerto, pero ignora firmas manipuladas, inconsistencias de contratos y patrones de fraude antes de la carga. SURE RMA reescribe las reglas. A través del blindaje Quad-Shield, evaluamos instantáneamente el cumplimiento legal de Roberto, la validez contractual de Moisés, y los parámetros físicos de Alcides. Sin instalaciones de software. Un Reporte Transaccional de Riesgo en solo siete minutos, por exactamente cincuenta dólares la transacción. Su equipo solo envía el documento por e-mail. Si ocurre una pérdida fiduciaria millonaria por firmas falsas que un análisis autónomo de cincuenta dólares pudo detectar en minutos, la junta directiva asume negligencia personal. Pruébenos sin riesgo. Envíenos un negocio fallido o muerto del año dos mil veintiséis y haremos una auditoría forense ciega y gratuita para mostrarle exactamente dónde estuvo el fraude. SURE RMA. Contacto en alfredo arroba sureforensic punto com."""
    },
    "marija": {
        "title": "Marija DI - Automatización Dental Lituania (Español)",
        "voice": "es-ES-AlvaroNeural",
        "text": """En la odontología moderna, cada minuto cuenta. Presentamos Marija DI de MB PROCDI: el motor de automatización inteligente diseñado específicamente para eliminar de raíz el costo de la silla vacía en su clínica. El recurso más costoso de su consultorio no son los materiales ni la tecnología; son los minutos con el sillón vacío. Mientras el reloj avanza, las citas canceladas o no-show drenan silenciosamente su rentabilidad diaria. Estadísticamente, el ausentismo y las reprogramaciones tardías provocan hasta un veinticinco por ciento de ineficiencia en las horas del consultorio, evaporando miles de euros en utilidades al final de su balance anual. Mientras tanto, su recepción lucha contra el colapso administrativo. El personal pasa la mayor parte del día resolviendo urgencias manuales y llamadas perdidas. El diagnóstico es claro: el sesenta por ciento del tiempo del personal se consume en tareas administrativas manuales, restándole tiempo valioso a la atención presencial del paciente. Marija DI transforma el caos en orden. Sin cambiar de software, opera veinticuatro siete de forma cien por ciento pasiva, confirmando agendas, reprogramando espacios vacíos y enviando contratos digitales de adhesión legal en Lituania. Recupere el control de su agenda médica, reduzca el ausentismo hasta en un cuarenta y cinco por ciento y maximice la facturación. Únase a las clínicas líderes en Lituania. Contáctenos hoy en antonio arroba procdi punto com para una prueba sin costo."""
    },
    "marija_lt": {
        "title": "Marija DI - Dantų Klinikos Automatizavimas (Lietuvių)",
        "voice": "lt-LT-OnaNeural", # Voz femenina lituana sumamente natural y profesional (Ona)
        "text": """Šiuolaikinėje odontologijoje svarbi kiekviena minutė. Pristatome Marija DI iš MB PROCDI – išmanųjį administracinį sprendimą, skirtą visiškai pašalinti tuščios kėdės išlaidas jūsų klinikoje. Brangiausias jūsų klinikos išteklius – ne medžiagos ar technologijos, o minutės, kai kėdė lieka tuščia. Laikui bėgant, neatvykimai ar pavėluoti vizitų perkėlimai tyliai naikina jūsų kasdienį pelningumą. Statistiškai neatvykimai ir pavėluoti perkėlimai sukelia iki dvidešimt penkių procentų kėdės valandų neefektyvumą, kasmet sudegindami tūkstančius eurų jūsų balanse. Tuo tarpu jūsų registratūra kovoja su administraciniu perkrovimu. Darbuotojai didžiąją dienos dalį praleidžia spręsdami rutininius klausimus ir rankiniu būdu patvirtindami vizitus. Diagnozė aiški: šešiasdešimt procentų darbuotojų laiko sunaudojama rankinėms administracinėms užduotims, atimant brangų laiką iš tiesioginio pacientų aptarnavimo. Marija DI paverčia chaosą tvarka. Nekeisdama jūsų programinės įrangos, ji veikia dvidešimt keturias valandas per parą, visiškai pasyviai – automatiškai patvirtina vizitus, užpildo atsilaisvinusias vietas ir siunčia skaitmenines sutartis pasirašymui Lietuvoje. Susigrąžinkite savo klinikos tvarkaraščio kontrolę, sumažinkite neatvykimų skaičių iki keturiasdešimt penkių procentų ir užpildykite kėdes iki devyniasdešimt penkių procentų. Susisiekite šiandien adresu antonio eta procdi taškas com nemokamai demonstracijai."""
    }
}

async def generate_voiceover(name: str, config: dict):
    output_file = f"voiceover_{name}.mp3"
    print(f"\n[+] Generando voz neural para: {config['title']}")
    print(f"    Voz: {config['voice']}")
    print(f"    Archivo de salida: {output_file}")
    
    communicate = edge_tts.Communicate(config["text"], config["voice"])
    await communicate.save(output_file)
    print(f"    ¡Éxito! Guardado en: {os.path.abspath(output_file)}")

async def main():
    print("=" * 70)
    print("     SURE & PROCDI - GENERADOR LOCAL DE LOCUCIONES NEURALES MULTILINGÜE    ")
    print("=" * 70)
    print("Este script genera los archivos de audio MP3 comerciales exactos de 75s")
    print("usando voces neuronales de alta fidelidad de Microsoft.\n")
    print("[1] Generar audio para SURE DNS (Español)")
    print("[2] Generar audio para SURE RMA (Español)")
    print("[3] Generar audio para Marija DI (Español)")
    print("[4] Generar audio para Marija DI en LITUANO (lt-LT)")
    print("[5] Generar TODOS los audios comerciales (DNS, RMA, Marija ES y Marija LT)")
    print("[6] Salir")
    
    choice = input("\nSelecciona una opción (1-6): ").strip()
    
    if choice == "1":
        await generate_voiceover("dns", SCRIPTS["dns"])
    elif choice == "2":
        await generate_voiceover("rma", SCRIPTS["rma"])
    elif choice == "3":
        await generate_voiceover("marija", SCRIPTS["marija"])
    elif choice == "4":
        await generate_voiceover("marija_lt", SCRIPTS["marija_lt"])
    elif choice == "5":
        await generate_voiceover("dns", SCRIPTS["dns"])
        await generate_voiceover("rma", SCRIPTS["rma"])
        await generate_voiceover("marija", SCRIPTS["marija"])
        await generate_voiceover("marija_lt", SCRIPTS["marija_lt"])
    else:
        print("Salida del programa.")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
