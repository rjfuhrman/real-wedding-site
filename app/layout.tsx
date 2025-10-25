import type { Metadata } from "next";
import "./globals.css";
import { Libre_Baskerville } from "next/font/google";

const libre = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-libre"
});

export const metadata: Metadata = {
  title: "Riley & Christine — Save the Date",
  description: "Save the date for Riley & Christine in Durango, Colorado.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${libre.variable} font-serif text-white antialiased`}>
        <div className="hero-bg" />
        <div className="hero-overlay" />
        {children}
      </body>
    </html>
  );
}
