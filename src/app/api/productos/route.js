import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Obtener todos los productos activos
export async function GET() {
  try {
    const productos = await prisma.producto.findMany({
      where: { Estado: true },
      include: { Categoria: true }, // 👈 Incluye descripción de categoría
      orderBy: { IdProducto: 'asc' }
    });
    return NextResponse.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return new Response('Error al consultar productos', { status: 500 });
  }
}

// Crear nuevo producto
export async function POST(request) {
  try {
    const data = await request.json();
    const { Codigo } = data;

    // Verificar si ya existe un producto con el mismo Código
    const existe = await prisma.producto.findFirst({
  where: {
    Codigo,
    Estado: true, // Solo verificar si está activo
  },
});

    if (existe) {
      return NextResponse.json(
        { mensaje: 'Ya existe un producto con ese código' },
        { status: 400 }
      );
    }

    const nuevo = await prisma.producto.create({
      data: {
        ...data,
        Estado: true, // 👈 Asegura que aparezca en el listado
      },
    });

    return NextResponse.json({ mensaje: 'Producto creado', producto: nuevo });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return new Response('Error al guardar producto', { status: 500 });
  }
}

// Editar producto existente
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    const data = await request.json();

    const actualizado = await prisma.producto.update({
      where: { IdProducto: id },
      data,
    });

    return NextResponse.json(actualizado);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return new Response('Error al actualizar producto', { status: 500 });
  }
}

// Eliminar producto (borrado lógico)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));

    await prisma.producto.update({
      where: { IdProducto: id },
      data: { Estado: false },
    });

    return NextResponse.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return new Response('Error al eliminar producto', { status: 500 });
  }
}
