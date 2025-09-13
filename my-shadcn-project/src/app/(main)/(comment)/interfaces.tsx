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



export type CommentInterface = {
  id:number
  task: number;
  user: number;
  user_details: UserDetails;
  description: string;
  created_at: string;
  updated_at:string;
  task_details : TaskInterface | undefined;
  tags : string[] | undefined;

}

export type Comment = CommentInterface;

export type CommentResponse = Comment[];

// Schema for Comment
export const commentFormSchema = z.object({
  id: z.number().optional(),
  task: z.number(),
  user: z.number(),
  description: z.string()
    .min(1, "Description is required")
    .max(5000, "Description cannot exceed 5000 characters")
})

export type CommentFormValues = z.infer<typeof commentFormSchema>

// Mapper: convert Comment -> CommentFormValues
export function mapCommentToFormValues(comment: CommentInterface): CommentFormValues {
  const form_values: CommentFormValues = {
    id: comment.id,
    task: comment.task,
    user: comment.user,
    description: comment.description ?? ""
  }

  return form_values
}
