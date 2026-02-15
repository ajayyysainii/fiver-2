import type { Express, Request, Response, NextFunction } from "express";
import { ccStorage } from "./cc-storage";
import { api } from "@shared/routes";
import { z } from "zod";
import {
    insertVaultDocumentSchema,
    insertCcTaskSchema,
    insertDecisionSchema,
    insertCcAssetSchema,
    insertInternalMessageSchema,
    insertAssistantSchema
} from "@shared/schema";
import { authStorage } from "./auth/storage";
import { seedControlCenter } from "./cc-seed";

// Middleware to require admin access
async function requireAdmin(req: Request, res: Response, next: NextFunction) {
    // Check if user is authenticated
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Get user from session
    const userId = (req.user as any)?.id;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch user from database to check admin status
    const user = await authStorage.getUser(userId);
    if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    next();
}

export function registerControlCenterRoutes(app: Express) {
    // Seed CC tables with initial data
    seedControlCenter().catch(console.error);

    // Apply admin middleware to all Control Center routes
    app.use("/api/cc", requireAdmin);
    app.use("/api/dashboard", requireAdmin);
    app.use("/api/campaigns", requireAdmin);
    app.use("/api/agents", requireAdmin);
    app.use("/api/system", requireAdmin);
    app.use("/api/assistants", requireAdmin);
    app.use("/api/conversations", requireAdmin);
    app.use("/api/vault", requireAdmin);
    app.use("/api/tasks", requireAdmin);
    app.use("/api/decisions", requireAdmin);
    app.use("/api/assets", requireAdmin);
    app.use("/api/messages", requireAdmin);
    app.use("/api/integrations", requireAdmin);

    // --- DASHBOARD ---
    app.get(api.dashboard.stats.path, async (req, res) => {
        const stats = await ccStorage.getDashboardStats();
        res.json(stats);
    });

    // --- CAMPAIGNS ---
    app.get(api.campaigns.list.path, async (req, res) => {
        const campaigns = await ccStorage.getCampaigns();
        res.json(campaigns);
    });

    // --- AGENTS ---
    app.get(api.agents.list.path, async (req, res) => {
        const agents = await ccStorage.getAgents();
        res.json(agents);
    });

    app.post(api.agents.control.path, async (req, res) => {
        const id = Number(req.params.id);
        const { status, version } = req.body;
        const agent = await ccStorage.updateAgent(id, { status, version });
        res.json(agent);
    });

    // --- SYSTEM METRICS ---
    app.get(api.system.metrics.path, async (req, res) => {
        const logs = await ccStorage.getAuditLogs();
        res.json({
            cpu: Math.floor(Math.random() * 30) + 10,
            memory: Math.floor(Math.random() * 40) + 20,
            uptime: 3600 * 24 * 3,
            errors: 2,
            logs,
        });
    });

    // --- FAMILY AI ASSISTANTS ---
    app.get(api.assistants.list.path, async (req, res) => {
        const list = await ccStorage.getAssistants();
        res.json(list);
    });

    app.get(api.assistants.get.path, async (req, res) => {
        const assistant = await ccStorage.getAssistant(Number(req.params.id));
        if (!assistant) return res.status(404).json({ message: "Assistant not found" });
        res.json(assistant);
    });

    app.put(api.assistants.update.path, async (req, res) => {
        try {
            const input = insertAssistantSchema.partial().parse(req.body);
            const assistant = await ccStorage.updateAssistant(Number(req.params.id), input);
            res.json(assistant);
        } catch (err) {
            res.status(500).json({ message: "Internal server error" });
        }
    });

    // --- CONVERSATIONS ---
    app.get(api.conversations.list.path, async (req, res) => {
        const userId = req.query.userId as string | undefined;
        const list = await ccStorage.getConversations(userId);
        res.json(list);
    });

    app.post(api.conversations.create.path, async (req, res) => {
        try {
            const userId = (req.user as any)?.id;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const { assistantId, title } = req.body;
            
            // Validate assistantId exists
            if (!assistantId) {
                return res.status(400).json({ message: "assistantId is required" });
            }
            
            const assistant = await ccStorage.getAssistant(Number(assistantId));
            if (!assistant) {
                return res.status(404).json({ message: "Assistant not found" });
            }
            
            const conv = await ccStorage.createConversation({ 
                userId, 
                assistantId: Number(assistantId), 
                title: title || "New Conversation" 
            });
            res.status(201).json(conv);
        } catch (err) {
            console.error("Error creating conversation:", err);
            res.status(500).json({ message: "Internal server error", details: String(err) });
        }
    });

    app.get(api.conversations.messages.path, async (req, res) => {
        const msgs = await ccStorage.getMessages(Number(req.params.id));
        res.json(msgs);
    });

    app.post(api.conversations.sendMessage.path, async (req, res) => {
        try {
            const conversationId = Number(req.params.id);
            const { role, content } = req.body;
            const msg = await ccStorage.createMessage({ conversationId, role, content });

            // If user message, generate AI response (simulated)
            if (role === "user") {
                const aiResponse = await ccStorage.createMessage({
                    conversationId,
                    role: "assistant",
                    content: generateAIResponse(content),
                });
                res.status(201).json(aiResponse);
            } else {
                res.status(201).json(msg);
            }
        } catch (err) {
            res.status(500).json({ message: "Internal server error" });
        }
    });

    // --- KNOWLEDGE VAULT ---
    app.get(api.vault.list.path, async (req, res) => {
        const docs = await ccStorage.getVaultDocuments();
        res.json(docs);
    });

    app.get(api.vault.get.path, async (req, res) => {
        const doc = await ccStorage.getVaultDocument(Number(req.params.id));
        if (!doc) return res.status(404).json({ message: "Document not found" });
        res.json(doc);
    });

    app.post(api.vault.create.path, async (req, res) => {
        try {
            const input = insertVaultDocumentSchema.parse(req.body);
            const doc = await ccStorage.createVaultDocument(input as any);
            res.status(201).json(doc);
        } catch (err) {
            if (err instanceof z.ZodError) {
                return res.status(400).json({ message: err.errors[0].message });
            }
            res.status(500).json({ message: "Internal server error" });
        }
    });

    app.put(api.vault.update.path, async (req, res) => {
        try {
            const doc = await ccStorage.updateVaultDocument(Number(req.params.id), req.body);
            res.json(doc);
        } catch (err) {
            res.status(500).json({ message: "Internal server error" });
        }
    });

    app.delete(api.vault.delete.path, async (req, res) => {
        await ccStorage.deleteVaultDocument(Number(req.params.id));
        res.status(204).send();
    });

    // --- TASKS ---
    app.get(api.tasks.list.path, async (req, res) => {
        const list = await ccStorage.getTasks();
        res.json(list);
    });

    app.get(api.tasks.get.path, async (req, res) => {
        const task = await ccStorage.getTask(Number(req.params.id));
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json(task);
    });

    app.post(api.tasks.create.path, async (req, res) => {
        try {
            const input = insertCcTaskSchema.parse(req.body);
            const task = await ccStorage.createTask(input as any);
            res.status(201).json(task);
        } catch (err) {
            if (err instanceof z.ZodError) {
                console.error("Zod validation errors:", JSON.stringify(err.errors, null, 2));
                return res.status(400).json({ message: err.errors[0].message, errors: err.errors });
            }
            console.error("Task creation error:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    });

    app.put(api.tasks.update.path, async (req, res) => {
        try {
            const task = await ccStorage.updateTask(Number(req.params.id), req.body);
            res.json(task);
        } catch (err) {
            res.status(500).json({ message: "Internal server error" });
        }
    });

    app.delete(api.tasks.delete.path, async (req, res) => {
        await ccStorage.deleteTask(Number(req.params.id));
        res.status(204).send();
    });

    // --- DECISIONS ---
    app.get(api.ccDecisions.list.path, async (req, res) => {
        const list = await ccStorage.getDecisions();
        res.json(list);
    });

    app.post(api.ccDecisions.create.path, async (req, res) => {
        try {
            const input = insertDecisionSchema.parse(req.body);
            const decision = await ccStorage.createDecision(input as any);
            res.status(201).json(decision);
        } catch (err) {
            if (err instanceof z.ZodError) {
                return res.status(400).json({ message: err.errors[0].message });
            }
            res.status(500).json({ message: "Internal server error" });
        }
    });

    // --- ASSETS ---
    app.get(api.ccAssets.list.path, async (req, res) => {
        const list = await ccStorage.getAssets();
        res.json(list);
    });

    app.get(api.ccAssets.get.path, async (req, res) => {
        const asset = await ccStorage.getAsset(Number(req.params.id));
        if (!asset) return res.status(404).json({ message: "Asset not found" });
        res.json(asset);
    });

    app.post(api.ccAssets.create.path, async (req, res) => {
        try {
            const input = insertCcAssetSchema.parse(req.body);
            const asset = await ccStorage.createAsset(input as any);
            res.status(201).json(asset);
        } catch (err) {
            if (err instanceof z.ZodError) {
                return res.status(400).json({ message: err.errors[0].message });
            }
            res.status(500).json({ message: "Internal server error" });
        }
    });

    app.put(api.ccAssets.update.path, async (req, res) => {
        try {
            const asset = await ccStorage.updateAsset(Number(req.params.id), req.body);
            res.json(asset);
        } catch (err) {
            res.status(500).json({ message: "Internal server error" });
        }
    });

    // --- INTERNAL MESSAGES ---
    app.get(api.internalMessages.list.path, async (req, res) => {
        const userId = req.query.userId as string | undefined;
        const list = await ccStorage.getInternalMessages(userId);
        res.json(list);
    });

    app.post(api.internalMessages.send.path, async (req, res) => {
        try {
            const input = insertInternalMessageSchema.parse(req.body);
            const msg = await ccStorage.sendInternalMessage(input as any);
            res.status(201).json(msg);
        } catch (err) {
            if (err instanceof z.ZodError) {
                return res.status(400).json({ message: err.errors[0].message });
            }
            res.status(500).json({ message: "Internal server error" });
        }
    });

    app.put(api.internalMessages.markRead.path, async (req, res) => {
        const msg = await ccStorage.markMessageRead(Number(req.params.id));
        res.json(msg);
    });

    // --- INTEGRATION CONFIG ---
    app.get(api.integrations.list.path, async (req, res) => {
        const configs = await ccStorage.getIntegrationConfigs();
        res.json(configs);
    });

    app.put(api.integrations.update.path, async (req, res) => {
        try {
            const config = await ccStorage.updateIntegrationConfig(Number(req.params.id), req.body);
            res.json(config);
        } catch (err) {
            res.status(500).json({ message: "Internal server error" });
        }
    });

    // --- FUTURE INTEGRATION PLACEHOLDERS (disabled) ---
    app.get("/api/legacy/sync", (req, res) => {
        res.status(503).json({ message: "Integration not yet active. FAMILY_LEGACY_PLATFORM=false" });
    });
    app.get("/api/legacy/users", (req, res) => {
        res.status(503).json({ message: "Integration not yet active. FAMILY_LEGACY_PLATFORM=false" });
    });
    app.get("/api/legacy/knowledge", (req, res) => {
        res.status(503).json({ message: "Integration not yet active. FAMILY_LEGACY_PLATFORM=false" });
    });
}

function generateAIResponse(userMessage: string): string {
    const lower = userMessage.toLowerCase();

    if (lower.includes("finance") || lower.includes("revenue") || lower.includes("money") || lower.includes("budget")) {
        return "I've reviewed the current financial data. Our position remains strong with consistent revenue growth. I'd recommend we discuss the quarterly allocation strategy at the next family meeting. Would you like me to prepare a detailed summary of asset performance?";
    }

    if (lower.includes("trust") || lower.includes("estate") || lower.includes("legal")) {
        return "Trust documentation should be reviewed annually. Based on our records, the last comprehensive review was completed recently. I can help you identify any areas that may need updating based on recent family changes. Shall I prepare a review checklist?";
    }

    if (lower.includes("task") || lower.includes("assign") || lower.includes("schedule")) {
        return "I can help organize that. Based on current priorities, I'd suggest scheduling this within the next two weeks. Would you like me to create a task entry and assign it to the appropriate family member?";
    }

    if (lower.includes("strategy") || lower.includes("plan") || lower.includes("future")) {
        return "Strategic planning is crucial for long-term family success. I'd recommend a three-horizon approach: short-term operational needs, medium-term growth initiatives, and long-term legacy preservation. Shall we explore any of these in detail?";
    }

    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
        return "Welcome to the Family Legacy Command Center. I'm here to assist you with any questions about family operations, assets, planning, or knowledge management. How can I help you today?";
    }

    return "I understand your inquiry. As your Family Legacy assistant, I'm here to help with strategic guidance, operational support, and knowledge management. Could you provide more details so I can assist you more effectively? I have access to family documents, task history, and strategic planning tools.";
}
