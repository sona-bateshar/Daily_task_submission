"use client"

import React, { useState } from 'react';


import {
    CommentInterface,  
} from "./interfaces"

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

import { EditIcon } from "lucide-react"

import { Separator } from "@/components/ui/separator"




export function CommentCard( {comment, Icon}  :{ comment  : CommentInterface, Icon?:any}) {
  return (
    <Card className="flex gap-0 w-full shadow-card rounded-2xl py-2 px-0 border-none">
      <CardHeader className="flex flex-wrap items-start justify-between gap-0  px-4 py-0">
        {/* Left side: user + date */}
        <div className="flex items-baseline gap-2 py-0">
          <span className=" text-text">{comment.user_details.full_name}</span>
          <span className="text-sm text-muted-foreground">{comment.created_at}</span>
        </div>
      </CardHeader> 
      {/* <Separator className=' py-0'/> */}
      <CardContent className="flex flex-col px-4 py-2 gap-2 ">
        {/* <Separator /> */}
        <p className="flex flex-col  text-sm">{comment.description}</p>
        {/* <div><Separator /></div>
        <div><p className="text-base text-text">{comment.description}</p></div> */}
      </CardContent>
    </Card>
    // <Card className="w-full shadow-card rounded-2xl">
    //   <CardHeader className="flex flex-wrap items-start justify-between gap-2">
    //     {/* Left side: user + date */}
    //     <div className="flex items-baseline gap-2">
    //       <span className="font-semibold text-text">{comment.user_details.full_name}</span>
    //       <span className="text-sm text-muted-foreground">{comment.created_at}</span>
    //     </div>
    //   </CardHeader> 
      
    //   <Separator />
    //   <CardContent>
    //     <p className="text-base text-text">{comment.description}</p>
    //   </CardContent>
    // </Card>
  )
}


