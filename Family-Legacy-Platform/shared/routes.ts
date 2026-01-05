import { z } from 'zod';
import { insertProfileSchema, profiles } from './schema';

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
  }
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
