import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du remplissage de la base de données (seeding)...");

  // 1. Créer un client
  const client = await prisma.client.upsert({
    where: { email: "jean.dupont@email.com" },
    update: {},
    create: {
      id: "client-1",
      nom: "Jean Dupont",
      email: "jean.dupont@email.com",
      adresse: "10 Rue de la Paix, 75000 Paris",
    },
  });
  console.log(" Client créé :", client.nom);

  // 2. Créer un restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { id: "resto-1" },
    update: {},
    create: {
      id: "resto-1",
      nom: "Le Bon Burger Éthique",
      adresse: "15 Avenue des Champs-Élysées, 75008 Paris",
      latitude: 48.8698,
      longitude: 2.3075,
      proprietaireId: "proprio-1",
    },
  });
  console.log("🍔 Restaurant créé :", restaurant.nom);

  // 3. Ajouter des plats au menu de ce restaurant
  await prisma.platMenu.upsert({
    where: { id: "plat-1" },
    update: {},
    create: {
      id: "plat-1",
      nom: "Burger Classique Bio",
      description: "Pain artisanal, steak haché bio, cheddar affiné",
      prixCentimes: 1200, // 12,00€
      allergenes: ["Gluten", "Lactose"],
      stockJournalier: 50,
      restaurantId: restaurant.id,
    },
  });

  await prisma.platMenu.upsert({
    where: { id: "plat-2" },
    update: {},
    create: {
      id: "plat-2",
      nom: "Frites Maison",
      description: "Pommes de terre d'Ile de France, sauce secrète",
      prixCentimes: 450, // 4,50€
      allergenes: [],
      stockJournalier: 100,
      restaurantId: restaurant.id,
    },
  });
  console.log("Plats menus créés.");

  // --- RESTAURANT 2 : Pizzeria Solidaire ---
  const resto2 = await prisma.restaurant.upsert({
    where: { id: "resto-2" },
    update: {},
    create: {
      id: "resto-2",
      nom: "La Pizzeria Solidaire",
      adresse: "42 Rue de la République, 69002 Lyon",
      latitude: 45.7640,
      longitude: 4.8357,
      proprietaireId: "proprio-2",
    },
  });
  console.log("Restaurant créé :", resto2.nom);

  await prisma.platMenu.upsert({
    where: { id: "plat-3" },
    update: {},
    create: {
      id: "plat-3",
      nom: "Pizza Margherita Locale",
      description: "Tomates anciennes de la ferme, Mozzarella artisanale, basilic frais",
      prixCentimes: 1050, // 10,50€
      allergenes: ["Gluten", "Lactose"],
      stockJournalier: 30,
      restaurantId: resto2.id,
    },
  });

  await prisma.platMenu.upsert({
    where: { id: "plat-4" },
    update: {},
    create: {
      id: "plat-4",
      nom: "Tiramisu au café équitable",
      description: "Véritable tiramisu italien, café bio pur arabica",
      prixCentimes: 600, // 6,00€
      allergenes: ["Gluten", "Lactose", "Œufs"],
      stockJournalier: 20,
      restaurantId: resto2.id,
    },
  });

  // --- RESTAURANT 3 : Sushi Éco ---
  const resto3 = await prisma.restaurant.upsert({
    where: { id: "resto-3" },
    update: {},
    create: {
      id: "resto-3",
      nom: "Sushi Éco",
      adresse: "12 Rue Sainte-Catherine, 33000 Bordeaux",
      latitude: 44.8378,
      longitude: -0.5792,
      proprietaireId: "proprio-3",
    },
  });
  console.log(" Restaurant créé :", resto3.nom);

  await prisma.platMenu.upsert({
    where: { id: "plat-5" },
    update: {},
    create: {
      id: "plat-5",
      nom: "Plateau Maki & Sushi (12 pcs)",
      description: "Saumon label rouge, thon albacore pêche responsable, riz vinaigré, gingembre bio",
      prixCentimes: 1690, // 16,90€
      allergenes: ["Poisson", "Soja"],
      stockJournalier: 40,
      restaurantId: resto3.id,
    },
  });

  // 4. Créer un livreur disponible
  const livreur = await prisma.livreur.upsert({
    where: { id: "livreur-1" },
    update: {},
    create: {
      id: "livreur-1",
      nom: "Alice Livraisons",
      telephone: "0601020304",
      latitude: 48.8700,
      longitude: 2.3080, // Très proche du restaurant
      statut: "DISPONIBLE",
      portefeuilleCentimes: 0,
    },
  });
  console.log(" Livreur créé :", livreur.nom);

  console.log("Seeding terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("Erreur lors du seeding :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
