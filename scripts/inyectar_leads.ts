import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
let supabaseUrl = '';
let supabaseKey = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
  if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) supabaseKey = line.split('=')[1].trim();
});

const supabase = createClient(supabaseUrl, supabaseKey);

async function injectLeads() {
  const inputPath = path.resolve('C:\\Users\\anton_mn7up\\Downloads\\IADIRECTO', 'SURE_LEADS_VULNERABLES_CONFIRMADOS.csv');
  
  if (!fs.existsSync(inputPath)) {
      console.error("No se encontró el archivo:", inputPath);
      console.log("Por favor asegúrate de haberlo guardado como CSV delimitado por comas.");
      return;
  }

  const csvContent = fs.readFileSync(inputPath, 'utf-8');
  const lines = csvContent.split('\n');
  
  // Asumimos que la primera línea es el Header: "Email","Empresa","Contacto","Origen"
  const leadsToInsert = [];
  
  // Expresión regular robusta para parsear CSV (maneja comillas y comas internas)
  const csvRegex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;

  let successCount = 0;
  let skipCount = 0;

  console.log(`Leyendo CSV con ${lines.length - 1} filas posibles...`);

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parseando línea CSV a mano (asumiendo formato "email","empresa","contacto","origen")
    const columns = line.split('","').map(col => col.replace(/^"/, '').replace(/"$/, ''));
    
    if (columns.length < 2) continue;

    const email = columns[0].trim();
    const empresa = columns[1].trim();
    const contacto = columns.length > 2 ? columns[2].trim() : '';
    
    if (!email || !email.includes('@')) {
        skipCount++;
        continue;
    }

    leadsToInsert.push({
        email: email,
        empresa: empresa,
        nombre_contacto: contacto,
        status: 'DISCOVERED'
    });
  }

  console.log(`Se prepararon ${leadsToInsert.length} prospectos válidos. Iniciando inyección masiva en Supabase...`);

  // Insertar en lotes de 100 para no ahogar la base de datos
  const BATCH_SIZE = 100;
  for (let i = 0; i < leadsToInsert.length; i += BATCH_SIZE) {
      const batch = leadsToInsert.slice(i, i + BATCH_SIZE);
      const { error } = await supabase.from('leads_campaign').upsert(batch, { onConflict: 'email', ignoreDuplicates: true });
      if (error) {
          console.error(`Error inyectando lote ${i} - ${i + BATCH_SIZE}:`, error.message);
      } else {
          successCount += batch.length;
          console.log(`Progreso: Inyectados ${successCount} prospectos...`);
      }
  }

  console.log(`\n¡INYECCIÓN EXITOSA! Se cargaron ${successCount} leads en Supabase (Tabla: leads_campaign).`);
  console.log(`Omitidos por correo inválido: ${skipCount}`);
}

injectLeads();
