import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./auth";

// Ensure secure downloads directory exists and has dummy files
const SECURE_FILES_DIR = path.join(process.cwd(), "server", "secure_downloads");
if (!fs.existsSync(SECURE_FILES_DIR)) {
  fs.mkdirSync(SECURE_FILES_DIR, { recursive: true });
  fs.writeFileSync(path.join(SECURE_FILES_DIR, "wordpress-plugin.zip"), "Dummy WordPress Plugin Content");
  fs.writeFileSync(path.join(SECURE_FILES_DIR, "platform-standalone.zip"), "Dummy Standalone Platform Content");
}

// Role-based Access Control Middleware
const checkRole = (roles: string[]) => (req: any, res: Response, next: NextFunction) => {
  const userId = req.user.id;
  storage.getProfile(userId).then(profile => {
    if (profile && roles.includes(profile.role)) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  }).catch(() => res.status(500).json({ message: "Internal Server Error" }));
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  // Admin Routes
  app.get("/api/admin/users", isAuthenticated, checkRole(["admin", "support", "developer"]), async (req, res) => {
    const profiles = await storage.getAllProfiles();
    res.json(profiles);
  });

  app.get("/api/admin/tickets", isAuthenticated, checkRole(["admin", "support"]), async (req, res) => {
    const tickets = await storage.getTickets();
    res.json(tickets);
  });

  app.get("/api/admin/stats", isAuthenticated, checkRole(["admin", "developer"]), async (req, res) => {
    const profiles = await storage.getAllProfiles();
    const stats = {
      totalUsers: profiles.length,
      familyUsers: profiles.filter(p => p.role === "family").length,
      proUsers: profiles.filter(p => p.role === "pro").length,
      activeSubscriptions: profiles.filter(p => p.subscriptionStatus === "active").length,
    };
    res.json(stats);
  });

  // Profile Routes
  app.get(api.profiles.get.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.id;
    const profile = await storage.getProfile(userId);
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  });

  app.post(api.profiles.create.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.id;
    try {
      const input = api.profiles.create.input.parse(req.body);
      const profile = await storage.createProfile(userId, input);
      res.status(201).json(profile);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.delete(api.profiles.delete.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.id;
    try {
      await storage.deleteProfile(userId);
      res.status(200).json({ message: "Profile deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete profile" });
    }
  });

  // Download routes - no auth needed, will be protected by parent website
  app.get("/api/download/:type", async (req, res) => {
    const { type } = req.params;

    let filename: string;
    let downloadName: string;

    if (type === 'wordpress') {
      filename = "wordpress-plugin.zip";
      downloadName = "family-legacy-wordpress-plugin.zip";
    } else if (type === 'standalone') {
      filename = "platform-standalone.zip";
      downloadName = "family-legacy-platform.zip";
    } else {
      return res.status(404).json({ message: "File type not found" });
    }

    const filePath = path.join(SECURE_FILES_DIR, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.download(filePath, downloadName);
  });

  return httpServer;
}
