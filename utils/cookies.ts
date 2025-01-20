import { cookies } from "next/headers";

export const setAuthCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
};

export const getAuthCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("auth-token");
};
