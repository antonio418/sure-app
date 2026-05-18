import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('./.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string);

async function run() {
  // 1. Check if DNS Pipeline project exists
  let { data: projects } = await supabase.from('projects').select('id').eq('name', 'DNS Pipeline');
  
  let projectId;
  if (!projects || projects.length === 0) {
    // Create the project
    const { data: newProject, error } = await supabase.from('projects').insert([{
      name: 'DNS Pipeline',
      objective: 'Ofrecer nuestros servicios de análisis forense y remediación DNS a empresas con dominios vulnerables o mal configurados (DMARC/SPF failed).',
      originator: 'Alfredo / SURE System'
    }]).select('id').single();
    
    if (error) {
      console.error('Error creating project:', error);
      return;
    }
    projectId = newProject.id;
    console.log('Created new project "DNS Pipeline" with ID:', projectId);
  } else {
    projectId = projects[0].id;
    console.log('Found existing "DNS Pipeline" project with ID:', projectId);
  }

  // 2. Assign any unassigned DNS leads to this project
  // We can identify them by checking sector that includes "(DNS Fail:" or project_id is null
  const { data: leadsToUpdate, error: fetchError } = await supabase
    .from('leads_campaign')
    .select('id')
    .filter('project_id', 'is', 'null');

  if (fetchError) {
    console.error('Error fetching leads:', fetchError);
    return;
  }

  if (leadsToUpdate && leadsToUpdate.length > 0) {
    const ids = leadsToUpdate.map(l => l.id);
    const { error: updateError } = await supabase
      .from('leads_campaign')
      .update({ project_id: projectId })
      .in('id', ids);

    if (updateError) {
      console.error('Error updating leads:', updateError);
    } else {
      console.log(`Successfully assigned ${ids.length} leads to DNS Pipeline project.`);
    }
  } else {
    console.log('No unassigned leads found.');
  }
}

run();
