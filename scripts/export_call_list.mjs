import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan variables de entorno de Supabase.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Extrayendo lista de contactos (Versión Completa) desde Supabase...");
  
  const { data: leads, error } = await supabase
    .from('leads_campaign')
    .select('empresa, nombre_oficial_empresa, nombre_contacto, email, telefono, pais, sector, nota_empresa, nota_contacto, status')
    .neq('status', 'NEW')
    .neq('status', 'lead_nuevo');
    
  if (error) {
     console.error("Error al obtener leads:", error);
     return;
  }
  
  if (!leads || leads.length === 0) {
      console.log("No se encontraron leads procesados.");
      return;
  }
  
  let csvContent = "Empresa,Nombre Oficial,Contacto,Email,Telefono,Pais,Sector,Nota Empresa,Nota Contacto,Status\n";
  
  for (const lead of leads) {
      const empresa = `"${(lead.empresa || '').replace(/"/g, '""')}"`;
      const nombre_oficial = `"${(lead.nombre_oficial_empresa || '').replace(/"/g, '""')}"`;
      const contacto = `"${(lead.nombre_contacto || '').replace(/"/g, '""')}"`;
      const email = `"${(lead.email || '').replace(/"/g, '""')}"`;
      const telefono = `"${(lead.telefono || 'No registrado').replace(/"/g, '""')}"`;
      const pais = `"${(lead.pais || '').replace(/"/g, '""')}"`;
      const sector = `"${(lead.sector || '').replace(/"/g, '""')}"`;
      const nota_empresa = `"${(lead.nota_empresa || '').replace(/"/g, '""')}"`;
      const nota_contacto = `"${(lead.nota_contacto || '').replace(/"/g, '""')}"`;
      const status = `"${(lead.status || '').replace(/"/g, '""')}"`;
      
      csvContent += `${empresa},${nombre_oficial},${contacto},${email},${telefono},${pais},${sector},${nota_empresa},${nota_contacto},${status}\n`;
  }
  
  const outputPath = path.join(__dirname, '..', 'lista_llamadas_completa.csv');
  fs.writeFileSync(outputPath, csvContent);
  
  console.log(`¡Éxito! Se ha guardado la lista con ${leads.length} contactos en el archivo: lista_llamadas_completa.csv`);
}

main();
