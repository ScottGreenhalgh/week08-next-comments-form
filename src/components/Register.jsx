import registerStyles from "@/app/styles/register.module.css";

import { useState } from "react";
import { useRouter } from "next/navigation";

const HOST = process.env.NEXT_PUBLIC_HOSTNAME;

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (event) => {
    event.preventDefault();
    if (!(password === password2)) {
      setError("Registration failed: Passwords do not match");
      return;
    }
    //setError("");
    try {
      const response = await fetch(`${HOST}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const responseData = await response.json();
      console.log(`From the server (register): `, responseData);
      if (response.ok) {
        setUsername("");
        setPassword("");
        setPassword2("");
        console.log("Registration successful: ", responseData);
        router.push("/login");
      } else {
        console.error("Registration failed", responseData.error.message);
        setError(`Registration failed: ${responseData.error.message}`);
      }
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  return (
    <div className={registerStyles["reg-container"]}>
      <h2 className={`text-3xl ${registerStyles["reg-title"]}`}>Register</h2>
      <form
        className={registerStyles["reg-form"]}
        aria-live="polite"
        onSubmit={handleRegister}
      >
        <input
          type="username"
          name="username"
          autoComplete="username"
          value={username}
          className={`${registerStyles["reg-input-field"]} ${registerStyles["username-field"]}`}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Enter a username"
          aria-label="enter a registration username"
        />
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          value={password}
          className={`${registerStyles["reg-input-field"]} ${registerStyles["password-field"]}`}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter a password"
          aria-label="Enter your new password"
        />
        <input
          type="password"
          name="password"
          autoComplete="login"
          value={password2}
          className={`${registerStyles["reg-input-field"]} ${registerStyles["password-field"]}`}
          onChange={(event) => setPassword2(event.target.value)}
          placeholder="Retype password"
          aria-label="Confirm your new password"
        />
        <button
          type="submit"
          name="register"
          className={registerStyles["submit-button"]}
          aria-label="register account"
        >
          Register
        </button>
      </form>
      {error && <p className={registerStyles["error-message"]}>{error}</p>}
    </div>
  );
}
