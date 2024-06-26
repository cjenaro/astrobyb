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

export function setFlashError(cookies: AstroCookies, error: string) {
  cookies.set("flash_session", error, {
    httpOnly: true,
    secure: !!import.meta.env.PROD,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "strict",
  });
}

export function getFlashError(cookies: AstroCookies) {
  const error = cookies.get("flash_session")?.value;

  if (error && error !== "deleted") {
    destroyFlashError(cookies);

    return error;
  } else {
    return undefined;
  }
}

export function destroyFlashError(cookies: AstroCookies) {
  cookies.set("flash_session", "deleted", {
    expires: new Date(0),
    secure: true,
    path: "/",
    httpOnly: true,
  });
}
