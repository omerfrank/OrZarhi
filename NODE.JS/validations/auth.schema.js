import { z } from 'zod';

export const Vlogin = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters long")
});

export const Vregister = z.object({
  username: z.string().min(2),
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters long")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
});

export const VupdateUser = z.object({

  email: z.email().optional(), 
  
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
    .optional(),
});