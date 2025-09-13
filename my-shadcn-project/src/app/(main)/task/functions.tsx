"use client";

import React, { useState } from "react";
import { Task } from "./interfaces";
import { TASK_STATUS_OPTIONS } from "./interfaces";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TaskStatusBadge({ status }: { status: string }) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "in_progress":
        return "default";
      case "closed":
        return "outline";
      case "discarted":
        return "destructive";
      case "on_hold":
        return "secondary";
      case "open":
        return "default";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-green-100 text-green-800";
      case "discarted":
        return "bg-red-100 text-red-800";
      case "on_hold":
        return "bg-gray-100 text-gray-800";
      case "open":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Badge
      variant={getStatusVariant(status)}
      className={`${getStatusColor(status)} font-medium`}
    >
      {formatStatus(status)}
    </Badge>
  );
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// import React, { useState } from 'react';

// Assuming these are your components from a UI library like Shadcn/ui
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const renderPersonList = (
  people: Array<{ id: number; full_name: string }>,
  maxDisplay = 2
) => {
  // Use a state variable to track the expanded status
  const [isExpanded, setIsExpanded] = useState(false);

  if (!people || people.length === 0) {
    return <span className="text-muted-foreground">None</span>;
  }

  // Determine which people to display based on the expanded state
  const displayPeople = isExpanded ? people : people.slice(0, maxDisplay);
  const remainingCount = people.length - maxDisplay;

  // Toggle the expanded state when the badge is clicked
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-wrap gap-1">
      {/* Map through the list of people to display */}
      {displayPeople.map((person) => (
        <div
          key={person.id}
          className="flex items-center gap-1 bg-muted rounded-md px-2 py-1 text-xs"
        >
          {/* <Avatar className="h-4 w-4">
            <AvatarFallback className="text-xs">{getInitials(person.full_name)}</AvatarFallback>
          </Avatar> */}
          <span className="truncate max-w-20" title={person.full_name}>
            {person.full_name}
          </span>
        </div>
      ))}

      {/* Show the "+remaining" badge or the "collapse" button */}
      {people.length > maxDisplay && (
        <div
          onClick={handleToggleExpand}
          className="flex items-center justify-center bg-muted rounded-md px-2 py-1 text-xs text-muted-foreground cursor-pointer"
        >
          {isExpanded ? `Show less` : `+${remainingCount} more`}
        </div>
      )}
    </div>
  );
};

// export const renderPersonList = (people: Array<{ id: number; full_name: string }>, maxDisplay = 2) => {
//   if (!people || people.length === 0) return <span className="text-muted-foreground">None</span>;

//   const displayPeople = people.slice(0, maxDisplay);
//   const remainingCount = people.length - maxDisplay;

//   return (
//     <div className="flex flex-wrap gap-1">
//       {displayPeople.map((person) => (
//         <div key={person.id} className="flex items-center gap-1 bg-muted rounded-md px-2 py-1 text-xs">
//           {/* <Avatar className="h-4 w-4">
//             <AvatarFallback className="text-xs">{getInitials(person.full_name)}</AvatarFallback>
//           </Avatar> */}
//           <span className="truncate max-w-20" title={person.full_name}>
//             {person.full_name}
//           </span>
//         </div>
//       ))}
//       {remainingCount > 0 && (
//         <div className="flex items-center justify-center bg-muted rounded-md px-2 py-1 text-xs text-muted-foreground">
//           +{remainingCount} more
//         </div>
//       )}
//     </div>
//   );
// };
