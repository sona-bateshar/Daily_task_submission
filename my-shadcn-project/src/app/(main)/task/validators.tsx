// // validators.tsx 

import { z } from "zod";

export const taskFormSchema = z.object({
  id: z.number().optional(),
  title: z.string()
    .min(1, "Title is required")
    .max(255, "Title cannot exceed 255 characters"),
  description: z.string()
    .max(10000, "Description cannot exceed 10,000 characters")
    .optional()
    .or(z.literal("")),
  actions_required: z.array(z.string()),
  owner: z.number()
    .min(1, "Owner is required"), // This ensures owner must be greater than 0
  assignees: z.array(z.number()),
  supporting_staff: z.array(z.number()),
  status: z.enum(["open", "closed"]),
  due_date: z.string()
    .min(1, "Due date is required")
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, "Due date cannot be in the past"),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;