import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    token: text("token"),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const notes = pgTable("notes", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    idUser: uuid("id_user")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
});

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
