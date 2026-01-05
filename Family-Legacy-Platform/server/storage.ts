import { db } from "./db";
import {
  profiles,
  type Profile,
  type InsertProfile
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { authStorage } from "./replit_integrations/auth/storage";

export interface IStorage {
  getProfile(userId: string): Promise<Profile | undefined>;
  createProfile(userId: string, profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, updates: Partial<InsertProfile>): Promise<Profile>;
  deleteProfile(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getProfile(userId: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile;
  }

  async createProfile(userId: string, profile: InsertProfile): Promise<Profile> {
    const [created] = await db.insert(profiles).values({ ...profile, userId }).returning();
    return created;
  }

  async updateProfile(userId: string, updates: Partial<InsertProfile>): Promise<Profile> {
    const [updated] = await db.update(profiles)
      .set(updates)
      .where(eq(profiles.userId, userId))
      .returning();
    return updated;
  }

  async deleteProfile(userId: string): Promise<void> {
    await db.delete(profiles).where(eq(profiles.userId, userId));
  }
}

export const storage = new DatabaseStorage();
export { authStorage };
