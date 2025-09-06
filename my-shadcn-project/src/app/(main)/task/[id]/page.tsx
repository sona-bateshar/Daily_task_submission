"use client"

import * as React from "react"
import {TaskCard} from './TaskCard'


export default function Page() {
    const task_eg = {
        "id": 21,
        "assignees_details": [
            {
                "id": 1,
                "email": "john.doe@example.com",
                "full_name": "John  Doe"
            },
            {
                "id": 6,
                "email": "emily.davis_alt@example.com",
                "full_name": "Emily  Davis"
            },
            {
                "id": 11,
                "email": "ryan.anderson_alt@example.com",
                "full_name": "Ryan  Anderson"
            },
            {
                "id": 16,
                "email": "elizabeth.martin_alt@example.com",
                "full_name": "Elizabeth  Martin"
            },
            {
                "id": 21,
                "email": "scott.hernandez_alt@example.com",
                "full_name": "Scott  Hernandez"
            }
        ],
        "supporting_staff_details": [
            {
                "id": 6,
                "email": "emily.davis_alt@example.com",
                "full_name": "Emily  Davis"
            },
            {
                "id": 16,
                "email": "elizabeth.martin_alt@example.com",
                "full_name": "Elizabeth  Martin"
            }
        ],
        "owner_details": {
            "id": 51,
            "email": "sonabateshar1999@gmail.com",
            "full_name": "Sona  Batesar"
        },
        "title": "sfghfsgjdgj",
        "description": "madjlhgfjadkltherio;gmndm,gnfd aeri nk na fjl; mxcclkvho; asdlkk lk;j dslk fslkf dslf hweopfjkfhasd",
        "actions_required": [],
        "status": "open",
        "created_at": "2025-09-03T09:05:30.107871Z",
        "updated_at": "2025-09-03T09:05:30.107898Z",
        "due_date": "2025-09-10",
        "closed_at": null,
        "discarted": false,
        "owner": 51,
        "assignees": [
            1,
            6,
            11,
            16,
            21
        ],
        "supporting_staff": [
            6,
            16
        ]
    }




  return (
    <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <TaskCard task = {task_eg}/>
            </div>
        </div>
    </div>
  )
}

