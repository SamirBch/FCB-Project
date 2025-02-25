// src/lib/db.ts
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// Testez la connexion à la base de données
db.$connect()
  .then(() => console.log("✅ Connexion à la base de données réussie."))
  .catch((error) => console.error("❌ Erreur de connexion à la base de données :", error));

export { db };