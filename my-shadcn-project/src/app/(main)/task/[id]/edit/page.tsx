"use client";
import {useState, useEffect, use}  from "react";

import { TaskForm } from "../../TaskForm"
import { type Task } from "../../interfaces";
import { useUser } from "@/context/UserContext";
import { getTaskDetails } from "@/api/task";
import { PopcornIcon } from 'lucide-react'; 

type PageProps = {
  params: Promise<{ id: string }>;
  task?: Task;                     
};

export default function Page({ params, task }: PageProps) {
  const { id } = use(params); 
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const [data, setData] = useState<Task | undefined>(task);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getTaskDetails(id);
      setData(response.data);
      console.log("task data fetched:", response.data);
    } catch (err: any) {
      console.log("Task data fetching failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Move useEffect outside of conditional and fix dependencies
  useEffect(() => {
    // Only fetch if we don't already have task data
    if (!task && !data) {
      fetchData();
    } else if (task) {
      // If task is provided as prop, use it and stop loading
      setData(task);
      setIsLoading(false);
    }
  }, [id]); // Only depend on id, fetch when id changes

  // Show loading spinner while fetching the data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PopcornIcon className="animate-spin h-10 w-10 text-gray-500" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!data) {
    return <p>No task found</p>;
  }

  return (
    <div>
      <h1>Edit Task, {id}</h1>
      <TaskForm add={false} task={data}  />
    </div>
  );
}

