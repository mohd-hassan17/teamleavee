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

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
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
