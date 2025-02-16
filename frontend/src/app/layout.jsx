import { Inter } from "next/font/google";
import "./globals.css";

import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import SocketProvider from "./context/socket";

export const metadata = {
  title: "Kahoot - Game it up!",
  description: "Create and play quizzes.",
  image: "/assets/logo.png",
  url: "https://kahoot.pro",
  type: "website",
  siteName: "Kahoot",
  locale: "en",
  lang: "en",
  keywords: ["kahoot", "quiz", "game", "fun", "play", "create", "learn", "education", "students", "teachers", "school", "college", "university"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SocketProvider>
          <div className="flex flex-col justify-center items-center min-h-screen relative">
            <div className="bgImage">
              <div className="bgEffect"></div>
            </div>
            <main className="w-screen h-full flex items-center justify-center">
              {children}
            </main>

            <footer className="absolute bottom-0 right-0 text-white gap-3 p-2">
              <Link target="_blank" href="https://github.com/maximdudai/kahoot">
                <FaGithub className="w-12 h-12" />
              </Link>
            </footer>
          </div>
        </SocketProvider>
      </body>
    </html>
  );
}
