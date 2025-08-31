"use client"

import { usePathname } from "next/navigation"
import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconReport,
  IconSearch,
  IconSettings,
  IconCirclePlus, IconPlus, IconPlaylistAdd,
  IconUsers, IconUserCircle, IconUserCog,
  IconChecklist, IconListDetails, IconClipboardText,
  IconMessageCircle, IconMessages, IconStars, IconMessageStar 

} from "@tabler/icons-react"


import { Building2, Users } from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from 'next/image';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname() // Move this inside the component

  const data = {
    user: {
      name: "Your Name", // Customize this
      email: "your@email.com", // Customize this
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      // {
      //   title: "Dashboard",
      //   url: "/dashboard",
      //   icon: IconDashboard,
      //   isActive: pathname === "/dashboard",
      // },
      {
        title: "New Task", // add new task for the juniors
        url: "/task/add", // Give it a proper URL
        icon: IconPlus,
        isActive: pathname === "/task/add",
      },
      {
        title: "My Tasks",  // task assigned to me
        url: "/task", // Fix URL to match your routing
        icon: IconChecklist,
        isActive: pathname === "/task", // filter the task list by assigned to me.
      },
      {
        title: "Team Tasks",  // task assigned to me
        url: "/task", // Fix URL to match your routing
        icon:  IconUsers, 
        isActive: pathname === "/task", // all open tasks visiable to the persom - (owened task, assigned to them, assigned to their team )
      },
      {
        title: "Task Feedback", // give feedback on a completd task by your team
        url: "/task/feedback", // Give it a proper URL
        icon: IconMessageStar ,
        isActive: pathname === "/task", // filter the tasks that are closed and user was either the owner or
        //  parent and not assignee of the task and there is no feedback given by the user yet on that task.
      },
      // {
      //   title: "Daily Work",
      //   url: "/dashboard/work/add", // Give it a proper URL
      //   icon: IconUsers,
      //   isActive: pathname === "/dashboard/team",
      // },
      // {
      //   title: "My Work Submissions",
      //   url: "/dashboard/work", // Give it a proper URL
      //   icon: IconUsers,
      //   isActive: pathname === "/dashboard/team",
      // },
      // {
      //   title: "Team Work Submissions",
      //   url: "/dashboard/work", // Give it a proper URL
      //   icon: IconUsers,
      //   isActive: pathname === "/dashboard/team",
      // },
    ],
    navClouds: [
      {
        title: "Capture",
        icon: IconCamera,
        isActive: pathname.startsWith("/dashboard/capture"),
        url: "/dashboard/capture",
        items: [
          {
            title: "Active Proposals",
            url: "/dashboard/capture/active",
          },
          {
            title: "Archived",
            url: "/dashboard/capture/archived",
          },
        ],
      },
      {
        title: "Proposal",
        icon: IconFileDescription,
        url: "/dashboard/proposal",
        isActive: pathname.startsWith("/dashboard/proposal"),
        items: [
          {
            title: "Active Proposals",
            url: "/dashboard/proposal/active",
          },
          {
            title: "Archived",
            url: "/dashboard/proposal/archived",
          },
        ],
      },
      {
        title: "Prompts",
        icon: IconFileAi,
        url: "/dashboard/prompts",
        isActive: pathname.startsWith("/dashboard/prompts"),
        items: [
          {
            title: "Active Proposals",
            url: "/dashboard/prompts/active",
          },
          {
            title: "Archived",
            url: "/dashboard/prompts/archived",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: IconSettings,
      },
      // {
      //   title: "Get Help",
      //   url: "/dashboard/help",
      //   icon: IconHelp,
      // },
      // {
      //   title: "Search",
      //   url: "/dashboard/search",
      //   icon: IconSearch,
      // },
    ],
    documents: [
      {
        name: "Branch",
        url: "/dashboard/branch",
        icon: Building2, // Using Lucide icon
        isActive: pathname === "/dashboard/branch",
      },
      {
        name: "Role",
        url: "/dashboard/role", 
        icon: Users, // Using Lucide icon
        isActive: pathname === "/dashboard/role",
      },
      // {
      //   name: "Data Library",
      //   url: "/dashboard/data-library",
      //   icon: IconDatabase,
      // },
      // {
      //   name: "Reports",
      //   url: "/dashboard/reports",
      //   icon: IconReport,
      // }
      ,
      // {
      //   name: "Word Assistant",
      //   url: "/dashboard/word-assistant",
      //   icon: IconFileWord,
      // },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>   

            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <div className="flex items-center gap-2"> {/* New container for the image and text */}
                  <Image
                    src="/images/logo.png"
                    alt="Your App Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                    priority
                  />
                  <span className="text-base font-semibold">Your App Name</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}



// "use client"
// "use client"

// import { usePathname } from "next/navigation"
// import { Building2, Users, Home, ChevronUp, User2 } from "lucide-react"

// import * as React from "react"
// import {
//   IconCamera,
//   IconChartBar,
//   IconDashboard,
//   IconDatabase,
//   IconFileAi,
//   IconFileDescription,
//   IconFileWord,
//   IconFolder,
//   IconHelp,
//   IconInnerShadowTop,
//   IconListDetails,
//   IconReport,
//   IconSearch,
//   IconSettings,
//   IconUsers,
// } from "@tabler/icons-react"

// import { NavDocuments } from "@/components/nav-documents"
// import { NavMain } from "@/components/nav-main"
// import { NavSecondary } from "@/components/nav-secondary"
// import { NavUser } from "@/components/nav-user"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"

// const pathname = usePathname()

// const data = {
//   user: {
//     name: "shadcn",
//     email: "m@example.com",
//     avatar: "/avatars/shadcn.jpg",
//   },
//   navMain: [
//     {
//       title: "Dashboard",
//       url: "#",
//       icon: IconDashboard,
//       isActive: pathname === "/dashboard/branch",
//     },
//     {
//       title: "branch",
//       url: "/branch/",
//       icon: IconDashboard,
//       isActive: pathname === "/dashboard/branch",
//     },
//     {
//       title: "Lifecycle", 
//       url: "/lifecycle",
//       icon: IconListDetails,
//     },
//     {
//       title: "Analytics",
//       url: "#",
//       icon: IconChartBar,
//     },
//     {
//       title: "Projects",
//       url: "#",
//       icon: IconFolder,
//     },
//     {
//       title: "Team",
//       url: "#",
//       icon: IconUsers,
//     },
//   ],
//   navClouds: [
//     {
//       title: "Capture",
//       icon: IconCamera,
//       isActive: true,
//       url: "#",
//       items: [
//         {
//           title: "Active Proposals",
//           url: "#",
//         },
//         {
//           title: "Archived",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Proposal",
//       icon: IconFileDescription,
//       url: "#",
//       items: [
//         {
//           title: "Active Proposals",
//           url: "#",
//         },
//         {
//           title: "Archived",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Prompts",
//       icon: IconFileAi,
//       url: "#",
//       items: [
//         {
//           title: "Active Proposals",
//           url: "#",
//         },
//         {
//           title: "Archived",
//           url: "#",
//         },
//       ],
//     },
//   ],
//   navSecondary: [
//     {
//       title: "Settings",
//       url: "#",
//       icon: IconSettings,
//     },
//     {
//       title: "Get Help",
//       url: "#",
//       icon: IconHelp,
//     },
//     {
//       title: "Search",
//       url: "#",
//       icon: IconSearch,
//     },
//   ],
//   documents: [
//     {
//       name: "Data Library",
//       url: "#",
//       icon: IconDatabase,
//     },
//     {
//       name: "Reports",
//       url: "#",
//       icon: IconReport,
//     },
//     {
//       name: "Word Assistant",
//       url: "#",
//       icon: IconFileWord,
//     },
//   ],
// }

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   return (
//     <Sidebar collapsible="offcanvas" {...props}>
//       <SidebarHeader>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton
//               asChild
//               className="data-[slot=sidebar-menu-button]:!p-1.5"
//             >
//               <a href="#">
//                 <IconInnerShadowTop className="!size-5" />
//                 <span className="text-base font-semibold">Acme Inc.</span>
//               </a>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>
//       <SidebarContent>
//         <NavMain items={data.navMain} />
//         <NavDocuments items={data.documents} />
//         <NavSecondary items={data.navSecondary} className="mt-auto" />
//       </SidebarContent>
//       <SidebarFooter>
//         <NavUser user={data.user} />
//       </SidebarFooter>
//     </Sidebar>
//   )
// }
