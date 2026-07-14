import { useEffect, useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BookOpen,
  GraduationCap,
  Users,
  School,
  UserCheck,
  Layers,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BACKEND_BASE_URL } from "@/constants";
import { getToken } from "@/providers/auth";
import { User } from "@/types";

type Stats = {
  counts: {
    subjects: number;
    departments: number;
    classes: number;
    enrollments: number;
    teachers: number;
    students: number;
  };
  subjectsByDepartment: { department: string; count: number }[];
  recentClasses: { id: number; name: string; status: string }[];
};

const STAT_CARDS = [
  { key: "classes", label: "Classes", icon: GraduationCap },
  { key: "subjects", label: "Subjects", icon: BookOpen },
  { key: "teachers", label: "Teachers", icon: School },
  { key: "students", label: "Students", icon: Users },
  { key: "enrollments", label: "Enrollments", icon: UserCheck },
  { key: "departments", label: "Departments", icon: Layers },
] as const;

const Dashboard = () => {
  const { data: user } = useGetIdentity<User>();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    fetch(`${BACKEND_BASE_URL}stats`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((payload) => setStats(payload?.data ?? null))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back{user?.name ? `, ${user.name}` : ""} 👋
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {STAT_CARDS.map(({ key, label, icon: Icon }) => (
          <Card key={key}>
            <CardContent className="pt-6 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{label}</span>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              {loading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <span className="text-3xl font-bold">
                  {stats?.counts[key] ?? 0}
                </span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Subjects per department chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Subjects by Department</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats?.subjectsByDepartment ?? []}
                  margin={{ top: 8, right: 8, bottom: 8, left: -20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                  />
                  <XAxis
                    dataKey="department"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      color: "var(--popover-foreground)",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="var(--primary)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent classes */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Classes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : stats?.recentClasses.length ? (
              <ul className="divide-y">
                {stats.recentClasses.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm text-foreground">{c.name}</span>
                    <Badge
                      variant={c.status === "active" ? "default" : "outline"}
                    >
                      {c.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">No classes yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
