import { useMemo, useState } from "react";
import {
  useCreate,
  useDelete,
  useList,
  useNotification,
} from "@refinedev/core";
import { Loader2, UserPlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Enrollment, User } from "@/types";

type Props = {
  classId: number;
  capacity?: number;
};

const ClassRoster = ({ classId, capacity }: Props) => {
  const { open } = useNotification();
  const [selectedStudent, setSelectedStudent] = useState<string>("");

  // Current roster for this class.
  const { query: rosterQuery } = useList<Enrollment>({
    resource: "enrollments",
    filters: [{ field: "classId", operator: "eq", value: classId }],
    pagination: { pageSize: 100 },
  });
  const roster = rosterQuery.data?.data ?? [];

  // All students, to offer the ones not yet enrolled.
  const { query: studentsQuery } = useList<User>({
    resource: "faculty",
    filters: [{ field: "role", operator: "eq", value: "student" }],
    pagination: { pageSize: 100 },
  });
  const students = studentsQuery.data?.data ?? [];

  const enrolledIds = useMemo(
    () => new Set(roster.map((r) => r.student?.id)),
    [roster]
  );
  const availableStudents = students.filter((s) => !enrolledIds.has(s.id));

  const { mutate: enroll, mutation: enrollMutation } = useCreate();
  const isEnrolling = enrollMutation.isPending;
  const { mutate: unenroll } = useDelete();

  const isFull = capacity != null && roster.length >= capacity;

  const handleEnroll = () => {
    if (!selectedStudent) return;
    enroll(
      {
        resource: "enrollments",
        values: { classId, studentId: Number(selectedStudent) },
      },
      {
        onSuccess: () => {
          setSelectedStudent("");
          rosterQuery.refetch();
        },
        onError: (err: any) => {
          open?.({
            type: "error",
            message: "Could not enroll student",
            description: err?.message ?? "Please try again.",
          });
        },
      }
    );
  };

  const handleRemove = (enrollmentId: number) => {
    unenroll(
      { resource: "enrollments", id: enrollmentId },
      { onSuccess: () => rosterQuery.refetch() }
    );
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Roster</span>
          <Badge variant="secondary">
            {roster.length}
            {capacity != null ? ` / ${capacity}` : ""} students
          </Badge>
        </CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="mt-6 space-y-5">
        {/* Add a student */}
        <div className="flex gap-2">
          <Select
            value={selectedStudent}
            onValueChange={setSelectedStudent}
            disabled={isFull || availableStudents.length === 0}
          >
            <SelectTrigger className="flex-1">
              <SelectValue
                placeholder={
                  isFull
                    ? "Class is full"
                    : availableStudents.length === 0
                    ? "No more students to add"
                    : "Select a student to enroll"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {availableStudents.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name} ({s.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            onClick={handleEnroll}
            disabled={!selectedStudent || isEnrolling || isFull}
          >
            {isEnrolling ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-1" /> Enroll
              </>
            )}
          </Button>
        </div>

        {/* Enrolled students */}
        {roster.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No students enrolled yet.
          </p>
        ) : (
          <ul className="divide-y">
            {roster.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between py-3"
              >
                <div className="flex flex-col">
                  <span className="text-foreground font-medium">
                    {entry.student?.name ?? "Unknown"}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {entry.student?.email}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(entry.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default ClassRoster;
