import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Buat roles: Admin dan Doctor
  const roles = await prisma.role.createMany({
    data: [{ name: "Admin" }, { name: "Doctor" }],
    skipDuplicates: true, // Hindari duplikasi jika data sudah ada
  });

  console.log(`Roles created:`, roles);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
