import forumPostStyle from "@/app/styles/forumpost.module.css";
import ForumComment from "@/components/ForumComments";

import { connect } from "@/utils/connect";

export default async function PostPage({ params }) {
  const db = connect();
  const slug = params.slug;
  const formattedTitle = slug.replace(/-/g, " "); // Convert slug back to normal title

  const postQuery = await db.query(
    `SELECT * FROM forum_posts WHERE LOWER(title) = $1`,
    [formattedTitle.toLowerCase()]
  );

  if (postQuery.rows.length === 0) {
    return <p>Post not found</p>;
  }

  const post = postQuery.rows[0];

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.post}</p>
      <p>Posted by: {post.username}</p>

      <ForumComment />
    </div>
  );
}
