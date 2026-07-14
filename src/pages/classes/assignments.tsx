import { useState } from "react";
import {
  useCreate,
  useDelete,
  useList,
  useNotification,
  useUpdate,
} from "@refinedev/core";
import { Loader2, Plus, X, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Assignment, Submission } from "@/types";
import { getRole, getStoredUser } from "@/providers/auth";

const ClassAssignments = ({ classId }: { classId: number }) => {
  const { open } = useNotification();
  const role = getRole();
  const isStaff = role === "admin" || role === "teacher";
  const currentUserId = getStoredUser()?.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [maxPoints, setMaxPoints] = useState("100");

  const { query } = useList<Assignment>({
    resource: "assignments",
    filters: [{ field: "classId", operator: "eq", value: classId }],
    pagination: { pageSize: 100 },
  });
  const assignments = query.data?.data ?? [];

  const { mutate: create, mutation } = useCreate();
  const { mutate: remove } = useDelete();

  const handleCreate = () => {
    if (!title.trim()) return;
    create(
      {
        resource: "assignments",
        values: {
          classId,
          title,
          description,
          dueDate: dueDate || null,
          maxPoints: Number(maxPoints) || 100,
        },
      },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          setDueDate("");
          setMaxPoints("100");
          query.refetch();
        },
        onError: (err: any) =>
          open?.({
            type: "error",
            message: "Could not create assignment",
            description: err?.message ?? "Please try again.",
          }),
      }
    );
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" /> Assignments
        </CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="mt-6 space-y-6">
        {isStaff && (
          <div className="space-y-3 rounded-lg border p-4">
            <Input
              placeholder="Assignment title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-44"
              />
              <Input
                type="number"
                min={1}
                value={maxPoints}
                onChange={(e) => setMaxPoints(e.target.value)}
                placeholder="Points"
                className="w-28"
              />
              <Button
                type="button"
                onClick={handleCreate}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {assignments.length === 0 ? (
          <p className="text-muted-foreground text-sm">No assignments yet.</p>
        ) : (
          <div className="space-y-4">
            {assignments.map((a) => (
              <AssignmentCard
                key={a.id}
                assignment={a}
                isStaff={isStaff}
                currentUserId={currentUserId}
                onDeleted={() => query.refetch()}
                onDelete={(id) =>
                  remove(
                    { resource: "assignments", id },
                    { onSuccess: () => query.refetch() }
                  )
                }
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

type CardProps = {
  assignment: Assignment;
  isStaff: boolean;
  currentUserId?: number | string;
  onDelete: (id: number) => void;
  onDeleted: () => void;
};

const AssignmentCard = ({
  assignment,
  isStaff,
  currentUserId,
  onDelete,
}: CardProps) => {
  const { open } = useNotification();
  const [content, setContent] = useState("");

  const { query } = useList<Submission>({
    resource: "submissions",
    filters: [{ field: "assignmentId", operator: "eq", value: assignment.id }],
    pagination: { pageSize: 100 },
  });
  const submissions = query.data?.data ?? [];
  const mySubmission = submissions.find(
    (s) => String(s.student?.id) === String(currentUserId)
  );

  const { mutate: submit, mutation: submitMutation } = useCreate();

  const handleSubmit = () => {
    if (!content.trim()) return;
    submit(
      {
        resource: "submissions",
        values: { assignmentId: assignment.id, content },
      },
      {
        onSuccess: () => {
          setContent("");
          query.refetch();
        },
        onError: (err: any) =>
          open?.({
            type: "error",
            message: "Could not submit",
            description: err?.message ?? "Please try again.",
          }),
      }
    );
  };

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-foreground">{assignment.title}</p>
          {assignment.description && (
            <p className="text-sm text-muted-foreground">
              {assignment.description}
            </p>
          )}
          <div className="flex gap-2 mt-1">
            <Badge variant="secondary">{assignment.maxPoints} pts</Badge>
            {assignment.dueDate && (
              <Badge variant="outline">
                Due {new Date(assignment.dueDate).toLocaleDateString()}
              </Badge>
            )}
          </div>
        </div>
        {isStaff && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDelete(assignment.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Staff: view + grade submissions */}
      {isStaff && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Submissions ({submissions.length})
          </p>
          {submissions.length === 0 ? (
            <p className="text-sm text-muted-foreground">None yet.</p>
          ) : (
            submissions.map((s) => (
              <GradeRow
                key={s.id}
                submission={s}
                maxPoints={assignment.maxPoints}
                onGraded={() => query.refetch()}
              />
            ))
          )}
        </div>
      )}

      {/* Student: submit or see own submission */}
      {!isStaff &&
        (mySubmission ? (
          <div className="rounded-md bg-muted/40 p-3 text-sm">
            <p className="text-foreground">Submitted ✓</p>
            <p className="text-muted-foreground mt-1">{mySubmission.content}</p>
            {mySubmission.grade != null && (
              <p className="mt-2 font-medium">
                Grade: {mySubmission.grade} / {assignment.maxPoints}
                {mySubmission.feedback ? ` — ${mySubmission.feedback}` : ""}
              </p>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <Textarea
              placeholder="Your answer or a link..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        ))}
    </div>
  );
};

const GradeRow = ({
  submission,
  maxPoints,
  onGraded,
}: {
  submission: Submission;
  maxPoints: number;
  onGraded: () => void;
}) => {
  const [grade, setGrade] = useState(
    submission.grade != null ? String(submission.grade) : ""
  );
  const [feedback, setFeedback] = useState(submission.feedback ?? "");
  const { mutate: update, mutation } = useUpdate();

  const handleSave = () =>
    update(
      {
        resource: "submissions",
        id: submission.id,
        values: { grade: grade === "" ? null : Number(grade), feedback },
      },
      { onSuccess: () => onGraded() }
    );

  return (
    <div className="rounded-md border p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {submission.student?.name ?? "Unknown"}
        </span>
        <span className="text-xs text-muted-foreground">
          {submission.student?.email}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{submission.content}</p>
      <div className="flex flex-wrap gap-2 items-center">
        <Input
          type="number"
          min={0}
          max={maxPoints}
          placeholder="Grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="w-24"
        />
        <span className="text-sm text-muted-foreground">/ {maxPoints}</span>
        <Input
          placeholder="Feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="flex-1 min-w-[140px]"
        />
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ClassAssignments;
