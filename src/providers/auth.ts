import { AuthProvider } from "@refinedev/core";
import { BACKEND_BASE_URL } from "@/constants";

// Keys used to persist the session in localStorage.
export const TOKEN_KEY = "classroom_token";
export const USER_KEY = "classroom_user";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

const getStoredUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const post = async (path: string, body: unknown) => {
  const response = await fetch(`${BACKEND_BASE_URL}auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  return { ok: response.ok, payload };
};

const persistSession = (payload: any) => {
  const token = payload?.data?.token;
  const user = payload?.data?.user;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const { ok, payload } = await post("login", { email, password });
    if (ok) {
      persistSession(payload);
      return { success: true, redirectTo: "/" };
    }
    return {
      success: false,
      error: {
        name: "LoginError",
        message: payload?.error ?? "Invalid email or password",
      },
    };
  },

  register: async ({ email, password, name, role }) => {
    const { ok, payload } = await post("signup", { email, password, name, role });
    if (ok) {
      persistSession(payload);
      return { success: true, redirectTo: "/" };
    }
    return {
      success: false,
      error: {
        name: "RegisterError",
        message: payload?.error ?? "Could not create account",
      },
    };
  },

  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    if (getToken()) {
      return { authenticated: true };
    }
    return { authenticated: false, redirectTo: "/login" };
  },

  onError: async (error) => {
    if (error?.statusCode === 401 || error?.status === 401) {
      return { logout: true, redirectTo: "/login", error };
    }
    return {};
  },

  getIdentity: async () => {
    return getStoredUser();
  },

  getPermissions: async () => {
    return getStoredUser()?.role ?? null;
  },
};
