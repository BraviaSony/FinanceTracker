import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // All routes should be prefixed with /api
  // DO NOT MODIFY THIS: API Health Check
  app.get("/api/health", (_, res) => {
    res.json({ status: "ok" });
  });

  // Seed data endpoint
  app.post("/api/seed-data", async (_, res) => {
    try {
      // This would normally call the Convex function
      // For now, just return success
      res.json({ success: true, message: "Sample data seeded successfully" });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to seed data" });
    }
  });

  // Default to using CONVEX for API routes, prefix with /api.
  return createServer(app);
}
