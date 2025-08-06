// src/app/branch/add/add_form.tsx
"use client"; // This component uses client-side hooks like useForm, so it must be a client component.

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react"; // For combobox icons

import { cn } from "@/lib/utils"; // Utility for combining class names
import { branchFormSchema, type BranchFormValues } from "./validators"; // Our Zod schema

// Shadcn UI components (assuming these paths are correct relative to your project root)
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {AutoSizeTextarea} from "@/components/ui/autosize-textarea"
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";

// --- Mock Data for Branch Head (replace with actual API fetch later) ---
// In a real application, you would fetch this list from your backend API.
const mockBranchHeads = [
  { id: "user-1", fullName: "Alice Smith", email: "alice@example.com" },
  { id: "user-2", fullName: "Bob Johnson", email: "bob@example.com" },
  { id: "user-3", fullName: "Charlie Brown", email: "charlie@example.com" },
  { id: "user-4", fullName: "Diana Prince", email: "diana@example.com" },
  { id: "user-5", fullName: "Eve Adams", email: "eve@example.com" },
];
// ---------------------------------------------------------------------

export function AddForm() {
  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      head: "", // Initialize head as an empty string
    },
  });

  // State to manage the open/closed state of the combobox popover
  const [openCombobox, setOpenCombobox] = React.useState(false);

  // Function to handle form submission
  function onSubmit(values: BranchFormValues) {
    console.log("Submitting Branch Data:", values);
    // Here you would typically send this data to your backend API
    // e.g., fetch('/api/branches', { method: 'POST', body: JSON.stringify(values) });
    // You might also want to reset the form or show a success message
    form.reset();
  }

  return (
    <div className="space-y-6">
      <h2 >Add New Branch</h2>
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
                    
                  {/* Using a textarea for address for multi-line input
                  <textarea
                    placeholder="e.g., 123 Main St, City, Country"
                    {...field}
                  /> */}
                  <AutoSizeTextarea placeholder="e.g., 123 Main St, City, Country" {...field} />
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

          {/* Branch Head Field (Searchable Combobox) */}
          <FormField
            control={form.control}
            name="head"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Branch Head</FormLabel>
                <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCombobox}
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? mockBranchHeads.find((head) => head.id === field.value)?.fullName
                          : "Select branch head..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Search user..." />
                      <CommandEmpty>No user found.</CommandEmpty>
                      <CommandGroup>
                        {mockBranchHeads.map((head) => (
                          <CommandItem
                            value={head.fullName} // Value for search filter
                            key={head.id}
                            onSelect={() => {
                              form.setValue("head", head.id); // Set the ID as the field value
                              setOpenCombobox(false); // Close the popover
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                head.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {head.fullName} ({head.email})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Add Branch</Button>
        </form>
      </Form>
    </div>
  );
}
