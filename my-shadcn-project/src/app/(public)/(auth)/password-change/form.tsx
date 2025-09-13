"use client"; // This directive marks the component as a Client Component

import React, { useState } from "react";
import { cn } from "@/lib/utils"; // Assuming you have this utility for class names
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
import { PassworChangeAPI } from "@/api/auth";
import { useRouter } from "next/navigation";
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function Form({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();

  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the default form submission and page reload

    setLoading(true);
    setError(null);
    setSuccessMessage(null); // Clear previous messages

    // Client-side validation
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      // Basic password strength check
      setError("New password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        old_password: oldPassword,
        new_password: newPassword,
      };
      // Call your API function with the state values
      const response = await PassworChangeAPI(payload);

      // Handle a successful password change
      setSuccessMessage(
        response.data?.message || "Password changed successfully!"
      );
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Handle a successful login (e.g., store the token, redirect, etc.)
      console.log("password-change successful:", response);
    } catch (err: any) {
      // Handle network errors or unexpected issues
      console.error("Password change failed:", err);
      setError(
        err.response?.data?.error || err.message || "An unknown error occurred."
      );
    } finally {
      setLoading(false); // Always set loading to false
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          {currentUserEmail ? (
            <CardDescription>
              Update your password for{" "}
              <span className="font-semibold">{currentUserEmail}</span>.
            </CardDescription>
          ) : (
            ""
          )}
        </CardHeader>
        <CardContent>
          {successMessage ? (
            <Alert variant={"default"}>
              <CheckCircle2Icon />
              {/* <AlertTitle> password changed  </AlertTitle> */}
              <AlertDescription> {successMessage} </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                {/* Old Password */}
                <div className="grid gap-3">
                  <Label htmlFor="old-password">Old Password</Label>
                  <Input
                    id="old-password"
                    type="password"
                    placeholder="Enter your old password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />

                  <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                    <li>1st level of puns: 5 gold coins</li>
                    <li>2nd level of jokes: 10 gold coins</li>
                    <li>3rd level of one-liners : 20 gold coins</li>
                  </ul>
                </div>

                {/* New Password */}
                <div className="grid gap-3">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter your new password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                {/* Confirm New Password */}
                <div className="grid gap-3">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your new password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                {error && (
                  // shadcn/ui Alert component based on status
                  <Alert variant={"destructive"}>
                    <AlertCircleIcon />
                    {/* <AlertTitle> haha </AlertTitle> */}
                    <AlertDescription> {error} </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Changing Password..." : "Change Password"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
