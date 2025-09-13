import React, { useState, useEffect } from "react";
import {
  Calendar,
  User,
  Users,
  Clock,
  Edit3,
  CheckCircle,
  AlertCircle,
  ParkingMeter,
  EditIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Task, TaskInterface, UserDetails } from "../interfaces";
import CommentPage from "../../(comment)/page";
// import { CommentPage } from '../../(comment)/page';
import { useParams } from "next/navigation";
import { TaskStatusBadge } from "../functions";
import { TaskDetails } from "../TaskDetails";
import { redirect } from "next/navigation";
import { usePathname, useRouter } from "next/navigation";

export const TaskCard = ({ task }: { task: TaskInterface }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleRedirect = () => {
    // Check if the path already ends with '/edit' to avoid an infinite loop
    if (pathname && !pathname.endsWith("/edit")) {
      const newPath = `${pathname}/edit`;
      router.push(newPath);
    }
  };
  // Format date helper function
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format datetime helper function
  const formatDateTime = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Person card component
  const PersonCard = ({ person }: { person: UserDetails }) => (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{person.full_name}</span>
        </div>
        <div className="text-sm text-muted-foreground">{person.email}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <CardTitle className="text-3xl mb-2">
            {task.title}{" "}
            <span className="font-thin text-muted-foreground leading-relaxed">
              #{task.id}
            </span>
          </CardTitle>
          <div className="flex items-center gap-4">
            <TaskStatusBadge status={task.status} />
          </div>
        </div>
        <Button className="gap-2" variant={"ghost"} onClick={handleRedirect}>
          <EditIcon className="w-6 h-6" />
        </Button>
      </div>

      <p className="flex flex-col gap-2 text-sm">
        <Separator /> {task.description}
      </p>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Component 2: This is the fixed-width component.
            On mobile, it fills the full width (`w-full`) and is displayed first due to its order in the DOM.
            On desktop, it has a fixed width of 250px (`md:w-[250px]`) and is moved to the second position using `md:order-2`.
          */}
        <div className="w-full md:w-[200px] md:order-2 transition-all duration-300 ease-in-out">
          <TaskDetails task={task} />
        </div>

        {/* Component 1: This is the flexible component.
            On mobile, it fills the full width (`w-full`) and is displayed second.
            On desktop, it uses `flex-grow` to fill the remaining space and is moved to the first position using `md:order-1`.
          */}
        <div className="w-full md:flex-grow md:order-1   transition-all duration-300 ease-in-out">
          <CommentPage {...task} />
        </div>
      </div>
    </div>
  );
};
