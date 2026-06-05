import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clinicName, contactPerson, email, phone, website } = body;

    // Validate required fields
    if (!clinicName || !contactPerson || !email || !phone) {
      return NextResponse.json(
        { error: 'Užpildykite visus privalomus laukus (Klinikos pavadinimas, kontaktinis asmuo, el. paštas ir telefonas).' },
        { status: 400 }
      );
    }

    const projectId = 'f588b680-816b-4bfe-99dd-18e81fbf2752'; // 'Clinicas od. Kauna' project

    // 1. Insert lead into Supabase leads_campaign
    const { data: lead, error: dbError } = await supabaseAdmin
      .from('leads_campaign')
      .insert([
        {
          project_id: projectId,
          empresa: clinicName,
          nombre_contacto: contactPerson,
          email: email,
          telefono: phone,
          cargo: website || 'Nėra svetainės', // repurporsing position field for website
          status: 'NEW',
          resend_status: 'pending'
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Database insertion error:', dbError);
      // If it's a duplicate email conflict, we can still send the email and update the status or return success
      if (dbError.code === '23505') {
        // Unique violation, let's update it to NEW
        const { error: updateError } = await supabaseAdmin
          .from('leads_campaign')
          .update({
            empresa: clinicName,
            nombre_contacto: contactPerson,
            telefono: phone,
            cargo: website || 'Nėra svetainės',
            status: 'NEW',
            resend_status: 'pending'
          })
          .eq('email', email)
          .eq('project_id', projectId);
          
        if (updateError) {
          throw updateError;
        }
      } else {
        throw dbError;
      }
    }

    // 2. Send email notification to antonio@procdi.com
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        const emailSubject = `Nauja Marija DI demo užklausa: ${clinicName}`;
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #0b192c; border-bottom: 2px solid #008dda; padding-bottom: 10px;">Gauta nauja demonstracinės versijos užklausa</h2>
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
                <td style="padding: 10px; border: 1px solid #e2e8f0;">
                  ${website ? `<a href="${website.startsWith('http') ? website : `https://${website}`}" target="_blank">${website}</a>` : 'Nenurodyta'}
                </td>
              </tr>
            </table>
            
            <div style="margin-top: 30px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px;">
              Šis pranešimas buvo išsiųstas automatiškai iš Marija DI demo registracijos sistemos.
            </div>
          </div>
        `;

        await resend.emails.send({
          from: 'Marija DI Portal <antonio@procdi.com>',
          to: 'antonio@procdi.com',
          subject: emailSubject,
          html: emailHtml
        });
        
        console.log(`Email notification sent to antonio@procdi.com for clinic: ${clinicName}`);
      } catch (emailErr) {
        console.error('Resend notification email error:', emailErr);
      }
    } else {
      console.warn('RESEND_API_KEY is not defined, skipping email notification.');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error handling Marija lead submission:', error);
    return NextResponse.json(
      { error: error.message || 'Įvyko vidinė klaida apdorojant užklausą.' },
      { status: 500 }
    );
  }
}
