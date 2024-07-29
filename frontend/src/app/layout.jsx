import { Inter } from "next/font/google";
import "./globals.css";

import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { SocketProvider } from "./context/socket";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kahoot - Game it up!",
  description: "Create and play quizzes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SocketProvider>
          <div className="bgImage">
            <div className="bgEffect"></div>
          </div>
          <main className="w-screen min-h-screen flex items-center justify-center p-2">
            {children}
          </main>

          <footer className="absolute bottom-2 right-2">
            <Link
              target="_blank"
              href="https://github.com/maximdudai/kahoot"
              className="text-white"
            >
              <FaGithub className="w-10 h-10" />
            </Link>
          </footer>
        </SocketProvider>
      </body>
    </html>
  );
}
