import { purchases, purchaseLineItems, type Purchase, type PurchaseLineItem, type InsertPurchase } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export type PurchaseWithLineItems = Purchase & {
  lineItems: PurchaseLineItem[];
};

export interface IStorage {
  getAllPurchases(): Promise<PurchaseWithLineItems[]>;
  createPurchase(purchase: InsertPurchase): Promise<PurchaseWithLineItems>;
  deletePurchase(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getAllPurchases(): Promise<PurchaseWithLineItems[]> {
    const allPurchases = await db.select().from(purchases).orderBy(desc(purchases.date));
    
    const purchasesWithLineItems = await Promise.all(
      allPurchases.map(async (purchase) => {
        const lineItems = await db
          .select()
          .from(purchaseLineItems)
          .where(eq(purchaseLineItems.purchaseId, purchase.id));
        
        return {
          ...purchase,
          lineItems,
        };
      })
    );
    
    return purchasesWithLineItems;
  }

  async createPurchase(insertPurchase: InsertPurchase): Promise<PurchaseWithLineItems> {
    const { lineItems, ...purchaseData } = insertPurchase;
    
    const [purchase] = await db
      .insert(purchases)
      .values(purchaseData)
      .returning();
    
    const createdLineItems = await db
      .insert(purchaseLineItems)
      .values(
        lineItems.map((item) => ({
          purchaseId: purchase.id,
          category: item.category,
          price: item.price,
        }))
      )
      .returning();
    
    return {
      ...purchase,
      lineItems: createdLineItems,
    };
  }

  async deletePurchase(id: string): Promise<void> {
    await db.delete(purchases).where(eq(purchases.id, id));
  }
}

export const storage = new DatabaseStorage();
