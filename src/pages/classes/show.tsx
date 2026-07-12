import { useShow } from "@refinedev/core";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { ShowView } from "@/components/refine-ui/views/show-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { ListButton } from "@/components/refine-ui/buttons/list";

import { ClassDetails } from "@/types";
import ClassRoster from "./roster";

const ClassesShow = () => {
  const { query } = useShow<ClassDetails>({ resource: "classes" });
  const item = query.data?.data;
  const isLoading = query.isLoading;

  return (
    <ShowView>
      <Breadcrumb />

      <div className="intro-row">
        <h1 className="page-title">Class Details</h1>
        <div className="flex gap-2">
          <ListButton resource="classes" />
          {item && (
            <>
              <EditButton resource="classes" recordItemId={item.id} />
              <DeleteButton resource="classes" recordItemId={item.id} />
            </>
          )}
        </div>
      </div>

      <Separator />

      {item?.bannerUrl && (
        <img
          src={item.bannerUrl}
          alt={item.name}
          className="w-full max-w-3xl h-48 object-cover rounded-lg"
        />
      )}

      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {isLoading ? (
              <Skeleton className="h-7 w-64" />
            ) : (
              <>
                <span>{item?.name}</span>
                {item?.status && (
                  <Badge
                    variant={item.status === "active" ? "default" : "outline"}
                  >
                    {item.status}
                  </Badge>
                )}
              </>
            )}
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="mt-6 grid sm:grid-cols-2 gap-5">
          <Field label="Subject">
            {isLoading ? (
              <Skeleton className="h-5 w-40" />
            ) : (
              <Badge variant="secondary">{item?.subject?.name ?? "—"}</Badge>
            )}
          </Field>

          <Field label="Teacher">
            {isLoading ? (
              <Skeleton className="h-5 w-40" />
            ) : (
              <span className="text-foreground">
                {item?.teacher?.name ?? "—"}
              </span>
            )}
          </Field>

          <Field label="Capacity">
            <span className="text-foreground">{item?.capacity ?? "—"}</span>
          </Field>

          <Field label="Invite Code">
            <span className="font-mono">{item?.inviteCode ?? "—"}</span>
          </Field>

          <div className="sm:col-span-2">
            <Field label="Description">
              <p className="text-muted-foreground">
                {item?.description || "—"}
              </p>
            </Field>
          </div>
        </CardContent>
      </Card>

      {item && <ClassRoster classId={item.id} capacity={item.capacity} />}
    </ShowView>
  );
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm font-medium text-muted-foreground">{label}</span>
    {children}
  </div>
);

export default ClassesShow;
