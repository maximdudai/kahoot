import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kahoot - Game it up!",
  description: "Create and play quizzes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bgImage">
          <div className="bgEffect"></div>
        </div>
        {children}
      </body>
    </html>
  );
}
