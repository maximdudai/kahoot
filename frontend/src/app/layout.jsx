import { Inter } from "next/font/google";
import "./globals.css";

import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import SocketProvider from "./context/socket";

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
          <div className="flex flex-col justify-center items-center min-h-screen relative">
            <div className="bgImage">
              <div className="bgEffect"></div>
            </div>
            <main className="w-screen h-full flex items-center justify-center">
              {children}
            </main>

            <footer className="relative text-white flex flex-row-reverse items-center gap-3 p-2">
              <Link target="_blank" href="https://github.com/maximdudai/kahoot">
                <FaGithub className="w-10 h-10" />
              </Link>
              <p className="uppercase text-xs">
                git push origin creativity
              </p>
            </footer>
          </div>
        </SocketProvider>
      </body>
    </html>
  );
}
