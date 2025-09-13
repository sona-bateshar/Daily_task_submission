"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LogoutUser } from "@/api/auth";
import { AlertCircle, CheckCircle2, LogOut } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const LogoutPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [logoutStatus, setLogoutStatus] = useState({
    success: false,
    message: "",
  });
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  const { user, setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      setIsLoading(true);
      try {
        // Add a small delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 800));

        const response = await LogoutUser();
        const isSuccess = response.status >= 200 && response.status < 300;
        const message =
          response.data?.message ||
          response.data?.error ||
          (isSuccess
            ? "You have been successfully logged out."
            : "Logout failed.");

        setLogoutStatus({ success: isSuccess, message: message });

        // Clear user from context regardless of API response
        setUser(null);
      } catch (error) {
        console.error("Logout error:", error);
        // Even if API fails, clear user locally
        setUser(null);
        setLogoutStatus({
          success: false,
          message:
            "Network error occurred, but you have been logged out locally.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    performLogout();
  }, [setUser]);

  // Countdown and redirect effect
  useEffect(() => {
    if (!isLoading) {
      const delay = logoutStatus.success ? 3000 : 5000; // 3s for success, 5s for error

      if (logoutStatus.success) {
        const timer = setInterval(() => {
          setRedirectCountdown((prev) => {
            if (prev <= 1) {
              router.push("/login");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(timer);
      } else {
        const failedTimer = setTimeout(() => {
          router.push("/login");
        }, delay);
        return () => clearTimeout(failedTimer);
      }
    }
  }, [isLoading, logoutStatus.success, router]);

  const getCardTitle = () => {
    if (isLoading) return "Logging Out...";
    if (logoutStatus.success) return "Logout Successful";
    return "Logout Complete";
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            {isLoading ? (
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            ) : logoutStatus.success ? (
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            ) : (
              <AlertCircle className="h-10 w-10 text-orange-500" />
            )}
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <LogOut className="h-5 w-5" />
            {getCardTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
              <div className="text-center text-sm text-muted-foreground mt-6">
                Securely signing you out...
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert variant={logoutStatus.success ? "default" : "destructive"}>
                {logoutStatus.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {logoutStatus.success ? "Success!" : "Notice"}
                </AlertTitle>
                <AlertDescription>
                  {logoutStatus.success
                    ? "You have been successfully logged out of your account."
                    : logoutStatus.message ||
                      "You have been logged out locally. Redirecting..."}
                </AlertDescription>
              </Alert>

              {logoutStatus.success && (
                <div className="text-center text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                  Redirecting to login page in{" "}
                  <span className="font-medium text-primary">
                    {redirectCountdown}
                  </span>{" "}
                  second{redirectCountdown !== 1 ? "s" : ""}...
                </div>
              )}

              {!logoutStatus.success && (
                <div className="text-center text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                  Redirecting to login page shortly...
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LogoutPage;
