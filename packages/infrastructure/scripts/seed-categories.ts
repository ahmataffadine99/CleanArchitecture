import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const restaurants = await prisma.restaurant.findMany();
  
  const categoriesPool = ['burger', 'pizza', 'sushi', 'healthy', 'sandwich', 'dessert', 'coffee'];

  for (const [index, resto] of restaurants.entries()) {
    const cat1 = categoriesPool[index % categoriesPool.length];
    const cat2 = categoriesPool[(index + 2) % categoriesPool.length];
    
    await prisma.restaurant.update({
      where: { id: resto.id },
      data: {
        categories: [cat1, cat2]
      }
    });
    console.log(`Updated ${resto.nom} with [${cat1}, ${cat2}]`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
