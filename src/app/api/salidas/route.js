import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  try {
    const despachos = await prisma.despacho.findMany({
      orderBy: { IdDespacho: 'desc' },
      include: {
        Detalles: true
      }
    });

    return NextResponse.json(despachos);
  } catch (error) {
    console.error('Error al obtener despachos:', error);
    return new Response(JSON.stringify({ mensaje: 'Error al consultar despachos' }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      IdUsuario,
      NumeroBoleta,
      DocumentoColaborador,
      NombreColaborador,
      DepartamentoColaborador,
      CargoColaborador,
      Productos
    } = data;

    const MontoTotal = Productos.reduce((sum, p) => sum + (p.Precio * p.Cantidad), 0);

    const despacho = await prisma.despacho.create({
      data: {
        IdUsuario,
        NumeroBoleta,
        DocumentoColaborador,
        NombreColaborador,
        DepartamentoColaborador,
        CargoColaborador,
        MontoTotal,
        Detalles: {
          create: Productos.map(p => ({
            IdProducto: p.IdProducto,
            CodigoProducto: p.CodigoProducto,
            NombreProducto: p.NombreProducto,
            Precio: p.Precio,
            Cantidad: p.Cantidad,
            SubTotal: p.Precio * p.Cantidad,
          }))
        }
      }
    });

    for (const p of Productos) {
      await prisma.producto.update({
        where: { IdProducto: p.IdProducto },
        data: { Stock: { decrement: p.Cantidad } }
      });
    }

    return NextResponse.json({ mensaje: 'Salida registrada correctamente', despacho });
  } catch (error) {
    console.error('Error al registrar salida:', error);
    return new Response(JSON.stringify({ mensaje: 'Error al registrar salida' }), { status: 500 });
  }
}
