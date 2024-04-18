import type { APIRoute } from "astro";
import { Product, db } from "astro:db";
import { getUserFromCookie } from "../../session";

export const POST: APIRoute = async ({ request, redirect, cookies }) => {
  const user = getUserFromCookie(cookies);

  if (!user || user.role !== "admin") return redirect("/permissions-error");

  try {
    const formData = await request.formData();

    const name = formData.get("name").toString();
    const bar_price = Number(formData.get("bar_price"));
    const franchise_price = Number(formData.get("franchise_price"));
    const batch = Number(formData.get("batch"));
    const delivery_time = Number(formData.get("delivery_time"));
    const type_id = Number(formData.get("type"));

    if (
      !name ||
      Number.isNaN(bar_price) ||
      Number.isNaN(franchise_price) ||
      Number.isNaN(batch) ||
      Number.isNaN(delivery_time) ||
      Number.isNaN(type_id)
    ) {
      return redirect("/products/new");
    }

    // Insert new product into the database
    await db.insert(Product).values([
      {
        name,
        bar_price,
        franchise_price,
        batch,
        delivery_time_id: delivery_time,
        type_id,
      },
    ]);

    return redirect("/products");
  } catch (error) {
    return redirect("/products/new");
  }
};
