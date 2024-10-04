"use client";

import ForumPost from "@/components/ForumPost";
import LoadingSpinner from "@/components/LoadingSpinner";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PostPage() {
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const authToken = sessionStorage.getItem("authToken");
      setToken(authToken);

      if (!authToken) {
        router.replace("/login");
      }
    }
  }, [token, router]);

  if (!token) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <ForumPost />
    </div>
  );
}
