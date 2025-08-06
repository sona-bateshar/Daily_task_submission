// src/components/login-form.tsx
"use client"; // <--- Add this line at the very top

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "../api/auth"; // Make sure this import path is correct
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  "use client";

  const router = useRouter();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the default form submission and page reload

    setLoading(true);
    setError(null);

    try {
      // Call your API function with the state values
      const response = await loginUser(username, password);

      // Handle a successful login (e.g., store the token, redirect, etc.)
      console.log("Login successful:", response);

      router.push("/dashboard"); // <--- Redirect to the dashboard

    } catch (err: any) {
      // Handle the error
      console.error("Login failed:", err);

      // Check if the error object has a 'response' and 'message' property
      const errorMessage =
        err.response?.data?.error || err.message || "An unknown error occurred.";
      
      setError(errorMessage);
    } finally {
      setLoading(false); // Always set loading to false, regardless of success or failure
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your username and password below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}> {/* <--- Add onSubmit handler here */}
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                {/* <--- Changed "email" to "username" */}
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text" // Change type to 'text' for username
                  placeholder="Your username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {/* <--- Conditional rendering for the error message */}
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={loading}> {/* <--- Disable button when loading */}
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}