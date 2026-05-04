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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const authRequest = async (
  path: "/api/auth/signup" | "/api/auth/login",
  body: Record<string, string>
): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Authentication failed");
  }

  return data;
};
