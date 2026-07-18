require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deleteUser(email) {
  console.log(`Buscando usuario: ${email}...`);
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error("Error listando usuarios:", listError);
    return;
  }

  const user = users.find(u => u.email === email);
  
  if (!user) {
    console.error(`Usuario ${email} no encontrado.`);
    return;
  }

  console.log(`Usuario encontrado con ID: ${user.id}. Eliminando...`);
  const { error } = await supabase.auth.admin.deleteUser(user.id);

  if (error) {
    console.error("Error al eliminar usuario:", error);
  } else {
    console.log(`Usuario ${email} eliminado exitosamente de Supabase.`);
  }
}

// Puedes cambiar el correo aquí para eliminar cualquier otro usuario de prueba
const emailToDelete = 'antonio@procdi.com';
deleteUser(emailToDelete);
