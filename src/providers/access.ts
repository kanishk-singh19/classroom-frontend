import { AccessControlProvider } from "@refinedev/core";
import { getRole } from "./auth";

// Read-only actions everyone signed in can perform.
const READ_ACTIONS = ["list", "show"];

// Mirrors the backend role rules: staff manage content, only admins manage
// user accounts, and students get read-only access.
export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    if (READ_ACTIONS.includes(action)) {
      return { can: true };
    }

    const role = getRole();

    // Managing people (faculty) is admin-only.
    if (resource === "faculty") {
      return { can: role === "admin" };
    }

    // Everything else (subjects, classes, enrollments, ...) is staff-only.
    return { can: role === "admin" || role === "teacher" };
  },
  options: {
    buttons: {
      // Hide actions a user can't perform instead of just disabling them.
      enableAccessControl: true,
      hideIfUnauthorized: true,
    },
  },
};
