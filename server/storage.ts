import { purchases, type Purchase, type InsertPurchase } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getAllPurchases(): Promise<Purchase[]>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  deletePurchase(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getAllPurchases(): Promise<Purchase[]> {
    return await db.select().from(purchases).orderBy(desc(purchases.date));
  }

  async createPurchase(insertPurchase: InsertPurchase): Promise<Purchase> {
    const [purchase] = await db
      .insert(purchases)
      .values(insertPurchase)
      .returning();
    return purchase;
  }

  async deletePurchase(id: string): Promise<void> {
    await db.delete(purchases).where(eq(purchases.id, id));
  }
}

export const storage = new DatabaseStorage();
