import { useState } from "react";
import { useCreate, useDelete, useList, useNotification } from "@refinedev/core";
import { Loader2, Plus, X, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ClassScheduleItem } from "@/types";
import { getRole } from "@/providers/auth";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const ClassSchedule = ({ classId }: { classId: number }) => {
  const { open } = useNotification();
  const canManage = getRole() === "admin" || getRole() === "teacher";

  const [day, setDay] = useState("monday");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  const { query } = useList<ClassScheduleItem>({
    resource: "schedules",
    filters: [{ field: "classId", operator: "eq", value: classId }],
    pagination: { pageSize: 100 },
  });
  const slots = query.data?.data ?? [];

  const { mutate: add, mutation } = useCreate();
  const { mutate: remove } = useDelete();

  const handleAdd = () => {
    add(
      {
        resource: "schedules",
        values: { classId, day, startTime, endTime },
      },
      {
        onSuccess: () => query.refetch(),
        onError: (err: any) =>
          open?.({
            type: "error",
            message: "Could not add slot",
            description: err?.message ?? "Please try again.",
          }),
      }
    );
  };

  const handleRemove = (id: number) =>
    remove(
      { resource: "schedules", id },
      { onSuccess: () => query.refetch() }
    );

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" /> Schedule
        </CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="mt-6 space-y-5">
        {canManage && (
          <div className="flex flex-wrap gap-2 items-end">
            <div className="flex-1 min-w-[140px]">
              <Select value={day} onValueChange={setDay}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {cap(d)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-32"
            />
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-32"
            />
            <Button type="button" onClick={handleAdd} disabled={mutation.isPending}>
              {mutation.isPending ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </>
              )}
            </Button>
          </div>
        )}

        {slots.length === 0 ? (
          <p className="text-muted-foreground text-sm">No schedule set yet.</p>
        ) : (
          <ul className="divide-y">
            {slots.map((slot) => (
              <li
                key={slot.id}
                className="flex items-center justify-between py-3"
              >
                <span className="text-foreground">
                  <span className="font-medium">{cap(slot.day)}</span>{" "}
                  {slot.startTime} – {slot.endTime}
                </span>
                {canManage && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(slot.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default ClassSchedule;
