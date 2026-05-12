import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHashed = await bcrypt.hash('password123', 10);

  console.log('--- Nettoyage de la base de données ---');
  await prisma.messageTicket.deleteMany();
  await prisma.ticketSupport.deleteMany();
  await prisma.articleCommande.deleteMany();
  await prisma.facture.deleteMany();
  await prisma.commande.deleteMany();
  await prisma.platMenu.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.client.deleteMany();
  await prisma.livreur.deleteMany();
  await prisma.compteUtilisateur.deleteMany();

  console.log('--- Création des comptes ---');

  // 1. ADMIN
  await prisma.compteUtilisateur.create({
    data: {
      id: 'admin-id-1',
      email: 'admin@ecoeats.fr',
      motDePasseHache: passwordHashed,
      role: 'ADMIN',
      profilId: 'admin-id-1'
    }
  });

  // 2. CLIENT
  await prisma.compteUtilisateur.create({
    data: {
      id: 'client-id-1',
      email: 'client@gmail.com',
      motDePasseHache: passwordHashed,
      role: 'CLIENT',
      profilId: 'client-id-1'
    }
  });
  await prisma.client.create({
    data: {
      id: 'client-id-1',
      nom: 'Jean Client',
      email: 'client@gmail.com',
      adresse: '10 Rue de la Paix, Paris',
      pointsFidelite: 50
    }
  });

  // 3. RESTAURATEUR
  await prisma.compteUtilisateur.create({
    data: {
      id: 'resto-id-1',
      email: 'resto@restaurant.fr',
      motDePasseHache: passwordHashed,
      role: 'RESTAURATEUR',
      profilId: 'resto-id-1'
    }
  });
  const restaurant = await prisma.restaurant.create({
    data: {
      id: 'resto-id-1',
      nom: 'Le Gourmet Français',
      adresse: '5 Avenue des Champs-Élysées, Paris',
      latitude: 48.8698,
      longitude: 2.3075,
      proprietaireId: 'resto-id-1',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
      categories: ['FRANCAIS', 'GASTRONOMIE']
    }
  });

  await prisma.platMenu.createMany({
    data: [
      {
        id: 'plat-1',
        nom: 'Burger Gourmet',
        description: 'Bœuf charolais, comté affiné, sauce maison.',
        prixCentimes: 1550,
        stockJournalier: 20,
        restaurantId: restaurant.id,
        categorie: 'PLAT'
      },
      {
        id: 'plat-2',
        nom: 'Salade César',
        description: 'Poulet grillé, croûtons, parmesan.',
        prixCentimes: 1200,
        stockJournalier: 15,
        restaurantId: restaurant.id,
        categorie: 'PLAT'
      }
    ]
  });

  // 4. LIVREUR
  await prisma.compteUtilisateur.create({
    data: {
      id: 'livreur-id-1',
      email: 'livreur@ecoeats.fr',
      motDePasseHache: passwordHashed,
      role: 'LIVREUR',
      profilId: 'livreur-id-1'
    }
  });
  await prisma.livreur.create({
    data: {
      id: 'livreur-id-1',
      nom: 'Marc Rapide',
      telephone: '0601020304',
      latitude: 48.8566,
      longitude: 2.3522,
      statut: 'DISPONIBLE',
      estExpert: true
    }
  });

  console.log('--- Seed terminé avec succès ! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
