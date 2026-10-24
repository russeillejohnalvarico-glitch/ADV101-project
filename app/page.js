"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NoteIcon from "./components/NoteIcon";
import { USER_KEY } from "./lib/session";

const MIN_PASSWORD_LENGTH = 8;

// Returns an error message, or an empty string when everything is valid.
function validate(email, password) {
  const trimmedEmail = email.trim();

  if (trimmedEmail === "") {
    return "Email is required.";
  }
  if (!/^[^\s@]+@gmail\.com$/i.test(trimmedEmail)) {
    return "Email must be a valid @gmail.com address.";
  }
  if (password === "") {
    return "Password is required.";
  }
  if (password.length <= MIN_PASSWORD_LENGTH) {
    return `Password must be more than ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return "";
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleEmailChange(event) {
    setEmail(event.target.value);
    setError("");
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const message = validate(email, password);
    if (message) {
      setError(message);
      return;
    }

    sessionStorage.setItem(USER_KEY, email.trim().toLowerCase());
    router.push("/notes");
  }

  return (
    <main className="page-center">
      <div className="card login-card">
        <div className="brand">
          <span className="brand-icon">
            <NoteIcon />
          </span>
          <h1>NoteApp</h1>
          <p className="muted">Log in to write and keep your notes.</p>
        </div>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              placeholder="you@gmail.com"
              value={email}
              onChange={handleEmailChange}
              autoComplete="email"
              aria-invalid={error !== "" && error.startsWith("Email")}
            />
          </label>

          <label className="field">
            <span>Password</span>
            <div className="password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={`More than ${MIN_PASSWORD_LENGTH} characters`}
                value={password}
                onChange={handlePasswordChange}
                autoComplete="current-password"
                aria-invalid={error !== "" && error.startsWith("Password")}
              />
              <button
                type="button"
                className="toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <button type="submit" className="btn btn-primary">
            Log in
          </button>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
