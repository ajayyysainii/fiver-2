import { pgTable, text, boolean, timestamp, integer, serial, date, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { users } from "./models/auth";

// --- CONTROL CENTER ENUMS ---
export const agentStatusEnum = pgEnum("agent_status", ["active", "disabled", "maintenance"]);
export const assistantTypeEnum = pgEnum("assistant_type", ["legacy_advisor", "finance_asset", "knowledge_archivist", "operations", "planning_strategy"]);
export const ccTaskStatusEnum = pgEnum("cc_task_status", ["pending", "in_progress", "completed", "cancelled"]);
export const ccTaskPriorityEnum = pgEnum("cc_task_priority", ["low", "medium", "high", "urgent"]);
export const ccAssetTypeEnum = pgEnum("cc_asset_type", ["business", "real_estate", "intellectual_property", "trust", "project"]);
export const ccAssetStatusEnum = pgEnum("cc_asset_status", ["active", "inactive", "pending", "archived"]);

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

// ============================
// CONTROL CENTER TABLES
// ============================

// --- AUDIT LOGS ---
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

// --- REVENUE / FINANCE ---
export const revenue = pgTable("revenue", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  amount: integer("amount").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull(),
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// --- MARKETING CAMPAIGNS ---
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull(),
  budget: integer("budget").notNull(),
  spend: integer("spend").default(0),
  clicks: integer("clicks").default(0),
  impressions: integer("impressions").default(0),
  conversions: integer("conversions").default(0),
  roi: integer("roi").default(0),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
});

// --- AGENTS (Mr. Reed) ---
export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  status: agentStatusEnum("status").default("active").notNull(),
  version: text("version").notNull(),
  capabilities: jsonb("capabilities"),
  totalRequests: integer("total_requests").default(0),
  avgLatencyMs: integer("avg_latency_ms").default(0),
  lastActive: timestamp("last_active").defaultNow(),
});

// --- SYSTEM METRICS (Snapshots) ---
export const systemMetrics = pgTable("system_metrics", {
  id: serial("id").primaryKey(),
  cpuUsage: integer("cpu_usage"),
  memoryUsage: integer("memory_usage"),
  uptimeSeconds: integer("uptime_seconds"),
  activeUsers: integer("active_users"),
  errorRate: integer("error_rate"),
  capturedAt: timestamp("captured_at").defaultNow(),
});

// --- FAMILY AI ASSISTANTS ---
export const assistants = pgTable("assistants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: assistantTypeEnum("type").notNull(),
  description: text("description"),
  status: text("status").default("active").notNull(),
  personality: text("personality"),
  capabilities: jsonb("capabilities"),
  model: text("model").default("llama3").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// --- CONVERSATIONS (for AI chat) ---
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  assistantId: integer("assistant_id").references(() => assistants.id).notNull(),
  title: text("title").default("New Conversation"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- CONVERSATION MESSAGES ---
export const ccMessages = pgTable("cc_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => conversations.id).notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// --- KNOWLEDGE & LEGACY VAULT ---
export const vaultDocuments = pgTable("vault_documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  fileType: text("file_type"),
  fileUrl: text("file_url"),
  tags: jsonb("tags"),
  generation: text("generation"),
  importance: text("importance").default("normal"),
  uploadedBy: text("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- FAMILY TASK & DECISION CENTER ---
export const ccTasks = pgTable("cc_tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: ccTaskStatusEnum("status").default("pending").notNull(),
  priority: ccTaskPriorityEnum("priority").default("medium").notNull(),
  assignedTo: text("assigned_to").references(() => users.id),
  createdBy: text("created_by").references(() => users.id),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const decisions = pgTable("decisions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  decidedBy: text("decided_by").references(() => users.id),
  reasoning: text("reasoning"),
  impact: text("impact"),
  category: text("category"),
  relatedTaskId: integer("related_task_id").references(() => ccTasks.id),
  relatedAssetId: integer("related_asset_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// --- ASSET & PROJECT OVERVIEW ---
export const ccAssets = pgTable("cc_assets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: ccAssetTypeEnum("type").notNull(),
  status: ccAssetStatusEnum("status").default("active").notNull(),
  description: text("description"),
  estimatedValue: integer("estimated_value"),
  location: text("location"),
  responsibleParty: text("responsible_party").references(() => users.id),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- COMMUNICATION HUB ---
export const internalMessages = pgTable("internal_messages", {
  id: serial("id").primaryKey(),
  senderId: text("sender_id").references(() => users.id).notNull(),
  recipientId: text("recipient_id").references(() => users.id),
  threadId: integer("thread_id"),
  subject: text("subject"),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  relatedEntity: text("related_entity"),
  relatedEntityId: integer("related_entity_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// --- INTEGRATION CONFIG ---
export const integrationConfig = pgTable("integration_config", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value"),
  enabled: boolean("enabled").default(false),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================
// CONTROL CENTER INSERT SCHEMAS
// ============================
export const insertAssistantSchema = createInsertSchema(assistants).omit({ id: true, createdAt: true });
export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCcMessageSchema = createInsertSchema(ccMessages).omit({ id: true, createdAt: true });
export const insertVaultDocumentSchema = createInsertSchema(vaultDocuments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCcTaskSchema = createInsertSchema(ccTasks, {
  dueDate: z.coerce.date().optional().nullable(),
}).omit({ id: true, createdAt: true, updatedAt: true, completedAt: true });
export const insertDecisionSchema = createInsertSchema(decisions).omit({ id: true, createdAt: true });
export const insertCcAssetSchema = createInsertSchema(ccAssets).omit({ id: true, createdAt: true, updatedAt: true });
export const insertInternalMessageSchema = createInsertSchema(internalMessages).omit({ id: true, createdAt: true });
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });

// ============================
// CONTROL CENTER TYPES
// ============================
export type Agent = typeof agents.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type Assistant = typeof assistants.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type CcMessage = typeof ccMessages.$inferSelect;
export type VaultDocument = typeof vaultDocuments.$inferSelect;
export type CcTask = typeof ccTasks.$inferSelect;
export type Decision = typeof decisions.$inferSelect;
export type CcAsset = typeof ccAssets.$inferSelect;
export type InternalMessage = typeof internalMessages.$inferSelect;
export type IntegrationConfig = typeof integrationConfig.$inferSelect;

// Dashboard Stats Type
export interface DashboardStats {
  revenueToday: number;
  revenueMonth: number;
  activeUsers: number;
  newUsers: number;
  conversionRate: number;
  systemHealth: "healthy" | "degraded" | "down";
  openTickets: number;
  activeCampaigns: number;
  totalTasks: number;
  pendingTasks: number;
  totalAssets: number;
  unreadMessages: number;
  vaultDocuments: number;
}
