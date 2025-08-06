// ./src/app/testpage/page.tsx
import * as z from "zod";
import { useForm } from "react-hook-form";
// IMPORTANT: Add the missing import for zodResolver
import { zodResolver } from "@hookform/resolvers/zod"; 

// Assume these are your form components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
// Assume this is a basic input component
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

// 1. Define the validation schema with Zod
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export function NewsletterForm() {
  // 2. Initialize the form with useForm and your schema
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 3. Define the submit handler
  function onSubmit(values) {
    console.log("Form submitted with values:", values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* 4. Use the <FormField /> component for the email input */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              {/* This is where the magic happens */}
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              {/* The FormMessage component automatically renders the error */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Subscribe</Button>
      </form>
    </Form>
  );
}
