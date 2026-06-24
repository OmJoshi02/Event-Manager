import {z} from 'zod'

export const registerSchema = z.object({

    name : z.string().min(2),
    email : z.string().email(),
    mobile : z.string().min(10).max(10),
    password : z.string().min(6)
})

export const profileSchema = z.object({
    collegeName: z.string().min(2),
    department: z.string().min(2),
    year: z.coerce.number().min(1).max(4)
})