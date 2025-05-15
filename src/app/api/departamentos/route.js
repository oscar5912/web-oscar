import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET
export async function GET() {
  try {
    const departamentos = await prisma.areaDepartamento.findMany({
      where: { Estado: true },
      orderBy: { IdArea: 'asc' },
    });
    return NextResponse.json(departamentos);
  } catch (error) {
    console.error('Error al obtener departamentos:', error);
    return new Response('Error al consultar departamentos', { status: 500 });
  }
}

// POST
export async function POST(request) {
  try {
    const data = await request.json();
    const { NombreArea } = data;

    const existe = await prisma.areaDepartamento.findFirst({
      where: { NombreArea },
    });

    if (existe) {
      return NextResponse.json({ mensaje: 'Ya existe el departamento' }, { status: 400 });
    }

    const nuevo = await prisma.areaDepartamento.create({
      data: {
        NombreArea,
        Estado: true,
      },
    });

    return NextResponse.json({ mensaje: 'Departamento guardado', departamento: nuevo });
  } catch (error) {
    console.error('Error al crear departamento:', error);
    return new Response('Error al guardar', { status: 500 });
  }
}

// PUT
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    const data = await request.json();

    const actualizado = await prisma.areaDepartamento.update({
      where: { IdArea: id },
      data,
    });

    return NextResponse.json(actualizado);
  } catch (error) {
    console.error('Error al actualizar departamento:', error);
    return new Response('Error al actualizar', { status: 500 });
  }
}

// DELETE
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));

    await prisma.areaDepartamento.delete({
      where: { IdArea: id },
    });

    return NextResponse.json({ mensaje: 'Departamento eliminado' });
  } catch (error) {
    console.error('Error al eliminar departamento:', error);
    return new Response('Error al eliminar', { status: 500 });
  }
}
