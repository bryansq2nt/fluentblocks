import { NextResponse } from 'next/server';
import { base } from '@/lib/airtable';
import { userProgressApi } from '@/lib/airtable';

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

export async function DELETE(request: Request) {
  const { email } = await request.json();
  if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
  const normalizedEmail = email.trim().toLowerCase();
  const records = await usersTable.select({ filterByFormula: `{email} = '${normalizedEmail}'` }).all();
  if (records.length > 0) {
    await usersTable.destroy(records[0].id);
    await userProgressApi.deleteUserProgress(normalizedEmail);
    return NextResponse.json({ ok: true });
  } else {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }
} 