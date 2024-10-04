"use client";

import forumPostStyles from "@/app/styles/forumpost.module.css";

import { useState } from "react";
import { useRouter } from "next/navigation";

const HOST = process.env.NEXT_PUBLIC_HOSTNAME;

export default function ForumPost() {
  const [title, setTitle] = useState("");
  const [post, setPost] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  // Regular expression to allow only letters, numbers, spaces
  const titleRegex = /^[a-zA-Z0-9\s]+$/;

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    if (!titleRegex.test(event.target.value)) {
      setError("Title contains invalid characters.");
    } else {
      setError("");
    }
  };

  const handleForumPost = async (event) => {
    event.preventDefault();
    const token = sessionStorage.getItem("authToken");
    setError("");
    if (error) {
      return;
    }
    try {
      const response = await fetch(`${HOST}/api/forums/post`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, post }),
      });
      const responseData = await response.json();
      console.log(`From the server (forum-post): `, responseData);
      if (response.ok) {
        const slug = responseData.title.toLowerCase().replace(/ /g, "-");
        setTitle("");
        setPost("");
        console.log("Post successful", responseData.message);
        router.push(`/forums/p/${slug}`);
      } else {
        console.log("Posting failed", responseData.error);
        setError(`Posting failed: ${responseData.error}`);
      }
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  return (
    <div className={forumPostStyles["forum-post-container"]}>
      <h2 className={`text-3xl ${forumPostStyles["forum-post-title"]}`}>
        Create a post
      </h2>
      <form
        className={forumPostStyles["forum-post-form"]}
        aria-live="polite"
        onSubmit={handleForumPost}
      >
        <input
          type="text"
          name="title"
          autoComplete="off"
          value={title}
          className={`${forumPostStyles["forum-post-input-field"]} ${forumPostStyles["title-field"]}`}
          onChange={handleTitleChange}
          placeholder="Enter post title"
          aria-label="enter post title"
        />
        <input
          type="text"
          name="post"
          autoComplete="off"
          value={post}
          className={`${forumPostStyles["forum-post-input-field"]} ${forumPostStyles["post-field"]}`}
          onChange={(event) => setPost(event.target.value)}
          placeholder="Enter your post content"
          aria-label="enter post content"
        />
        <button
          type="submit"
          name="forum-post"
          className={forumPostStyles["submit-button"]}
          aria-label="Submit your forum post"
        >
          Post
        </button>
      </form>
      {error && <p className={forumPostStyles["error-message"]}>{error}</p>}
    </div>
  );
}
