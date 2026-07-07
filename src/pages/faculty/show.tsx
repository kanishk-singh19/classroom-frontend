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

import { User } from "@/types";

const FacultyShow = () => {
  const { query } = useShow<User>({ resource: "faculty" });
  const user = query.data?.data;
  const isLoading = query.isLoading;

  return (
    <ShowView>
      <Breadcrumb />

      <div className="intro-row">
        <h1 className="page-title">Person Details</h1>
        <div className="flex gap-2">
          <ListButton resource="faculty" />
          {user && (
            <>
              <EditButton resource="faculty" recordItemId={user.id} />
              <DeleteButton resource="faculty" recordItemId={user.id} />
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
                <span>{user?.name}</span>
                {user?.role && <Badge variant="secondary">{user.role}</Badge>}
              </>
            )}
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="mt-6 space-y-5">
          <Field label="Email">
            {isLoading ? (
              <Skeleton className="h-5 w-56" />
            ) : (
              <span className="text-foreground">{user?.email}</span>
            )}
          </Field>

          <Field label="Department">
            {isLoading ? (
              <Skeleton className="h-5 w-40" />
            ) : (
              <span className="text-foreground">{user?.department || "—"}</span>
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

export default FacultyShow;
