"use client";

import forumCommentStyles from "@/app/styles/forumcomment.module.css";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { LoginContext } from "@/context/LoginProvider";

const HOST = process.env.NEXT_PUBLIC_HOSTNAME;

export default function ForumComment({ slug }) {
  const { currentLogin } = useContext(LoginContext);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleForumComment = async (event) => {
    event.preventDefault();
    const token = sessionStorage.getItem("authToken");
    setError("");

    try {
      const response = await fetch(`${HOST}/api/forums/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          slug: slug,
        },
        body: JSON.stringify({ comment }),
      });
      const responseData = await response.json();
      console.log(`From the server (forum-comment): `, responseData);
      if (response.ok) {
        setComment("");
        console.log("Comment successful", responseData.message);
        //router.push(`/forums/p/${slug}`);
        router.refresh();
      } else {
        console.log("Commenting failed", responseData.error);
        setError(`Commenting failed: ${responseData.error}`);
      }
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  // if not logged in the form won't render
  if (!currentLogin) {
    return (
      <div className={forumCommentStyles["forum-comment-container"]}>
        <p>Login to leave a comment</p>
      </div>
    );
  }

  return (
    <div className={forumCommentStyles["forum-comment-container"]}>
      <h2 className={`text-3xl ${forumCommentStyles["forum-comment-title"]}`}>
        Leave a comment
      </h2>
      <form
        className={forumCommentStyles["forum-comment-form"]}
        aria-live="polite"
        onSubmit={handleForumComment}
      >
        <input
          type="text"
          name="comment"
          autoComplete="off"
          value={comment}
          className={`${forumCommentStyles["forum-comment-input-field"]} ${forumCommentStyles["comment-field"]}`}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Enter your comment"
          aria-label="enter comment content"
        />
        <button
          type="submit"
          name="forum-comment"
          className={forumCommentStyles["submit-button"]}
          aria-label="Submit your forum comment"
        >
          Comment
        </button>
      </form>
      {error && <p className={forumCommentStyles["error-message"]}>{error}</p>}
    </div>
  );
}
