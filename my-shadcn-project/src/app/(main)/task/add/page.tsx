"use client";

import { TaskForm } from "../TaskForm"
// import { taskFormSchema,  type TaskFormValues  } from "../interfaces";

// import { useForm } from 'react-hook-form';
// import { zodResolver } from "@hookform/resolvers/zod";


export default function page() {
  // const form = useForm<TaskFormValues>({
  //   resolver: zodResolver(taskFormSchema),
  //   defaultValues: {
  //     id: undefined,
  //     title: "",
  //     description: "",
  //     actions_required: [],
  //     owner: 0,
  //     assignees: [],
  //     supporting_staff: [],
  //     status: "open",
  //     due_date: "",
  //   },
  // });

  return (
    <div>
      <h1>Create a New Task</h1>
      {/* Pass the form object as a prop */}
      <TaskForm  add={true} />
    </div>
  );
}