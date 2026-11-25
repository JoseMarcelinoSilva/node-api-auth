import bcrypt from "bcrypt";
import { db } from "./index.js";
import { notes, users } from "./schema.js";

const seedUsers = [
  {
    email: "demo@example.com",
    password: "password123",
    notes: [
      {
        title: "Primeira nota",
        content: "Este é o conteúdo da primeira nota de exemplo.",
      },
      {
        title: "Lista de compras",
        content: "Leite, ovos, pão e café.",
      },
    ],
  },
  {
    email: "other@example.com",
    password: "password123",
    notes: [
      {
        title: "Nota do outro usuário",
        content: "Esta nota não deve aparecer para o usuário demo.",
      },
    ],
  },
];

async function seed() {
  try {
    await db.delete(notes);
    await db.delete(users);

    for (const seedUser of seedUsers) {
      const hashedPassword = await bcrypt.hash(seedUser.password, 10);

      const [user] = await db
        .insert(users)
        .values({
          email: seedUser.email,
          password: hashedPassword,
        })
        .returning();

      await db.insert(notes).values(
        seedUser.notes.map((note) => ({
          ...note,
          idUser: user.id,
        })),
      );
    }

    console.log("Seed completed.");
    console.log("Users:");
    for (const seedUser of seedUsers) {
      console.log(`  ${seedUser.email} / ${seedUser.password}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();
