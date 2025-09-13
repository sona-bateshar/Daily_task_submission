import React from 'react';

import { TaskInterface, UserDetails } from './interfaces';
import { renderPersonList } from './functions'; // Assuming this function exists
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


// Type for the data list
interface DataItem {
  label: string;
  content: JSX.Element;
}

export const TaskDetailSections = (task: TaskInterface): DataItem[] => {
  const sections: DataItem[] = [];

  // Assignees Section
  sections.push({
    label: 'Assignees',
    content: renderPersonList(task.assignees_details),
  });

  // Supporting Staff Section
  sections.push({
    label: 'Supporting Staff',
    content: renderPersonList(task.supporting_staff_details),
  });

  // Owner Details Section
  sections.push({
    label: 'Owner Details',
    content: renderPersonList([task.owner_details]),
  });

  return sections;
};


export const TaskDetails = ({
  task,
}: {
  task: TaskInterface;
}) => {
    const sections: DataItem[] = TaskDetailSections(task);



    return (
    <div className="flex flex-col  items-baseline gap-6 py-0">
      {sections.map((item, index) => (
        <div className="flex flex-col items-baseline gap-2 py-0" >
            <div className="flex items-baseline gap-2 py-0">
                  <span className=" text-text">{item.label}</span>
                </div>
                                <div>{item.content}</div>

        </div>
        // // <Card className="flex gap-0 w-full bg-transparent py-2 px-0 border-none">
        // //       <CardHeader className="flex flex-wrap items-start justify-between gap-0  px-4 py-0">
        // //         {/* Left side: user + date */}
        //         <div className="flex items-baseline gap-2 py-0">
        //           <span className=" text-text">{item.label}</span>
        //         </div>
        //     //   </CardHeader> 
        //     //   {/* <Separator className=' py-0'/> */}
        //     //   <CardContent className="flex flex-col px-4 py-2 gap-2 ">
        //         // {/* <Separator /> */}
        //         <div>{item.content}</div>
        //         // {/* <div><Separator /></div>
        //         // <div><p className="text-base text-text">{comment.description}</p></div> */}
        //     //   </CardContent>
        //     // </Card>
      ))}
    </div>
  );

}