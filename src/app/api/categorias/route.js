import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Obtener todas las categorías activas
export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany({
      where: { Estado: true },
      select: {
        IdCategoria: true,
        Descripcion: true,
      },
      orderBy: { IdCategoria: 'asc' },
    });

    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return new Response('Error al consultar categorías', { status: 500 });
  }
}

// Crear nueva categoría (POST)
export async function POST(request) {
  try {
    const data = await request.json();
    const { Descripcion } = data;

    // Verificar si ya existe
    const existe = await prisma.categoria.findFirst({
      where: { Descripcion },
    });

    if (existe) {
      return NextResponse.json(
        { mensaje: 'Categoría ya existe' },
        { status: 400 }
      );
    }

    const nueva = await prisma.categoria.create({
      data: {
        Descripcion,
        Estado: true,
      },
    });

    return NextResponse.json({ mensaje: 'Categoría guardada', categoria: nueva });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    return new Response('Error al guardar categoría', { status: 500 });
  }
}

// Actualizar categoría (PUT)
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    const data = await request.json();

    const actualizada = await prisma.categoria.update({
      where: { IdCategoria: id },
      data,
    });

    return NextResponse.json(actualizada);
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    return new Response('Error al actualizar categoría', { status: 500 });
  }
}

// Eliminar categoría (DELETE)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));

    await prisma.categoria.delete({
      where: { IdCategoria: id },
    });

    return NextResponse.json({ mensaje: 'Categoría eliminada' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    return new Response('Error al eliminar categoría', { status: 500 });
  }
}