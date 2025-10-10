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
    const result = await db
      .select({
        purchase: purchases,
        lineItem: purchaseLineItems,
      })
      .from(purchases)
      .leftJoin(purchaseLineItems, eq(purchases.id, purchaseLineItems.purchaseId))
      .orderBy(desc(purchases.date));

    const purchaseMap = new Map<string, PurchaseWithLineItems>();
    
    for (const row of result) {
      if (!purchaseMap.has(row.purchase.id)) {
        purchaseMap.set(row.purchase.id, {
          ...row.purchase,
          lineItems: [],
        });
      }
      
      if (row.lineItem) {
        purchaseMap.get(row.purchase.id)!.lineItems.push(row.lineItem);
      }
    }
    
    return Array.from(purchaseMap.values());
  }

  async createPurchase(insertPurchase: InsertPurchase): Promise<PurchaseWithLineItems> {
    const { lineItems, ...purchaseData } = insertPurchase;
    
    return await db.transaction(async (tx) => {
      const [purchase] = await tx
        .insert(purchases)
        .values(purchaseData)
        .returning();
      
      const createdLineItems = await tx
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
    });
  }

  async deletePurchase(id: string): Promise<void> {
    await db.delete(purchases).where(eq(purchases.id, id));
  }
}

export const storage = new DatabaseStorage();
