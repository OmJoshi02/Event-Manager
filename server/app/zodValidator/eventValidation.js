import { z } from 'zod'

export const eventSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(10),
    date: z.string(),
    venue: z.string(),
    registrationFee: z.coerce.number(),
    maxParticipants: z.coerce.number().positive(),
    registrationDeadline: z.string(),
    status: z.enum([
        'upcoming',
        'ongoing',
        'completed',
        'cancelled'
    ])
})