'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // shadcn/ui Card components
import { Skeleton } from '@/components/ui/skeleton'; // Assuming path to shadcn/ui Skeleton
import { LogoutUser } from '@/api/auth';
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

const App = () => {
    
  const [isLoading, setIsLoading] = useState(true);
  const [logoutStatus, setLogoutStatus] = useState({ success: false, message: '' });

  const { user, setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      setIsLoading(true);
      try {
        const response = await LogoutUser(); // This 'response' is now treated as an AxiosResponse-like object

        // Extract success status and message from the response object
        // Assuming success if status is 2xx and message is in response.data.message
        const isSuccess = response.status >= 200 && response.status < 300;
        const message = response.data?.error || (isSuccess ? 'Logout successful.' : 'Logout failed.');

        setLogoutStatus({ success: isSuccess, message: message });
        setUser(null);
        router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
        // Handle cases where the API call itself fails (e.g., network error)
        setLogoutStatus({ success: false, message: 'An unexpected error occurred during logout.' });
      } finally {
        setIsLoading(false);
      }
    };

    performLogout();
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle >
            Logging Out...
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading  ? (  //isLoading && !timedOut
            // shadcn/ui Skeleton component
            <div className="space-y-4">
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
          ) : (
            <Alert variant={logoutStatus.success ? "default" : "destructive"}>
              {logoutStatus.success ? <CheckCircle2Icon  /> : <AlertCircleIcon  />}
              <AlertTitle>
                {(logoutStatus.success ? "Logout successful." : "Logout Failed.")}
              </AlertTitle>
              <AlertDescription>
                {(logoutStatus.success? '' : ( logoutStatus.message || 'An unknown error occurred.'))}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default App;

