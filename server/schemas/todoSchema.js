import { z } from "zod";

const subTaskSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(25, "Description cannot be greater than 25 characters"),
  status: z.enum(["Done", "Not Done"]),
});

export const todoFormSchema = z.object({
  status: z.enum(["Not Started", "In Progress", "Cancelled", "Completed"]),
  priority: z.enum(["Critical", "High", "Low"]),
  title: z
    .string()
    .min(1, "Title is required")
    .max(25, "Maximum of 25 characters allowed"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(300, "Maximum of 300 characters allowed"),
  due_at: z.coerce.date(),
  created_at: z.coerce.date().optional(),
  slug: z.string().optional(),
  completed_at: z.coerce.date().optional().nullable(),
  subtasks: z
    .array(subTaskSchema)
    .max(10, "You can add up to 10 subtasks only"),
});
