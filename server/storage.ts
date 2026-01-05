import { db } from "./db";
import {
  profiles,
  tickets,
  messages,
  affiliates,
  type Profile,
  type InsertProfile,
  type Ticket,
  type Message,
  type Affiliate
} from "@shared/schema";
import { eq, and, or } from "drizzle-orm";
import { authStorage } from "./replit_integrations/auth/storage";

export interface IStorage {
  getProfile(userId: string): Promise<Profile | undefined>;
  createProfile(userId: string, profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, updates: Partial<InsertProfile>): Promise<Profile>;
  deleteProfile(userId: string): Promise<void>;
  
  // Admin Management
  getAllProfiles(): Promise<Profile[]>;
  getTickets(): Promise<Ticket[]>;
  createTicket(ticket: any): Promise<Ticket>;
  getMessages(userId: string): Promise<Message[]>;
  createMessage(message: any): Promise<Message>;
  getAffiliate(userId: string): Promise<Affiliate | undefined>;
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

  async getAllProfiles(): Promise<Profile[]> {
    return await db.select().from(profiles);
  }

  async getTickets(): Promise<Ticket[]> {
    return await db.select().from(tickets);
  }

  async createTicket(ticket: any): Promise<Ticket> {
    const [created] = await db.insert(tickets).values(ticket).returning();
    return created;
  }

  async getMessages(userId: string): Promise<Message[]> {
    return await db.select().from(messages).where(
      or(eq(messages.senderId, userId), eq(messages.receiverId, userId))
    );
  }

  async createMessage(message: any): Promise<Message> {
    const [created] = await db.insert(messages).values(message).returning();
    return created;
  }

  async getAffiliate(userId: string): Promise<Affiliate | undefined> {
    const [affiliate] = await db.select().from(affiliates).where(eq(affiliates.userId, userId));
    return affiliate;
  }
}

export const storage = new DatabaseStorage();
export { authStorage };
