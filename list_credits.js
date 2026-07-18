require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listAllCredits() {
  console.log("Consultando base de datos de Supabase...");
  
  const { data, error } = await supabase
    .from('organization_members')
    .select(`
      email,
      role,
      organizations(name, active_plan, available_credits)
    `);

  if (error) {
    console.error("Error al obtener la lista:", error);
    return;
  }

  if (!data || data.length === 0) {
    console.log("No hay usuarios u organizaciones registradas aún.");
    return;
  }

  console.log("\n========================================================================");
  console.log("                  REPORTE DE CRÉDITOS / TOKENS POR USUARIO");
  console.log("========================================================================");
  
  const tableData = data.map((member) => {
    const org = member.organizations;
    return {
      'Correo Electrónico': member.email,
      'Rol': member.role || 'member',
      'Plan Activo': org?.active_plan || 'none',
      'Créditos Disponibles': org?.available_credits !== undefined ? org.available_credits : 0,
      'Nombre de Espacio': org?.name || 'N/A'
    };
  });

  console.table(tableData);
  console.log("========================================================================\n");
}

listAllCredits();
