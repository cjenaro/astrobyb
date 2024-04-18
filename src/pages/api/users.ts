import type { APIRoute } from "astro";
import { User, db } from "astro:db";
import bcrypt from "bcrypt";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const name = formData.get("name").toString();
  const username = formData.get("username").toString();
  const password = formData.get("password").toString();
  const confirmPassword = formData.get("confirm-password").toString();
  const address = formData.get("address").toString();
  const phone_number = formData.get("phone_number").toString();
  const contact_name = formData.get("contact_name").toString();
  const userType = Number(formData.get("userType"));

  if (
    !name ||
    !username ||
    !password ||
    !confirmPassword ||
    !address ||
    !phone_number ||
    !contact_name ||
    Number.isNaN(userType)
  ) {
    return redirect("/signup");
  }

  // Check if password and confirm password match
  if (password !== confirmPassword) {
    return redirect("/signup");
  }

  // Hash the password
  const passwordHash = bcrypt.hashSync(password, 10);

  try {
    await db.insert(User).values([
      {
        name,
        username,
        password_hash: passwordHash,
        address,
        phone_number,
        contact_name,
        type_id: userType,
      },
    ]);

    return redirect("/users");
  } catch (error) {
    redirect("/signup");
  }
};
