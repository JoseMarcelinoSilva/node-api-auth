import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { notes } from "../db/schema.js";
import type { CreateNoteInput, UpdateNoteInput } from "../schemas/notes.js";

export class NotFoundError extends Error {
    constructor(message = "Note not found") {
        super(message);
        this.name = "NotFoundError";
    }
}

export class ForbiddenError extends Error {
    constructor(message = "Forbidden") {
        super(message);
        this.name = "ForbiddenError";
    }
}

export async function createNote(input: CreateNoteInput, userId: string) {
    try {
        const [note] = await db
            .insert(notes)
            .values({
                title: input.title,
                content: input.content,
                idUser: userId,
            })
            .returning();
        return note;
    } catch (error) {
        throw error;
    }
}

export async function findAllNotes(userId: string) {
    try {
        return await db.select().from(notes).where(eq(notes.idUser, userId));
    } catch (error) {
        throw error;
    }
}

export async function findNoteById(id: string, userId: string) {
    try {
        const [note] = await db.select().from(notes).where(eq(notes.id, id));

        if (!note) {
            throw new NotFoundError();
        }

        if (note.idUser !== userId) {
            throw new ForbiddenError();
        }

        return note;
    } catch (error) {
        throw error;
    }
}

export async function updateNote(
    id: string,
    input: UpdateNoteInput,
    userId: string,
) {
    try {
        await findNoteById(id, userId);

        const [note] = await db
            .update(notes)
            .set(input)
            .where(and(eq(notes.id, id), eq(notes.idUser, userId)))
            .returning();

        if (!note) {
            throw new NotFoundError();
        }

        return note;
    } catch (error) {
        throw error;
    }
}

export async function deleteNote(id: string, userId: string) {
    try {
        await findNoteById(id, userId);

        const [note] = await db
            .delete(notes)
            .where(and(eq(notes.id, id), eq(notes.idUser, userId)))
            .returning();

        if (!note) {
            throw new NotFoundError();
        }
    } catch (error) {
        throw error;
    }
}
