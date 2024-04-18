import type { APIRoute } from "astro";
import { db, Order, OrderItem } from "astro:db";
import { getUserFromCookie } from "../../session";

export const POST: APIRoute = async ({ cookies, request, redirect }) => {
  const user = getUserFromCookie(cookies);

  // Validate user is logged in
  if (!user) return redirect("/login");

  const formData = await request.formData();
  const items = Array.from(formData.getAll("product_id"));
  const quantities = Array.from(formData.getAll("quantity"));
  const delivery_date = new Date(
    formData.get("delivery_date").toString()
  ).toISOString();

  if (!items || Array.from(items).length === 0) {
    return redirect("/orders/new");
  }

  if (!quantities.some((el) => !Number.isNaN(Number(el)) && Number(el) > 0))
    return redirect("/orders/new");

  const today = new Date();

  const [{ id: orderId }] = await db
    .insert(Order)
    .values([
      {
        user_id: user.id,
        date_of_creation: today,
        date_of_delivery: new Date(delivery_date),
      },
    ])
    .returning();

  const orderItems = items.reduce((acc, item, index) => {
    const quantity = Number(quantities[index]);
    if (!Number.isNaN(quantity) && quantity > 0) {
      acc.push({
        product_id: Number(item),
        quantity,
        order_id: orderId,
      });
    }

    return acc;
  }, []);

  await db.insert(OrderItem).values(orderItems);

  return redirect("/orders/new");
};
