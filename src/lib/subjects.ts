import { Subject } from "@/types";

// The API returns `department` as a joined object, but forms submit it as a
// plain name string. Normalize both into a display name.
export function departmentName(subject?: Subject | null): string {
  if (!subject?.department) return "—";
  if (typeof subject.department === "string") return subject.department;
  return subject.department.name ?? "—";
}
