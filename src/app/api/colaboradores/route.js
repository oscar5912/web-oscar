// src/app/api/colaboradores/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET: Obtener colaboradores activos
export async function GET() {
  try {
    const colaboradores = await prisma.colaborador.findMany({
      where: { Estado: true },
      orderBy: { IdColaborador: 'asc' },
      include: {
        Area: true, // Accederás a colaborador.Area.NombreArea
      },
    });
    return NextResponse.json(colaboradores);
  } catch (error) {
    console.error('Error al obtener colaboradores:', error);
    return new Response('Error al consultar colaboradores', { status: 500 });
  }
}

// POST: Registrar colaborador
export async function POST(request) {
  try {
    const data = await request.json();
    const { Documento, NombreCompleto, Correo, Telefono, Cargo, IdArea } = data;

    const existe = await prisma.colaborador.findFirst({ where: { Documento } });
    if (existe) {
      return NextResponse.json({ mensaje: 'Colaborador ya registrado' }, { status: 400 });
    }

    const nuevo = await prisma.colaborador.create({
      data: {
        Documento,
        NombreCompleto,
        Correo,
        Telefono,
        Cargo,
        IdArea,
        Estado: true,
      },
    });

    return NextResponse.json({ mensaje: 'Colaborador guardado', colaborador: nuevo });
  } catch (error) {
    console.error('Error al guardar colaborador:', error);
    return new Response('Error al guardar colaborador', { status: 500 });
  }
}
