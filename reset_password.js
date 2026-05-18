require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function resetPassword() {
  console.log("Buscando usuario...");
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error("Error listando usuarios:", listError);
    return;
  }

  const user = users.find(u => u.email === 'antonio@procdi.com');
  
  if (!user) {
    console.error("Usuario antonio@procdi.com no encontrado. Creándolo...");
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: 'antonio@procdi.com',
      password: 'admin',
      email_confirm: true
    });
    if (createError) console.error("Error creando:", createError);
    else console.log("Usuario creado con contraseña 'admin'");
    return;
  }

  console.log("Usuario encontrado, actualizando contraseña...");
  const { error } = await supabase.auth.admin.updateUserById(
    user.id,
    { password: 'admin123' }
  );

  if (error) {
    console.error("Error actualizando:", error);
  } else {
    console.log("Contraseña actualizada exitosamente a: admin");
  }
}

resetPassword();
