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

import { Subject } from "@/types";
import { departmentName } from "@/lib/subjects";

const SubjectsShow = () => {
  const { query } = useShow<Subject>({ resource: "subjects" });
  const subject = query.data?.data;
  const isLoading = query.isLoading;

  return (
    <ShowView>
      <Breadcrumb />

      <div className="intro-row">
        <h1 className="page-title">Subject Details</h1>
        <div className="flex gap-2">
          <ListButton resource="subjects" />
          {subject && (
            <>
              <EditButton resource="subjects" recordItemId={subject.id} />
              <DeleteButton resource="subjects" recordItemId={subject.id} />
            </>
          )}
        </div>
      </div>

      <Separator />

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {isLoading ? (
              <Skeleton className="h-7 w-64" />
            ) : (
              <>
                <span>{subject?.name}</span>
                {subject?.code && <Badge>{subject.code}</Badge>}
              </>
            )}
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="mt-6 space-y-5">
          <Field label="Department">
            {isLoading ? (
              <Skeleton className="h-5 w-40" />
            ) : (
              <Badge variant="secondary">{departmentName(subject)}</Badge>
            )}
          </Field>

          <Field label="Code">
            {isLoading ? (
              <Skeleton className="h-5 w-24" />
            ) : (
              <span className="text-foreground">{subject?.code}</span>
            )}
          </Field>

          <Field label="Description">
            {isLoading ? (
              <Skeleton className="h-5 w-full" />
            ) : (
              <p className="text-muted-foreground">
                {subject?.description || "—"}
              </p>
            )}
          </Field>
        </CardContent>
      </Card>
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

export default SubjectsShow;
