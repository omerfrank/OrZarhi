import { z } from 'zod';

export const VaddMovie = z.object({
    title: z.string().min(1, "Title is required").trim(),
    description: z.string().optional(), // Defined as required: false in model
    // Expecting an array of strings for genres
    genre: z.array(z.string()).min(1, "At least one genre is required"), 
    // Coerce converts the input string to a Date object automatically
    releaseDate: z.coerce.date(), 
    posterURL: z.string().url("Must be a valid URL"),
    // Validate that cast is an array of strings (ObjectIds)
    cast: z.array(z.string()).optional() 
});