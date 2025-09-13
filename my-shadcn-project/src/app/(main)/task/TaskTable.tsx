"use client"

import {useState, useEffect}  from "react";
import { DataTable } from "@/components/data-table";
import { useUser } from "@/context/UserContext";
import { PopcornIcon } from 'lucide-react'; 
import { getTaskList } from "@/api/task";
import { TaskTable } from "./Table";


// A lightweight user reference
interface UserDetails {
  id: number;
  email: string;
  full_name: string;
}

// A single Task object
export interface Task {
  id: number;
  assignees_details: UserDetails[];
  supporting_staff_details: UserDetails[];
  owner_details: UserDetails;
  title: string;
  description: string | null;
  actions_required: [];
  status: "open" | "closed" | "in_progress" | string; 
  created_at: string; 
  updated_at: string;  
  due_date: string;   
  closed_at: string | null;
  discarted: boolean;
  owner: number;
  assignees: number[];
  supporting_staff: number[];
}

export type TaskResponse = Task[];


export function TaskList2() {
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const { user } = useUser(); // Get both user and loading state
    const [data, setData] = useState<TaskResponse>([]) || [];

    const FatchData = async () => {
        try {
          setIsLoading(true);
          const responce = await getTaskList();
          setData(responce.data);
          console.log("task data fatched:", responce.data);
        } catch (err: any) {
          console.log("Task data fatching failed", err);
        } finally {
          setIsLoading(false);
        }
      };
    
      useEffect(() => {
        FatchData();
      }, []); // Empty dependency array - only runs once on mount


    

    // Show loading spinner while fatching the data or user. 
    if (isLoading) {
        return (
        <div className="flex items-center justify-center min-h-screen">
            <PopcornIcon className="animate-spin h-10 w-10 text-gray-500" />
            <span className="ml-2">Loading...</span>
        </div>
        );
  }

  if (!data || data.length === 0) {
    return <p>No tasks found</p>;
    }

  return (
    <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <TaskTable data={data} />
            {/* <TaskTable  /> */}
        </div>
        </div>
    </div>

  );
    

}





