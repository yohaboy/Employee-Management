import { z } from 'zod'

// Authentication schemas
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
})

export const createNodeSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    position: z.string().min(2, 'Position must be at least 2 characters'),
})

// Letter schemas
export const createLetterSchema = z.object({
    subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
    body: z.string().min(1, 'Body is required'),
    receiverId: z.string().uuid('Invalid receiver ID'),
    category: z.enum(['RESPONSE_REQUIRED', 'NO_RESPONSE_REQUIRED']),
    parentId: z.string().uuid('Invalid parent ID').nullable().optional(),
})

export const updateLetterSchema = z.object({
    subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long').optional(),
    body: z.string().min(1, 'Body is required').optional(),
})

export const signLetterSchema = z.object({
    response: z.string().optional(),
})

// Type exports
export type LoginInput = z.infer<typeof loginSchema>
export type CreateNodeInput = z.infer<typeof createNodeSchema>
export type CreateLetterInput = z.infer<typeof createLetterSchema>
export type UpdateLetterInput = z.infer<typeof updateLetterSchema>
export type SignLetterInput = z.infer<typeof signLetterSchema>
