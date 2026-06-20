import {z} from 'zod'

export const registerSchema = z.object({

    name : z.string().min(2),
    email : z.string().email(),
    mobile : z.string().min(10).max(10),
    password : z.string().min(6)
})