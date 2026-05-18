export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
}

export interface Task {
  id: string;
  _id?: string;
  title: string;
  description: string;
  status: "pending" | "accepted" | "completed";
  createdAt: string;
  createdBy?: User;
  assignedTo?: User | null;
  assignedUser?: { name: string; email: string };
}

// Empty string = same origin (Vite dev proxy or backend serving the built app).
const BASE_URL = import.meta.env.VITE_API_URL ?? "";

function normalizeUser(user: any): User | undefined {
  if (!user || typeof user !== "object") return undefined;

  return {
    ...user,
    id: String(user.id || user._id),
  };
}

function normalizeTask(task: any): Task {
  const createdBy = normalizeUser(task.createdBy);
  const assignedTo = normalizeUser(task.assignedTo);

  return {
    ...task,
    id: String(task.id || task._id),
    createdBy,
    assignedTo: assignedTo || null,
    assignedUser: task.assignedUser || assignedTo,
  };
}

function normalizeApiData(data: any): any {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map((item) => normalizeApiData(item));
  }

  if (Array.isArray(data.tasks)) {
    return data.tasks.map(normalizeTask);
  }

  if (data.task) {
    return {
      ...data,
      task: normalizeTask(data.task),
    };
  }

  if (data.title && data.status) {
    return normalizeTask(data);
  }

  if (data._id || data.id) {
    return normalizeUser(data);
  }

  return data;
}

export const apiClient = {
  async fetch<T>(path: string, options?: RequestInit): Promise<{ data?: T; error?: string }> {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options?.headers as Record<string, string> | undefined),
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
      });

      const isJson = response.headers.get("content-type")?.includes("application/json");
      
      if (!response.ok) {
        let errorMessage = response.statusText;
        if (isJson) {
          const errorData = await response.json().catch(() => null);
          errorMessage = errorData?.message || errorMessage;
        } else {
          const textData = await response.text().catch(() => null);
          errorMessage = textData || errorMessage;
        }
        return { error: errorMessage };
      }

      if (isJson) {
        const data = await response.json().catch(() => null);
        return { data: normalizeApiData(data) };
      }
      
      return { data: {} as T };
    } catch (err: any) {
      return { error: err.message || "Network error" };
    }
  }
};
