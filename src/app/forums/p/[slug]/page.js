import forumSlugStyle from "@/app/styles/forumslug.module.css";

import ForumComment from "@/components/ForumComments";
import { connect } from "@/utils/connect";
import Link from "next/link";
import DeletePostButton from "@/components/DeletePostButton";
import LikeDislikeButton from "@/components/LikeDislikeButton";

export default async function PostPage({ params, searchParams }) {
  const db = connect();
  const slug = params.slug;
  const formattedTitle = slug.replace(/-/g, " "); // Convert slug back to normal title

  const postQuery = await db.query(
    `SELECT * FROM forum_posts WHERE LOWER(title) = $1`,
    [formattedTitle]
  );

  if (postQuery.rows.length === 0) {
    return <p>Post not found</p>;
  }

  const post = postQuery.rows[0];

  const commentsQuery = await db.query(
    `SELECT * FROM comments WHERE post_id = $1`,
    [post.id]
  );
  const comments = commentsQuery.rows;

  const sortedComments = comments.sort((a, b) => {
    if (searchParams.sortBy == "asc") {
      return a.comment.localeCompare(b.comment);
    }
    if (searchParams.sortBy == "desc") {
      return b.comment.localeCompare(a.comment);
    }
  });

  return (
    <div className={forumSlugStyle["forums-container"]}>
      <DeletePostButton slug={slug} postCreatorId={post.user_id} />
      {/* Render post */}
      <div className={forumSlugStyle["post-container"]}>
        <h1 className={`text-amber-500 ${forumSlugStyle["forums-post-title"]}`}>
          {post.title}
        </h1>
        <p className={forumSlugStyle["forums-post-sender"]}>
          Posted by: {post.username}
        </p>
        <p className={forumSlugStyle["forums-post-date"]}>{post.post}</p>
        <LikeDislikeButton
          postId={post.id}
          initialLikes={post.likes}
          initialDislikes={post.dislikes}
        />
      </div>
      {/* Render comments */}
      <div>
        <h2 className={`text-2xl ${forumSlugStyle["forums-comments-title"]}`}>
          Comments:
        </h2>
        {comments.length === 0 ? (
          <p className={forumSlugStyle["forums-no-comments"]}>
            No comments yet.
          </p>
        ) : (
          <>
            <div className={forumSlugStyle["dropdown"]}>
              <button className={forumSlugStyle["dropdown-button"]}>^</button>
              <div className={forumSlugStyle["dropdown-content"]}>
                <Link href={`/forums/p/${slug}?sortBy=asc`}>Sort: A-Z</Link>
                <Link href={`/forums/p/${slug}?sortBy=desc`}> | Sort: Z-A</Link>
                <Link href={`/forums/p/${slug}`}> | Sort: None</Link>
              </div>
            </div>
            {sortedComments.map((comment) => {
              const date = new Date(comment.created_at);
              const formattedDate = `${date
                .getHours()
                .toString()
                .padStart(2, "0")}:${date
                .getMinutes()
                .toString()
                .padStart(2, "0")} ${date.getDate()}/${
                date.getMonth() + 1
              }/${date.getFullYear()}`;
              // returns a Day/month/year 2 digit hour and 2 digit min
              return (
                <div
                  className={forumSlugStyle["comments-container"]}
                  key={comment.id}
                >
                  <p className={forumSlugStyle["forums-comment-content"]}>
                    {comment.comment}
                  </p>
                  <p className={forumSlugStyle["forums-comment-sender"]}>
                    By: {comment.username}
                  </p>
                  <p className={forumSlugStyle["forums-comment-date"]}>
                    {formattedDate}
                  </p>
                  <LikeDislikeButton
                    commentId={comment.id}
                    initialLikes={comment.likes}
                    initialDislikes={comment.dislikes}
                  />
                </div>
              );
            })}
          </>
        )}
      </div>

      <ForumComment slug={slug} />
    </div>
  );
}
