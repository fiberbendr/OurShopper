import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertPurchaseSchema } from "@shared/schema";
import { z } from "zod";
import { sendPurchaseNotification } from "./email";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time syncing
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  // Broadcast to all connected clients
  function broadcast(data: any) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  // Get all purchases
  app.get("/api/purchases", async (req, res) => {
    try {
      const purchases = await storage.getAllPurchases();
      res.json(purchases);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      res.status(500).json({ error: "Failed to fetch purchases" });
    }
  });

  // Create a purchase
  app.post("/api/purchases", async (req, res) => {
    try {
      const validated = insertPurchaseSchema.parse(req.body);
      const purchase = await storage.createPurchase(validated);
      
      // Send email notification (async, don't wait for it)
      sendPurchaseNotification(purchase).catch(err => {
        console.error('Email notification failed:', err);
      });
      
      // Broadcast to all clients
      broadcast({ type: "purchase_added", purchase });
      
      res.json(purchase);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid purchase data", details: error.errors });
      } else {
        console.error("Error creating purchase:", error);
        res.status(500).json({ error: "Failed to create purchase" });
      }
    }
  });

  // Delete a purchase
  app.delete("/api/purchases/:id", async (req, res) => {
    try {
      await storage.deletePurchase(req.params.id);
      
      // Broadcast to all clients
      broadcast({ type: "purchase_deleted", id: req.params.id });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting purchase:", error);
      res.status(500).json({ error: "Failed to delete purchase" });
    }
  });

  return httpServer;
}
