"use client";

import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { taskFormSchema, type TaskFormValues } from "../validators";

// Import our utilities
import { processDataToFormOptions, type FormOption } from "@/utilities/processDataToFormOptions";
import { FormCombobox, type ComboboxOption } from "@/components/ui/form-combobox";

// Shadcn UI components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AutoSizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Calendar28 from "@/components/calendar-28"
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

import { CompanyProfilelist } from '@/api/company';
import { postTask } from '@/api/task';
import TagInput from "@/components/TagInput"


// Type for the API response (CompanyProfile)
interface CompanyProfile {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
}

// Convert FormOption to ComboboxOption
const convertToComboboxOptions = (formOptions: FormOption[]): ComboboxOption[] => {
  return formOptions.map(option => ({
    id: option.id,
    label: option.label,
    description: option.originalData?.email,
    ...option.originalData // Include original data for additional access
  }));
};

// Fetch company profiles and process them
const getCompanyProfileOptions = async (): Promise<ComboboxOption[]> => {
  try {
    const response = await CompanyProfilelist(); 
    const profiles: CompanyProfile[] = response.data;

    console.log("Raw company profiles data:", profiles);

    // First process with our form options utility
    const formOptions = processDataToFormOptions({
      data: profiles,
      idField: 'id',
      labelFields: ['first_name', 'middle_name', 'last_name'],
      searchFields: ['email'],
      fallbackField: 'email'
    });

    // Then convert to combobox format
    const comboboxOptions = convertToComboboxOptions(formOptions);

    console.log("Processed combobox options:", comboboxOptions);
    return comboboxOptions;
  } catch (error) {
    console.error("Failed to get company profile options:", error);
    return [];
  }
}; 

export function AddForm() {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      id: undefined,
      title: "",
      description: "",
      actions_required: [], // Changed from undefined to []
      owner: 0, // Changed from undefined to 0 (will need validation)
      assignees: [], // Changed from undefined to []
      supporting_staff: [], // Changed from undefined to []
      status: "open",
      due_date: "",
    },
  });

  // State management
  const [companyProfiles, setCompanyProfiles] = React.useState<ComboboxOption[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [actionInput, setActionInput] = useState("");

  // Fetch company profiles on component mount
  React.useEffect(() => {
    const fetchCompanyProfiles = async () => {
      try {
        const data = await getCompanyProfileOptions();
        setCompanyProfiles(data);
      } catch (error) {
        console.error("Error fetching company profiles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyProfiles();
  }, []);

  // Handle adding actions
  const addAction = () => {
    if (actionInput.trim()) {
      const currentActions = form.getValues("actions_required") || [];
      form.setValue("actions_required", [...currentActions, actionInput.trim()]);
      setActionInput("");
    }
  };

  // Handle removing actions
  const removeAction = (index: number) => {
    const currentActions = form.getValues("actions_required") || [];
    const updatedActions = currentActions.filter((_, i) => i !== index);
    form.setValue("actions_required", updatedActions);
  };

  // Handle key press for actions
  const handleActionKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addAction();
    }
  };

  // Form submission handler
  const onSubmit = async (formdata: TaskFormValues) => {
    console.log("🚀 Task form submit triggered!");
    console.log("📝 Task form data received:", formdata);

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await postTask(formdata);
      console.log("✅ API response:", response);

      setSuccessMessage(response.data?.message || "Task added successfully!");
      form.reset({
        id: undefined,
        title: "",
        description: "",
        actions_required: [],
        owner: 0,
        assignees: [],
        supporting_staff: [],
        status: "open",
        due_date: "",
      });
      setActionInput("");
      
    } catch (err: any) {
      console.error("❌ API error:", err);
      
      const backendErrors = err.response?.data;
      let nonFieldErrors: string[] = [];
      let fieldErrorsExist = false;

      if (backendErrors) {
        for (const fieldName in backendErrors) {
          if (Object.prototype.hasOwnProperty.call(backendErrors, fieldName)) {
            if (Object.keys(formdata).includes(fieldName)) {
              form.setError(fieldName as keyof TaskFormValues, {
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
    return <div>Loading company profiles...</div>;
  }

  const actionsRequired = form.watch("actions_required") || [];

  return (
    <div className="space-y-6">
      <h2>Add New Task</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Task Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Complete project documentation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <AutoSizeTextarea 
                    placeholder="Detailed description of the task..." 
                    {...field} 
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Actions Required Field */}
          <FormField
            control={form.control}
            name="actions_required"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Actions Required</FormLabel>
                <FormControl>
                  <TagInput
                    // label="Actions Required"
                    placeholder="Add an action item..."
                    initialTags={actionsRequired}
                    maxTags={10}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          

          {/* Owner Field */}
          <FormField
            control={form.control}
            name="owner"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FormCombobox
                    label="Task Owner"
                    options={companyProfiles}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select task owner..."
                    searchPlaceholder="Search by name or email..."
                    emptyMessage="No profiles found."
                    maxSelections={1}
                    clearable={true}
                    showDescription={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Assignees Field */}
          <FormField
            control={form.control}
            name="assignees"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FormCombobox
                    label="Assignees"
                    options={companyProfiles}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select assignees..."
                    searchPlaceholder="Search by name or email..."
                    emptyMessage="No profiles found."
                    maxSelections={10} // Allow multiple selections
                    clearable={true}
                    showDescription={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* // Supporting Staff Field */}
          <FormField
            control={form.control}
            name="supporting_staff"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FormCombobox
                    label="Supporting Staff"
                    options={companyProfiles}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select supporting staff..."
                    searchPlaceholder="Search by name or email..."
                    emptyMessage="No profiles found."
                    maxSelections={10} // Allow multiple selections
                    clearable={true}
                    showDescription={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Due Date Field with Calendar-28 Component */}
          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Calendar28
                    {...field}
                    disabledDates={[
                      { dayOfWeek: [0, 6] },  // Disable weekends
                      { before: new Date() }  // Disable past dates
                    ]}
                  />
                  {/* <Calendar28
                    {...field}
                    disabled={[
                              { dayOfWeek: [0, 6] },
                              { before: new Date(2025, 5, 12) }
                            ]}
                  /> */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          

          {/* Due Date Field */}
          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field}
                    min={new Date().toISOString().split('T')[0]}
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
            {loading ? "Adding task..." : "Add Task"}
          </Button>
        </form>
      </Form>
    </div>
  );
};







// {/* Status Field */}
//           <FormField
//             control={form.control}
//             name="status"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Status</FormLabel>
//                 <FormControl>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="open">Open</SelectItem>
//                       <SelectItem value="closed">Closed</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />