import type { APIRoute } from "astro";
import { db, eq, User, UserType } from "astro:db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createAuthSession, setFlashError } from "../../session";

function generateToken(userData: {
  id: number;
  type: string;
  name: string;
  username: string;
}) {
  // userData should contain non-sensitive user information, like user ID and roles
  return jwt.sign(
    {
      id: userData.id,
      username: userData.username,
      role: userData.type,
    },
    import.meta.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
}

export const POST: APIRoute = async function ({ request, cookies, redirect }) {
  const data = await request.formData();
  const username = data.get("username");
  const password = data.get("password");

  if (!username || !password) {
    return redirect("/login");
  }

  const [user] = await db
    .select()
    .from(User)
    .where(eq(User.username, username as string));

  if (!user) {
    setFlashError(cookies, "No se encontro el usuario.");

    return redirect("/login");
  }

  const passwordIsValid = await bcrypt.compare(
    password.toString(),
    user.password_hash
  );

  if (!passwordIsValid) {
    setFlashError(cookies, "Contraseña incorrecta.");

    return redirect("/login");
  }

  const [role] = await db
    .select()
    .from(UserType)
    .where(eq(UserType.id, user.type_id));

  if (!role) {
    return redirect("/login");
  }

  const token = generateToken({
    username: user.username,
    type: role.type,
    name: user.name,
    id: user.id,
  });

  createAuthSession(cookies, token);

  return redirect("/");
};
