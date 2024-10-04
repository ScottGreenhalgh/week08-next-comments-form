"use client";
import { createContext, useEffect, useState, useCallback } from "react";

export const LoginContext = createContext();

export function LoginProvider({ children }) {
  const [currentLogin, setCurrentLogin] = useState("");

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
          clearSession();
        }
      } catch (error) {
        console.error("Error fetching session: ", error);
        clearSession();
      }
    }
  }, []);

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
