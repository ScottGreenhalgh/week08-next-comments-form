"use client";

import { useState, useEffect, act } from "react";

export default function LikeDislikeButton({
  postId,
  commentId,
  initialLikes,
  initialDislikes,
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userAction, setUserAction] = useState(null); // 'like', 'dislike', or null
  const [userId, setUserId] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user's like/dislike status and user ID
    const fetchUserIdAndAction = async () => {
      const token = sessionStorage.getItem("authToken");

      if (!token) {
        setError("Login to leave a like.");
        return;
      }

      try {
        const userResponse = await fetch("/api/userid", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await userResponse.json();
        if (userResponse.ok) {
          setUserId(data.id); // Set user ID
        } else {
          setError(data.error || "Failed to fetch user ID");
        }
        const actionResponse = await fetch(`/api/likes_dislikes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId, commentId, user_id: data.id }),
        });
        const { action } = await actionResponse.json();
        console.log(action);
        setUserAction(action); // Set current like/dislike action
      } catch (error) {
        setError("Failed to fetch user data. Please try again.");
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserIdAndAction();
  }, [postId, commentId]);

  const handleLike = async () => {
    const action = userAction === "like" ? "unlike" : "like";
    const response = await fetch(`/api/likes_dislikes`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, postId, commentId, user_id: userId }),
    });
    const { likes: newLikes, dislikes: newDislikes } = await response.json();
    console.log(newLikes, newDislikes);
    setLikes(newLikes);
    setDislikes(newDislikes);
    setUserAction(action === "like" ? "like" : null); // Toggle between like and unlike
  };

  const handleDislike = async () => {
    const action = userAction === "dislike" ? "undislike" : "dislike";
    const response = await fetch(`/api/likes_dislikes`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, postId, commentId, user_id: userId }),
    });
    const { likes: newLikes, dislikes: newDislikes } = await response.json();
    console.log(newLikes, newDislikes);
    setLikes(newLikes);
    setDislikes(newDislikes);
    setUserAction(action === "dislike" ? "dislike" : null); // Toggle between dislike and undislike
  };

  return (
    <div>
      {error && <span className="error-message">{error}</span>}
      <button onClick={handleLike} disabled={!userId}>
        👍 {likes}
      </button>
      <button onClick={handleDislike} disabled={!userId}>
        👎 {dislikes}
      </button>
    </div>
  );
}
