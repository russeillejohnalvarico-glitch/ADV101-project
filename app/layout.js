import { Caveat, Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const display = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const hand = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata = {
  title: "NoteApp",
  description: "A simple Next.js note application with login and form validation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${hand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
