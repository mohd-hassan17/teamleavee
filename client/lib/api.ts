import axios from "axios";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "employee" | "manager" | "admin";
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type RegisterUserData = {
  name: string;
  email: string;
  password: string;
  role: AuthUser["role"];
};

export type LeaveRequest = {
  _id: string;
  userId:
    | string
    | {
        _id: string;
        name: string;
        email: string;
        role: AuthUser["role"];
      };
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  managerId?: string | null;
  comment?: string;
  workingDays?: number;
  createdAt?: string;
};

export type LeaveFormData = {
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
};

export type ParsedLeave = LeaveFormData;

export type ManagerInsight = {
  summary: string;
  recommendation: string;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthToken = () => {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem("auth_token") || "";
};

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || error.message || "Request failed";
  }

  return "Something went wrong";
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const registerUser = async (data: RegisterUserData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/signup", data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const applyLeave = async (data: LeaveFormData): Promise<LeaveRequest> => {
  try {
    const token = getAuthToken();

    console.log("Applying leave", {
      endpoint: "/leave/apply",
      hasToken: Boolean(token),
      data,
    });

    const response = await api.post<{ leaveRequest: LeaveRequest }>("/leave/apply", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.leaveRequest;
  } catch (error) {
    console.error("Leave apply failed", error);
    throw new Error(getErrorMessage(error));
  }
};

export const getMyLeaves = async (): Promise<LeaveRequest[]> => {
  try {
    const response = await api.get<{ leaveRequests: LeaveRequest[] }>("/leave/my");
    return response.data.leaveRequests;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getPendingLeaves = async (): Promise<LeaveRequest[]> => {
  try {
    const response = await api.get<{ leaveRequests: LeaveRequest[] }>("/leave/pending");
    return response.data.leaveRequests;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const approveLeave = async (id: string, comment = ""): Promise<LeaveRequest> => {
  try {
    const response = await api.patch<{ leaveRequest: LeaveRequest }>(`/leave/${id}/approve`, {
      comment,
    });
    return response.data.leaveRequest;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const rejectLeave = async (id: string, comment = ""): Promise<LeaveRequest> => {
  try {
    const response = await api.patch<{ leaveRequest: LeaveRequest }>(`/leave/${id}/reject`, {
      comment,
    });
    return response.data.leaveRequest;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const parseLeaveText = async (text: string): Promise<ParsedLeave> => {
  try {
    const response = await api.post<ParsedLeave>("/ai/parse-leave", { text });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getManagerInsight = async (
  leaveRequest: LeaveRequest,
  teamData: { pendingCount: number; requests: LeaveRequest[] }
): Promise<ManagerInsight> => {
  try {
    const response = await api.post<ManagerInsight>("/ai/manager-insight", {
      leaveRequest,
      teamData,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
