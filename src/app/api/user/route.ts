import { NextResponse } from 'next/server';
import { base } from '@/lib/airtable';

const usersTable = base('Users');

export async function POST(request: Request) {
  const { name, image, email: rawEmail } = await request.json();
  if (!rawEmail) return NextResponse.json({ error: 'Email requerido' }, { status: 400 });

  const email = rawEmail.trim().toLowerCase();

  // Busca si ya existe el usuario
  const records = await usersTable.select({ filterByFormula: `{email} = '${email}'` }).all();
  if (records.length > 0) {
    // Actualiza
    await usersTable.update(records[0].id, { name, image });
  } else {
    // Crea
    await usersTable.create({ email, name, image });
  }
  return NextResponse.json({ ok: true });
} 