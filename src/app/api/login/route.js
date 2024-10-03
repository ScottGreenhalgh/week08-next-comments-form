import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
    const results = await db.query(
      `SELECT password FROM login WHERE username = $1`,
      [username]
    );

    if (results.rows.length === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const storedHashedPassword = results.rows[0].password;
    const isPasswordMatch = await bcrypt.compare(
      password,
      storedHashedPassword
    );

    if (isPasswordMatch) {
      const token = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      //console.log("Generated token: ", token);
      return new Response(
        JSON.stringify({ message: "Login successful", token }),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ error: "Incorrect password" }), {
        status: 401,
      });
    }
  } catch (error) {
    console.error("Database error: ", error);
    return new Response(
      JSON.stringify({ error: { name: error.name, message: error.message } }),
      { status: 500 }
    );
  }
};
