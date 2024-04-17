import type { APIRoute } from "astro";
import { db, eq, User, UserType } from "astro:db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
}

export const post: APIRoute = async function ({ request, cookies }) {
  const data = await request.formData();
  const username = data.get("username");
  const password = data.get("password");

  if (!username || !password) {
    return new Response(JSON.stringify({ error: "Missing credentials" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const [user] = await db
    .select()
    .from(User)
    .where(eq(User.username, username as string));

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const passwordIsValid = await bcrypt.compare(password, user.password_hash);

  if (!passwordIsValid) {
    return new Response(JSON.stringify({ error: "Invalid password" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const [role] = await db
    .select()
    .from(UserType)
    .where(eq(UserType.id, user.type_id));

  if (!role) {
    return new Response(JSON.stringify({ error: "Invalid role" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const token = generateToken({
    username: user.username,
    type: role.type,
    name: user.name,
    id: user.id,
  });

  cookies.set("session_id", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "strict",
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
