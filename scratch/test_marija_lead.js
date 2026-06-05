import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const clinicName = 'Testinė Klinika Kaune';
  const contactPerson = 'Testas Vardas';
  const email = 'test_marija_lead@example.com';
  const phone = '+37061111111';
  const website = 'www.testklinika.lt';
  const projectId = 'f588b680-816b-4bfe-99dd-18e81fbf2752';

  console.log("1. Testing Supabase insertion...");
  const { data: lead, error: dbError } = await supabaseAdmin
    .from('leads_campaign')
    .insert([
      {
        project_id: projectId,
        empresa: clinicName,
        nombre_contacto: contactPerson,
        email: email,
        telefono: phone,
        cargo: website,
        status: 'NEW',
        resend_status: 'pending'
      }
    ])
    .select()
    .single();

  if (dbError) {
    if (dbError.code === '23505') {
      console.log("Lead already exists. Updating existing lead...");
      const { data: updated, error: updateError } = await supabaseAdmin
        .from('leads_campaign')
        .update({
          empresa: clinicName,
          nombre_contacto: contactPerson,
          telefono: phone,
          cargo: website,
          status: 'NEW',
          resend_status: 'pending'
        })
        .eq('email', email)
        .eq('project_id', projectId)
        .select()
        .single();
        
      if (updateError) {
        console.error("Error updating lead:", updateError);
        return;
      }
      console.log("Successfully updated lead in DB:", updated.id);
    } else {
      console.error("Error inserting lead into DB:", dbError);
      return;
    }
  } else {
    console.log("Successfully inserted lead in DB:", lead.id);
  }

  console.log("2. Testing Resend notification...");
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error("Missing RESEND_API_KEY");
    return;
  }
  
  try {
    const resend = new Resend(resendKey);
    const emailSubject = `Nauja Marija DI demo užklausa: ${clinicName}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0b192c; border-bottom: 2px solid #008dda; padding-bottom: 10px;">Gauta nauja demonstracinės versijos užklausa (TESTAS)</h2>
        <p style="font-size: 15px; color: #475569;">Gauti šie kontaktiniai duomenys iš Marija DI portalo:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0; width: 40%;">Klinikos pavadinimas:</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${clinicName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">Kontaktinis asmuo:</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${contactPerson}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">El. paštas:</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">Telefono numeris:</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;"><a href="tel:${phone}">${phone}</a></td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">Klinikos svetainė:</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${website}</td>
          </tr>
        </table>
      </div>
    `;

    const emailRes = await resend.emails.send({
      from: 'Marija DI Portal <antonio@procdi.com>',
      to: 'antonio@procdi.com',
      subject: emailSubject,
      html: emailHtml
    });
    
    console.log("Email sent successfully:", emailRes);
  } catch (emailErr) {
    console.error("Resend Error:", emailErr);
  }
}

run();
