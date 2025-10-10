import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const purchases = pgTable("purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date", { mode: "date" }).notNull(),
  place: text("place").notNull(),
  paymentType: text("payment_type").notNull(),
  checkNumber: text("check_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const purchaseLineItems = pgTable("purchase_line_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  purchaseId: varchar("purchase_id").notNull().references(() => purchases.id, { onDelete: "cascade" }),
  category: text("category").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

const lineItemSchema = z.object({
  category: z.enum([
    "Grocery",
    "Restaurant",
    "Clothing",
    "Gas",
    "Medication",
    "Entertainment",
    "Babysitter",
    "Gift",
    "Misc"
  ]),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
});

export const insertPurchaseSchema = createInsertSchema(purchases, {
  date: z.coerce.date(),
  place: z.string().min(1, "Place is required"),
  paymentType: z.enum([
    "Citi x8215",
    "Chase x4694",
    "WSFS debit",
    "Other debit",
    "Check",
    "Cash",
    "HSA"
  ]),
  checkNumber: z.string().optional(),
}).omit({ id: true, createdAt: true }).extend({
  lineItems: z.array(lineItemSchema).min(1, "At least one item is required"),
});

export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Purchase = typeof purchases.$inferSelect;
export type PurchaseLineItem = typeof purchaseLineItems.$inferSelect;
export type InsertPurchaseLineItem = z.infer<typeof lineItemSchema>;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
