import { z } from 'zod';
import dayjs, { Dayjs } from "dayjs";

const subTaskSchema = z.object({
  description: z.string().min(1, "Description is required"),
  status: z.enum(["Done", "Not Done"]),
});

export const TodoFormSchema = z
  .object({
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
  due_at: z.instanceof(dayjs as unknown as typeof Dayjs),
  created_at: z.instanceof(dayjs as unknown as typeof Dayjs).optional(),
  slug: z.string().optional(),
  completed_at: z.instanceof(dayjs as unknown as typeof Dayjs).optional(),
  subtasks: z
    .array(subTaskSchema)
    .max(10, "You can add up to 10 subtasks only"),
  });
  