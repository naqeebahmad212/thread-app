import * as z from "zod";

export const userValidation = z.object({
    profile_photo: z.string().nonempty(),
    name: z.string().min(3,{message:"Name must be between 3 and 30 characters"}).max(30,{message:"Name must be between 3 and 30 characters"}),
    username: z.string().min(3,{message:"Username must be between 3 and 30 characters"}).max(30,{message:"Username must be between 3 and 30 characters"}),
    bio: z.string().min(3).max(1000),
    
})