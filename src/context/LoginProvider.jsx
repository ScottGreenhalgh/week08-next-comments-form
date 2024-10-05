"use client";
import { createContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export const LoginContext = createContext();

export function LoginProvider({ children }) {
  const [currentLogin, setCurrentLogin] = useState("");
  const router = useRouter();

  const fetchSession = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      try {
        const response = await fetch("/api/session", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setCurrentLogin(data.username);
          console.log("Current login set to: ", data.username);
        } else {
          console.error("Invalid or expired token ", data.error);
          router.push("/login");
          clearSession();
        }
      } catch (error) {
        console.error("Error fetching session: ", error);
        clearSession();
      }
    }
  }, [router]);

  const clearSession = () => {
    sessionStorage.removeItem("authToken");
    setCurrentLogin("");
  };

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return (
    <LoginContext.Provider
      value={{ currentLogin, clearSession, fetchSession, setCurrentLogin }}
    >
      {children}
    </LoginContext.Provider>
  );
}
