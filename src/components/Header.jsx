"use client";

import Link from "next/link";
import headerStyles from "@/app/styles/header.module.css";
import { useContext } from "react";
import { LoginContext } from "@/context/LoginProvider";

export default function Header() {
  const { currentLogin, clearSession } = useContext(LoginContext);

  const logoutUser = () => {
    clearSession();
    console.log("Successfully logged out");
  };

  return (
    <nav className={headerStyles.nav}>
      <Link className={headerStyles["header-link"]} href="/">
        Home
      </Link>
      <Link className={headerStyles["header-link"]} href="/forums">
        Forums
      </Link>
      {currentLogin ? (
        <>
          <Link className={headerStyles["header-link"]} href="/profile">
            Profile
          </Link>
          <Link className={headerStyles["header-link"]} href="/editprofile">
            Edit Profile
          </Link>
          <p className={headerStyles["header-username"]}>{currentLogin}</p>
          <p className={headerStyles["header-logout"]} onClick={logoutUser}>
            Logout
          </p>
        </>
      ) : (
        <>
          <Link className={headerStyles["header-link"]} href="/register">
            Register
          </Link>
          <Link className={headerStyles["header-link"]} href="/login">
            Login
          </Link>
        </>
      )}
    </nav>
  );
}
