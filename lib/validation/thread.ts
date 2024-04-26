import * as z from "zod";

export const threadValidation = z.object({
    accountId: z.string(),
    thread: z.string().min(3,{message:"Name must be between 3 and 600 characters"}).max(600,{message:"Name must be between 3 and 30 characters"}),
   
    
})


export const commentValidation = z.object({
    thread: z.string().min(3,{message:"Name must be between 3 and 600 characters"}).max(600,{message:"Name must be between 3 and 30 characters"}),
   
    
})