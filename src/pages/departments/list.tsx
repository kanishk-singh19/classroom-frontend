import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ListView } from "@/components/refine-ui/views/list-view";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";

import { Department } from "@/types";

const DepartmentsListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const columns = useMemo<ColumnDef<Department>[]>(
    () => [
      {
        id: "code",
        accessorKey: "code",
        size: 120,
        header: () => <p className="column-title ml-2">Code</p>,
        cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
      },
      {
        id: "name",
        accessorKey: "name",
        size: 240,
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<string>()}</span>
        ),
      },
      {
        id: "description",
        accessorKey: "description",
        size: 320,
        header: () => <p className="column-title">Description</p>,
        cell: ({ getValue }) => (
          <span className="text-muted-foreground line-clamp-2">
            {getValue<string>() || "—"}
          </span>
        ),
      },
      {
        id: "actions",
        size: 180,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <EditButton
              resource="departments"
              recordItemId={row.original.id}
              variant="outline"
              size="sm"
            >
              Edit
            </EditButton>
            <DeleteButton
              resource="departments"
              recordItemId={row.original.id}
              variant="outline"
              size="sm"
            />
          </div>
        ),
      },
    ],
    []
  );

  const searchFilters = searchQuery
    ? [{ field: "search", operator: "contains" as const, value: searchQuery }]
    : [];

  const table = useTable<Department>({
    columns,
    refineCoreProps: {
      resource: "departments",
      pagination: { pageSize: 10, mode: "server" },
      filters: { permanent: searchFilters },
      sorters: { initial: [{ field: "id", order: "desc" }] },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Departments</h1>

      <div className="intro-row">
        <p>Departments group your subjects and faculty.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search departments..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <CreateButton resource="departments" />
        </div>
      </div>

      <DataTable table={table} />
    </ListView>
  );
};

export default DepartmentsListPage;
