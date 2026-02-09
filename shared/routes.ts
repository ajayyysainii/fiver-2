import { z } from 'zod';
import {
  insertProfileSchema,
  profiles,
  // Control Center imports
  agents,
  campaigns,
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
  insertAssistantSchema,
  insertConversationSchema,
  insertCcMessageSchema,
  insertVaultDocumentSchema,
  insertCcTaskSchema,
  insertDecisionSchema,
  insertCcAssetSchema,
  insertInternalMessageSchema,
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  profiles: {
    get: {
      method: 'GET' as const,
      path: '/api/profile',
      responses: {
        200: z.custom<typeof profiles.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/profile',
      input: insertProfileSchema,
      responses: {
        201: z.custom<typeof profiles.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/profile',
      input: insertProfileSchema.partial(),
      responses: {
        200: z.custom<typeof profiles.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/profile',
      responses: {
        200: z.object({ message: z.string() }),
        404: errorSchemas.notFound,
      },
    },
    mockPayment: {
      method: 'POST' as const,
      path: '/api/profile/mock-payment',
      input: z.object({
        type: z.enum(['one-time', 'subscription']),
        tier: z.enum(['gold', 'platinum', 'uranium']).optional(),
      }),
      responses: {
        200: z.custom<typeof profiles.$inferSelect>(),
      },
    },
    validateMarketplace: {
      method: 'GET' as const,
      path: '/api/marketplace/validate',
      responses: {
        200: z.object({
          valid: z.boolean(),
          message: z.string()
        }),
      },
    }
  },
  payments: {
    onetime: {
      method: 'POST' as const,
      path: '/api/payments/onetime',
      responses: { 200: z.custom<typeof profiles.$inferSelect>() }
    },
    subscribe: {
      method: 'POST' as const,
      path: '/api/payments/subscribe',
      input: z.object({ tier: z.enum(['gold', 'platinum', 'uranium']) }),
      responses: { 200: z.custom<typeof profiles.$inferSelect>() }
    }
  },
  marketplace: {
    validate: {
      method: 'GET' as const,
      path: '/api/marketplace/validate',
      responses: {
        200: z.object({ valid: z.boolean(), message: z.string() }),
        403: z.object({ valid: z.boolean(), message: z.string() }),
      }
    }
  },

  // ============================
  // CONTROL CENTER API ROUTES
  // ============================

  // --- DASHBOARD ---
  dashboard: {
    stats: {
      method: 'GET' as const,
      path: '/api/cc/dashboard/stats',
      responses: {
        200: z.object({
          revenueToday: z.number(),
          revenueMonth: z.number(),
          activeUsers: z.number(),
          newUsers: z.number(),
          conversionRate: z.number(),
          systemHealth: z.enum(["healthy", "degraded", "down"]),
          openTickets: z.number(),
          activeCampaigns: z.number(),
          totalTasks: z.number(),
          pendingTasks: z.number(),
          totalAssets: z.number(),
          unreadMessages: z.number(),
          vaultDocuments: z.number(),
        }),
      },
    },
  },

  // --- CAMPAIGNS ---
  campaigns: {
    list: {
      method: 'GET' as const,
      path: '/api/cc/campaigns',
      responses: {
        200: z.array(z.custom<typeof campaigns.$inferSelect>()),
      },
    },
  },

  // --- AGENTS (Mr. Reed / ALKULOUS) ---
  agents: {
    list: {
      method: 'GET' as const,
      path: '/api/cc/agents',
      responses: {
        200: z.array(z.custom<typeof agents.$inferSelect>()),
      },
    },
    control: {
      method: 'POST' as const,
      path: '/api/cc/agents/:id/control',
      input: z.object({
        status: z.enum(["active", "disabled", "maintenance"]),
        version: z.string().optional(),
      }),
      responses: {
        200: z.custom<typeof agents.$inferSelect>(),
      },
    },
  },

  // --- SYSTEM HEALTH ---
  system: {
    metrics: {
      method: 'GET' as const,
      path: '/api/cc/system/metrics',
      responses: {
        200: z.object({
          cpu: z.number(),
          memory: z.number(),
          uptime: z.number(),
          errors: z.number(),
          logs: z.array(z.custom<typeof auditLogs.$inferSelect>()),
        }),
      },
    },
  },

  // --- FAMILY AI ASSISTANTS ---
  assistants: {
    list: {
      method: 'GET' as const,
      path: '/api/cc/assistants',
      responses: {
        200: z.array(z.custom<typeof assistants.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/cc/assistants/:id',
      responses: {
        200: z.custom<typeof assistants.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/cc/assistants/:id',
      input: insertAssistantSchema.partial(),
      responses: {
        200: z.custom<typeof assistants.$inferSelect>(),
      },
    },
  },

  // --- CONVERSATIONS ---
  conversations: {
    list: {
      method: 'GET' as const,
      path: '/api/cc/conversations',
      input: z.object({
        assistantId: z.string().optional(),
        userId: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof conversations.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/cc/conversations',
      input: insertConversationSchema,
      responses: {
        201: z.custom<typeof conversations.$inferSelect>(),
      },
    },
    messages: {
      method: 'GET' as const,
      path: '/api/cc/conversations/:id/messages',
      responses: {
        200: z.array(z.custom<typeof ccMessages.$inferSelect>()),
      },
    },
    sendMessage: {
      method: 'POST' as const,
      path: '/api/cc/conversations/:id/messages',
      input: z.object({
        role: z.string(),
        content: z.string(),
      }),
      responses: {
        201: z.custom<typeof ccMessages.$inferSelect>(),
      },
    },
  },

  // --- KNOWLEDGE VAULT ---
  vault: {
    list: {
      method: 'GET' as const,
      path: '/api/cc/vault',
      input: z.object({
        search: z.string().optional(),
        tag: z.string().optional(),
        generation: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof vaultDocuments.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/cc/vault/:id',
      responses: {
        200: z.custom<typeof vaultDocuments.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/cc/vault',
      input: insertVaultDocumentSchema,
      responses: {
        201: z.custom<typeof vaultDocuments.$inferSelect>(),
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/cc/vault/:id',
      input: insertVaultDocumentSchema.partial(),
      responses: {
        200: z.custom<typeof vaultDocuments.$inferSelect>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/cc/vault/:id',
      responses: {
        204: z.void(),
      },
    },
  },

  // --- TASKS ---
  tasks: {
    list: {
      method: 'GET' as const,
      path: '/api/cc/tasks',
      input: z.object({
        status: z.string().optional(),
        priority: z.string().optional(),
        assignedTo: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof ccTasks.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/cc/tasks/:id',
      responses: {
        200: z.custom<typeof ccTasks.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/cc/tasks',
      input: insertCcTaskSchema,
      responses: {
        201: z.custom<typeof ccTasks.$inferSelect>(),
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/cc/tasks/:id',
      input: insertCcTaskSchema.partial(),
      responses: {
        200: z.custom<typeof ccTasks.$inferSelect>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/cc/tasks/:id',
      responses: {
        204: z.void(),
      },
    },
  },

  // --- DECISIONS ---
  ccDecisions: {
    list: {
      method: 'GET' as const,
      path: '/api/cc/decisions',
      responses: {
        200: z.array(z.custom<typeof decisions.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/cc/decisions',
      input: insertDecisionSchema,
      responses: {
        201: z.custom<typeof decisions.$inferSelect>(),
      },
    },
  },

  // --- ASSETS ---
  ccAssets: {
    list: {
      method: 'GET' as const,
      path: '/api/cc/assets',
      input: z.object({
        type: z.string().optional(),
        status: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof ccAssets.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/cc/assets/:id',
      responses: {
        200: z.custom<typeof ccAssets.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/cc/assets',
      input: insertCcAssetSchema,
      responses: {
        201: z.custom<typeof ccAssets.$inferSelect>(),
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/cc/assets/:id',
      input: insertCcAssetSchema.partial(),
      responses: {
        200: z.custom<typeof ccAssets.$inferSelect>(),
      },
    },
  },

  // --- INTERNAL MESSAGES ---
  internalMessages: {
    list: {
      method: 'GET' as const,
      path: '/api/cc/messages',
      input: z.object({
        userId: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof internalMessages.$inferSelect>()),
      },
    },
    send: {
      method: 'POST' as const,
      path: '/api/cc/messages',
      input: insertInternalMessageSchema,
      responses: {
        201: z.custom<typeof internalMessages.$inferSelect>(),
      },
    },
    markRead: {
      method: 'PUT' as const,
      path: '/api/cc/messages/:id/read',
      responses: {
        200: z.custom<typeof internalMessages.$inferSelect>(),
      },
    },
  },

  // --- INTEGRATION CONFIG ---
  integrations: {
    list: {
      method: 'GET' as const,
      path: '/api/cc/integrations',
      responses: {
        200: z.array(z.custom<typeof integrationConfig.$inferSelect>()),
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/cc/integrations/:id',
      input: z.object({
        enabled: z.boolean().optional(),
        value: z.string().optional(),
      }),
      responses: {
        200: z.custom<typeof integrationConfig.$inferSelect>(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPE HELPERS
// ============================================
export type DashboardStatsResponse = z.infer<typeof api.dashboard.stats.responses[200]>;
export type CampaignResponse = z.infer<typeof api.campaigns.list.responses[200]>[number];
export type AgentResponse = z.infer<typeof api.agents.list.responses[200]>[number];
export type SystemMetricsResponse = z.infer<typeof api.system.metrics.responses[200]>;
export type AssistantResponse = z.infer<typeof api.assistants.list.responses[200]>[number];
export type ConversationResponse = z.infer<typeof api.conversations.list.responses[200]>[number];
export type CcMessageResponse = z.infer<typeof api.conversations.messages.responses[200]>[number];
export type VaultDocumentResponse = z.infer<typeof api.vault.list.responses[200]>[number];
export type CcTaskResponse = z.infer<typeof api.tasks.list.responses[200]>[number];
export type DecisionResponse = z.infer<typeof api.ccDecisions.list.responses[200]>[number];
export type CcAssetResponse = z.infer<typeof api.ccAssets.list.responses[200]>[number];
export type InternalMessageResponse = z.infer<typeof api.internalMessages.list.responses[200]>[number];
