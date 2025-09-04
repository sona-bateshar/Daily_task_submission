// src/app/(main)/layout.tsx
"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from '@/context/UserContext';
import { PopcornIcon } from 'lucide-react'; 

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading } = useUser(); // Get both user and loading state
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're not loading and there's no user
    if (!isLoading && !user) {
      console.log("No user found, redirecting to login");
      router.push('/login');
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
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PopcornIcon className="animate-spin h-10 w-10 text-gray-500" />
        <span className="ml-2">Redirecting...</span>
      </div>
    );
  }

  // If user is present, render the main content
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}