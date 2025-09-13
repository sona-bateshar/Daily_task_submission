"use client";

import { useState, useEffect, use } from "react";

import { TaskCard } from "./TaskCard";
import { type Task } from "../interfaces";
import { useUser } from "@/context/UserContext";
import { getTaskDetails } from "@/api/task";
import { PopcornIcon } from "lucide-react";

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
      <TaskCard task={data} />
    </div>
  );
}

// "use client"

// import {useState, useEffect, use}  from "react";
// import {TaskCard} from './TaskCard'
// import { type Task } from "../../interfaces";

// type PageProps = {
//   params: Promise<{ id: string }>;
//   task?: Task;
// };

// export default function Page({ params, task }: PageProps) {
//   const { id } = use(params);     const task_eg = {
//         "id": 21,
//         "assignees_details": [
//             {
//                 "id": 1,
//                 "email": "john.doe@example.com",
//                 "full_name": "John  Doe"
//             },
//             {
//                 "id": 6,
//                 "email": "emily.davis_alt@example.com",
//                 "full_name": "Emily  Davis"
//             },
//             {
//                 "id": 11,
//                 "email": "ryan.anderson_alt@example.com",
//                 "full_name": "Ryan  Anderson"
//             },
//             {
//                 "id": 16,
//                 "email": "elizabeth.martin_alt@example.com",
//                 "full_name": "Elizabeth  Martin"
//             },
//             {
//                 "id": 21,
//                 "email": "scott.hernandez_alt@example.com",
//                 "full_name": "Scott  Hernandez"
//             }
//         ],
//         "supporting_staff_details": [
//             {
//                 "id": 6,
//                 "email": "emily.davis_alt@example.com",
//                 "full_name": "Emily  Davis"
//             },
//             {
//                 "id": 16,
//                 "email": "elizabeth.martin_alt@example.com",
//                 "full_name": "Elizabeth  Martin"
//             }
//         ],
//         "owner_details": {
//             "id": 51,
//             "email": "sonabateshar1999@gmail.com",
//             "full_name": "Sona  Batesar"
//         },
//         "title": "sfghfsgjdgj",
//         "description": "madjlhgfjadkltherio;gmndm,gnfd aeri nk na fjl; mxcclkvho; asdlkk lk;j dslk fslkf dslf hweopfjkfhasd",
//         "actions_required": [],
//         "status": "open",
//         "created_at": "2025-09-03T09:05:30.107871Z",
//         "updated_at": "2025-09-03T09:05:30.107898Z",
//         "due_date": "2025-09-10",
//         "closed_at": null,
//         "discarted": false,
//         "owner": 51,
//         "assignees": [
//             1,
//             6,
//             11,
//             16,
//             21
//         ],
//         "supporting_staff": [
//             6,
//             16
//         ]
//     }

//   return (
//     <div className="flex flex-1 flex-col">
//         <div className="@container/main flex flex-1 flex-col gap-2">
//             <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
//                 <TaskCard task = {task_eg}/>
//             </div>
//         </div>
//     </div>
//   )
// }
