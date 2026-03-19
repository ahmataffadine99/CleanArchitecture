import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const restaurants = [
    { id: 'resto-1', nom: 'Le Bon Burger Éthique', adresse: '123 Rue de la Paix', latitude: 48.8566, longitude: 2.3522, proprietaireId: 'prop-1' },
    { id: 'resto-2', nom: 'La Pizzeria Solidaire', adresse: '45 Avenue de la Liberté', latitude: 48.8584, longitude: 2.2945, proprietaireId: 'prop-2' },
    { id: 'resto-3', nom: 'Sushi Éco', adresse: '78 Boulevard Haussmann', latitude: 48.8738, longitude: 2.3312, proprietaireId: 'prop-3' }
  ];

  for (const r of restaurants) {
    await prisma.restaurant.upsert({
      where: { id: r.id },
      update: r,
      create: r,
    });
  }
  console.log('Seeding restaurants terminé !');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
