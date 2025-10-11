import Client from "@/lib/api";

export const LogInUser = async (data) => {
  try {
    const res = await Client.post("/auth/signin", data, { withCredentials: true });
    return res.data.user || null;
  } catch (error) {
    console.error("Login error:", error?.response?.data || error.message);
    return null;
  }
};

export const CheckSession = async () => {
  try {
    const res = await Client.get("/auth/session", { withCredentials: true });
    return res.data || null;
  } catch (error) {
    console.error("Session check error:", error?.response?.data || error.message);
    return null;
  }
};

export const LogOutUser = async () => {
  try {
    await Client.post("/auth/signout", {}, { withCredentials: true });
    return true;
  } catch (error) {
    console.error("Logout error:", error?.response?.data || error.message);
    return false;
  }
};
