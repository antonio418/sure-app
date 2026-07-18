require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function manageCredits(email, action, value = 0, plan = 'tactico') {
  console.log(`Buscando organización para el usuario: ${email}...`);
  
  // 1. Comprobar si el usuario pertenece a una organización
  const { data: memberRecord, error: memberError } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('email', email)
    .maybeSingle();

  if (memberError) {
    console.error("Error buscando miembro:", memberError);
    return;
  }

  let orgId = memberRecord?.organization_id;

  if (!orgId) {
    console.log(`El usuario no tiene una organización asignada. Creando una nueva organización...`);
    
    // Crear nueva organización
    const { data: newOrg, error: createOrgError } = await supabase
      .from('organizations')
      .insert({
        name: `Corporate Workspace - ${email}`,
        active_plan: plan,
        available_credits: action === 'set' ? value : (action === 'add' ? value : 0)
      })
      .select('id')
      .single();

    if (createOrgError) {
      console.error("Error creando organización:", createOrgError);
      return;
    }

    orgId = newOrg.id;

    // Asignar al usuario a la organización
    const { error: memberInsertError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: orgId,
        email: email,
        role: 'admin'
      });

    if (memberInsertError) {
      console.error("Error asignando miembro:", memberInsertError);
      return;
    }

    console.log(`Organización y relación creadas con éxito. Saldo inicial establecido.`);
  } else {
    // 2. Si ya pertenece a una organización, actualizar
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('available_credits, active_plan')
      .eq('id', orgId)
      .single();

    if (orgError) {
      console.error("Error obteniendo organización:", orgError);
      return;
    }

    let newCredits = org.available_credits;
    if (action === 'set') {
      newCredits = value;
    } else if (action === 'add') {
      newCredits = org.available_credits + value;
    } else if (action === 'remove' || action === 'delete') {
      newCredits = Math.max(0, org.available_credits - value);
    }

    console.log(`Saldo actual de la organización: ${org.available_credits} créditos (Plan: ${org.active_plan})`);
    console.log(`Actualizando a: ${newCredits} créditos (Plan: ${plan})...`);

    const { error: updateError } = await supabase
      .from('organizations')
      .update({
        active_plan: plan,
        available_credits: newCredits,
        updated_at: new Date().toISOString()
      })
      .eq('id', orgId);

    if (updateError) {
      console.error("Error actualizando créditos:", updateError);
      return;
    }

    console.log(`Créditos actualizados exitosamente para ${email}.`);
  }

  // Mostrar resultado final
  const { data: finalData } = await supabase
    .from('organization_members')
    .select('organizations(active_plan, available_credits)')
    .eq('email', email)
    .single();
  
  const finalOrg = finalData?.organizations;
  console.log(`=========================================`);
  console.log(`Estado final para ${email}:`);
  console.log(`  - Plan activo: ${finalOrg?.active_plan}`);
  console.log(`  - Créditos disponibles: ${finalOrg?.available_credits}`);
  console.log(`=========================================`);
}

// ================= Configuración de la acción =================
let EMAIL = 'antonio.baronas@gmail.com';
let ACTION = 'set';
let VALUE = 5;
let PLAN = 'tactico';

// Parse command line arguments: node manage_credits.js <email> <set|add|remove> <valor> [plan]
if (process.argv.length >= 5) {
  EMAIL = process.argv[2];
  ACTION = process.argv[3].toLowerCase();
  VALUE = parseInt(process.argv[4], 10);
  if (isNaN(VALUE)) {
    console.error("Error: El valor de créditos debe ser un número entero.");
    process.exit(1);
  }
  if (process.argv[5]) {
    PLAN = process.argv[5];
  }
} else if (process.argv.length > 2) {
  console.log("Uso: node manage_credits.js <email> <set|add|remove> <valor> [plan]");
  console.log("Ejemplo: node manage_credits.js antonio.baronas@gmail.com add 10 tactico");
  process.exit(0);
}

manageCredits(EMAIL, ACTION, VALUE, PLAN);
