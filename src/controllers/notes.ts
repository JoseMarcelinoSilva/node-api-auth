import type { Request, Response } from "express";
import * as notesService from "../services/notes.js";
import { ForbiddenError, NotFoundError } from "../services/notes.js";
import type { CreateNoteInput, UpdateNoteInput } from "../schemas/notes.js";

export async function create(req: Request, res: Response) {
    try {
        const userId = getUserId(req, res);
        if (!userId) {
            return;
        }

        const body = req.body as CreateNoteInput;
        const note = await notesService.createNote(body, userId);
        res.status(201).json(note);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function findAll(req: Request, res: Response) {
    try {
        const userId = getUserId(req, res);
        if (!userId) {
            return;
        }

        const notes = await notesService.findAllNotes(userId);
        res.status(200).json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function findById(req: Request, res: Response) {
    try {
        const userId = getUserId(req, res);
        if (!userId) {
            return;
        }

        const { id } = req.params as { id: string };
        const note = await notesService.findNoteById(id, userId);
        res.status(200).json(note);
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(404).json({ error: "Note not found" });
            return;
        }

        if (error instanceof ForbiddenError) {
            res.status(403).json({ error: "Note not found for this user" });
            return;
        }

        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function update(req: Request, res: Response) {
    try {
        const userId = getUserId(req, res);
        if (!userId) {
            return;
        }

        const { id } = req.params as { id: string };
        const body = req.body as UpdateNoteInput;
        const note = await notesService.updateNote(id, body, userId);
        res.status(200).json(note);
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(404).json({ error: "Note not found" });
            return;
        }

        if (error instanceof ForbiddenError) {
            res.status(403).json({ error: "Note not found for this user" });
            return;
        }

        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function remove(req: Request, res: Response) {
    try {
        const userId = getUserId(req, res);
        if (!userId) {
            return;
        }

        const { id } = req.params as { id: string };
        await notesService.deleteNote(id, userId);
        res.status(204).send();
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(404).json({ error: "Note not found" });
            return;
        }

        if (error instanceof ForbiddenError) {
            res.status(403).json({ error: "Note not found for this user" });
            return;
        }

        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

function getUserId(req: Request, res: Response) {
    if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return null;
    }

    return req.userId;
}
