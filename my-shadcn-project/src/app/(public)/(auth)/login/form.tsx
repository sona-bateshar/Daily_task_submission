"use client";

import React, { useState, useEffect } from "react";
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
import { loginUser } from "@/api/auth";
import { useRouter } from "next/navigation";
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useUser } from "@/context/UserContext";
import { getCompanyProfileDetails } from "@/api/company";

export function Form({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const { user, isLoading, checkAuth } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Only redirect if we're not loading and there's a user
    if (!isLoading && user) {
      console.log("loggedin user, redirecting to dashboard");
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PopcornIcon className="animate-spin h-10 w-10 text-gray-500" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // If no user after loading, show loading (redirect is happening)
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PopcornIcon className="animate-spin h-10 w-10 text-gray-500" />
        <span className="ml-2">Redirecting...</span>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the default form submission and page reload

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Call your API function with the state values
      const response = await loginUser(username, password);
      console.log("Login successful", response);
      // Give UserContext time to update
      await new Promise((resolve) => setTimeout(resolve, 500));
      await checkAuth();

      router.push("/dashboard");
    } catch (err: any) {
      // Handle the error
      console.error("Login failed:", err);

      // Check if the error object has a 'response' and 'message' property
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "An unknown error occurred.";

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
          <form onSubmit={handleSubmit}>
            {" "}
            {/* <--- Add onSubmit handler here */}
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
                // shadcn/ui Alert component based on status
                <Alert variant={"destructive"}>
                  <AlertCircleIcon />
                  {/* <AlertTitle> haha </AlertTitle> */}
                  <AlertDescription> {error} </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {" "}
                  {/* <--- Disable button when loading */}
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
