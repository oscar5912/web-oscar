// ✅ Archivo: src/app/api/salidas/pdf/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));

    if (!id) return new Response('ID no válido', { status: 400 });

    const despacho = await prisma.despacho.findUnique({
      where: { IdDespacho: id },
      include: { Detalles: true }
    });

    if (!despacho) return new Response('Despacho no encontrado', { status: 404 });

    const pdf = await PDFDocument.create();
    const page = pdf.addPage([800, 600]);
    const { width, height } = page.getSize();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

    let y = height - 40;

    // Título
    page.drawText('Dirección Administrativa', {
      x: width / 2 - 80,
      y,
      size: 14,
      font: bold,
    });

    // Datos generales
    page.drawText(`No. Despacho: ${despacho.IdDespacho}`, { x: 40, y: y - 25, size: 10, font });
    page.drawText(`Fecha: ${new Date(despacho.FechaRegistro).toLocaleDateString('es-GT')}`, {
      x: width - 200,
      y: y - 25,
      size: 10,
      font
    });

    // Recibe
    const boxTop = y - 50;
    page.drawText('RECIBE', { x: 50, y: boxTop - 5, font: bold, size: 10 });
    page.drawRectangle({
      x: 40, y: boxTop - 90, width: width - 80, height: 70,
      borderColor: rgb(0, 0, 0), borderWidth: 1
    });

    page.drawText(`Departamento: ${despacho.DepartamentoColaborador}`, { x: 50, y: boxTop - 30, size: 10, font });
    page.drawText(`Nombre del colaborador: ${despacho.NombreColaborador}`, { x: 50, y: boxTop - 40, size: 10, font });
    page.drawText(`Puesto: ${despacho.CargoColaborador}`, { x: 50, y: boxTop - 55, size: 10, font });

    // Título tabla
    const tablaY = boxTop - 105;
    page.drawText('DETALLE DE ARTÍCULOS', {
      x: 40,
      y: tablaY - 10,
      font: bold,
      size: 10,
    });

    // Tabla
    const headers = ['Código Artículo', 'Descripción Artículo', 'Precio', 'Cantidad', 'Subtotal'];
    const colWidths = [90, 200, 70, 70, 80];
    const startX = 40;
    let posY = tablaY - 40;

    // Dibujar encabezados
    headers.forEach((text, i) => {
      const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
      page.drawRectangle({
        x,
        y: posY,
        width: colWidths[i],
        height: 20,
        color: rgb(0.7, 0.7, 0.7),
        borderWidth: 1,
        borderColor: rgb(0, 0, 0),
      });
      page.drawText(text, {
        x: x + 3,
        y: posY + 5,
        size: 9,
        font: bold,
      });
    });

    // Dibujar filas
    let total = 0;
    despacho.Detalles.forEach((det, rowIndex) => {
      const rowY = posY - 20 - rowIndex * 20;
      const data = [
        det.CodigoProducto,
        det.NombreProducto,
        det.Precio.toFixed(2),
        det.Cantidad.toString(),
        det.SubTotal.toFixed(2)
      ];
      total += parseFloat(det.SubTotal);

      data.forEach((text, i) => {
        const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
        page.drawRectangle({
          x,
          y: rowY,
          width: colWidths[i],
          height: 20,
          borderWidth: 1,
          borderColor: rgb(0, 0, 0),
        });
        page.drawText(text, {
          x: x + 3,
          y: rowY + 5,
          size: 9,
          font,
        });
      });
    });

    // Total
    const finalY = posY - 20 - despacho.Detalles.length * 20;
    const totalX = startX + colWidths.slice(0, 4).reduce((a, b) => a + b, 0);

    page.drawRectangle({
      x: totalX,
      y: finalY,
      width: colWidths[4],
      height: 20,
      borderWidth: 1,
      borderColor: rgb(0, 0, 0),
    });

    page.drawText('TOTAL:', {
      x: totalX - 50,
      y: finalY + 5,
      font: bold,
      size: 10,
    });

    page.drawText(`Q${total.toFixed(2)}`, {
      x: totalX + 3,
      y: finalY + 5,
      font: bold,
      size: 10,
    });

    const pdfBytes = await pdf.save();

    return new Response(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="despacho.pdf"',
      },
    });
  } catch (error) {
    console.error('Error al generar PDF:', error);
    return new Response('Error interno', { status: 500 });
  }
}
