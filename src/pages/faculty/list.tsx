import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ListView } from "@/components/refine-ui/views/list-view";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { EditButton } from "@/components/refine-ui/buttons/edit";

import { User } from "@/types";

const ROLE_FILTERS = [
  { value: "all", label: "All Roles" },
  { value: "admin", label: "Admin" },
  { value: "teacher", label: "Teacher" },
  { value: "student", label: "Student" },
];

const roleVariant = (role: string) =>
  role === "admin" ? "default" : role === "teacher" ? "secondary" : "outline";

const FacultyListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        size: 200,
        header: () => <p className="column-title ml-2">Name</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground ml-2">{getValue<string>()}</span>
        ),
      },
      {
        id: "email",
        accessorKey: "email",
        size: 240,
        header: () => <p className="column-title">Email</p>,
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{getValue<string>()}</span>
        ),
      },
      {
        id: "role",
        accessorKey: "role",
        size: 120,
        header: () => <p className="column-title">Role</p>,
        cell: ({ getValue }) => {
          const role = getValue<string>();
          return <Badge variant={roleVariant(role)}>{role}</Badge>;
        },
      },
      {
        id: "department",
        accessorKey: "department",
        size: 180,
        header: () => <p className="column-title">Department</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<string>() || "—"}</span>
        ),
      },
      {
        id: "actions",
        size: 180,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <ShowButton
              resource="faculty"
              recordItemId={row.original.id}
              variant="outline"
              size="sm"
            >
              View
            </ShowButton>
            <EditButton
              resource="faculty"
              recordItemId={row.original.id}
              variant="outline"
              size="sm"
            >
              Edit
            </EditButton>
          </div>
        ),
      },
    ],
    []
  );

  const roleFilters =
    selectedRole === "all"
      ? []
      : [{ field: "role", operator: "eq" as const, value: selectedRole }];

  const searchFilters = searchQuery
    ? [{ field: "search", operator: "contains" as const, value: searchQuery }]
    : [];

  const table = useTable<User>({
    columns,
    refineCoreProps: {
      resource: "faculty",
      pagination: { pageSize: 10, mode: "server" },
      filters: { permanent: [...roleFilters, ...searchFilters] },
      sorters: { initial: [{ field: "id", order: "desc" }] },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Faculty & Students</h1>

      <div className="intro-row">
        <p>Manage the people in your institution.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_FILTERS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateButton resource="faculty" />
          </div>
        </div>
      </div>

      <DataTable table={table} />
    </ListView>
  );
};

export default FacultyListPage;
