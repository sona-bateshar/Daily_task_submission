"use client"; 

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
import { loginUser } from '@/api/auth'; 
import { useRouter } from "next/navigation";
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { useUser } from '@/context/UserContext'; 
import { getCompanyProfileDetails } from "@/api/company";

export function Form({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { setUser } = useUser();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the default form submission and page reload

    setLoading(true);
    setError(null);
    setSuccessMessage(null); 

    try {
      // Call your API function with the state values
      const response = await loginUser(username, password);

      if (response && response.data && response.data.id ) {

        try{
          const companyProfile = await getCompanyProfileDetails(response.data.id);

        setUser(response.data); 
        console.log("Login successful, user context set:", response.data.user);
        router.push("/dashboard");

        }catch (err: any){
          console.log("Login successful but user contex failed", err);
          const errorMessage =
            err.response?.data?.error || err.message || "An unknown error occurred.";
          setError(errorMessage);

        }
        
      }

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
                // shadcn/ui Alert component based on status
                <Alert variant={"destructive"}>
                  <AlertCircleIcon  />
                  {/* <AlertTitle> haha </AlertTitle> */}
                  <AlertDescription>  {error} </AlertDescription>
                </Alert>
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