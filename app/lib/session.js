// Keys used to remember who is logged in and their notes in the browser.
export const USER_KEY = "noteapp:user";

export function notesKey(email) {
  return `noteapp:notes:${email}`;
}
