import bcrypt from "bcryptjs";
import { connect } from "@/utils/connect";

const db = connect();

export const POST = async (request) => {
  const { username, password } = await request.json();

  if (!username || !password) {
    return new Response(
      JSON.stringify({ error: "Username or password not provided" }),
      { status: 401 }
    );
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const loginResult = await db.query(
      `INSERT INTO login (username, password) VALUES ($1, $2) RETURNING id`,
      [username, hashedPassword]
    );
    const userId = loginResult.rows[0].id;

    await db.query(
      `INSERT INTO preferences (user_id, displayname) VALUES ($1, $2)`,
      [userId, userId]
    );

    return new Response(
      JSON.stringify({
        success: "User registered successfully",
        data: loginResult,
      }),
      { status: 200 }
    );
  } catch (error) {
    if (error.code === "23505" && error.constraint === "login_username_key") {
      return new Response(
        JSON.stringify({
          error: { name: error.name, message: "Username already exists" },
        }),
        { status: 409 }
      );
    }

    console.error("Database error: ", error);
    return new Response(
      JSON.stringify({ error: { name: error.name, message: error.message } }),
      { status: 500 }
    );
  }
};
