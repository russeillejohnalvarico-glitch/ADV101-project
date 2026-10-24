"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NoteIcon from "../components/NoteIcon";
import { USER_KEY, notesKey } from "../lib/session";

export default function NotesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
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

    const note = {
      id: Date.now(),
      text: text.trim(),
      createdAt: new Date().toLocaleString(),
    };
    saveNotes([note, ...notes]);
    setText("");
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

  return (
    <main className="page-center">
      <div className="notes-wrap">
        <header className="card topbar">
          <div className="topbar-brand">
            <span className="brand-icon small">
              <NoteIcon size={20} />
            </span>
            <div>
              <h1>My Notes</h1>
              <p className="muted">{user}</p>
            </div>
          </div>
          <button type="button" className="btn btn-outline" onClick={handleLogout}>
            Log out
          </button>
        </header>

        <form className="card composer" onSubmit={handleAddNote}>
          <textarea
            placeholder="Write a note..."
            value={text}
            onChange={handleTextChange}
            rows={3}
          />
          <div className="composer-actions">
            {error ? (
              <p className="error" role="alert">
                {error}
              </p>
            ) : (
              <span className="muted">
                {notes.length} {notes.length === 1 ? "note" : "notes"}
              </span>
            )}
            <button type="submit" className="btn btn-primary">
              Add note
            </button>
          </div>
        </form>

        {notes.length === 0 ? (
          <p className="empty muted">No notes yet. Your first one goes above.</p>
        ) : (
          <ul className="note-list">
            {notes.map((note) => (
              <li key={note.id} className="card note">
                <p>{note.text}</p>
                <div className="note-footer">
                  <span className="muted">{note.createdAt}</span>
                  <button
                    type="button"
                    className="btn-link"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
