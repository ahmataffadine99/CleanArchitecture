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
      email: 'client@ecoeats.fr',
      motDePasseHache: passwordHashed,
      role: 'CLIENT',
      profilId: 'client-id-1'
    }
  });
  await prisma.client.create({
    data: {
      id: 'client-id-1',
      nom: 'Jean Client',
      email: 'client@ecoeats.fr',
      adresse: '10 Rue de la Paix, Paris',
      pointsFidelite: 50
    }
  });

  // 3. RESTAURATEURS & RESTAURANTS
  
  // RESTO 1 : Le Gourmet Français
  await prisma.compteUtilisateur.create({
    data: {
      id: 'resto-id-1',
      email: 'resto@ecoeats.fr',
      motDePasseHache: passwordHashed,
      role: 'RESTAURATEUR',
      profilId: 'resto-id-1'
    }
  });
  const resto1 = await prisma.restaurant.create({
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
      { id: 'p1-1', nom: 'Burger Gourmet', description: 'Bœuf charolais, comté, sauce maison.', prixCentimes: 1550, stockJournalier: 20, restaurantId: resto1.id, categorie: 'PLAT' },
      { id: 'p1-2', nom: 'Salade César', description: 'Poulet grillé, croûtons, parmesan.', prixCentimes: 1200, stockJournalier: 15, restaurantId: resto1.id, categorie: 'PLAT' },
      { id: 'p1-3', nom: 'Vin Rouge Bordeaux', description: 'Verre de 15cl.', prixCentimes: 650, stockJournalier: 50, restaurantId: resto1.id, categorie: 'BOISSON' },
      { id: 'p1-4', nom: 'Eau Minérale', description: '50cl.', prixCentimes: 250, stockJournalier: 100, restaurantId: resto1.id, categorie: 'BOISSON' }
    ]
  });

  // RESTO 2 : Bella Italia
  const resto2Id = 'resto-id-2';
  await prisma.compteUtilisateur.create({
    data: {
      id: resto2Id,
      email: 'italia@ecoeats.fr',
      motDePasseHache: passwordHashed,
      role: 'RESTAURATEUR',
      profilId: resto2Id
    }
  });
  const resto2 = await prisma.restaurant.create({
    data: {
      id: resto2Id,
      nom: 'Bella Italia',
      adresse: '12 Rue de la Roquette, Paris',
      latitude: 48.8546,
      longitude: 2.3724,
      proprietaireId: resto2Id,
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
      categories: ['ITALIEN', 'PIZZA']
    }
  });

  await prisma.platMenu.createMany({
    data: [
      { id: 'p2-1', nom: 'Pizza Margherita', description: 'Tomate, mozzarella, basilic frais.', prixCentimes: 1100, stockJournalier: 30, restaurantId: resto2.id, categorie: 'PLAT' },
      { id: 'p2-2', nom: 'Lasagnes Maison', description: 'Bœuf, sauce tomate, béchamel.', prixCentimes: 1350, stockJournalier: 10, restaurantId: resto2.id, categorie: 'PLAT' },
      { id: 'p2-3', nom: 'Limonade Italienne', description: 'Citron pressé, sucre de canne.', prixCentimes: 450, stockJournalier: 40, restaurantId: resto2.id, categorie: 'BOISSON' }
    ]
  });

  // RESTO 3 : Healthy Garden
  const resto3Id = 'resto-id-3';
  await prisma.compteUtilisateur.create({
    data: {
      id: resto3Id,
      email: 'healthy@ecoeats.fr',
      motDePasseHache: passwordHashed,
      role: 'RESTAURATEUR',
      profilId: resto3Id
    }
  });
  const resto3 = await prisma.restaurant.create({
    data: {
      id: resto3Id,
      nom: 'Healthy Garden',
      adresse: '24 Boulevard Voltaire, Paris',
      latitude: 48.8621,
      longitude: 2.3685,
      proprietaireId: resto3Id,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      categories: ['HEALTHY', 'VEGAN']
    }
  });

  await prisma.platMenu.createMany({
    data: [
      { id: 'p3-1', nom: 'Poke Bowl Saumon', description: 'Riz, saumon frais, avocat, edamame.', prixCentimes: 1450, stockJournalier: 25, restaurantId: resto3.id, categorie: 'PLAT' },
      { id: 'p3-2', nom: 'Smoothie Vert', description: 'Épinards, pomme, gingembre.', prixCentimes: 700, stockJournalier: 20, restaurantId: resto3.id, categorie: 'BOISSON' }
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
