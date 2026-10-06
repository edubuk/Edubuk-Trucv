import api from "@/lib/api";

export type DeveloperResponse<T = {}> =
  | ({ success: true } & T)
  | { success: false; message: string };

const developerSignIn = async (
  email: string,
  password: string
): Promise<DeveloperResponse<{ message: string }>> => {
  try {
    const { data } = await api.post("/developer/sign-in", { email, password });
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Could not sign in",
    };
  }
};

const getCurrentDeveloper = async (): Promise<
  DeveloperResponse<{ developer: { email: string } }>
> => {
  try {
    const { data } = await api.get("/developer/me");
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Could not fetch developer",
    };
  }
};

const developerLogout = async (): Promise<DeveloperResponse<{ message: string }>> => {
  try {
    const { data } = await api.post("/developer/logout");
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Could not sign out",
    };
  }
};

const requestDebugSession = async (
  candidateEmail: string,
  developerEmail: string
): Promise<DeveloperResponse<{ message: string }>> => {
  try {
    const { data } = await api.post("/developer/debug/request", {
      candidateEmail,
      developerEmail,
    });
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Could not request debug session",
    };
  }
};

const confirmDebugSession = async (
  token: string
): Promise<DeveloperResponse<{ candidate: { email: string } }>> => {
  try {
    const { data } = await api.post("/developer/debug/confirm", { token });
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Could not confirm debug session",
    };
  }
};

// Ends the impersonated candidate session by reusing the normal end-user
// logout endpoint — it's a real candidate session, so ending it goes through
// the same path as any other logout. The developer's own session
// (developer_token) is untouched.
const switchDebugSession = async (): Promise<void> => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`, {
    method: "PUT",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Unable to switch session");
};

export const developerService = {
  developerSignIn,
  getCurrentDeveloper,
  developerLogout,
  requestDebugSession,
  confirmDebugSession,
  switchDebugSession,
};
