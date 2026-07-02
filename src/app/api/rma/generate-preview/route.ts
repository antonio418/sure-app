import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const maxDuration = 45;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Falta la API Key de Anthropic (Claude) en el servidor.' }, { status: 500 });
    }

    const { client_name, client_type, survey_responses, language } = await req.json();

    if (!client_name || !client_type || !survey_responses) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos.' }, { status: 400 });
    }

    const targetLang = language || 'Español';
    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `Actúa como un Consultor Sénior en Gestión de Riesgos, Protección Civil y Continuidad del Negocio.
Tu tarea es generar una Propuesta Comercial Ejecutiva y Preliminar (no-spoiler) basada en las respuestas de una encuesta de diagnóstico.

El documento debe ser altamente profesional y estructurado en Markdown utilizando los siguientes módulos:

# Propuesta de Plan de Contingencia para: [Nombre del Cliente]

## 1. Diagnóstico Preliminar de Riesgos y Vulnerabilidades
*Analiza a alto nivel los riesgos y focos de vulnerabilidad basados en los datos del cliente (tipo de entidad, ubicación, amenazas seleccionadas). Describe por qué es crítico actuar.*

## 2. Listado de Entregables Personalizados a Desarrollar
*Detalla qué documentos y formatos exactos se van a generar para su caso una vez activado el plan:*
*   **Documento 0: Planilla de Requerimientos y Alcance**
*   **Documento 1: Instructivo General de Operaciones** (incluyendo anillos de seguridad perimetral para [client_type])
*   **Documento 2: Plan de Implementación y Cronograma**
*   **Documento 3: Formatos y Plantillas Rellenables** (Directorio de Coordinadores, Organigrama, Mensajes Oficiales Pre-redactados, Hojas de Inventario, Minutas y Reportes de Incidentes)
*   **Documento 4: Repositorio Seguro de Planos e Información**
*   **Documento 5: Plan Kaizen de Mejora Continua y Simulacros**
*   **Servicios Adicionales Premium**: Matriz de Análisis de Riesgos y Severidad, Directorio de Enlaces Externos, y la Guía de Primeros Auxilios Psicológicos.

## 3. Asesoría Basada en Inteligencia Artificial y Soporte
*Explica cómo el cliente tendrá acceso a la plataforma inteligente para consultar dudas operativas, adiestrar personal y simular alertas de forma interactiva.*

## 4. Asesoría en Vivo en Sitio (Opcional / Premium)
*Explica que, de ser requerido, se puede coordinar la visita presencial de consultores físicos para inspección de linderos, adiestramiento de coordinadores in-situ o dirección de simulacros en vivo. Detalla que este servicio es opcional y se cotizará de manera personalizada sujeto a la aceptación previa de las condiciones de prestación de servicios.*

## 5. Propuesta Económica y Siguientes Pasos
*Presenta las condiciones comerciales aprobadas:*
*   **Inversión de Puesta en Marcha**: $2,000 USD totales.
    *   *Anticipo de Firma*: $500 USD (Para desbloquear la carga de planos y la generación del borrador completo).
    *   *Saldo Final*: $1,500 USD (A la visualización y aprobación final del plan; desbloquea descargas de PDF e impresión e incluye 2 meses de soporte gratuito).
*   **Mantenimiento Opcional**: Contrato anual de $200 USD mensuales para acceso permanente a cambios y adiciones.

Escribe el documento ESTRICTAMENTE en el idioma: ${targetLang}. Usa un tono formal, persuasivo, técnico y corporativo.`;

    const userPrompt = `Respuestas diagnósticas del cliente:
- **Nombre**: ${client_name}
- **Tipo**: ${client_type}
- **Ubicación**: ${survey_responses.location || 'No especificada'}
- **Límites**: ${survey_responses.limits || 'No especificados'}
- **Población**: ${survey_responses.population || 'No especificada'}
- **Amenazas principales**: ${survey_responses.threats?.join(', ') || 'No especificadas'}
- **Servicios a proteger**: ${survey_responses.critical_services?.join(', ') || 'No especificados'}
- **Recursos disponibles**: ${survey_responses.resources?.join(', ') || 'No especificados'}
- **Seguridad privada**: ${survey_responses.security_private ? 'Sí' : 'No'}
- **Médicos/Sicólogos**: ${survey_responses.medical_residents ? 'Sí' : 'No'}
- **Detalles especiales**: ${survey_responses.special_details || 'Ninguno'}

Genera la propuesta preliminar en el idioma ${targetLang}.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
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

    // Guardar el estado inicial de "proposal"
    const enrichedResponses = {
      ...survey_responses,
      status: 'proposal' // Estado inicial
    };

    const { data, error: dbError } = await supabaseAdmin
      .from('contingency_plans')
      .insert({
        client_name,
        client_type,
        survey_responses: enrichedResponses,
        generated_plan_md: generatedText
      })
      .select('id')
      .single();

    if (dbError) {
      console.error("Supabase Error:", dbError);
      throw new Error(`Error de Base de Datos al guardar la propuesta: ${dbError.message}`);
    }

    return NextResponse.json({ success: true, planId: data.id, planMd: generatedText });

  } catch (error: any) {
    console.error("Error en API de Propuesta RMA:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
