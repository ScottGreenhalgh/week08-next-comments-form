import { connect } from "@/utils/connect";

export const POST = async (request) => {
  const db = connect();
  try {
    const { postId, commentId, user_id } = await request.json();

    const field = postId ? "post_id" : "comment_id";
    const value = postId ? postId : commentId;
    const queryString = `SELECT is_like FROM likes_dislikes WHERE user_id = ${user_id} AND ${field} = ${value}`;

    // Fetch the user's current like/dislike status
    // const existingAction = await db.query(
    //   `SELECT is_like FROM likes_dislikes WHERE user_id = $1 AND $2 = $3`,
    //   [user_id, postId ? "post_id" : "comment_id", postId ? postId : commentId]
    // );

    const existingAction = await db.query(queryString);

    // console.log(queryString);

    // console.log(commentId || null);
    // console.log(user_id, postId, commentId);
    // console.log(existingAction);
    const action = existingAction?.rows[0]
      ? existingAction.rows[0].is_like
        ? "like"
        : "dislike"
      : "null";
    return new Response(JSON.stringify({ action }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch user action" }),
      { status: 500 }
    );
  }
};

export const PUT = async (request) => {
  const db = connect();
  try {
    const { action, postId, commentId, user_id } = await request.json();
    console.log("initial action", action);

    const isLike = action === "like" || action === "unlike";
    const isDislike = action === "dislike" || action === "undislike";

    const targetTable = commentId ? "comments" : "forum_posts"; // Determine target table

    const targetId = commentId || postId; // Use commentId if present, else postId
    const idField = commentId ? "comment_id" : "post_id"; // Column for where clause

    console.log(targetTable, targetId, idField);

    // Remove existing like or dislike if the user is undoing their action
    if (action === "unlike" || action === "undislike") {
      const removalQuery = isLike
        ? `UPDATE ${targetTable} SET likes = likes - 1 WHERE id = $1 AND likes > 0 RETURNING likes, dislikes`
        : `UPDATE ${targetTable} SET dislikes = dislikes - 1 WHERE id = $1 RETURNING likes, dislikes`;

      await db.query(
        `DELETE FROM likes_dislikes WHERE user_id = $1 AND ${idField} = $2`,
        [user_id, targetId]
      );
      const result = await db.query(removalQuery, [targetId]);
      console.log(result.rows[0]);
      return new Response(JSON.stringify(result.rows[0]), { status: 200 });
    }

    // Insert or update like/dislike based on user action
    else if (isLike || isDislike) {
      await db.query(
        `INSERT INTO likes_dislikes (user_id, post_id, comment_id, is_like)
           VALUES ($1, $2, $3, $4) 
           ON CONFLICT (user_id, post_id, comment_id) DO UPDATE SET is_like = $4`,
        [user_id, postId || null, commentId || null, isLike]
      );

      const updateQuery = isLike
        ? `UPDATE ${targetTable} SET likes = likes + 1 WHERE id = $1 RETURNING likes, dislikes`
        : `UPDATE ${targetTable} SET dislikes = dislikes + 1 WHERE id = $1 RETURNING likes, dislikes`;

      const result = await db.query(updateQuery, [targetId]);
      console.log(result.rows[0]);
      return new Response(JSON.stringify(result.rows[0]), { status: 200 });
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to update like/dislike" }),
      { status: 500 }
    );
  }
};
