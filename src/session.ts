// sessionMiddleware.ts
import type { AstroCookies, ValidRedirectStatus } from "astro"; // Adjust import based on exact types if necessary
import jwt from "jsonwebtoken";

interface MiddlewareContext {
  cookies: AstroCookies;
  redirect: (path: string, status?: ValidRedirectStatus) => Response;
}

export function getUserFromCookie(cookies: AstroCookies) {
  const token = cookies.get("session_id");

  if (!token) return null;

  return jwt.verify(
    token.value,
    import.meta.env.JWT_SECRET_KEY
  ) as jwt.JwtPayload;
}

export function redirectIfNotLoggedIn({
  cookies,
  redirect,
  url,
}: MiddlewareContext & { url: string }) {
  const user = getUserFromCookie(cookies);

  if (!user && url != "/login") {
    return redirect("/login");
  }

  return user;
}

export function redirectIfNotAdmin({ cookies, redirect }: MiddlewareContext) {
  const user = getUserFromCookie(cookies);
  if (!user || user.role !== "admin") {
    return redirect("/role-error");
  }
  return user;
}

export function redirectIfLoggedIn({ cookies, redirect }: MiddlewareContext) {
  const user = getUserFromCookie(cookies);
  if (user) {
    return redirect("/");
  }
}

export function destroySession({ cookies, redirect }: MiddlewareContext) {
  cookies.delete("session_token");

  return redirect("/login");
}
