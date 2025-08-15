// src/app/branch/add/form_validators.ts
import * as z from "zod";

/**
 * Zod schema for validating branch creation form data.
 * This schema ensures that:
 * - 'name' is a non-empty string, up to 255 characters.
 * - 'address' is an optional string.
 * - 'phone' is an optional string, validated for common phone number formats.
 * - 'head' is an optional string, representing the ID of the selected branch head.
 */
export const branchFormSchema = z.object({
  id: z.int().optional(),
  name: z
    .string()
    .min(1, "Branch name is required.")
    .max(255, "Name cannot exceed 255 characters."),
  address: z.string().optional(), // TextField can be blank/null
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]*$/, "Invalid phone number format.") // Allows optional +, digits, spaces, hyphens, parentheses
    .optional(),
  head: z.int().optional(), // OneToOneField with null=True, so it's optional on the frontend
});

// Infer the type from the schema for TypeScript usage
export type BranchFormValues = z.infer<typeof branchFormSchema>;