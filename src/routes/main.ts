import { Router } from "express";
import * as notesController from "../controllers/notes.js";
import { authorize } from "../middlewares/authorize.js";
import { validate } from "../middlewares/validate.js";
import {
    createNoteSchema,
    noteIdParamsSchema,
    updateNoteSchema,
} from "../schemas/notes.js";

const router = Router();

router.post("/notes", authorize, validate(createNoteSchema, "body"), notesController.create);
router.get("/notes", authorize, notesController.findAll);
router.get(
    "/notes/:id",
    authorize,
    validate(noteIdParamsSchema, "params"),
    notesController.findById,
);
router.put(
    "/notes/:id",
    authorize,
    validate(noteIdParamsSchema, "params"),
    validate(updateNoteSchema, "body"),
    notesController.update,
);
router.delete(
    "/notes/:id",
    authorize,
    validate(noteIdParamsSchema, "params"),
    notesController.remove,
);

export default router;
