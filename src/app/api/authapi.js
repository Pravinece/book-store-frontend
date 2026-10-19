import instance from "../../utils/service";

// POST /api/v1/auth/register
// body: { name, email, password }
// response: { id, name, email, role, isActive, createdAt, lastLoginAt }
export async function registerUser(userData) {
  try {
    const res = await instance.post("/api/v1/auth/register", userData);
    return { success: true, data: res.data };
  } catch (err) {
    const errData = err?.response?.data;
    return {
      success: false,
      message: errData?.message || errData?.error || errData?.detail || err?.message || "Error registering user",
    };
  }
}

// POST /api/v1/auth/login
// body: { email, password }
// response: { accessToken, tokenType, expiresAt, user }
export async function loginUser(credentials) {
  try {
    const res = await instance.post("/api/v1/auth/login", credentials);
    const { accessToken, user } = res.data;
    return { success: true, data: res.data, user };
  } catch (err) {
    const errData = err?.response?.data;
    return {
      success: false,
      message: errData?.message || errData?.error || errData?.detail || err?.message || "Error logging in",
    };
  }
}

export async function logOutUser() {
  try {
    const res = await instance.post("/api/v1/auth/logout");
    return { success: true, data: res.data };
  } catch (err) {
    const errData = err?.response?.data;
    return {
      success: false,
      message: errData?.message || errData?.error || errData?.detail || err?.message || "Error logging in",
    };
  }
}
