import loginStyles from "@/app/styles/login.module.css";

import { useState, useContext } from "react";
import { LoginContext } from "@/context/LoginProvider";
import { useRouter } from "next/navigation";

const HOST = process.env.NEXT_PUBLIC_HOSTNAME;

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setCurrentLogin } = useContext(LoginContext);
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch(`${HOST}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const responseData = await response.json();
      console.log(`From the server (login): `, responseData);
      if (response.ok) {
        setUsername("");
        setPassword("");
        sessionStorage.setItem("authToken", responseData.token);
        setCurrentLogin(" ");
        console.log("Login successful", responseData.message);
        router.push("/profile");
      } else {
        console.log("Login failed", responseData.error);
        setError(`Login failed: ${responseData.error}`);
      }
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  return (
    <div className={loginStyles["login-container"]}>
      <h2 className={`text-3xl ${loginStyles["login-title"]}`}>Login</h2>
      <form
        className={loginStyles["login-form"]}
        aria-live="polite"
        onSubmit={handleLogin}
      >
        <input
          type="username"
          name="username"
          autoComplete="username"
          value={username}
          className={`${loginStyles["login-input-field"]} ${loginStyles["username-field"]}`}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Enter your username"
          aria-label="enter your username"
        />
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          className={`${loginStyles["login-input-field"]} ${loginStyles["password-field"]}`}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          aria-label="enter your password"
        />
        <button
          type="submit"
          name="login"
          className={loginStyles["submit-button"]}
          aria-label="login to account"
        >
          Login
        </button>
      </form>
      {error && <p className={loginStyles["error-message"]}>{error}</p>}
    </div>
  );
}
