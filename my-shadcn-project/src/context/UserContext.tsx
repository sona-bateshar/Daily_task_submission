"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Import useRouter and usePathname

// Define the shape of the user data
interface User {
  id: string;
  username: string;
}

// Define the shape of the context value
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create the context provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Define the public routes that do not require authentication
    const publicRoutes = ['/login', '/register', '/']; 

    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.includes(pathname);

    // If there is no user and the current page is not a public route, redirect to the login page
    if (!user && !isPublicRoute) {
      router.push('/login');
    }
  }, [user, router, pathname]);

  const value = { user, setUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};