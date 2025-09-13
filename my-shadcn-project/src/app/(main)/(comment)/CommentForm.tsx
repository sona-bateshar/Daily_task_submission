"use client"

import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { 
    Comment, 
    CommentInterface,  
    commentFormSchema, 
    type CommentFormValues, 
    mapCommentToFormValues,
    CommentResponse
} from "./interfaces"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AutoSizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PopcornIcon } from 'lucide-react'; 


import { patchComment, postComment} from '@/api/task';
import { useUser } from '@/context/UserContext'; 
import { UseFormReturn } from "react-hook-form"


export function CommentForm({
    comment,
    add,
    saveComment,
    }: {
    comment: CommentInterface;
    add?: boolean;
    saveComment: (newComment: CommentInterface) => void;
}) {

    console.log("commentform props :", comment, add)
    const {user} = useUser()

    const form = useForm<CommentFormValues>({
        resolver: zodResolver(commentFormSchema),
        defaultValues: mapCommentToFormValues(comment)
    })

    console.log("comment form initial", form.getValues())

    // const {user} = useUser()
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setErrorRaw] = useState<string | null>(null);
    const setError = (val: string | null) =>
        setErrorRaw(val ? val.substring(0, 50) : null);


    const onSubmit = async (formdata: CommentFormValues) => {
        if (user){
            formdata.user = user.id
        }

        if (!formdata.id){
            formdata.id = undefined
        }

        console.log("comment form before submit", form.getValues())


        console.log("🚀 Comment form submit triggered!");
        console.log("📝 Comment form data received:", formdata);
    
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        
        try {

          
          const response = add? await postComment(formdata) : await patchComment(formdata.id , formdata);
          setSuccessMessage(response.data?.message || add? "Comment added successfully!": "Comment edited successfully!");
          
          console.log("✅ API response:", response);
          saveComment(response?.data)
        //   const a = [];
        //   a.push(response?.data)
        // setComments((prevComments) => [...prevComments, response?.data]);
          
        } catch (err: any) {
          console.error("❌ API error:", err);
          setError(err.message)
        } finally {
          setLoading(false);
          console.log("Inside finally");
        }
      };
      

      return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* Description Field */}
                    <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <Avatar className="h-4 w-4">
                                    <AvatarFallback className="text-xs">PopcornIcon</AvatarFallback>
                                </Avatar>
                                {comment.user_details.full_name}
                            </FormLabel>
                            <FormControl>
                                <AutoSizeTextarea 
                                placeholder="Add a comment..." 
                                {...field} 
                                value={field.value || ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="flex">
                        <Button 
                            type="submit" 
                            className="w-auto ml-auto" 
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Comment"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
  );
};


