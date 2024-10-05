import jwt from "jsonwebtoken";
import { connect } from "@/utils/connect";

const db = connect();

export const DELETE = async (request) => {
  try {
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

    const slug = request.headers.get("slug");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;

    // Get user_id from username
    const userResult = await db.query(
      `SELECT id FROM login WHERE username = $1`,
      [username]
    );

    if (userResult.rowCount === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user_id = userResult.rows[0].id;

    // Delete post with matching title and user_id
    const deleteResult = await db.query(
      `DELETE FROM forum_posts WHERE LOWER(title) = $1 AND user_id = $2 RETURNING *`,
      [slug.replace(/-/g, " "), user_id]
    );

    if (deleteResult.rowCount === 0) {
      return new Response(
        JSON.stringify({
          error:
            "Post not found or you do not have permission to delete this post",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "Post deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
