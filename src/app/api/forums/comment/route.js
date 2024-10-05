import jwt from "jsonwebtoken";
import { connect } from "@/utils/connect";

const db = connect();

export const POST = async (request) => {
  try {
    const { comment } = await request.json();
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

    const slug = request.headers.get("slug");
    const postQuery = await db.query(
      `SELECT id FROM forum_posts WHERE LOWER(title) = $1`,
      [slug.replace(/-/g, " ")]
    );

    if (postQuery.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
      });
    }

    const postId = postQuery.rows[0].id;

    console.log(`Forum comment request from: ${username}`);

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

    const insertComment = await db.query(
      `INSERT INTO comments (user_id, username, post_id, comment) VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, displayname, postId, comment]
    );

    return new Response(
      JSON.stringify({
        message: "Comment added successfully",
        comment: insertComment.rows[0],
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error adding comment: ", error);
    return new Response(JSON.stringify({ error: "Error adding comment" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
