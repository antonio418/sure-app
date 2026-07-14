import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const maxDuration = 120; // 120 segundos para la generación completa del plan

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Falta la API Key de Anthropic (Claude) en el servidor.' }, { status: 500 });
    }

    const { planId, language, layout_url, special_details } = await req.json();

    if (!planId) {
      return NextResponse.json({ error: 'Falta el parámetro requerido: planId.' }, { status: 400 });
    }

    // Obtener los datos del plan existentes en Supabase
    const { data: existingPlan, error: fetchError } = await supabaseAdmin
      .from('contingency_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (fetchError || !existingPlan) {
      console.error("Fetch plan error:", fetchError);
      return NextResponse.json({ error: 'No se encontró el registro del plan de contingencia.' }, { status: 404 });
    }

    const { client_name, client_type, survey_responses } = existingPlan;
    const targetLang = language || 'Español';
    
    // Guardar el plano en las respuestas de la encuesta y actualizar estado
    const updatedResponses = {
      ...survey_responses,
      layout_url: layout_url || survey_responses.layout_url || null,
      special_details: special_details || survey_responses.special_details || null,
      status: 'review' // Cambiar estado a "review" (Borrador de Revisión)
    };

    const anthropic = new Anthropic({ apiKey });

    // Armamos el prompt del sistema basado en las directrices de generalización
    let systemPrompt = `Actúa como un Consultor Sénior en Gestión de Riesgos, Protección Civil y Continuidad del Negocio. 
Tu tarea es tomar las respuestas de una encuesta de diagnóstico y generar un Plan de Contingencia (PDC) personalizado, detallado y profesional.

DIRECTRICES CRÍTICAS PARA LA REDACCIÓN:
1. PROHIBIDO acusar al cliente de carecer de recursos o dar por sentado debilidades. Está prohibido escribir "Ausencia de...", "Falta de..." o "Inexistencia de...".
2. En su lugar, debes plantearlo como una verificación preventiva utilizando la siguiente redacción exacta (traducida al idioma del documento):
   "Los siguientes elementos son cruciales para garantizar la seguridad y continuidad de operaciones. Se recomienda verificar la disponibilidad y estado de los siguientes elementos clave:"
   Luego, enumera los puntos como elementos a verificar (ej. "Verificar si se dispone de personal médico...", "Confirmar existencia de plan documentado...", "Verificar protocolos HAZMAT...", etc.).
3. Si el usuario solicita mensajes pregrabados de emergencia, debes generar las plantillas de mensajes (alerta Amarilla, Naranja y Roja) redactadas por completo en cada uno de los idiomas solicitados por el usuario.
4. PROHIBIDO inventar distancias numéricas exactas, coordenadas, metros o medidas específicas que no se hayan proporcionado en la encuesta. En vez de escribir distancias simuladas (como "50 metros"), debes usar términos generales como "en las cercanías", "colindante" o "adyacente". Inventar aseveraciones de métricas sin datos de respaldo resta seriedad y rigor al reporte.

El formato del plan debe seguir rigurosamente las siguientes secciones en Markdown, utilizando tablas extensas, diagramas Mermaid para los organigramas y notas estilo GitHub (> [!NOTE], > [!IMPORTANT], > [!WARNING]) para destacar puntos críticos:

# Plan de Contingencia Personalizado para: [Nombre del Cliente]

## 1. Información General y Alcance
*   **Nombre de la Comunidad/Entidad**: [Nombre del Cliente]
*   **Tipo de Entidad**: [Tipo de Entidad]
*   **Ubicación y Entorno**: [Ubicación detallada]
*   **Límites Físicos**: [Linderos]
*   **Población / Densidad**: [Detalles demográficos o cantidad de personal]

## 2. Identificación de Focos de Riesgo y Vulnerabilidades
*Clasifica en una tabla los riesgos específicos (naturales, antrópicos, tecnológicos o de servicios) basándote en las respuestas del cliente. Sigue estrictamente la directriz de redactar todo como recomendaciones de verificación sin asumir carencias.*

## 3. Metodología de Zonificación y Escalabilidad
*Explica cómo se dividirá el territorio/área (zonas, sectores, bloques, departamentos) para descentralizar la respuesta y comunicación.*

## 4. Estructura Organizativa y Directorio de Coordinación
*Define los roles y brigadas recomendados para este cliente. Incluye un diagrama Mermaid jerárquico que represente la cadena de mando.*
*   **Coordinador General (Comando)**: Responsabilidades.
*   **Coordinador de Seguridad**: Responsabilidades.
*   **Coordinador Médico / Salud (Involucrar primeros auxilios físicos y psicológicos)**: Responsabilidades.
*   **Coordinador de Logística y Suministros (Protección de servicios de agua, luz, gas, telecomunicaciones)**: Responsabilidades.
*   **Coordinador de Defensa Civil / Rescate (En coordinación con logística)**: Responsabilidades.
*   *Nota: Menciona que cada rol debe contar con al menos dos suplentes asignados.*

## 5. Plan de Comunicaciones Redundante (Jerárquico y Feedback)
*Ordena los canales del 1 al 6 según prioridad (WhatsApp/Telegram, SMS, llamadas, radios VHF/UHF, acústico/megáfonos, presencial) y detalla las directrices del retorno de información (feedback en 3 minutos).*

## 6. Protocolo de Niveles de Alerta (Amarilla, Naranja, Roja)
*Crea una tabla con las acciones de cada rol principal en los tres niveles de alerta.*

## 7. Fases Temporales: Antes, Durante y Después
*   **Fase 1: Antes (Prevención)**: Capacitaciones, mantenimiento y puesta a punto de equipos críticos y cronograma de simulacros anuales de eventos.
*   **Fase 2: Durante (Mitigación)**: Activación del plan (ejemplo para urbanización o industria según el caso), Anillos de Seguridad (5 anillos de control perimetral eventuales adaptados al caso de forma particular) y desconexión eventual de servicios no esenciales.
*   **Fase 3: Después (Evaluación)**: Inspección de daños, restablecimiento y mejora continua.
`;

    // Si el cliente subió un plano, instruir a la IA a incrustarlo y hacerle referencia
    if (updatedResponses.layout_url) {
      systemPrompt += `
\n## Plano de Ubicación y Distribución de Áreas
Incrusta la imagen del plano utilizando la siguiente sintaxis de Markdown en una sección dedicada:
![Plano de Distribución y Áreas de las Instalaciones](${updatedResponses.layout_url})
Debes hacer referencia directa a este plano en las secciones de zonificación y asignación de rutas de evacuación y brigadas.`;
    } else {
      systemPrompt += `
\n## Plano de Ubicación y Distribución de Áreas
*Nota: No se ha adjuntado ningún plano físico de las instalaciones. Se recomienda incorporar un plano en el visor de mantenimiento del plan.*`;
    }

    systemPrompt += `
\n## 8. Formatos y Plantillas Listos para Rellenar
*Genera las plantillas vacías en Markdown con marcadores [...] para el cliente:*
*   **Formato 3.1: Directorio de Coordinadores y Suplentes (incluyendo 2 suplentes por rol)**
*   **Formato 3.2: Plantilla de Matriz de Responsabilidades**
*   **Formato 3.3: Mensajes pre-redactados para redes sociales y alertas**
    *   *Añade una nota indicando que la redacción de campañas de comunicación profesional personalizada está disponible por un precio módico.*
*   **Formato 3.4: Hoja de Inventario de Bienes y Servicios Críticos**
*   **Formato 3.5: Formato de Informe de Evento (Post-Incidente)**
*   **Formato 3.6: Formato de Minuta de Reunión (MoM)**

## 9. Plan Kaizen (Mejora Continua)
*Define la metodología para reportar fallas en los simulacros y emergencias reales e implementarlas de forma periódica en el documento maestro.*

CRITICAL DIRECTIVE: You MUST write the entire contingency plan, all section headers, tables, notes, blockquotes, and all fillable templates (Formularios 3.1 - 3.6) strictly in the following language: ${targetLang}. Do not mix languages or default to English or Spanish unless explicitly asked.

CRITICAL CONSTRAINTS: Be concise, direct, and avoid unnecessary filler in the early sections (sections 1-7) to guarantee that all 9 sections, including all fillable templates (Formatos 3.1 - 3.6) and Section 9 (Plan Kaizen), are generated in full. Do not omit or truncate any section under any circumstances. You must output the entire plan.

Escribe con un tono formal, técnico, preventivo y corporativo. Comienza directamente con el título del plan en Markdown.`;

    const userPrompt = `Respuestas del cliente para generar el plan:
- **Nombre**: ${client_name}
- **Tipo**: ${client_type}
- **Ubicación**: ${updatedResponses.location || 'No especificada'}
- **Límites**: ${updatedResponses.limits || 'No especificados'}
- **Población**: ${updatedResponses.population || 'No especificada'}
- **Amenazas principales**: ${updatedResponses.threats?.join(', ') || 'No especificadas'}
- **Servicios a proteger**: ${updatedResponses.critical_services?.join(', ') || 'No especificados'}
- **Recursos disponibles**: ${updatedResponses.resources?.join(', ') || 'No especificados'}
- **Seguridad privada**: ${updatedResponses.security_private ? 'Sí' : 'No'}
- **Médicos/Sicólogos**: ${updatedResponses.medical_residents ? 'Sí' : 'No'}
- **Detalles especiales**: ${updatedResponses.special_details || 'Ninguno'}
- **Idiomas para mensajes pregrabados de emergencia**: ${updatedResponses.pre_recorded_languages || 'No especificados'}
${updatedResponses.layout_url ? `- **Plano de las instalaciones**: Cargado correctamente en ${updatedResponses.layout_url}` : ''}

Por favor genera el plan completo e incorpóralo en el idioma ${targetLang}.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      temperature: 0.2,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    });

    const generatedText = (response.content[0] as any).text;

    // Actualizar el plan en Supabase usando supabaseAdmin
    const { error: dbError } = await supabaseAdmin
      .from('contingency_plans')
      .update({
        survey_responses: updatedResponses,
        generated_plan_md: generatedText
      })
      .eq('id', planId);

    if (dbError) {
      console.error("Supabase update error:", dbError);
      throw new Error(`Error al actualizar el plan en Supabase: ${dbError.message}`);
    }

    return NextResponse.json({ success: true, planId, planMd: generatedText });

  } catch (error: any) {
    console.error("Error en API de Redacción de Plan Completo:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
