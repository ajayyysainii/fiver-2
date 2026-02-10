import { db } from "./db";
import {
    campaigns,
    agents,
    auditLogs,
    assistants,
    vaultDocuments,
    ccTasks,
    decisions,
    ccAssets,
    internalMessages,
    integrationConfig,
} from "@shared/schema";

export async function seedControlCenter() {
    // Check if already seeded by looking at agents table
    const existingAgents = await db.select().from(agents).limit(1);
    if (existingAgents.length > 0) {
        console.log("Control Center already seeded, skipping...");
        return;
    }

    console.log("Seeding Control Center tables...");

    // Campaigns
    await db.insert(campaigns).values([
        { name: "Q1 Launch", status: "active", budget: 500000, spend: 120000, clicks: 5400, conversions: 210 },
        { name: "Retargeting Alpha", status: "paused", budget: 100000, spend: 45000, clicks: 1200, conversions: 45 },
        { name: "Influencer Push", status: "active", budget: 750000, spend: 300000, clicks: 8900, conversions: 560 },
    ]);

    // Agents
    await db.insert(agents).values([
        { name: "Mr. Reed", status: "active", version: "v4.2.0", capabilities: ["strategic_oversight", "anomaly_detection"], totalRequests: 1450, avgLatencyMs: 450 },
        { name: "SalesBot", status: "active", version: "v2.1.5", capabilities: ["lead_qualification", "email_outreach"], totalRequests: 8900, avgLatencyMs: 120 },
        { name: "SupportGenie", status: "maintenance", version: "v1.9.0", capabilities: ["ticket_triage", "faq_answering"], totalRequests: 3200, avgLatencyMs: 200 },
    ]);

    // Audit Logs
    await db.insert(auditLogs).values([
        { action: "SYSTEM_CONFIG_CHANGE", entity: "system", details: { setting: "maintenance_mode", value: false } },
        { action: "USER_SUSPEND", entity: "user", entityId: "5", details: { reason: "Suspicious activity" } },
        { action: "VAULT_UPLOAD", entity: "vault", entityId: "1", details: { filename: "family_charter.pdf" } },
        { action: "TASK_CREATE", entity: "task", entityId: "1", details: { title: "Review quarterly report" } },
    ]);

    // Family AI Assistants (Alkulous-powered)
    await db.insert(assistants).values([
        {
            name: "Legacy Advisor AI",
            type: "legacy_advisor",
            description: "Strategic guidance on family legacy planning, generational wealth, and long-term vision. Calm, wise, and discreet.",
            status: "active",
            personality: "Wise, measured, speaks with authority and warmth. Thinks in decades and generations.",
            capabilities: ["legacy_planning", "succession_advice", "strategic_insight"],
            model: "llama3",
        },
        {
            name: "Finance & Asset AI",
            type: "finance_asset",
            description: "Provides financial oversight summaries, asset tracking insights, and budget analysis. No direct transactions.",
            status: "active",
            personality: "Precise, detail-oriented, conservative in estimates. Uses clear financial language.",
            capabilities: ["financial_analysis", "asset_tracking", "budget_review"],
            model: "llama3",
        },
        {
            name: "Knowledge Archivist AI",
            type: "knowledge_archivist",
            description: "Manages the family knowledge vault. Summarizes documents, answers questions, cross-references history.",
            status: "active",
            personality: "Scholarly, thorough, excellent at synthesis and cross-referencing. Respects historical context.",
            capabilities: ["document_summary", "knowledge_search", "history_cross_reference"],
            model: "llama3",
        },
        {
            name: "Operations AI",
            type: "operations",
            description: "Assists with daily operations, task management, scheduling, and workflow optimization.",
            status: "active",
            personality: "Efficient, organized, action-oriented. Focuses on clarity and follow-through.",
            capabilities: ["task_management", "scheduling", "workflow_optimization"],
            model: "llama3",
        },
        {
            name: "Planning & Strategy AI",
            type: "planning_strategy",
            description: "Helps with long-term planning, scenario analysis, and strategic decision-making for the family.",
            status: "active",
            personality: "Thoughtful, analytical, forward-thinking. Considers multiple scenarios and outcomes.",
            capabilities: ["scenario_analysis", "strategic_planning", "risk_assessment"],
            model: "llama3",
        },
    ]);

    // Vault Documents
    await db.insert(vaultDocuments).values([
        {
            title: "Family Charter v3.1",
            description: "The core document outlining family values, mission, and governance structure.",
            content: "This charter establishes the guiding principles of the Reed Family Legacy...",
            fileType: "pdf",
            tags: ["governance", "charter", "founding"],
            generation: "1st Generation",
            importance: "critical",
        },
        {
            title: "Real Estate Holdings Summary",
            description: "Overview of all current real estate assets, valuations, and management contacts.",
            content: "Portfolio includes 3 commercial properties and 2 residential holdings...",
            fileType: "document",
            tags: ["real_estate", "assets", "quarterly"],
            generation: "Current",
            importance: "high",
        },
        {
            title: "Meeting Notes - Q4 Strategy Session",
            description: "Notes from the quarterly family strategy meeting covering upcoming initiatives.",
            content: "Attendees: Reed, Sarah, Mike. Discussed expansion into new markets...",
            fileType: "note",
            tags: ["meetings", "strategy", "quarterly"],
            generation: "Current",
            importance: "normal",
        },
        {
            title: "Trust Documentation - Reed Family Trust",
            description: "Legal documentation for the family trust including beneficiaries and terms.",
            fileType: "legal",
            tags: ["trust", "legal", "confidential"],
            generation: "1st Generation",
            importance: "critical",
        },
    ]);

    // Tasks
    await db.insert(ccTasks).values([
        { title: "Review quarterly financial report", description: "Analyze Q4 performance metrics and prepare summary for family meeting", status: "in_progress", priority: "high" },
        { title: "Update family charter section 4.2", description: "Incorporate new governance amendments discussed in last meeting", status: "pending", priority: "medium" },
        { title: "Schedule annual family retreat", description: "Coordinate dates and venue for the annual family planning retreat", status: "pending", priority: "low" },
        { title: "Review trust beneficiary designations", description: "Ensure all trust documentation is current with latest family changes", status: "pending", priority: "urgent" },
        { title: "Onboard new advisor", description: "Set up access and brief new family advisor on systems and protocols", status: "completed", priority: "medium" },
    ]);

    // Decisions
    await db.insert(decisions).values([
        { title: "Adopt Alkulous AI Framework", description: "Decided to use Alkulous as the core AI layer for all family assistants", reasoning: "Maintains privacy with local Ollama models, no cloud AI dependency", impact: "All AI assistants now run through Alkulous core", category: "technology" },
        { title: "Expand Real Estate Portfolio", description: "Approved acquisition of commercial property in downtown district", reasoning: "Strong ROI projections, aligns with diversification strategy", impact: "Adds $2.4M in managed assets", category: "investments" },
        { title: "Implement Role-Based Access", description: "Established tiered access system for family command center", reasoning: "Security and privacy require granular permissions", impact: "All family members now have role-appropriate access", category: "security" },
    ]);

    // Assets
    await db.insert(ccAssets).values([
        { name: "Reed Family Trust", type: "trust", status: "active", description: "Primary family trust holding core assets", estimatedValue: 5000000, metadata: { established: "2020", trustee: "Reed Admin" } },
        { name: "Downtown Commercial Building", type: "real_estate", status: "active", description: "Mixed-use commercial property, 3 floors", estimatedValue: 2400000, location: "123 Main St, Downtown" },
        { name: "Legacy Software IP", type: "intellectual_property", status: "active", description: "Proprietary software and algorithms for the Family Legacy platform", estimatedValue: 800000 },
        { name: "Family Legacy Platform", type: "project", status: "pending", description: "The public-facing Family Legacy platform (not yet connected)", metadata: { stage: "development", targetLaunch: "2026-Q3" } },
        { name: "Reed Consulting LLC", type: "business", status: "active", description: "Family consulting business for strategic advisory services", estimatedValue: 1200000 },
    ]);

    // Internal Messages (use generic sender/recipient since we don't have specific user IDs)
    // These will be created without senderId/recipientId references to avoid FK issues
    // In production, these would reference actual auth user IDs

    // Integration Config (placeholders - disabled by default)
    await db.insert(integrationConfig).values([
        { key: "FAMILY_LEGACY_PLATFORM", value: "false", enabled: false, description: "Connection to the public Family Legacy Platform. Not yet active." },
        { key: "API_SYNC_ENDPOINT", value: "/api/legacy/sync", enabled: false, description: "Sync endpoint for future platform integration." },
        { key: "API_USERS_ENDPOINT", value: "/api/legacy/users", enabled: false, description: "User sync endpoint for future platform integration." },
        { key: "API_KNOWLEDGE_ENDPOINT", value: "/api/legacy/knowledge", enabled: false, description: "Knowledge vault sync endpoint for future platform integration." },
        { key: "WEBHOOKS_ENABLED", value: "false", enabled: false, description: "External webhook notifications. Disabled by default for security." },
        { key: "ALKULOUS_CORE", value: "active", enabled: true, description: "Alkulous AI Core - routes all AI through local Ollama models." },
        { key: "OLLAMA_ENDPOINT", value: "http://localhost:11434", enabled: true, description: "Local Ollama model server endpoint." },
    ]);

    console.log("Control Center seeding complete!");
}
