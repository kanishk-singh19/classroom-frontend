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

import { ClassDetails } from "@/types";

const STATUS_FILTERS = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const ClassesListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const columns = useMemo<ColumnDef<ClassDetails>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        size: 200,
        header: () => <p className="column-title ml-2">Class</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground ml-2 font-medium">
            {getValue<string>()}
          </span>
        ),
      },
      {
        id: "subject",
        size: 160,
        header: () => <p className="column-title">Subject</p>,
        cell: ({ row }) => (
          <Badge variant="secondary">{row.original.subject?.name ?? "—"}</Badge>
        ),
      },
      {
        id: "teacher",
        size: 160,
        header: () => <p className="column-title">Teacher</p>,
        cell: ({ row }) => (
          <span className="text-foreground">
            {row.original.teacher?.name ?? "—"}
          </span>
        ),
      },
      {
        id: "capacity",
        accessorKey: "capacity",
        size: 100,
        header: () => <p className="column-title">Capacity</p>,
        cell: ({ getValue }) => <span>{getValue<number>()}</span>,
      },
      {
        id: "status",
        accessorKey: "status",
        size: 110,
        header: () => <p className="column-title">Status</p>,
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <Badge variant={status === "active" ? "default" : "outline"}>
              {status}
            </Badge>
          );
        },
      },
      {
        id: "inviteCode",
        accessorKey: "inviteCode",
        size: 130,
        header: () => <p className="column-title">Invite Code</p>,
        cell: ({ getValue }) => (
          <span className="font-mono text-sm">{getValue<string>()}</span>
        ),
      },
      {
        id: "actions",
        size: 180,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <ShowButton
              resource="classes"
              recordItemId={row.original.id}
              variant="outline"
              size="sm"
            >
              View
            </ShowButton>
            <EditButton
              resource="classes"
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

  const statusFilters =
    selectedStatus === "all"
      ? []
      : [{ field: "status", operator: "eq" as const, value: selectedStatus }];

  const searchFilters = searchQuery
    ? [{ field: "search", operator: "contains" as const, value: searchQuery }]
    : [];

  const table = useTable<ClassDetails>({
    columns,
    refineCoreProps: {
      resource: "classes",
      pagination: { pageSize: 10, mode: "server" },
      filters: { permanent: [...statusFilters, ...searchFilters] },
      sorters: { initial: [{ field: "id", order: "desc" }] },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Classes</h1>

      <div className="intro-row">
        <p>Create and manage classes taught across your subjects.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by class name..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTERS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateButton resource="classes" />
          </div>
        </div>
      </div>

      <DataTable table={table} />
    </ListView>
  );
};

export default ClassesListPage;
