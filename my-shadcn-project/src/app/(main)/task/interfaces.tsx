import { z } from "zod";



// A lightweight user reference
interface UserDetails {
  id: number;
  email: string;
  full_name: string;
}

// A single Task object
export interface TaskInterface {
  id: number;
  assignees_details: UserDetails[];
  supporting_staff_details: UserDetails[];
  owner_details: UserDetails;
  title: string;
  description: string | null;
  actions_required: string[];
  status: "open" | "closed" | "in_progress" ; 
  created_at: string; 
  updated_at: string;  
  due_date: string;   
  closed_at: string | null;
  discarted: boolean;
  owner: number;
  assignees: number[];
  supporting_staff: number[];
}

export type Task = TaskInterface;

export type TaskResponse = Task[];




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
  owner: z.number(),
  assignees: z.array(z.number()),
  supporting_staff: z.array(z.number()),
  status: z.enum(["open", "closed", "in_progress"]),
  due_date: z.string()
    .min(1, "Due date is required")
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, "Due date cannot be in the past"),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;


// Mapper: convert Task -> TaskFormValues
export function mapTaskToFormValues(task: Task): TaskFormValues {
    const form_values: TaskFormValues = {
        id: task.id ?? undefined,
        title: task.title ?? "",
        description: task.description ?? "",
        actions_required: task.actions_required ?? [],
        owner: task.owner ?? 0,
        assignees: task.assignees ?? [],
        supporting_staff: task.supporting_staff ?? [],
        status: task.status ?? "open",
        due_date: task.due_date ?? ""
      }
  
    return form_values
}