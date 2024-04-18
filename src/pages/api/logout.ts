import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.set("session_id", "deleted", {
    expires: new Date(0),
    secure: true,
    path: "/",
    httpOnly: true,
  });

  return redirect("/login", 302);
};
