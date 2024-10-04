"use client";

import EditProfile from "@/components/EditProfile";
import LoadingSpinner from "@/components/LoadingSpinner";

import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { LoginContext } from "@/context/LoginProvider";

export default function LoginPage() {
  const { currentLogin } = useContext(LoginContext);
  const router = useRouter();

  useEffect(() => {
    if (!currentLogin) {
      router.replace("/login");
    }
  }, [currentLogin, router]);

  if (!currentLogin) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <EditProfile />
    </>
  );
}
