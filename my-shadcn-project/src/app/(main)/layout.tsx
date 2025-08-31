// src/app/(main)/layout.tsx
"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React, { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useUser } from '@/context/UserContext';
import { PopcornIcon } from 'lucide-react'; 



export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Add your authentication check here. This is a client-side check.
  // The best practice is to also use a server-side check (e.g., in middleware.ts)
  // to protect your routes before they even render.
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If there's no user, redirect to the login page.
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // If we're still checking, show a loading spinner.
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PopcornIcon className="animate-spin h-10 w-10 text-gray-500" />
      </div>
    );
  }

  // If a user is present, render the main content.
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