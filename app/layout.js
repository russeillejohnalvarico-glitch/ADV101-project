import "./globals.css";

export const metadata = {
  title: "NoteApp",
  description: "A simple Next.js note application with login and form validation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
