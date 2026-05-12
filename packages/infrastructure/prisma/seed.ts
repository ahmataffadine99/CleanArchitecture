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
    data: { id: 'admin-id-1', email: 'admin@ecoeats.fr', motDePasseHache: passwordHashed, role: 'ADMIN', profilId: 'admin-id-1' }
  });

  // 2. CLIENT
  await prisma.compteUtilisateur.create({
    data: { id: 'client-id-1', email: 'client@ecoeats.fr', motDePasseHache: passwordHashed, role: 'CLIENT', profilId: 'client-id-1' }
  });
  await prisma.client.create({
    data: { id: 'client-id-1', nom: 'Jean Client', email: 'client@ecoeats.fr', adresse: '10 Rue de la Paix, 75002', pointsFidelite: 50 }
  });

  // 3. RESTAURATEURS & RESTAURANTS
  
  // RESTO 1 : Le Gourmet Français
  const resto1Id = 'resto-id-1';
  await prisma.compteUtilisateur.create({
    data: { id: resto1Id, email: 'resto@ecoeats.fr', motDePasseHache: passwordHashed, role: 'RESTAURATEUR', profilId: resto1Id }
  });
  const resto1 = await prisma.restaurant.create({
    data: {
      id: resto1Id,
      nom: 'Le Gourmet Français',
      adresse: '5 Avenue des Champs-Élysées, 75008',
      latitude: 48.8698,
      longitude: 2.3075,
      proprietaireId: resto1Id,
      imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop',
      categories: ['burger', 'français']
    }
  });

  await prisma.platMenu.createMany({
    data: [
      { id: 'p1-1', nom: 'Burger Gourmet', description: 'Bœuf charolais, comté, sauce maison.', prixCentimes: 1550, stockJournalier: 20, restaurantId: resto1.id, categorie: 'PLAT', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
      { id: 'p1-2', nom: 'Salade César', description: 'Poulet grillé, croûtons, parmesan.', prixCentimes: 1200, stockJournalier: 15, restaurantId: resto1.id, categorie: 'PLAT', imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400' },
      { id: 'p1-3', nom: 'Vin Rouge Bordeaux', description: 'Verre de 15cl.', prixCentimes: 650, stockJournalier: 50, restaurantId: resto1.id, categorie: 'BOISSON', imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400' },
      { id: 'p1-4', nom: 'Eau Minérale', description: '50cl.', prixCentimes: 250, stockJournalier: 100, restaurantId: resto1.id, categorie: 'BOISSON', imageUrl: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?w=400' }
    ]
  });

  // RESTO 2 : Bella Italia
  const resto2Id = 'resto-id-2';
  await prisma.compteUtilisateur.create({
    data: { id: resto2Id, email: 'italia@ecoeats.fr', motDePasseHache: passwordHashed, role: 'RESTAURATEUR', profilId: resto2Id }
  });
  const resto2 = await prisma.restaurant.create({
    data: {
      id: resto2Id,
      nom: 'Bella Italia',
      adresse: '12 Rue de la Roquette, 75015',
      latitude: 48.8546,
      longitude: 2.3724,
      proprietaireId: resto2Id,
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop',
      categories: ['pizza', 'italien']
    }
  });

  await prisma.platMenu.createMany({
    data: [
      { id: 'p2-1', nom: 'Pizza Margherita', description: 'Tomate, mozzarella, basilic frais.', prixCentimes: 1100, stockJournalier: 30, restaurantId: resto2.id, categorie: 'PLAT', imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?w=400' },
      { id: 'p2-2', nom: 'Lasagnes Maison', description: 'Bœuf, sauce tomate, béchamel.', prixCentimes: 1350, stockJournalier: 10, restaurantId: resto2.id, categorie: 'PLAT', imageUrl: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400' },
      { id: 'p2-3', nom: 'Limonade Italienne', description: 'Citron pressé, sucre de canne.', prixCentimes: 450, stockJournalier: 40, restaurantId: resto2.id, categorie: 'BOISSON', imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400' }
    ]
  });

  // RESTO 3 : Healthy Garden
  const resto3Id = 'resto-id-3';
  await prisma.compteUtilisateur.create({
    data: { id: resto3Id, email: 'healthy@ecoeats.fr', motDePasseHache: passwordHashed, role: 'RESTAURATEUR', profilId: resto3Id }
  });
  const resto3 = await prisma.restaurant.create({
    data: {
      id: resto3Id,
      nom: 'Healthy Garden',
      adresse: '24 Boulevard Voltaire, 75012',
      latitude: 48.8621,
      longitude: 2.3685,
      proprietaireId: resto3Id,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop',
      categories: ['healthy', 'vegan']
    }
  });

  await prisma.platMenu.createMany({
    data: [
      { id: 'p3-1', nom: 'Poke Bowl Saumon', description: 'Riz, saumon frais, avocat, edamame.', prixCentimes: 1450, stockJournalier: 25, restaurantId: resto3.id, categorie: 'PLAT', imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' },
      { id: 'p3-2', nom: 'Smoothie Vert', description: 'Épinards, pomme, gingembre.', prixCentimes: 700, stockJournalier: 20, restaurantId: resto3.id, categorie: 'BOISSON', imageUrl: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400' },
      { id: 'p3-3', nom: 'Coca-Cola', description: '33cl glacé.', prixCentimes: 350, stockJournalier: 100, restaurantId: resto3.id, categorie: 'BOISSON', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400' }
    ]
  });

  // 4. LIVREUR
  await prisma.compteUtilisateur.create({
    data: { id: 'livreur-id-1', email: 'livreur@ecoeats.fr', motDePasseHache: passwordHashed, role: 'LIVREUR', profilId: 'livreur-id-1' }
  });
  await prisma.livreur.create({
    data: {
      id: 'livreur-id-1', nom: 'Marc Rapide', telephone: '0601020304', latitude: 48.8566, longitude: 2.3522, statut: 'DISPONIBLE', estExpert: true
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
