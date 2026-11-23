import { eq } from "drizzle-orm";
import { db } from "./index.js";
import { notes, users } from "./schema.js";

const sampleNotes = [
    {
        title: "Primeira nota",
        content: "Este é o conteúdo da primeira nota de exemplo.",
    },
    {
        title: "Lista de compras",
        content: "Leite, ovos, pão e café.",
    },
    {
        title: "Ideias",
        content: "Criar uma API simples de notas com Node e TypeScript.",
    },
];

const seedUser = {
    email: "seed@example.com",
    password: "seed",
};

async function seed() {
    try {
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, seedUser.email));

        const user =
            existingUser ??
            (await db.insert(users).values(seedUser).returning())[0];

        await db.insert(notes).values(
            sampleNotes.map((note) => ({
                ...note,
                idUser: user.id,
            })),
        );
        console.log(`Seeded ${sampleNotes.length} notes.`);
        process.exit(0);
    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    }
}

seed();
