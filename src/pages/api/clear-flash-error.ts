import { APIRoute } from "astro";
import { destroyFlashError } from "../../session";

export const POST: APIRoute = async function ({ cookies, redirect, request }) {
  destroyFlashError(cookies);

  const data = await request.formData();
  const redirectTo = data.get("redirect-to").toString();

  return redirect(redirectTo);
};
