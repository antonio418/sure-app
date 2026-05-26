import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const CLINIC_PROJECT_ID = 'f588b680-816b-4bfe-99dd-18e81fbf2752';
const INFOGRAPHIC_URL = 'https://kzyujcivutwktpbdztgu.supabase.co/storage/v1/object/public/email_assets/marija_ai_comparison_lt.png';

async function embedInfographic() {
  console.log("🔍 Obteniendo leads del proyecto de clínicas...");
  
  // Obtener todos los leads del proyecto de clínicas para actualizar su contenido
  const { data: leads, error } = await supabase
    .from('leads_campaign')
    .select('id, empresa, email, email_1_content, status')
    .eq('project_id', CLINIC_PROJECT_ID);

  if (error) {
     console.error("❌ Error obteniendo leads:", error.message);
     return;
  }

  console.log(`🎯 Se encontraron ${leads.length} leads para actualizar con el infograma en lituano.`);

  let updatedCount = 0;

  for (const lead of leads) {
    const originalText = lead.email_1_content || "";
    
    // Si ya contiene la imagen, no duplicar
    if (originalText.includes('marija_ai_comparison_lt.png')) {
       console.log(`   ⏭️ Lead ${lead.email} ya tiene el infograma integrado.`);
       continue;
    }

    // Diseñar la plantilla HTML profesional que envuelve el texto original en lituano
    const htmlWrapper = `<html>
  <body style="margin: 0; padding: 20px; background-color: #f8fafc; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b;">
    <div style="max-width: 680px; margin: 0 auto;">
      <!-- Tarjeta de Contenido Principal -->
      <div style="background-color: #ffffff; border-radius: 16px; padding: 35px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); line-height: 1.7; font-size: 15px; white-space: pre-wrap; color: #334155;">${originalText}</div>
      
      <!-- Sección de Infografía Comparativa -->
      <div style="margin-top: 35px; text-align: center; background-color: #ffffff; border-radius: 16px; padding: 30px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <p style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 20px 0; text-align: left; text-transform: uppercase; letter-spacing: 0.75px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">
          📊 VIZUALUS PALYGINIMAS: „MARIJA AI“ VS TRADICINĖ REZERVACIJOS FORMA
        </p>
        <img src="${INFOGRAPHIC_URL}" alt="Marija AI palyginimas su tradicine užklausų forma" style="width: 100%; max-width: 620px; border-radius: 12px; border: 1px solid #e2e8f0; display: block; margin: 0 auto;" />
      </div>
      
      <!-- Pie de página B2B -->
      <div style="text-align: center; margin-top: 25px; padding: 0 20px;">
        <p style="color: #94a3b8; font-size: 11px; margin: 0;">Šis el. laiškas yra konfidencialus ir skirtas tik nurodytam adresatui.</p>
        <p style="color: #cbd5e1; font-size: 11px; margin: 5px 0 0 0;">&copy; ${new Date().getFullYear()} MB PROCDI. Visos teisės saugomos.</p>
      </div>
    </div>
  </body>
</html>`;

    // Actualizar en la base de datos
    const { error: updateError } = await supabase
       .from('leads_campaign')
       .update({ email_1_content: htmlWrapper })
       .eq('id', lead.id);

    if (updateError) {
       console.error(`   ❌ Error actualizando lead ${lead.email}:`, updateError.message);
    } else {
       console.log(`   ✅ Lead ${lead.email} (${lead.empresa}) actualizado con el infograma en lituano.`);
       updatedCount++;
    }
  }

  console.log(`\n🎉 PROCESO COMPLETADO. Se integró el infograma lituano en ${updatedCount} correos.`);
}

embedInfographic();
