import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Profile Routes
  app.get(api.profiles.get.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const profile = await storage.getProfile(userId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  });

  app.post(api.profiles.create.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    try {
      const existing = await storage.getProfile(userId);
      if (existing) {
        return res.status(400).json({ message: "Profile already exists" });
      }
      
      const input = api.profiles.create.input.parse(req.body);
      const profile = await storage.createProfile(userId, input);
      res.status(201).json(profile);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.patch(api.profiles.update.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    try {
      const input = api.profiles.update.input.parse(req.body);
      const profile = await storage.updateProfile(userId, input);
      res.json(profile);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Keep this for backward compatibility if needed, but also add the new ones
  app.post(api.profiles.mockPayment.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    try {
      const { type, tier } = req.body;
      const updates: any = {};

      if (type === 'one-time') {
        updates.hasPaidOneTimeFee = true;
      } else if (type === 'subscription') {
        updates.subscriptionStatus = 'active';
        if (tier) updates.subscriptionTier = tier;
        // Marketplace access is granted when subscription is active for Pro
        updates.marketplaceAccess = true;
      }

      const profile = await storage.updateProfile(userId, updates);
      res.json(profile);
    } catch (err) {
      res.status(500).json({ message: "Failed to process payment" });
    }
  });

  app.get(api.profiles.validateMarketplace.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const profile = await storage.getProfile(userId);
    
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (!profile.hasPaidOneTimeFee) {
      return res.json({ 
        valid: false, 
        message: "One-time onboarding fee required for download access." 
      });
    }

    if (profile.subscriptionStatus !== 'active') {
      return res.json({ 
        valid: false, 
        message: "Active monthly subscription required for marketplace connection." 
      });
    }

    res.json({ valid: true, message: "Marketplace license valid." });
  });

  // New endpoints expected by frontend
  app.post(api.payments.onetime.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    try {
      const profile = await storage.updateProfile(userId, { hasPaidOneTimeFee: true });
      res.json(profile);
    } catch (err) {
      res.status(500).json({ message: "Failed to process payment" });
    }
  });

  app.post(api.payments.subscribe.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    try {
      const { tier } = req.body;
      const profile = await storage.updateProfile(userId, { 
        subscriptionStatus: 'active',
        subscriptionTier: tier
      });
      res.json(profile);
    } catch (err) {
      res.status(500).json({ message: "Failed to process subscription" });
    }
  });

  return httpServer;
}
