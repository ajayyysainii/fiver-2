import { db } from "./db";
import {
    campaigns,
    agents,
    auditLogs,
    assistants,
    conversations,
    ccMessages,
    vaultDocuments,
    ccTasks,
    decisions,
    ccAssets,
    internalMessages,
    integrationConfig,
    profiles,
    tickets,
    type Campaign,
    type Agent,
    type AuditLog,
    type DashboardStats,
    type Assistant,
    type Conversation,
    type CcMessage,
    type VaultDocument,
    type CcTask,
    type Decision,
    type CcAsset,
    type InternalMessage,
    type IntegrationConfig
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export class ControlCenterStorage {
    // === DASHBOARD ===
    async getDashboardStats(): Promise<DashboardStats> {
        const allProfiles = await db.select().from(profiles);
        const allTickets = await db.select().from(tickets);
        const allCampaigns = await db.select().from(campaigns);
        const allTasks = await db.select().from(ccTasks);
        const allAssets = await db.select().from(ccAssets);
        const allMessages = await db.select().from(internalMessages);
        const allDocs = await db.select().from(vaultDocuments);

        return {
            revenueToday: 125000,
            revenueMonth: 4500000,
            activeUsers: allProfiles.length,
            newUsers: 12,
            conversionRate: 3.5,
            systemHealth: "healthy",
            openTickets: allTickets.filter(t => t.status === 'open').length,
            activeCampaigns: allCampaigns.filter(c => c.status === 'active').length,
            totalTasks: allTasks.length,
            pendingTasks: allTasks.filter(t => t.status === 'pending').length,
            totalAssets: allAssets.length,
            unreadMessages: allMessages.filter(m => !m.isRead).length,
            vaultDocuments: allDocs.length,
        };
    }

    // === CAMPAIGNS ===
    async getCampaigns(): Promise<Campaign[]> {
        return await db.select().from(campaigns);
    }

    // === AGENTS ===
    async getAgents(): Promise<Agent[]> {
        return await db.select().from(agents);
    }

    async updateAgent(id: number, updates: Partial<Agent>): Promise<Agent> {
        const [agent] = await db.update(agents).set(updates).where(eq(agents.id, id)).returning();
        return agent;
    }

    // === AUDIT LOGS ===
    async getAuditLogs(): Promise<AuditLog[]> {
        return await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(50);
    }

    // === ASSISTANTS ===
    async getAssistants(): Promise<Assistant[]> {
        return await db.select().from(assistants);
    }

    async getAssistant(id: number): Promise<Assistant | undefined> {
        const [a] = await db.select().from(assistants).where(eq(assistants.id, id));
        return a;
    }

    async updateAssistant(id: number, updates: Partial<Assistant>): Promise<Assistant> {
        const [a] = await db.update(assistants).set(updates).where(eq(assistants.id, id)).returning();
        return a;
    }

    // === CONVERSATIONS ===
    async getConversations(userId?: string): Promise<Conversation[]> {
        if (userId) {
            return await db.select().from(conversations).where(eq(conversations.userId, userId)).orderBy(desc(conversations.updatedAt));
        }
        return await db.select().from(conversations).orderBy(desc(conversations.updatedAt));
    }

    async createConversation(conv: Omit<Conversation, "id" | "createdAt" | "updatedAt">): Promise<Conversation> {
        const [c] = await db.insert(conversations).values(conv).returning();
        return c;
    }

    async getMessages(conversationId: number): Promise<CcMessage[]> {
        return await db.select().from(ccMessages).where(eq(ccMessages.conversationId, conversationId)).orderBy(ccMessages.createdAt);
    }

    async createMessage(msg: Omit<CcMessage, "id" | "createdAt">): Promise<CcMessage> {
        const [m] = await db.insert(ccMessages).values(msg).returning();
        return m;
    }

    // === VAULT ===
    async getVaultDocuments(): Promise<VaultDocument[]> {
        return await db.select().from(vaultDocuments).orderBy(desc(vaultDocuments.createdAt));
    }

    async getVaultDocument(id: number): Promise<VaultDocument | undefined> {
        const [doc] = await db.select().from(vaultDocuments).where(eq(vaultDocuments.id, id));
        return doc;
    }

    async createVaultDocument(doc: Omit<VaultDocument, "id" | "createdAt" | "updatedAt">): Promise<VaultDocument> {
        const [d] = await db.insert(vaultDocuments).values(doc).returning();
        return d;
    }

    async updateVaultDocument(id: number, updates: Partial<VaultDocument>): Promise<VaultDocument> {
        const [d] = await db.update(vaultDocuments).set(updates).where(eq(vaultDocuments.id, id)).returning();
        return d;
    }

    async deleteVaultDocument(id: number): Promise<void> {
        await db.delete(vaultDocuments).where(eq(vaultDocuments.id, id));
    }

    // === TASKS ===
    async getTasks(): Promise<CcTask[]> {
        return await db.select().from(ccTasks).orderBy(desc(ccTasks.createdAt));
    }

    async getTask(id: number): Promise<CcTask | undefined> {
        const [t] = await db.select().from(ccTasks).where(eq(ccTasks.id, id));
        return t;
    }

    async createTask(task: Omit<CcTask, "id" | "createdAt" | "updatedAt" | "completedAt">): Promise<CcTask> {
        const [t] = await db.insert(ccTasks).values(task).returning();
        return t;
    }

    async updateTask(id: number, updates: Partial<CcTask>): Promise<CcTask> {
        const [t] = await db.update(ccTasks).set({ ...updates, updatedAt: new Date() }).where(eq(ccTasks.id, id)).returning();
        return t;
    }

    async deleteTask(id: number): Promise<void> {
        await db.delete(ccTasks).where(eq(ccTasks.id, id));
    }

    // === DECISIONS ===
    async getDecisions(): Promise<Decision[]> {
        return await db.select().from(decisions).orderBy(desc(decisions.createdAt));
    }

    async createDecision(decision: Omit<Decision, "id" | "createdAt">): Promise<Decision> {
        const [d] = await db.insert(decisions).values(decision).returning();
        return d;
    }

    // === ASSETS ===
    async getAssets(): Promise<CcAsset[]> {
        return await db.select().from(ccAssets).orderBy(desc(ccAssets.createdAt));
    }

    async getAsset(id: number): Promise<CcAsset | undefined> {
        const [a] = await db.select().from(ccAssets).where(eq(ccAssets.id, id));
        return a;
    }

    async createAsset(asset: Omit<CcAsset, "id" | "createdAt" | "updatedAt">): Promise<CcAsset> {
        const [a] = await db.insert(ccAssets).values(asset).returning();
        return a;
    }

    async updateAsset(id: number, updates: Partial<CcAsset>): Promise<CcAsset> {
        const [a] = await db.update(ccAssets).set({ ...updates, updatedAt: new Date() }).where(eq(ccAssets.id, id)).returning();
        return a;
    }

    // === INTERNAL MESSAGES ===
    async getInternalMessages(userId?: string): Promise<InternalMessage[]> {
        if (userId) {
            return await db.select().from(internalMessages).where(eq(internalMessages.recipientId, userId)).orderBy(desc(internalMessages.createdAt));
        }
        return await db.select().from(internalMessages).orderBy(desc(internalMessages.createdAt));
    }

    async sendInternalMessage(msg: Omit<InternalMessage, "id" | "createdAt">): Promise<InternalMessage> {
        const [m] = await db.insert(internalMessages).values(msg).returning();
        return m;
    }

    async markMessageRead(id: number): Promise<InternalMessage> {
        const [m] = await db.update(internalMessages).set({ isRead: true }).where(eq(internalMessages.id, id)).returning();
        return m;
    }

    // === INTEGRATION CONFIG ===
    async getIntegrationConfigs(): Promise<IntegrationConfig[]> {
        return await db.select().from(integrationConfig);
    }

    async updateIntegrationConfig(id: number, updates: Partial<IntegrationConfig>): Promise<IntegrationConfig> {
        const [c] = await db.update(integrationConfig).set({ ...updates, updatedAt: new Date() }).where(eq(integrationConfig.id, id)).returning();
        return c;
    }
}

export const ccStorage = new ControlCenterStorage();
