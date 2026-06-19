import {z} from 'zod'

export const eventSchema = z.object({
    name : z.string().trim().min(3, 'Event name must be greater than 2 chars'),
    
    description : z.string().trim().min(10, 'Description must be more than 10 chars')
})