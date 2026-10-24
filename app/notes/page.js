"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertIcon,
  CheckIcon,
  LogoutIcon,
  NoteIcon,
  PlusIcon,
  TrashIcon,
} from "../components/Icons";
import { USER_KEY, notesKey } from "../lib/session";

const NOTE_COLORS = ["yellow", "pink", "mint", "sky", "lavender"];

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(value) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function NotesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [color, setColor] = useState(NOTE_COLORS[0]);
  const [error, setError] = useState("");

  // Only logged-in users can see this page.
  useEffect(() => {
    const savedUser = sessionStorage.getItem(USER_KEY);
    if (!savedUser) {
      router.replace("/");
      return;
    }
    setUser(savedUser);
    setNotes(JSON.parse(localStorage.getItem(notesKey(savedUser)) || "[]"));
  }, [router]);

  function saveNotes(nextNotes) {
    setNotes(nextNotes);
    localStorage.setItem(notesKey(user), JSON.stringify(nextNotes));
  }

  function handleTextChange(event) {
    setText(event.target.value);
    setError("");
  }

  function handleAddNote(event) {
    event.preventDefault();

    if (text.trim() === "") {
      setError("Note cannot be empty.");
      return;
    }

    const now = Date.now();
    saveNotes([{ id: now, text: text.trim(), color, createdAt: now }, ...notes]);
    setText("");
  }

  // Ctrl + Enter (or Cmd + Enter) adds the note without clicking the button.
  function handleKeyDown(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      handleAddNote(event);
    }
  }

  function handleDeleteNote(id) {
    saveNotes(notes.filter((note) => note.id !== id));
  }

  function handleLogout() {
    sessionStorage.removeItem(USER_KEY);
    router.push("/");
  }

  if (!user) {
    return null;
  }

  const name = user.split("@")[0];

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="logo">
            <span className="logo-mark">
              <NoteIcon size={20} />
            </span>
            NoteApp
          </div>

          <div className="header-right">
            <div className="user-chip" title={user}>
              <span className="avatar">{name[0].toUpperCase()}</span>
              <span className="user-email">{user}</span>
            </div>
            <button type="button" className="btn btn-ghost" onClick={handleLogout}>
              <LogoutIcon size={17} />
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="hero">
          <h1>
            {greeting()}, <em>{name}</em>
          </h1>
          <p>
            {notes.length === 0
              ? "Start by writing your first note."
              : `You have ${notes.length} ${notes.length === 1 ? "note" : "notes"}.`}
          </p>
        </section>

        <form className={`composer c-${color}`} onSubmit={handleAddNote}>
          <textarea
            placeholder="What's on your mind?"
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            rows={3}
            aria-label="New note"
          />

          <div className="composer-bar">
            <div className="swatches" role="radiogroup" aria-label="Note color">
              {NOTE_COLORS.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={color === option}
                  aria-label={option}
                  className={`swatch c-${option}`}
                  onClick={() => setColor(option)}
                >
                  {color === option && <CheckIcon size={14} strokeWidth={3} />}
                </button>
              ))}
            </div>

            <div className="composer-actions">
              <span className="kbd-hint">
                <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
              </span>
              <button type="submit" className="btn btn-primary">
                <PlusIcon size={18} />
                Add note
              </button>
            </div>
          </div>

          {error && (
            <p className="alert" role="alert">
              <AlertIcon size={18} />
              {error}
            </p>
          )}
        </form>

        {notes.length === 0 ? (
          <div className="empty">
            <div className="empty-art">
              <NoteIcon size={36} strokeWidth={1.5} />
            </div>
            <h2>No notes yet</h2>
            <p>Write something above and it will show up here.</p>
          </div>
        ) : (
          <ul className="note-grid">
            {notes.map((note) => (
              <li key={note.id} className={`note c-${note.color || "yellow"}`}>
                <p>{note.text}</p>
                <div className="note-footer">
                  <span>{formatDate(note.createdAt)}</span>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => handleDeleteNote(note.id)}
                    aria-label="Delete note"
                    title="Delete note"
                  >
                    <TrashIcon size={17} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
