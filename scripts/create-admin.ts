import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function createAdmin() {
  const email = "adli@ecoeats.fr";
  const password = "admin_password_123"; // À changer après la première connexion
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const admin = await prisma.compteUtilisateur.upsert({
      where: { email },
      update: {
        role: "ADMIN",
        motDePasseHache: hashedPassword
      },
      create: {
        id: uuidv4(),
        email,
        motDePasseHache: hashedPassword,
        role: "ADMIN",
        profilId: "ADMIN_PROFIL"
      }
    });

    console.log("--------------------------------------------------");
    console.log("✅ Compte ADMIN créé ou mis à jour avec succès !");
    console.log(`📧 Email : ${email}`);
    console.log(`🔑 Password : ${password}`);
    console.log("--------------------------------------------------");
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'admin :", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
