import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { fileName } = await req.json();

    if (!fileName) {
      return NextResponse.json({ error: 'Falta el nombre del archivo (fileName).' }, { status: 400 });
    }

    // Nombre seguro + único para evitar colisiones entre subidas
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `uploads/${randomUUID()}-${safeName}`;

    // Reutilizamos el mismo bucket que ya usa api/analyze ("temp_dossiers")
    const { data, error } = await supabaseAdmin.storage
      .from('temp_dossiers')
      .createSignedUploadUrl(path);

    if (error || !data) {
      console.error('[GetUploadUrl] Error creating signed URL:', error);
      return NextResponse.json(
        { error: error?.message || 'No se pudo generar la URL de subida.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
    });
  } catch (error: any) {
    console.error('[GetUploadUrl] Error:', error);
    return NextResponse.json({ error: error.message || 'Error interno.' }, { status: 500 });
  }
}