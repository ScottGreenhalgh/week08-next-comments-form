import jwt from "jsonwebtoken";
import { connect } from "@/utils/connect";

const db = connect();

export const POST = async (request) => {
  try {
    const { title, post } = await request.json();
    const token = request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Authorization token missing" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;

    console.log(`Forum post request from: ${username}`);

    const userQuery = await db.query(
      `SELECT login.id, preferences.displayname FROM login 
       INNER JOIN preferences ON login.id = preferences.user_id 
       WHERE login.username = $1`,
      [username]
    );

    if (userQuery.rows.length === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { id: user_id, displayname } = userQuery.rows[0];

    const result = await db.query(
      `INSERT INTO forum_posts (user_id, username, title, post) VALUES ($1, $2, $3, $4) RETURNING title`,
      [user_id, displayname, title, post]
    );
    return new Response(
      JSON.stringify({
        title: result.rows[0].title,
        message: "Post created successfully",
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
