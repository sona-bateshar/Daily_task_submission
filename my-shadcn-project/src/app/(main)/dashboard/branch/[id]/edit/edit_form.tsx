"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

import { branchFormSchema, type BranchFormValues } from "../../add/validators";

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

import { AlertCircleIcon, CheckCircle2Icon, LoaderIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { getBranch, patchBranch, CompanyProfilelist } from "@/api/company";

// Type for the API response
interface BranchHead {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
}

// Type for branch data from API
interface BranchData {
  id: number;
  name: string;
  address: string;
  phone: string;
  head: number | null;
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

export function EditForm() {
  const params = useParams();
  const router = useRouter();
  const branchId = String(params.id);

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
  const [branchHeads, setBranchHeads] = useState<ComboboxOption[]>([]);
  const [branchData, setBranchData] = useState<BranchData | null>(null);
  const [isLoadingHeads, setIsLoadingHeads] = useState(true);
  const [isLoadingBranch, setIsLoadingBranch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Remove the two separate useEffect hooks.
  // Replace them with this single one.
  useEffect(() => {
    const fetchData = async () => {
      if (!branchId) return;

      try {
        // 1. Fetch branch details first
        console.log("Fetching branch details for ID:", branchId);
        const branchResponse = await getBranch(branchId);
        const branch: BranchData = branchResponse.data;
        setBranchData(branch);

        // Pre-fill the form with existing data after a successful call
        form.reset({
          id: branch.id,
          name: branch.name || "",
          address: branch.address || "",
          phone: branch.phone || "",
          head: branch.head || undefined,
        });

        // 2. Then, fetch branch heads options
        console.log("Fetching branch heads...");
        const headsData = await getBranchManagerOptions();
        setBranchHeads(headsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load branch details. Please try again.");
      } finally {
        // Set both loading states to false at the same time
        setIsLoadingBranch(false);
        setIsLoadingHeads(false);
      }
    };

    fetchData();
  }, [branchId, form]);

  // // Fetch branch details on component mount
  // useEffect(() => {
  //   const fetchBranchDetails = async () => {
  //     if (!branchId) return;

  //     try {
  //       console.log("Fetching branch details for ID:", branchId);
  //       const response = await getBranch(branchId);
  //       const branch: BranchData = response.data;

  //       console.log("Branch data received:", branch);
  //       setBranchData(branch);

  //       // Pre-fill the form with existing data
  //       form.reset({
  //         id: branch.id,
  //         name: branch.name || "",
  //         address: branch.address || "",
  //         phone: branch.phone || "",
  //         head: branch.head || undefined,
  //       });

  //     } catch (error) {
  //       console.error("Error fetching branch details:", error);
  //       setError("Failed to load branch details. Please try again.");
  //     } finally {
  //       setIsLoadingBranch(false);
  //     }
  //   };

  //   fetchBranchDetails();
  // }, [branchId, form]);

  // // Fetch branch heads on component mount
  // useEffect(() => {
  //   const fetchBranchHeads = async () => {
  //     try {
  //       const data = await getBranchManagerOptions();
  //       setBranchHeads(data);
  //     } catch (error) {
  //       console.error("Error fetching branch heads:", error);
  //     } finally {
  //       setIsLoadingHeads(false);
  //     }
  //   };

  //   fetchBranchHeads();
  // }, []);

  // Form submission handler
  const onSubmit = async (formdata: BranchFormValues) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Include the branch ID in the form data for the update
      const updateData = {
        ...formdata,
        id: parseInt(branchId),
      };

      const response = await patchBranch(branchId, formdata);
      console.log("✅ API response:", response);

      setSuccessMessage(
        response.data?.message || "Branch updated successfully!"
      );

      // Optionally redirect back to branch list or stay on edit form
      // router.push('/branches'); // Uncomment to redirect after successful update
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

  // Show loading state while fetching data
  if (isLoadingHeads || isLoadingBranch) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoaderIcon className="h-6 w-6 animate-spin mr-2" />
        <span>Loading branch details...</span>
      </div>
    );
  }

  // Show error if branch couldn't be loaded
  if (!branchData && !isLoadingBranch) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertDescription>
            Failed to load branch details. Please check if the branch exists and
            try again.
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2>Edit Branch</h2>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

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
                  <Input
                    placeholder="e.g., Main Street Branch"
                    {...field}
                    value={field.value || ""}
                  />
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
                    value={field.value || ""}
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
                  <Input
                    placeholder="e.g., +1 (555) 123-4567"
                    {...field}
                    value={field.value || ""}
                  />
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

          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <>
                  <LoaderIcon className="h-4 w-4 animate-spin mr-2" />
                  Updating branch...
                </>
              ) : (
                "Update Branch"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
