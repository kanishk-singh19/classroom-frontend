import { useGetIdentity } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types";

const Dashboard = () => {
  const { data: user } = useGetIdentity<User>();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="page-title">Dashboard</h1>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">
            Welcome back{user?.name ? `, ${user.name}` : ""} 👋
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Use the sidebar to manage subjects, faculty and classes. More
            insights are coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
