"use client";

import delStyle from "@/app/styles/delete.module.css";

import { useContext, useState, useEffect } from "react";
import { LoginContext } from "@/context/LoginProvider";
import { useRouter } from "next/navigation";

export default function DeletePostButton({ slug, postCreatorId }) {
  const { currentLogin } = useContext(LoginContext); // Get the current logged-in user
  const [isDeleting, setIsDeleting] = useState(false);
  const [user_id, setUser_id] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserId = async () => {
      const token = sessionStorage.getItem("authToken");

      if (!token) {
        setError("You are not authorized to delete this post.");
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
          setUser_id(data.id);
        } else {
          setError(data.error || "Failed to fetch user ID");
        }
      } catch (error) {
        setError("Failed to fetch user ID. Please try again.");
        console.error("Fetch user ID error:", error);
      }
    };

    fetchUserId();
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    const token = sessionStorage.getItem("authToken");

    if (!token) {
      setError("You are not authorized to delete this post.");
      setIsDeleting(false);
      return;
    }

    try {
      const response = await fetch("/api/forums/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          slug: slug,
        },
      });

      const result = await response.json();

      if (response.ok) {
        router.push("/forums");
      } else {
        setError(result.error || "An error occurred while deleting the post.");
      }
    } catch (error) {
      setError("Failed to delete the post. Please try again.");
      console.error("Delete post error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (user_id !== postCreatorId) {
    return null; // Hide button if user isn't the post creator
  }

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={delStyle["delete-button"]}
      >
        {/* Conditional rendering to inform the user when button is disabled */}
        {isDeleting ? "Deleting..." : "Delete Post"}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
