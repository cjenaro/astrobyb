import type { APIRoute } from "astro";
import { Product, db, eq } from "astro:db";
import { getUserFromCookie, setFlashError } from "../../session";

export const POST: APIRoute = async ({ request, redirect, cookies }) => {
  const user = getUserFromCookie(cookies);

  if (!user || user.role !== "admin") {
    setFlashError(cookies, "Usted no tiene permiso para crear un producto.");

    return redirect("/products");
  }

  const formData = await request.formData();

  const productId = Number(formData.get("productId"));
  const action = formData.get("action").toString();
  const name = formData.get("name").toString();
  const bar_price = Number(formData.get("bar_price"));
  const franchise_price = Number(formData.get("franchise_price"));
  const batch = Number(formData.get("batch"));
  const delivery_time = Number(formData.get("delivery_time"));
  const type_id = Number(formData.get("type"));

  if (action && action === "delete") {
    if (productId && !Number.isNaN(productId) && name) {
      const [product] = await db
        .select()
        .from(Product)
        .where(eq(Product.id, productId));

      if (product.name !== name) {
        setFlashError(
          cookies,
          "El nombre de este producto no coincide con el ingresado"
        );
        return redirect(`/products/${productId}`);
      } else {
        await db.delete(Product).where(eq(Product.id, productId));
      }
    }

    return redirect(`/products`);
  }

  if (
    !name ||
    Number.isNaN(bar_price) ||
    Number.isNaN(franchise_price) ||
    Number.isNaN(batch) ||
    Number.isNaN(delivery_time) ||
    Number.isNaN(type_id)
  ) {
    setFlashError(cookies, "Hay algo mal en los datos para crear el producto");
    return redirect("/products/new");
  }

  if (action && action === "update") {
    if (productId && !Number.isNaN(productId)) {
      await db
        .update(Product)
        .set({
          name,
          bar_price,
          franchise_price,
          batch,
          delivery_time_id: delivery_time,
          type_id,
        })
        .where(eq(Product.id, productId));
    }

    return redirect("/products");
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
};
