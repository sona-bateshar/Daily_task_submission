// src/components/user-context.tsx


"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getUserDetails } from '@/api/auth';


// Define the type for your user object.
interface User {
  id: string;
  name: string;
  email: string;
  // Add any other user properties you need.
}

// Define the shape of the context value.
interface UserContextType {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Define the UserProvider component. This is where the API call happens.
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // This is a placeholder for your actual API call to your backend.
        // It should check if the user is authenticated and return their data.
        const response = await getUserDetails(); 
        if (response.status != 200) {
          throw new Error('User not authenticated');
        }
        const userData = await response.data();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        // Redirect to login on authentication failure.
        redirect('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context.
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};