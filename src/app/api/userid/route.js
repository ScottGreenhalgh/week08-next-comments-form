import jwt from "jsonwebtoken";
import { connect } from "@/utils/connect";

const db = connect();

export const GET = async (request) => {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return new Response("Authorization header missing", { status: 400 });
    }

    const authToken = authHeader.split(" ")[1];
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    const username = decoded.username;

    const userResult = await db.query(
      `SELECT id FROM login WHERE username = $1`,
      [username]
    );

    if (userResult.rowCount === 0) {
      return new Response("User not found", { status: 404 });
    }

    return new Response(JSON.stringify({ id: userResult.rows[0].id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Invalid or expired token", { status: 401 });
  }
};
