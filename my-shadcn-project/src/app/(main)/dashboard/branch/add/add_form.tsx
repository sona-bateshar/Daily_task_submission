"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { branchFormSchema, type BranchFormValues } from "./validators";

// Import our utilities
import {
  processDataToFormOptions,
  type FormOption,
} from "@/utilities/processDataToFormOptions";
import {
  FormCombobox,
  type ComboboxOption,
} from "@/components/ui/form-combobox";

// Shadcn UI components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AutoSizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";

import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { postBranch, CompanyProfilelist } from "@/api/company";

// Type for the API response
interface BranchHead {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
}

// Convert FormOption to ComboboxOption
const convertToComboboxOptions = (
  formOptions: FormOption[]
): ComboboxOption[] => {
  return formOptions.map((option) => ({
    id: option.id,
    label: option.label,
    description: option.originalData?.email,
    ...option.originalData, // Include original data for additional access
  }));
};

// Fetch branch heads and process them
const getBranchManagerOptions = async (): Promise<ComboboxOption[]> => {
  try {
    const response = await CompanyProfilelist();
    const branchHeads: BranchHead[] = response.data;

    console.log("Raw branch heads data:", branchHeads);

    // First process with our form options utility
    const formOptions = processDataToFormOptions({
      data: branchHeads,
      idField: "id",
      labelFields: ["first_name", "middle_name", "last_name"],
      searchFields: ["email"],
      fallbackField: "email",
    });

    // Then convert to combobox format
    const comboboxOptions = convertToComboboxOptions(formOptions);

    console.log("Processed combobox options:", comboboxOptions);
    return comboboxOptions;
  } catch (error) {
    console.error("Failed to get branch manager options:", error);
    return [];
  }
};

export function AddForm() {
  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      id: undefined,
      name: "",
      address: "",
      phone: "",
      head: undefined,
    },
  });

  // State management
  const [branchHeads, setBranchHeads] = React.useState<ComboboxOption[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch branch heads on component mount
  React.useEffect(() => {
    const fetchBranchHeads = async () => {
      try {
        const data = await getBranchManagerOptions();
        setBranchHeads(data);
      } catch (error) {
        console.error("Error fetching branch heads:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranchHeads();
  }, []);

  // Form submission handler
  const onSubmit = async (formdata: BranchFormValues) => {
    console.log("🚀 Form submit triggered!");
    console.log("📝 Form data received:", formdata);

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await postBranch(formdata);
      console.log("✅ API response:", response);

      setSuccessMessage(response.data?.message || "Branch added successfully!");
      form.reset();
    } catch (err: any) {
      console.error("❌ API error:", err);

      const backendErrors = err.response?.data;
      let nonFieldErrors: string[] = [];
      let fieldErrorsExist = false;

      if (backendErrors) {
        for (const fieldName in backendErrors) {
          if (Object.prototype.hasOwnProperty.call(backendErrors, fieldName)) {
            if (Object.keys(formdata).includes(fieldName)) {
              form.setError(fieldName as keyof BranchFormValues, {
                type: "server",
                message: backendErrors[fieldName][0],
              });
              fieldErrorsExist = true;
            } else {
              nonFieldErrors = nonFieldErrors.concat(backendErrors[fieldName]);
            }
          }
        }
      }

      if (!fieldErrorsExist && nonFieldErrors.length > 0) {
        setError(nonFieldErrors.join(", "));
      } else if (!fieldErrorsExist) {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading branch heads...</div>;
  }

  return (
    <div className="space-y-6">
      <h2>Add New Branch</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Branch Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Main Street Branch" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address Field */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <AutoSizeTextarea
                    placeholder="e.g., 123 Main St, City, Country"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Field */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., +1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Branch Head Field - Using our reusable combobox */}
          <FormField
            control={form.control}
            name="head"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FormCombobox
                    label="Branch Head"
                    options={branchHeads}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select branch head..."
                    searchPlaceholder="Search by name or email..."
                    emptyMessage="No branch heads found."
                    maxSelections={1}
                    clearable={true}
                    showDescription={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert>
              <CheckCircle2Icon />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding branch..." : "Add Branch"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
