import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ message: "Faltan email o contraseña" }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ message: "Correo ya registrado" }, { status: 400 });
  }

  const hashedPassword = await hash(password, 12);
  await prisma.user.create({
    data: { email, name: name || "", hashedPassword },
  });

  return NextResponse.json({ message: "Usuario creado" }, { status: 201 });
}
