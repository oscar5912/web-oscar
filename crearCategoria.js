import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const nueva = await prisma.categoria.create({
    data: {
      Descripcion: "Papelería",
      Estado: true
    }
  });
  console.log("Categoría creada:", nueva);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
