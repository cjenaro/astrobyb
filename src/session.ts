import type { AstroCookies } from "astro"; // Adjust import based on exact types if necessary
import jwt from "jsonwebtoken";

export function getUserFromCookie(cookies: AstroCookies) {
  const token = cookies.get("auth_session");

  if (!token) return null;

  return jwt.verify(
    token.value,
    import.meta.env.JWT_SECRET_KEY
  ) as jwt.JwtPayload;
}

export function createAuthSession(cookies: AstroCookies, token: string) {
  cookies.set("auth_session", token, {
    httpOnly: true,
    secure: !!import.meta.env.PROD,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "strict",
  });
}

export function destroyAuthSession(cookies: AstroCookies) {
  cookies.set("auth_session", "deleted", {
    expires: new Date(0),
    secure: true,
    path: "/",
    httpOnly: true,
  });
}
