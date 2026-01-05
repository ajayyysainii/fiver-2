import { pgTable, text, boolean, timestamp, integer, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { users } from "./models/auth";

export * from "./models/auth";

export const profiles = pgTable("profiles", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull().references(() => users.id),
  role: text("role", { enum: ["family", "pro", "admin", "support", "affiliate_manager", "developer"] }).notNull(),
  subscriptionTier: text("subscription_tier", { enum: ["gold", "platinum", "uranium"] }),
  hasPaidOneTimeFee: boolean("has_paid_one_time_fee").default(false).notNull(),
  subscriptionStatus: text("subscription_status", { enum: ["active", "inactive"] }).default("inactive"),
  marketplaceAccess: boolean("marketplace_access").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status", { enum: ["open", "in_progress", "resolved", "closed"] }).default("open").notNull(),
  priority: text("priority", { enum: ["low", "medium", "high", "urgent"] }).default("medium").notNull(),
  creatorId: text("creator_id").notNull().references(() => users.id),
  assigneeId: text("assignee_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: text("sender_id").notNull().references(() => users.id),
  receiverId: text("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const affiliates = pgTable("affiliates", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  referralCode: text("referral_code").notNull().unique(),
  totalCommission: integer("total_commission").default(0).notNull(),
  payoutStatus: text("payout_status", { enum: ["pending", "paid"] }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertTicketSchema = createInsertSchema(tickets).omit({ id: true, creatorId: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, senderId: true, createdAt: true });
export const insertAffiliateSchema = createInsertSchema(affiliates).omit({ id: true, userId: true, createdAt: true });

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Ticket = typeof tickets.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Affiliate = typeof affiliates.$inferSelect;

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  createdTickets: many(tickets, { relationName: "creator" }),
  assignedTickets: many(tickets, { relationName: "assignee" }),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  creator: one(users, {
    fields: [tickets.creatorId],
    references: [users.id],
    relationName: "creator",
  }),
  assignee: one(users, {
    fields: [tickets.assigneeId],
    references: [users.id],
    relationName: "assignee",
  }),
}));
