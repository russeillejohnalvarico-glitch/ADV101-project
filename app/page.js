"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  NoteIcon,
} from "./components/Icons";
import { USER_KEY } from "./lib/session";

const MIN_PASSWORD_LENGTH = 8;

// Returns { field, message } for the first problem found, or null when everything is valid.
function validate(email, password) {
  const trimmedEmail = email.trim();

  if (trimmedEmail === "") {
    return { field: "email", message: "Email is required." };
  }
  if (!/^[^\s@]+@gmail\.com$/i.test(trimmedEmail)) {
    return { field: "email", message: "Email must be a valid @gmail.com address." };
  }
  if (password === "") {
    return { field: "password", message: "Password is required." };
  }
  if (password.length <= MIN_PASSWORD_LENGTH) {
    return {
      field: "password",
      message: `Password must be more than ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }
  return null;
}

export default function LoginPage() {
  const router = useRouter();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  function handleEmailChange(event) {
    setEmail(event.target.value);
    setError(null);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
    setError(null);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const problem = validate(email, password);
    if (problem) {
      setError(problem);
      setAttempts(attempts + 1);
      (problem.field === "email" ? emailRef : passwordRef).current.focus();
      return;
    }

    setSubmitting(true);
    sessionStorage.setItem(USER_KEY, email.trim().toLowerCase());
    router.push("/notes");
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <aside className="auth-aside">
          <div className="logo logo-light">
            <span className="logo-mark">
              <NoteIcon size={20} />
            </span>
            NoteApp
          </div>

          <div className="aside-copy">
            <h2>
              Your thoughts,
              <br />
              <em>neatly kept.</em>
            </h2>
            <p>Jot down ideas, to-dos and reminders, all in one simple place.</p>
          </div>

          <div className="sticky-stack" aria-hidden="true">
            <div className="sticky sticky-1">
              <s>Study for quiz</s>
            </div>
            <div className="sticky sticky-2">Buy coffee beans</div>
            <div className="sticky sticky-3">Call mom on Sunday</div>
          </div>
        </aside>

        <div className="auth-main">
          <div className="logo mobile-logo">
            <span className="logo-mark">
              <NoteIcon size={20} />
            </span>
            NoteApp
          </div>

          <h1>Welcome back</h1>
          <p className="auth-sub">Log in to continue to your notes.</p>

          <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email" className="field-label">
                Email
              </label>
              <div className="input-wrap">
                <MailIcon className="input-icon" size={18} />
                <input
                  id="email"
                  ref={emailRef}
                  type="email"
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={handleEmailChange}
                  autoComplete="email"
                  aria-invalid={error?.field === "email"}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <div className="input-wrap">
                <LockIcon className="input-icon" size={18} />
                <input
                  id="password"
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  placeholder={`More than ${MIN_PASSWORD_LENGTH} characters`}
                  value={password}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                  aria-invalid={error?.field === "password"}
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? "Logging in..." : "Log in"}
              {!submitting && <ArrowRightIcon size={18} />}
            </button>

            {error && (
              <p key={attempts} className="alert" role="alert">
                <AlertIcon size={18} />
                {error.message}
              </p>
            )}
          </form>

          <p className="auth-foot">Your notes are saved on this device.</p>
        </div>
      </section>
    </main>
  );
}
