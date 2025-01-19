import { cookies } from "next/headers";

export const setAuthCookie = async (token: string) => {
  (await cookies()).set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
};

export const getAuthCookie = async () => {
  return (await cookies()).get("auth-token");
};
