import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan variables de entorno de Supabase.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Obteniendo leads que ya recibieron el primer correo...");
  const { data: leads, error } = await supabase
    .from('leads_campaign')
    .select('id, nombre_contacto, email_1_subject')
    .eq('status', 'email_1_enviado');
    
  if (error) {
     console.error("Error al obtener leads:", error);
     return;
  }
  
  if (!leads || leads.length === 0) {
      console.log("No se encontraron leads con status 'email_1_enviado'.");
      return;
  }
  
  console.log(`Encontrados ${leads.length} leads. Actualizando los borradores de seguimiento (Correo 2)...`);
  
  for (const lead of leads) {
    const contactName = lead.nombre_contacto && lead.nombre_contacto.trim() !== '' ? lead.nombre_contacto : 'Team';
    const originalSubject = lead.email_1_subject || 'Request for Quotation (RFQ) - Germanium Materials';
    
    // Asegurar que tenga el RE:
    let newSubject = originalSubject;
    if (!newSubject.toUpperCase().startsWith('RE:')) {
      newSubject = 'RE: ' + newSubject;
    }
    
    const newBody = `Dear ${contactName},

I am following up on the email I sent earlier this week regarding the procurement of Germanium.

We are currently evaluating suppliers and would like to understand your current available volume and pricing structures.

Do you have 5 minutes this week for a brief introductory call? Alternatively, if there is a more appropriate person to handle this request, please let me know.

Thank you for your time.

Best regards,

Antonio - Procurement Team | PROCDI`;

    const { error: updateError } = await supabase
      .from('leads_campaign')
      .update({
         email_2_subject: newSubject,
         email_2_content: newBody
      })
      .eq('id', lead.id);
      
    if (updateError) {
      console.error(`Fallo al actualizar lead ${lead.id}:`, updateError.message);
    } else {
      console.log(`Lead ${lead.id} actualizado correctamente con el nuevo modelo.`);
    }
  }
  
  console.log("¡Proceso completado exitosamente!");
}

main();
