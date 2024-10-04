"use client";

import forumCommentStyles from "@/app/styles/forumcomment.module.css";

import { useState } from "react";
import { useRouter } from "next/navigation";

const HOST = process.env.NEXT_PUBLIC_HOSTNAME;

export default function ForumComment() {
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleForumComment = async (event) => {
    event.preventDefault();
    const token = sessionStorage.getItem("authToken");
    setError("");
    if (error) {
      return;
    }
    try {
      const response = await fetch(`${HOST}/api/forums/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, comment }),
      });
      const responseData = await response.json();
      console.log(`From the server (forum-comment): `, responseData);
      if (response.ok) {
        const slug = responseData.title.toLowerCase().replace(/ /g, "-");
        setComment("");
        console.log("Comment successful", responseData.message);
        router.push(`/forums/p/${slug}`);
      } else {
        console.log("Commenting failed", responseData.error);
        setError(`Commenting failed: ${responseData.error}`);
      }
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  return (
    <div className={forumCommentStyles["forum-comment-container"]}>
      <h2 className={`text-3xl ${forumCommentStyles["forum-comment-title"]}`}>
        Make a comment
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
