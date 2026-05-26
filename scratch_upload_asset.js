import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function upload() {
  // Intentar crear un bucket público llamado 'email_assets'
  console.log("Creando bucket público 'email_assets'...");
  const { data: createData, error: createError } = await supabase.storage.createBucket('email_assets', {
    public: true
  });
  
  if (createError) {
     console.log("Bucket 'email_assets' ya existe o no se pudo crear:", createError.message);
  } else {
     console.log("Bucket público 'email_assets' creado con éxito:", createData);
  }

  // Localizar el archivo de la imagen generada en lituano
  const imagePath = 'C:/Users/anton_mn7up/.gemini/antigravity/brain/19e14534-95eb-48b9-a934-63e682162501/marija_ai_lt_chart_1779781627364.png';
  if (!fs.existsSync(imagePath)) {
     console.error("El archivo no existe en la ruta especificada.");
     return;
  }
  
  const fileBody = fs.readFileSync(imagePath);
  const uploadPath = 'marija_ai_comparison_lt.png';
  
  const { data, error } = await supabase.storage
    .from('email_assets')
    .upload(uploadPath, fileBody, {
       contentType: 'image/png',
       upsert: true
    });
    
  if (error) {
     console.error("Error al subir archivo a 'email_assets':", error.message);
     return;
  }
  
  console.log("Archivo subido con éxito a 'email_assets':", data);
  
  // Obtener URL pública
  const { data: urlData } = supabase.storage.from('email_assets').getPublicUrl(uploadPath);
  console.log("URL Pública de alta disponibilidad (CDN):", urlData.publicUrl);
}

upload();
