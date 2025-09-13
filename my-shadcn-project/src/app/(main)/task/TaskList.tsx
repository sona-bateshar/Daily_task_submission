"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Define the Task type based on your API structure
export type Task = {
  id: number
  assignees_details: Array<{
    id: number
    email: string
    full_name: string
  }>
  supporting_staff_details: Array<{
    id: number
    email: string
    full_name: string
  }>
  owner_details: {
    id: number
    email: string
    full_name: string
  }
  title: string
  description: string
  actions_required: any[]
  status: string
  created_at: string
  updated_at: string
  due_date: string
  closed_at: string | null
  discarted: boolean
  owner: number
  assignees: number[]
  supporting_staff: number[]
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    open: { variant: "destructive" as const, label: 'Open' },
    in_progress: { variant: "default" as const, label: 'In Progress' },
    completed: { variant: "secondary" as const, label: 'Completed' },
    closed: { variant: "outline" as const, label: 'Closed' }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || { variant: "outline" as const, label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const renderPersonList = (people: Array<{ id: number; full_name: string }>, maxDisplay = 2) => {
  if (!people || people.length === 0) return <span className="text-muted-foreground">None</span>;
  
  const displayPeople = people.slice(0, maxDisplay);
  const remainingCount = people.length - maxDisplay;
  
  return (
    <div className="flex flex-wrap gap-1">
      {displayPeople.map((person) => (
        <div key={person.id} className="flex items-center gap-1 bg-muted rounded-md px-2 py-1 text-xs">
          <Avatar className="h-4 w-4">
            <AvatarFallback className="text-xs">{getInitials(person.full_name)}</AvatarFallback>
          </Avatar>
          {/* <span className="truncate max-w-20" title={person.full_name}>
            {person.full_name}
          </span> */}
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="flex items-center justify-center bg-muted rounded-md px-2 py-1 text-xs text-muted-foreground">
          +{remainingCount} more
        </div>
      )}
    </div>
  );
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Task ID",
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="max-w-[300px]">
        <div className="font-medium truncate" title={row.getValue("title")}>
          {row.getValue("title")}
        </div>
        <div className="text-xs text-muted-foreground truncate mt-1" title={row.original.description}>
          {row.original.description}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "owner_details",
    header: "Owner",
    cell: ({ row }) => {
      const owner = row.getValue("owner_details") as Task["owner_details"];
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {getInitials(owner.full_name)}
            </AvatarFallback>
          </Avatar>
          <span className="truncate max-w-24" title={owner.full_name}>
            {owner.full_name}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "assignees_details",
    header: "Assignees",
    cell: ({ row }) => {
      const assignees = row.getValue("assignees_details") as Task["assignees_details"];
      return renderPersonList(assignees);
    },
  },
  {
    accessorKey: "supporting_staff_details",
    header: "Supporting Staff",
    cell: ({ row }) => {
      const supportingStaff = row.getValue("supporting_staff_details") as Task["supporting_staff_details"];
      return renderPersonList(supportingStaff);
    },
  },
  {
    accessorKey: "due_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{formatDate(row.getValue("due_date"))}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.getValue("status")),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const task = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(task.id.toString())}
            >
              Copy task ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit task</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export  function TaskList() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Sample data - replace this with your API data
  const [data] = React.useState<Task[]>([
    {
      id: 21,
      assignees_details: [
        { id: 1, email: "john.doe@example.com", full_name: "John Doe" },
        { id: 6, email: "emily.davis_alt@example.com", full_name: "Emily Davis" },
        { id: 11, email: "ryan.anderson_alt@example.com", full_name: "Ryan Anderson" },
        { id: 16, email: "elizabeth.martin_alt@example.com", full_name: "Elizabeth Martin" },
        { id: 21, email: "scott.hernandez_alt@example.com", full_name: "Scott Hernandez" }
      ],
      supporting_staff_details: [
        { id: 6, email: "emily.davis_alt@example.com", full_name: "Emily Davis" },
        { id: 16, email: "elizabeth.martin_alt@example.com", full_name: "Elizabeth Martin" }
      ],
      owner_details: {
        id: 51,
        email: "sonabateshar1999@gmail.com",
        full_name: "Sona Batesar"
      },
      title: "Implement user authentication system",
      description: "Design and implement a new authentication system with multi-factor authentication support for enhanced security",
      actions_required: [],
      status: "open",
      created_at: "2025-09-03T09:05:30.107871Z",
      updated_at: "2025-09-03T09:05:30.107898Z",
      due_date: "2025-09-10",
      closed_at: null,
      discarted: false,
      owner: 51,
      assignees: [1, 6, 11, 16, 21],
      supporting_staff: [6, 16]
    },
    {
      id: 22,
      assignees_details: [
        { id: 2, email: "alice.smith@example.com", full_name: "Alice Smith" },
        { id: 3, email: "bob.johnson@example.com", full_name: "Bob Johnson" }
      ],
      supporting_staff_details: [
        { id: 4, email: "charlie.brown@example.com", full_name: "Charlie Brown" }
      ],
      owner_details: {
        id: 52,
        email: "manager@example.com",
        full_name: "Project Manager"
      },
      title: "Database optimization",
      description: "Optimize database queries for better performance and reduced load times",
      actions_required: [],
      status: "in_progress",
      created_at: "2025-09-02T14:30:00.000000Z",
      updated_at: "2025-09-04T10:15:00.000000Z",
      due_date: "2025-09-15",
      closed_at: null,
      discarted: false,
      owner: 52,
      assignees: [2, 3],
      supporting_staff: [4]
    }
  ])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <Input
          placeholder="Filter tasks by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
            </div>
        </div>
    </div>
  )
}