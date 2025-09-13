"use client";

import { useState, useEffect, use, useRef } from "react";
import { CommentForm } from "./CommentForm";
import { CommentCard } from "./CommentCard";
import {
  Comment,
  CommentInterface,
  commentFormSchema,
  type CommentFormValues,
  mapCommentToFormValues,
  CommentResponse,
  TaskInterface,
} from "./interfaces";
import {
  parseDateFromValue,
  formatDateForDisplay,
} from "@/components/calendar-28";
import { useUser } from "@/context/UserContext";
import { getCommentList } from "@/api/task";
import { PopcornIcon } from "lucide-react";
import { Task } from "../task/interfaces";
import { getTaskDetails } from "@/api/task";

export default function CommentPage(task: Task) {
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const { user } = useUser(); // Get both user and loading state
  const [data, setData] = useState<CommentResponse>([]) || [];

  const FatchData = async () => {
    try {
      setIsLoading(true);
      const responce = await getCommentList(task.id);
      setData(responce.data);
      console.log("comment data fatched:", responce.data);
    } catch (err: any) {
      console.log("comment data fatching failed", err);
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
    return <p>No comments found</p>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <CommentList data={data} task={task} />
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";

import { EditIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function CommentList({
  data,
  task,
}: {
  data: CommentResponse;
  task: TaskInterface;
}) {
  const [comments, setComments] = useState<CommentResponse>(data);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const { user } = useUser();

  const handleEdit = (commentId: number) => {
    setEditingCommentId(commentId);
  };

  const handleSave = (updatedComment: CommentInterface) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
    setEditingCommentId(null);
  };

  function handleAdd(newComment: CommentInterface) {
    setComments((prevComments) => [...prevComments, newComment]);
  }

  // Function to create a placeholder comment for the add form
  const getNewCommentPlaceholder = (): CommentInterface => {
    return {
      id: 0,
      task: task.id,
      user: user?.id ?? -1,
      user_details: user
        ? { id: user.id, full_name: user.full_name, email: user.email }
        : { id: -1, full_name: "Guest", email: "" },
      description: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      task_details: undefined,
      tags: undefined,
    };
  };

  function EditButton(comment: CommentInterface) {
    return (
      <Button
        variant="ghost"
        className="absolute top-2 right-2 p-1"
        onClick={() => handleEdit(comment.id)}
      >
        <EditIcon className="h-4 w-4" />
      </Button>
    );
  }

  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      // Find the actual scrollable viewport within ScrollArea
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [comments]);

  return (
    <div className="flex flex-col gap-6">
      <ScrollArea ref={scrollAreaRef} className="flex h-[500px]    p-0">
        <div className="space-y-6">
          {comments.length != 0 &&
            comments.map((comment) => (
              <div key={comment.id} className="relative">
                {editingCommentId === comment.id ? (
                  <CommentForm comment={comment} saveComment={handleSave} />
                ) : (
                  <>
                    <CommentCard comment={comment} Icon={EditButton} />
                    <Button
                      variant="ghost"
                      className="absolute top-2 right-2 p-1"
                      onClick={() => handleEdit(comment.id)}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      <CommentForm
        comment={getNewCommentPlaceholder()}
        add={true}
        saveComment={handleAdd}
      />
    </div>
  );
}
