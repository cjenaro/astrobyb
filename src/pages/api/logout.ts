import type { APIRoute } from "astro";
import { destroyAuthSession } from "../../session";

export const POST: APIRoute = async ({ cookies, redirect }) => {
  destroyAuthSession(cookies);

  return redirect("/login", 302);
};
