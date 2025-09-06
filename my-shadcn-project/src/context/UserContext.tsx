"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCompanyProfileDetails } from "@/api/company";

// Interfaces for the nested objects
interface CompanyDetails {
  id: number;
  name: string;
}

interface BranchDetails {
  id: number;
  name: string;
}

interface DepartmentDetails {
  id: number;
  name: string;
}

interface RoleDetails {
  id: number;
  name: string;
}

interface ParentDetails {
  id: number;
  full_name: string;
}

interface groups {
  id: number;
  name: string;
}

interface UserDetails {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  groups: groups[];
}



interface User {
  id: number;
  company_details: CompanyDetails;
  branch_details: BranchDetails;
  department_details: DepartmentDetails;
  role_details: RoleDetails;
  parent_details: ParentDetails;
  user_details:UserDetails;
  email: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth: string;
  date_joined: string;
  user: number;
  company: number;
  branch: number;
  role: number;
  department: number;
  parent: number;

}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create the context provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const router = useRouter();

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const companyProfile = await getCompanyProfileDetails();
      
      if (companyProfile?.data) {
        setUser(companyProfile.data);
        console.log("Auth check successful, user context set:", companyProfile.data);
      } else {
        setUser(null);
        console.log("No user data received");
      }
    } catch (err: any) {
      console.log("User context auth check failed", err);
      setUser(null);
      
      // Only redirect to login if we get an authentication error
      if (err.response?.status === 401 || err.response?.status === 403) {
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    checkAuth();
  }, []); // Empty dependency array - only runs once on mount

  const value = { 
    user, 
    setUser, 
    isLoading,
    checkAuth 
  };

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