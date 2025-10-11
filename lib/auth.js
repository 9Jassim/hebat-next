"use server"
import Client from "@/lib/api"
import { cookies } from "next/headers"

// export async function verifyTokenOnServer(token) {
//   // optional: call backend to verify token
//   try {
//     const res = await fetch("http://localhost:3000/auth/session", {
//       method: "POST",
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//     })
//     if (!res.ok) return null
//     return await res.json()
//   } catch (e) {
//     return null
//   }
// }

// ✅ Register user
export const RegisterUser = async data => {
  try {
    const response = await Client.post("/auth/signup", data)
    return response.data
  } catch (error) {
    console.error("Register error:", error.response?.data || error.message)
    throw error
  }
}

// ✅ Log in user (save token to cookies)
export const LogInUser = async data => {
  try {
    const response = await Client.post("/auth/signin", data)
    const { token, user } = response.data

    // Store token in cookies (HTTP-only on server)
    cookies().set("auth_token", token, {
      httpOnly: false, // set true if you only handle cookies server-side
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return user
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message)
    return null
  }
}

// ✅ Check session (verify token from cookies)
export const CheckSession = async () => {
  try {
    const token = cookies().get("auth_token")?.value
    if (!token) return null

    const response = await Client.get("/auth/session", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error) {
    console.error("Session check error:", error.response?.data || error.message)
    return null
  }
}

// ✅ Logout (clear cookies)
export const LogOutUser = async () => {
  try {
    cookies().delete("auth_token")
    return true
  } catch (error) {
    console.error("Logout error:", error)
    return false
  }
}
