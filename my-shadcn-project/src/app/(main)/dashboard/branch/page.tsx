// app/dashboard/branch/page.tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconEdit } from "@tabler/icons-react";

// Replace this with the actual path to your API function
import { getBranchList } from "@/api/company";

// ===============================================
// Define Data Structures and Columns
// ===============================================

// Define the data type for a single branch object
type Branch = {
  id: string;
  name: string;
  location: string;
  manager: string;
  phone: string;
};

// Define the structure for the table columns.
// This matches the format expected by the DataTable component.
const allColumns = [
  { accessorKey: "name", header: "Branch Name" },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "manager", header: "Manager" },
  { accessorKey: "phone", header: "Phone Number" },
  {
    accessorKey: "actions",
    header: "Actions",
    // Explicitly typing the `row` parameter to resolve the TypeScript error
    cell: ({ row }: { row: { original: Branch } }) => (
      <Link href={`/dashboard/branch/edit/${row.original.id}`}>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <IconEdit className="h-4 w-4" />
        </Button>
      </Link>
    ),
  },
];

// ===============================================
// Generic DataTable Component
// ===============================================
// This is a simplified, generic DataTable to make the page self-contained
// and resolve the type error. It is a substitute for your existing component.
const DataTable = ({ data, columns }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-8">No data to display.</div>;
  }

  return (
    <div className="rounded-md border bg-card text-card-foreground shadow-sm">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              {columns.map((column) => (
                <th
                  key={column.accessorKey}
                  className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              >
                {columns.map((column) => (
                  <td
                    key={column.accessorKey}
                    className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                  >
                    {column.cell
                      ? column.cell({ row: { original: row } })
                      : row[column.accessorKey]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ===============================================
// Main Component
// ===============================================

export default function BranchPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch branch data from the API
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Access the .data property of the Axios response
        const response = await getBranchList();
        setBranches(response.data);
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter the branch list based on the search term
  const filteredBranches = useMemo(() => {
    return branches.filter((branch) =>
      branch.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [branches, searchTerm]);

  // Determine which columns to show based on the visibleColumns state
  const columnsToShow = useMemo(() => {
    return allColumns;
  }, []);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Header section with search and add button */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        <h1 className="text-2xl font-bold">Branch List</h1>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search by branch name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Link href="/dashboard/branch/add">
            <Button>Add Branch</Button>
          </Link>
        </div>
      </div>

      {/* Main content area */}
      <div className="px-4 lg:px-6">
        {isLoading ? (
          <div className="text-center py-8">Loading branches...</div>
        ) : (
          <DataTable data={filteredBranches} columns={columnsToShow} />
        )}
      </div>
    </div>
  );
}
