"use client";

import { TaskForm } from "../TaskForm";

export default function page() {
  return (
    <div>
      {/* Pass the form object as a prop */}
      <TaskForm add={true} />
    </div>
  );
}
