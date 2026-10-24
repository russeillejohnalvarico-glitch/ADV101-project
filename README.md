# NoteApp (ADV101 Project)

A simple Next.js note application built with React event handling and form validation.

## Features

- **Login page at `/`**, centered on the screen.
- **Form validation** with error messages:
  - Email must not be empty.
  - Email must be a `@gmail.com` address (e.g. `juan@gmail.com`).
  - Password must be more than 8 characters.
- If all checks pass, the user is sent to the **Notes page** (`/notes`).
- **Bonus 1:** the error message is shown below the Log in button.
- **Bonus 2:** a **Log out** button returns the user to the login screen.
- Notes page: add and delete colorful sticky notes (5 colors). Press **Ctrl + Enter** to add a note quickly. Notes are saved in the browser (localStorage).
- Visiting `/notes` without logging in redirects back to the login page.
- Responsive design that works on desktop and phones.

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  page.js              Login page with validation
  notes/page.js        Notes page with logout
  components/Icons.js  SVG icons
  lib/session.js       Storage keys
  globals.css          Styles
  layout.js            Fonts and page shell
  icon.svg             Favicon
```
